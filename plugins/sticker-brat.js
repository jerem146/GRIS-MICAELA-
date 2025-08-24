import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Uso correcto: *${usedPrefix + command} <texto>*`)

  try {
    // Mantener saltos de línea
    let safeText = text.replace(/"/g, '\\"')

    const chartConfig = {
      type: 'scatter',
      data: {
        datasets: [{
          data: [{ x: 0, y: 0 }],
          pointRadius: 0
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: {
            display: true,
            anchor: 'center',
            align: 'center',
            color: 'black',
            font: {
              family: 'Impact',
              // 👇 Autoajuste: grande si es corto, pequeño si es largo
              size: Math.max(20, Math.min(80, 400 / text.length)),
              weight: 'bold'
            },
            formatter: () => safeText
          }
        },
        scales: {
          x: { display: false, min: -1, max: 1 },
          y: { display: false, min: -1, max: 1 }
        }
      }
    }

    const url = `https://quickchart.io/chart?w=512&h=512&bkg=%2300FF00&c=${encodeURIComponent(JSON.stringify(chartConfig))}&plugins=datalabels`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = await res.buffer()

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