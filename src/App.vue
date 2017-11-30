<template>
  <div id="app">
    <div class="container">
        <h1>PTL Viewer</h1>
        <p class="lead">
            マストドンの公開タイムラインをみるやつ。inspired by <a href="http://junk.azyobuzi.net/mastodonptl/">junk.azyobuzi.net/mastodonptl/</a>
        </p>
        <p>github: <a href="https://github.com/hinaloe/public-toot-viewer"><span class="hidden-xs-down">hinaloe/</span>public-toot-viewer</a> by <a
                href="https://github.com/hinaloe/">hinaloe</a> on <a href="https://mdn.hinaloe.net">ひな丼</a></p>
      <div class="alert alert-warning" v-if="error">{{error}}</div>
        <form action="/" method="post" @submit.prevent="submit">
            <div class="form-group row">
                <label for="domain" class="col-4 col-md-2">Domain</label>
                <div class="col-8 col-md-4">
                    <input type="text" class="form-control" placeholder="mstdn.jp" id="domain" v-model="domain" @input="inputDomain">
                    <div class="dropdown-menu" style="display: block;right: 0" v-show="suggestEnabled && filteredInstances.length">
                        <instance :instance="instance" v-for="instance in filteredInstances" :key="instance.name" @selected="instanceSelected">err</instance>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <input type="submit" class="btn btn-primary" value="Load">
                    <label class="custom-control custom-checkbox ml-3">
                        <input type="checkbox" class="custom-control-input" v-model="local">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Local</span>
                    </label>

                </div>
            </div>
        </form>
        <div>
            <div v-for="toot in toots" :key="toot.id">
                <Toot :toot="toot"></Toot>
            </div>
            <div class="text-center pb-3 more" v-if="currentUri && !loading" @click.prevent="loadMore" style="cursor: pointer">more</div>
            <div v-else-if="loading" class="text-center pb-3">Loading...</div>
        </div>
    </div>
  </div>
</template>

<script>
import Toot from './components/Toot.vue'
import Instance from './components/Instance.vue'
import axios from 'axios'

export default {
  data () {
    return {
      toots: [],
      instances: [],
      suggestEnabled: false,
      domain: '',
      local: false,
      loading: false,
      currentUri: null,
      error: ''
    }
  },
  name: 'app',
  components: {
    Toot, Instance
  },
  mounted () {
    if (!window.URLSearchParams) {
      this.error = 'お使いのブラウザーはURLSearchParamsに対応していないため、このアプリケーションは利用できません。最新の Chrome または Firefox をご利用ください。'
      return
    }
    setInterval(() => {
      if (this.currentUri && !this.loading && this.toots.length) {
        const url = this.currentUri
        url.searchParams.delete('max_id')
        url.searchParams.set('since_id', this.toots[0].id)
        axios.get(url.href).then((res) => {
          this.toots.unshift(...res.data)
        })
      }
    }, 30000)
    axios.get('https://instances.mastodon.xyz/instances.json').then(res => {
      if (!Array.isArray(res.data)) {
        return Promise.reject(new Error('Invalid response'))
      }
      if (process.env.NODE_ENV !== 'production') {
        console.log('Instances list was loaded.', res.data)
      }
      this.instances = res.data
    }).catch(err => {
      this.error = err.message
    })
    const url = new URL(location.href)
    if (url.searchParams.has('domain')) {
      this.domain = url.searchParams.get('domain')
      this.local = url.searchParams.has('local') && !['false', '', '0', 'no'].includes(url.searchParams.get('local'))
      this.submit()
    }
  },
  computed: {
    filteredInstances () {
      return this.instances.filter(instance => String.includes(instance.name, this.domain)).slice(0, 6)
    }
  },
  methods: {
    getApiUri () {
      const url = new URL(String.includes(this.domain, '://') ? this.domain : 'https://' + this.domain)
      url.pathname = '/api/v1/timelines/public'
      return url
    },
    submit () {
      this.error = ''
      this.toots = []
      this.loading = true
      this.suggestEnabled = false
      Promise.resolve().then(() => {
        if (!String.includes(this.domain, '.')) {
          throw new Error('Invalid domain')
        }
        const url = this.getApiUri()
        this.currentUri = url
        if (process.env.NODE_ENV !== 'production') {
          console.log(url.searchParams)
        }
        url.searchParams.set('limit', 40)
        if (this.local) {
          url.searchParams.append('local', true)
        }
        return axios.get(url.href)
      }).then(res => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(res.data)
        }
        this.toots = res.data
        this.loading = false
        this.updateSearchParams()
        window.ga('send', 'event', 'Toots', 'load', this.domain)
      }).catch((err) => {
        this.error = err.message
      })
    },
    loadMore () {
      this.loading = true
      Promise.resolve().then(() => {
        const url = this.currentUri
        url.searchParams.delete('since_id')
        url.searchParams.set('max_id', this.toots[this.toots.length - 1].id)
        if (process.env.NODE_ENV !== 'production') {
          console.log(url.href)
        }
        return axios.get(url.href)
      }).then((res) => {
        this.toots.push(...res.data)
        this.loading = false
      }).catch((err) => {
        this.error = err.message
        this.loading = false
      })
    },
    instanceSelected (name) {
      this.domain = name
      this.submit()
    },
    inputDomain () {
      this.suggestEnabled = true
    },
    updateSearchParams () {
      const to = `?domain=${this.domain}&local=${this.local.toString()}`
      if (location.search !== to) {
        history.pushState(null, null, to)
      }
    }
  }
}
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
