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
        <form action="post" @submit.prevent="submit">
            <div class="form-group row">
                <label for="domain" class="col-4 col-md-2">Domain</label>
                <input type="text" class="form-control col-8 col-md-4"
                       placeholder="mstdn.jp" id="domain" v-model="domain">
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
            <div class="text-center" v-if="currentUri && !loading" @click.prevent="loadMore" style="cursor: pointer">more</div>
        </div>
    </div>
  </div>
</template>

<script>
import Toot from './components/Toot.vue'
import axios from 'axios'

export default {
  data () {
    return {
      toots: [],
      domain: '',
      local: false,
      loading: false,
      currentUri: null,
      error: ''
    }
  },
  name: 'app',
  components: {
    Toot
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
        url.searchParams.append('since_id', this.toots[0].id)
        axios.get(url.href).then((res) => {
          this.toots.unshift(...res.data)
        })
      }
    }, 30000)
  },
  computed: {
    apiUri () {
      const url = new URL(String.includes(this.domain, '://') ? this.domain : 'https://' + this.domain)
      url.pathname = '/api/v1/timelines/public'
      return url
    }
  },
  methods: {
    submit () {
      this.error = ''
      this.toots = []
      this.loading = true
      Promise.resolve().then(() => {
        if (!String.includes(this.domain, '.')) {
          throw new Error('Invalid domain')
        }
        console.log(this.apiUri)
        const url = this.apiUri
        this.currentUri = url
        console.log(url.searchParams)
        url.searchParams.append('limit', 40)
        if (this.local) {
          url.searchParams.append('local', true)
        }
        return axios.get(url.href)
      }).then(res => {
        console.log(res.data)
        this.toots = res.data
        this.loading = false
      }).catch((err) => {
        this.error = err.message
      })
    },
    loadMore () {
      this.loading = true
      Promise.resolve().then(() => {
        const url = this.currentUri
        url.searchParams.delete('since_id')
        url.searchParams.append('max_id', this.toots[this.toots.length - 1].id)
        console.log(url.href)
        return axios.get(url.href)
      }).then((res) => {
        this.toots.push(...res.data)
        this.loading = false
      }).catch((err) => {
        this.error = err.message
        this.loading = false
      })
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
</style>
