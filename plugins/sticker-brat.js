import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Uso correcto: *${usedPrefix + command} <texto>*`)

  try {
    // Escapar saltos de línea y comillas
    let safeText = text.replace(/\n/g, '\\n').replace(/"/g, '\\"')

    // Config Chart.js para SOLO texto (sin gráficas)
    const chartConfig = {
      type: 'scatter', // gráfico vacío
      data: { datasets: [] },
      options: {
        layout: { padding: 20 },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: {
            anchor: 'start',
            align: 'start',
            color: 'black',
            font: { family: 'Impact', size: 48, weight: 'bold' },
            formatter: () => safeText
          }
        },
        scales: { x: { display: false }, y: { display: false } }
      }
    }

    const url = `https://quickchart.io/chart?w=512&h=512&bkg=%2300FF00&c=${encodeURIComponent(JSON.stringify(chartConfig))}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = await res.buffer()

    // Convertir a sticker
    const stkr = await sticker(buffer, false, 'Brat', 'Texto')
    if (stkr) {
      await conn.sendFile(m.chat, stkr, 'sticker.webp', '', m)
    } else {
      m.reply(`❌ Error al convertir en sticker`)
    }

  } catch (e) {
    console.error(e)
    m.reply(`⚠︎ Error: ${e.message}`)
  }
}

handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = /^brat$/i

export default handler