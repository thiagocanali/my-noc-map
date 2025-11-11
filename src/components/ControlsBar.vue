<template>
  <div class="controls">
    <button @click="$emit('simulateDown')">Simular Queda</button>
    <button @click="$emit('simulateUp')">Simular Normalização</button>
    <button @click="clearLogs">Limpar Logs</button>
  </div>
</template>

<script setup>
import logService from '../services/logService'

function clearLogs() {
  if (confirm('Limpar logs?')) {
    logService.clear()
    alert('Logs limpos!')
  }
}
</script>

<style>
.controls {
  padding: 10px;
  background: #1f2937;
}
.controls button {
  margin-right: 8px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.controls button:hover {
  background: #1e40af;
}
</style>
