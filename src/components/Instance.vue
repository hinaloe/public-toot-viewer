<template>
    <a class="dropdown-item" href="#" @click.prevent="$emit('selected', instance.name)">
        <div>{{instance.name}}</div>
        <div>
            <small>
                <b class="text-danger" v-if="!instance.up">DOWN </b>
                {{instance.users}} users / connections: {{instance.connections}}
            </small>
        </div>
    </a>
</template>
<script>
export default {
  props: {
    instance: Object
  }
}
</script>
