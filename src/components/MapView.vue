<template>
    <div id="map"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import dayjs from 'dayjs'
import logService from '../services/logService'
import linksData from '../data/links.json'

const map = ref(null)
let markers = {}
const links = ref(JSON.parse(JSON.stringify(linksData)))

onMounted(() => {
    // inicializa mapa travado na América do Sul
    map.value = L.map('map', {
        minZoom: 3,
        maxZoom: 7,
    }).setView([-15.8, -47.9], 4)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map.value)

    const bounds = L.latLngBounds([-60, -90], [15, -25]) // América do Sul
    map.value.setMaxBounds(bounds)

    // cria marcadores
    links.value.forEach(link => {
        const icon = L.divIcon({
            className: link.status === 'up' ? 'noc-dot noc-green' : 'noc-dot noc-red',
            iconSize: [14, 14]
        })
        const marker = L.marker([link.latitude, link.longitude], { icon })
            .addTo(map.value)
            .bindPopup(getPopupHTML(link))
        markers[link.id] = marker
    })
})

// funções
function getPopupHTML(link) {
    return `
    <b>${link.cliente}</b><br/>
    ${link.operadora}<br/>
    ${link.designacao}<br/>
    Velocidade: ${link.velocidade}<br/>
    IP: ${link.ip}<br/>
    CNPJ: ${link.cnpj}<br/>
    Endereço: ${link.endereco}<br/>
    Status: ${link.status.toUpperCase()}<br/>
    Última queda: ${link.lastDownAt ? dayjs(link.lastDownAt).format('DD/MM HH:mm:ss') : '—'}
  `
}

function updateMarker(link) {
    const icon = L.divIcon({
        className: link.status === 'up' ? 'noc-dot noc-green' : 'noc-dot noc-red',
        iconSize: [14, 14]
    })
    const marker = markers[link.id]
    if (marker) {
        marker.setIcon(icon)
        marker.setPopupContent(getPopupHTML(link))
    }
}

function markDown(id) {
    const link = links.value.find(l => l.id === id)
    if (!link || link.status === 'down') return
    link.status = 'down'
    link.lastDownAt = dayjs().toISOString()
    const evt = logService.logEvent({
        id: link.id,
        type: 'down',
        cliente: link.cliente,
        ip: link.ip,
        details: link
    })
    link.events.unshift(evt)
    updateMarker(link)
}

function markUp(id) {
    const link = links.value.find(l => l.id === id)
    if (!link || link.status === 'up') return
    link.status = 'up'
    const evt = logService.logEvent({
        id: link.id,
        type: 'up',
        cliente: link.cliente,
        ip: link.ip,
        details: link
    })
    link.events.unshift(evt)
    updateMarker(link)
}

function simulateRandomDown() {
    const candidates = links.value.filter(l => l.status !== 'down')
    if (!candidates.length) return
    const chosen = candidates[Math.floor(Math.random() * candidates.length)]
    markDown(chosen.id)
}

function simulateRandomUp() {
    const candidates = links.value.filter(l => l.status === 'down')
    if (!candidates.length) return
    const chosen = candidates[Math.floor(Math.random() * candidates.length)]
    markUp(chosen.id)
}

defineExpose({ simulateRandomDown, simulateRandomUp })
</script>

<style>
#map {
    height: 100%;
    width: 100%;
}

.noc-dot {
    border-radius: 50%;
    display: inline-block;
}

.noc-red {
    background: #ff3b30;
    width: 14px;
    height: 14px;
    box-shadow: 0 0 8px rgba(255, 59, 48, 0.9);
    animation: blink 1s infinite;
}

.noc-green {
    background: #10b981;
    width: 12px;
    height: 12px;
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.7);
}

@keyframes blink {
    50% {
        opacity: 0.4
    }
}
</style>
