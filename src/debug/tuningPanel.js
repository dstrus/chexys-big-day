import { TUNING, TUNING_SCHEMA } from '../config/tuning.js'

// Debug tuning panel: backtick (`) toggles a DOM overlay of live sliders
// bound straight to TUNING, plus a "Copy values" button that puts the
// current settings on the clipboard as JSON for pasting back into
// src/config/tuning.js. This is how feel gets tuned — no code round-trips.

let panelEl = null
const statusEls = {}

// used by in-game debug overlays that should only draw while tuning
export function isTuningPanelOpen() {
  return !!panelEl && panelEl.style.display !== 'none'
}

// live readout lines at the panel's foot; slot 0 = steal fairness,
// slot 1 = frame/physics rates (jitter probe)
export function setPanelReadout(text, ok, slot = 0) {
  const el = statusEls[slot]
  if (!el) return
  el.textContent = text
  el.style.color = ok ? '#12b76a' : '#ea5151'
}

export function initTuningPanel() {
  const panel = document.createElement('div')
  panelEl = panel
  panel.id = 'tuning-panel'
  panel.style.cssText = [
    'position:fixed',
    'top:0',
    'right:0',
    'width:250px',
    'max-height:100vh',
    'overflow-y:auto',
    'box-sizing:border-box',
    'background:rgba(12,12,20,0.93)',
    'color:#f2ecd8',
    'font:11px/1.5 monospace',
    'padding:10px 14px 14px',
    'border-left:1px solid #3a3a4a',
    'z-index:1000',
    'display:none',
  ].join(';')

  const title = document.createElement('div')
  title.textContent = 'TUNING  (` to close)'
  title.style.cssText = 'font-weight:bold;margin-bottom:8px;color:#59c2e8'
  panel.appendChild(title)

  for (const entry of TUNING_SCHEMA) {
    panel.appendChild(entry.type === 'flag' ? flagRow(entry) : sliderRow(entry))
  }

  for (const slot of [0, 1]) {
    statusEls[slot] = document.createElement('div')
    statusEls[slot].style.cssText = 'margin-top:8px;font-size:10px;line-height:1.4'
    panel.appendChild(statusEls[slot])
  }

  const copyBtn = document.createElement('button')
  copyBtn.textContent = 'Copy values'
  copyBtn.style.cssText =
    'margin-top:10px;width:100%;padding:5px;font:bold 11px monospace;' +
    'background:#59c2e8;color:#101018;border:none;cursor:pointer'
  copyBtn.addEventListener('click', async () => {
    const json = JSON.stringify(TUNING, null, 2)
    try {
      await navigator.clipboard.writeText(json)
      copyBtn.textContent = 'Copied!'
    } catch {
      fallbackCopy(json)
      copyBtn.textContent = 'Copied (fallback)'
    }
    setTimeout(() => (copyBtn.textContent = 'Copy values'), 1200)
    copyBtn.blur()
  })
  panel.appendChild(copyBtn)

  document.body.appendChild(panel)

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Backquote') {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none'
    }
  })
}

function rowShell(labelText) {
  const row = document.createElement('div')
  row.style.cssText = 'margin-bottom:6px'
  const label = document.createElement('div')
  label.style.cssText = 'display:flex;justify-content:space-between'
  const name = document.createElement('span')
  name.textContent = labelText
  const value = document.createElement('span')
  value.style.color = '#ffe066'
  label.appendChild(name)
  label.appendChild(value)
  row.appendChild(label)
  return { row, value }
}

function sliderRow({ key, label, min, max, step, negate }) {
  const { row, value } = rowShell(label)
  value.textContent = TUNING[key]

  const input = document.createElement('input')
  input.type = 'range'
  input.min = min
  input.max = max
  input.step = step
  input.value = negate ? -TUNING[key] : TUNING[key]
  input.style.cssText = 'width:100%;margin:1px 0 0'
  input.addEventListener('input', () => {
    const raw = parseFloat(input.value)
    TUNING[key] = negate ? -raw : raw
    value.textContent = TUNING[key]
  })
  // give focus back to the game so arrow keys keep moving Chexy
  input.addEventListener('change', () => input.blur())

  row.appendChild(input)
  return row
}

function flagRow({ key, label }) {
  const { row, value } = rowShell(label)
  value.textContent = TUNING[key] ? 'on' : 'off'

  const input = document.createElement('input')
  input.type = 'checkbox'
  input.checked = TUNING[key]
  input.addEventListener('change', () => {
    TUNING[key] = input.checked
    value.textContent = input.checked ? 'on' : 'off'
    input.blur()
  })

  row.appendChild(input)
  return row
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.cssText = 'position:fixed;opacity:0'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  ta.remove()
}
