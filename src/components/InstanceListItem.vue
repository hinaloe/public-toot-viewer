<template>
  <a
    class="dropdown-item"
    href="#"
    @click.prevent="$emit('selected', instance.name)"
  >
    <div class="instance-name">{{ instance.name }}</div>
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
<script setup lang="ts">
type InstanceInfo = {
  name: string
  users: number
  connections: number
  up: boolean
  [key: string]: unknown
}

defineProps<{instance: InstanceInfo}>()
</script>
