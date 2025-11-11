import dayjs from 'dayjs'

const STORAGE_KEY = 'noc_map_logs_v1'

function load() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

function save(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
}

function logEvent(event) {
  const logs = load()
  const enriched = { ...event, datetime: event.datetime || dayjs().toISOString() }
  logs.unshift(enriched)
  save(logs)
  return enriched
}

function getLogs() { return load() }
function clear() { localStorage.removeItem(STORAGE_KEY) }

export default { logEvent, getLogs, clear }
