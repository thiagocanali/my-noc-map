<template>
  <div class="log-panel">
    <h3>📜 Logs de Eventos</h3>
    <ul>
      <li v-for="(event, index) in events" :key="index">
        <strong>{{ event.datetime }}</strong> — 
        {{ event.details }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import logService from '../services/logService'

const events = ref([])

onMounted(() => {
  // carrega logs do serviço central
  events.value = logService.events
})
</script>

<style scoped>
.log-panel {
  background: #10141a;
  color: #fff;
  padding: 16px;
  border-radius: 12px;
  width: 400px;
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 13px;
}

.log-panel h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #00eaff;
}

.log-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.log-panel li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 0;
}
</style>
