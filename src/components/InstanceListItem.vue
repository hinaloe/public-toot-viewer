<template>
  <a
    class="dropdown-item"
    href="#"
    @click.prevent="emit('selected', instance.name)"
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
import type { InstanceInfo } from '@/types'

defineProps<{ instance: InstanceInfo }>()

const emit = defineEmits<{
  selected: [name: string]
}>()
</script>
