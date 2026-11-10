<template>
  <article class="card mb-3">
    <div class="card-body d-flex">
      <div style="width: 90px;margin-right: 20px">
        <a :href="toot.account.url">
          <img
            :src="toot.account.avatar"
            alt="avatar"
            style="border-radius: 50%;width: 100%"
          >
        </a>
      </div>
      <div style="width: 100%">
        <div class="d-flex toot-header">
          <a
            :href="toot.account.url"
            :title="note"
          >
            <div><span class="name">{{ toot.account.display_name }}</span> <span class="acct">@{{ toot.account.acct }}</span></div>
          </a>
          <a
            :href="toot.url"
            class="ml-auto text-right date"
          >{{ date }}</a>
        </div>
        <p v-if="toot.spoiler_text">
          {{ toot.spoiler_text }}
          <button
            v-if="!more"
            class="btn btn-outline-primary btn-sm"
            @click.prevent="more=true"
          >
            Read more...
          </button>
          <button
            v-else
            class="btn btn-outline-secondary btn-sm"
            @click.prevent="more=false"
          >
            Close
          </button>
        </p>
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-if="!toot.spoiler_text||more"
          class="content"
          v-html="content"
        />
        <!-- eslint-enable vue/no-v-html -->
        <div v-if="toot.media_attachments.length">
          <div
            v-if="toot.sensitive && !allowSensitive"
            class="text-center sensitive"
            @click="allowSensitive=true"
          >
            Sensitive content (click to show)
          </div>
          <div v-else>
            <a
              v-for="media in toot.media_attachments"
              :key="media.id"
              :href="media.url"
            >
              <img
                :src="media.preview_url"
                alt=""
                class="img-fluid img-thumbnail"
              >
            </a>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import striptags from 'striptags'
import sanitize from 'sanitize-html'

type Emoji = {
  shortcode: string
  url: string
  static_url: string
  visible_in_picker: boolean
}

type Account = {
  id: `${number}`
  acct: string
  display_name: string
  url: string
  avatar: string
  header: string
  note: string
  followers_count: number
  following_count: number
  statuses_count: number
  last_status_at: string
  emojis: Emoji[]
  fields?: {name: string, value:string, verified_at: string | null}[]
  [key: string]: unknown
}

type Toot = {
  id: `${number}`
  url: string
  account: Account
  content: string
  created_at: string
  in_reply_to_id: Toot['id'] | null
  in_reply_to_account_id?: Account['id'] | null
  reblog: Toot | null
  sensitive: boolean
  spoiler_text: string
  visibility: string
  media_attachments: Array<{
    id: `${number}`
    type: string
    url: string
    preview_url: string
    text_url: string
    description: unknown
    blurhash?: string|null
    meta: {
      [sizeVar: 'original' | 'small' | string]: {
        width: number
        height: number
        size: string
        aspect: number
      }
    }
  }>
  emojis: Emoji[]
  [key: string]: unknown
}

const props = defineProps<{toot: Toot}>()

const allowSensitive = ref(false)
const more = ref(false)

const note = striptags(props.toot.account.note?.replace(/<br(?: \/)?>/g, '\n'))

const _date = new Date(props.toot.created_at)
const date = `${_date.getFullYear()}/${_date.getMonth() + 1}/${_date.getDate()} ${_date.getHours()}:${`00${_date.getMinutes()}`.slice(-2)}:${`0${_date.getSeconds()}`.slice(-2)}`

const content = (()=> {
  let sanitized: string = sanitize(props.toot.content, {
          allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
          'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
          'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span'],
        allowedAttributes: {
          a: ['href', 'target'],
          // We don't currently allow img itself by default, but this
          // would make sense if we did
          img: ['src', 'alt'],
          '*': ['class', 'title', 'rel'],
    },
  })
  if (Array.isArray(props.toot.emojis) && props.toot.emojis.length) {
    for (const emoji of props.toot.emojis) {
      if (!emoji.shortcode || !emoji.url || !validateShortCode(emoji.shortcode)) {
        continue
      }
      sanitized = sanitized.replace(new RegExp(`:${emoji.shortcode}:`, 'g'), `<img src="${emoji.url}" draggable="false" alt=":${emoji.shortcode}:" title=":${emoji.shortcode}:" class="inline-emoji">`)
    }
  }

  return sanitized
})()

function validateShortCode (name: string) {
  return /^[a-zA-Z0-9_]+$/.test(name)
}
</script>
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

    .acct {
        font-size: .9em;
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
