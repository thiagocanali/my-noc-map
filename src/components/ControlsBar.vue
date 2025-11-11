<template>
  <div class="controls">
    <button @click="$emit('simulateDown')">Simular queda aleatória</button>
    <button @click="$emit('simulateUp')">Simular normalização aleatória</button>
    <button @click="clearLogs">Limpar logs</button>
  </div>
</template>

<script setup>
import logService from '../services/logService'
function clearLogs() {
  if(confirm('Limpar logs?')) {
    logService.clear()
    alert('Logs limpos')
  }
}
</script>

<style>
.controls { padding:8px; background:#111827; color:white }
.controls button { margin-right:8px }
</style>