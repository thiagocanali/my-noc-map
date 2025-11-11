<template>
  <div class="log-panel">
    <h3>Logs de Eventos</h3>
    <div class="log-list">
      <div v-for="log in logs" :key="log.datetime" class="log-item">
        <b>{{ log.type.toUpperCase() }}</b> — {{ log.cliente }}
        ({{ log.ip }}) — {{ formatDate(log.datetime) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import logService from '../services/logService'
import dayjs from 'dayjs'

const logs = ref([])

onMounted(() => {
  logs.value = logService.getLogs()
  window.addEventListener('storage', () => {
    logs.value = logService.getLogs()
  })
})

function formatDate(d) {
  return dayjs(d).format('DD/MM/YYYY HH:mm:ss')
}
</script>

<style>
.log-panel {
  width: 30%;
  background: #1e293b;
  padding: 10px;
  color: #e5e7eb;
  overflow-y: auto;
}
.log-item {
  border-bottom: 1px solid #334155;
  padding: 4px 0;
}
</style>
