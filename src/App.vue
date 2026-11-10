<template>
  <div>
    <div class="container">
      <h1>PTL Viewer</h1>
      <p class="lead">
        マストドンの公開タイムラインをみるやつ。inspired by <a href="https://junk.azyobuzi.net/mastodonptl/">junk.azyobuzi.net/mastodonptl/</a>
      </p>
      <p>
        github: <a href="https://github.com/hinaloe/public-toot-viewer"><span class="hidden-xs-down">hinaloe/</span>public-toot-viewer</a> by <a
          href="https://github.com/hinaloe/"
        >hinaloe</a> on <a href="https://mdn.hinaloe.net">ひな丼</a>
      </p>
      <div
        v-if="error"
        class="alert alert-warning"
      >
        {{ error }}
      </div>
      <form
        action="/"
        method="post"
        @submit.prevent="submit"
      >
        <div class="form-group row">
          <label
            for="domain"
            class="col-4 col-md-2 col-form-label"
          >Domain</label>
          <div class="col-8 col-md-4">
            <input
              id="domain"
              v-model="domain"
              type="text"
              class="form-control"
              placeholder="mstdn.jp"
              @input="inputDomain"
            >
            <div
              v-show="suggestEnabled && filteredInstances.length"
              class="dropdown-menu"
              style="display: block;right: 0"
            >
              <InstanceListItem
                v-for="instance in filteredInstances"
                :key="instance.name"
                :instance="instance"
                @selected="instanceSelected"
              />
            </div>
          </div>
          <div class="col-12 col-md-6">
            <input
              type="submit"
              class="btn btn-primary"
              value="Load"
            >
            <div class="custom-control custom-checkbox custom-control-inline ml-3">
              <input
                id="is-local"
                v-model="local"
                type="checkbox"
                class="custom-control-input"
              >
              <label
                class="custom-control-label"
                for="is-local"
              >Local</label>
            </div>
          </div>
        </div>
      </form>
      <div>
        <div
          v-for="toot in toots"
          :key="toot.id"
        >
          <TootItem :toot="toot" />
        </div>
        <div
          v-if="currentUri && !loading"
          class="text-center pb-3 more"
          style="cursor: pointer"
          @click.prevent="loadMore"
        >
          more
        </div>
        <div
          v-else-if="loading"
          class="text-center pb-3"
        >
          Loading...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import axios from 'axios'
import TootItem from './components/TootItem.vue'
import InstanceListItem from './components/InstanceListItem.vue'
import type { InstanceInfo, Toot } from './types'

const toots = ref<Toot[]>([])
const instances = ref<InstanceInfo[]>([])
const suggestEnabled = ref(false)
const domain = ref('')
const local = ref(false)
const loading = ref(false)
const currentUri = shallowRef<URL | null>(null)
const error = ref('')

const filteredInstances = computed(() =>
  instances.value.filter(instance => instance.name.includes(domain.value)).slice(0, 6),
)

function errorMessage (err: unknown) {
  return err instanceof Error ? err.message : String(err)
}

function getApiUri () {
  const url = new URL(domain.value.includes('://') ? domain.value : 'https://' + domain.value)
  url.pathname = '/api/v1/timelines/public'
  return url
}

async function submit () {
  error.value = ''
  toots.value = []
  loading.value = true
  suggestEnabled.value = false
  try {
    if (!domain.value.includes('.')) {
      throw new Error('Invalid domain')
    }
    const url = getApiUri()
    currentUri.value = url
    if (import.meta.env.DEV) {
      console.log(url.searchParams)
    }
    url.searchParams.set('limit', '40')
    if (local.value) {
      url.searchParams.append('local', 'true')
    }
    const res = await axios.get<Toot[]>(url.href)
    if (import.meta.env.DEV) {
      console.log(res.data)
    }
    toots.value = res.data
    loading.value = false
    updateSearchParams()
    window.gtag?.('event', 'load', { event_category: 'Toots', event_label: domain.value })
  } catch (err) {
    error.value = errorMessage(err)
    currentUri.value = null
    loading.value = false
  }
}

async function loadMore () {
  const url = currentUri.value
  const last = toots.value[toots.value.length - 1]
  if (!url || !last) {
    return
  }
  loading.value = true
  try {
    url.searchParams.delete('since_id')
    url.searchParams.set('max_id', last.id)
    if (import.meta.env.DEV) {
      console.log(url.href)
    }
    const res = await axios.get<Toot[]>(url.href)
    toots.value.push(...res.data)
  } catch (err) {
    error.value = errorMessage(err)
  } finally {
    loading.value = false
  }
}

async function loadNew () {
  const url = currentUri.value
  const first = toots.value[0]
  if (!url || loading.value || !first) {
    return
  }
  url.searchParams.delete('max_id')
  url.searchParams.set('since_id', first.id)
  const res = await axios.get<Toot[]>(url.href)
  toots.value.unshift(...res.data)
}

function instanceSelected (name: string) {
  domain.value = name
  submit()
}

function inputDomain () {
  suggestEnabled.value = true
}

function updateSearchParams () {
  const to = `?domain=${domain.value}&local=${local.value.toString()}`
  if (location.search !== to) {
    history.pushState(null, '', to)
  }
}

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    loadNew().catch(err => console.error(err))
  }, 30000)

  axios.get<InstanceInfo[]>('https://instances.social/instances.json').then(res => {
    if (!Array.isArray(res.data)) {
      throw new Error('Invalid response')
    }
    if (import.meta.env.DEV) {
      console.log('Instances list was loaded.', res.data)
    }
    instances.value = res.data
  }).catch(err => {
    error.value = errorMessage(err)
  })

  const url = new URL(location.href)
  if (url.searchParams.has('domain')) {
    domain.value = url.searchParams.get('domain') ?? ''
    local.value = url.searchParams.has('local') && !['false', '', '0', 'no'].includes(url.searchParams.get('local') ?? '')
    submit()
  }
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  margin-top: 60px;
}

img {
    max-width: 100%;
}

.more {
    border-radius: 5px;
    transition: background-color .1s;
}
.more:hover {
    background: rgba(79, 79, 79, 0.10);
}
</style>
