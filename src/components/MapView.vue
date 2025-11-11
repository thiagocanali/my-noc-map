<template>
    <div id="map" style="height:100%; width:100%"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import dayjs from 'dayjs'
import logService from '../services/logService'
import linksData from '../data/links.json'



onMounted(() => {
    map.value = L.map('map').setView([-14.235004, -51.92528], 4)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map.value)


    // adicionar marcadores iniciais
    links.forEach(link => addMarker(link))
})


// --- funções públicas para simulação e para integrar com monitoramento ---


// Simula uma queda em um link aleatório
function simulateRandomDown() {
    const candidates = links.filter(l => l.status !== 'down')
    if (!candidates.length) return
    const chosen = candidates[Math.floor(Math.random() * candidates.length)]
    markDown(chosen.id)
}


// Simula normalização
function simulateRandomUp() {
    const candidates = links.filter(l => l.status === 'down')
    if (!candidates.length) return
    const chosen = candidates[Math.floor(Math.random() * candidates.length)]
    markUp(chosen.id)
}


function markDown(id) {
    const link = links.find(l => l.id === id)
    if (!link || link.status === 'down') return
    link.status = 'down'
    link.lastDownAt = dayjs().toISOString()
    // registra evento
    const evt = logService.logEvent({
        id: link.id,
        type: 'down',
        cliente: link.cliente,
        ip: link.ip,
        details: {
            operadora: link.operadora,
            designacao: link.designacao,
            velocidade: link.velocidade,
            endereco: link.endereco
        }
    })
    link.events.unshift(evt)
    updateMarker(link)
}


function markUp(id) {
    const link = links.find(l => l.id === id)
    if (!link || link.status === 'up') return
    link.status = 'up'
    // registra normalização (up)
    const evt = logService.logEvent({
        id: link.id,
        type: 'up',
        cliente: link.cliente,
        ip: link.ip,
        details: {
            operadora: link.operadora,
            designacao: link.designacao,
            velocidade: link.velocidade,
            endereco: link.endereco
        }
    })
    link.events.unshift(evt)
    updateMarker(link)
}


// expose methods to parent
defineExpose({ simulateRandomDown, simulateRandomUp, markDown, markUp })
</script>

<style>
#map {
    height: 100%;
}


/* estilos dos pontos */
.noc-dot {
    border-radius: 50%;
    display: inline-block
}

.noc-red {
    background: #ff3b30;
    width: 14px;
    height: 14px;
    box-shadow: 0 0 8px rgba(255, 59, 48, 0.9);
    animation: blink 1s infinite
}

.noc-green {
    background: #10b981;
    width: 12px;
    height: 12px;
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.7)
}


@keyframes blink {
    50% {
        opacity: 0.35
    }
}
</style>