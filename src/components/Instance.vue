<template>
  <a
    class="dropdown-item"
    href="#"
    @click.prevent="$emit('selected', instance.name)"
  >
    <div>{{ instance.name }}</div>
    <div>
      <small>
        <b
          v-if="!instance.up"
          class="text-danger"
        >DOWN </b>
        {{ instance.users }} users / connections: {{ instance.connections }}
      </small>
    </div>
  </a>
</template>
<script>
export default {
  props: {
    instance: {
      type: Object,
      required: true,
    },
  },
}
</script>
