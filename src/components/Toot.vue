<template>
    <article class="card mb-3">
        <div class="card-body d-flex">
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
                <div v-html="content" v-if="!toot.spoiler_text||more" class="content"></div>
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
    </article>
</template>
<style scoped="scoped">
    .card {
        word-break: break-all;
    }

    .card >>> .invisible {
        width: 0;
        height: 0;
        visibility: initial!important;
        display: inline-flex;
        font-size: 0;
        line-height: 0;
        position: absolute;
    }

    .card >>> .ellipsis::after {
        content: '…';
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

    .content >>> .inline-emoji {
        display: inline-block;
        height: 24px;
        width: 24px;
        vertical-align: middle;
        object-fit: contain;
    }
</style>
<script>
  import striptags from 'striptags'
  import sanitize from 'sanitize-html'

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
      },
      content () {
        /** @type {String} sanitized */
        let sanitized = sanitize(this.toot.content, {
          allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
            'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
            'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span'],
          allowedAttributes: {
            a: ['href', 'target'],
            // We don't currently allow img itself by default, but this
            // would make sense if we did
            img: ['src', 'alt'],
            '*': ['class', 'title', 'rel']
          }
        })

        if (Array.isArray(this.toot.emojis) && this.toot.emojis.length) {
          for (const emoji of this.toot.emojis) {
            if (!emoji.shortcode || !emoji.url || !this.validateShortCode(emoji.shortcode)) {
              debugger
              break
            }
            sanitized = sanitized.replace(new RegExp(`:${emoji.shortcode}:`, 'g'), `<img src="${emoji.url}" draggable="false" alt=":${emoji.shortcode}:" title=":${emoji.shortcode}:" class="inline-emoji">`)
          }
        }

        return sanitized
      }
    },
    methods: {
      validateShortCode (name) {
        return /^[a-zA-Z0-9_]+$/.test(name)
      }
    }
  }
</script>
