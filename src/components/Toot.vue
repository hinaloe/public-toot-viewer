<template>
    <div class="card mb-3">
        <div class="card-block d-flex">
            <div style="width: 90px;margin-right: 20px">
                <a :href="toot.account.url">
                    <img :src="toot.account.avatar" alt="avatar" style="border-radius: 50%;width: 100%">
                </a>
            </div>
            <div style="width: 100%">
                <div class="d-flex toot-header">
                    <a :href="toot.account.url" :title="note">
                        <div>{{toot.account.display_name}} @{{toot.account.acct}}</div>
                    </a>
                    <a :href="toot.url" class="ml-auto text-right date">{{date}}</a>
                </div>
                <p v-if="toot.spoiler_text">{{toot.spoiler_text}}
                    <button @click.prevent="more=true" class="btn btn-outline-primary btn-sm" v-if="!more">
                        Read more...
                    </button>
                    <button @click.prevent="more=false" class="btn btn-outline-secondary btn-sm" v-else>
                        Close
                    </button>
                </p>
                <div v-html="toot.content" v-if="!toot.spoiler_text||more"></div>
                <div v-if="toot.media_attachments.length">
                    <div v-if="toot.sensitive && !allowSensitive" class="text-center sensitive" @click="allowSensitive=true">
                        Sensitive content (click to show)
                    </div>
                    <div v-else>
                        <a :href="media.url" v-for="media in toot.media_attachments">
                            <img :src="media.preview_url" alt="" class="img-fluid img-thumbnail">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    .card .invisible {
        width: 0;
        height: 0;
        visibility: hidden;
        display: inline-flex;
    }
</style>
<style scoped="scoped">
    .card {
        word-break: break-all;
    }

    .sensitive {
        width: 100%;
        background: #303030;
        color: aliceblue;
        padding: 60px 30px;
        word-break: keep-all;
    }

    @media screen and (max-width: 768px) {
        .toot-header {
            flex-direction: column;
        }
    }
    .toot-header .date {
        font-size: .8em;
        color: #626262;
    }
</style>
<script>
  import striptags from 'striptags'
  export default {
    props: {
      toot: {
        type: Object, required: true
      }
    },
    data () {
      return {
        allowSensitive: false,
        more: false
      }
    },
    computed: {
      date () {
        const date = new Date(this.toot.created_at)
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${`00${date.getMinutes()}`.slice(-2)}:${`0${date.getSeconds()}`.slice(-2)}`
      },
      note () {
        return striptags(this.toot.account.note.replace(/<br(?: \/)?>/g, '\n'))
      }
    }
  }
</script>
