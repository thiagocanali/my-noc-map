<template>
  <div class="app-root">
    <ControlsBar @simulateDown="simulateDown" @simulateUp="simulateUp" />
    <div class="layout">
      <MapView ref="mapview" />
      <LogPanel />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MapView from './components/MapView.vue'
import LogPanel from './components/LogPanel.vue'
import ControlsBar from './components/ControlsBar.vue'

const mapview = ref(null)

function simulateDown() { mapview.value?.simulateRandomDown() }
function simulateUp() { mapview.value?.simulateRandomUp() }
</script>

<style>
.app-root { height: 100vh; display:flex; flex-direction:column; }
.layout { display:flex; flex:1; }
MapView, LogPanel { flex:1; }
</style>