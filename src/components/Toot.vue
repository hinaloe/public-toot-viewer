<template>
    <div class="card mb-3">
        <div class="card-block d-flex">
            <div style="width: 90px;margin-right: 20px">
                <a :href="toot.account.url">
                    <img :src="toot.account.avatar" alt="avatar" style="border-radius: 50%;width: 100%">
                </a>
            </div>
            <div style="width: 100%">
                <div class="d-flex">
                    <a :href="toot.account.url" :title="toot.account.note">
                        <div>{{toot.account.display_name}} @{{toot.account.username}}</div>
                    </a>
                    <a :href="toot.url" class="ml-auto">{{date}}</a>
                </div>
                <div v-html="toot.content"></div>
                <div v-if="toot.media_attachments.length">
                    <div v-if="toot.sensitive && !allowSensitive" style="width: 100%; background: #303030; color: aliceblue;padding: 60px" class="text-center" @click="allowSensitive=true">
                        Sensitive content (click to show)
                    </div>
                    <div v-else>
                        <a :href="media.url" v-for="media in toot.media_attachments">
                            <img :src="media.preview_url" alt="">
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
        display: inline-block;
    }
</style>
<script>
  export default {
    props: {
      toot: Object
    },
    data () {
      return {
        allowSensitive: false
      }
    },
    computed: {
      date () {
        const date = new Date(this.toot.created_at)
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      }
    }
  }
</script>
