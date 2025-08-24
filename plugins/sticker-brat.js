import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Uso correcto: *${usedPrefix + command} <texto>*`)

  try {
    // Prepara texto multilínea natural
    let safeText = text.replace(/\n/g, '\\n').replace(/"/g, '\\"')

    // Chart.js config para sólo texto usando datalabels
    const chartConfig = {
      type: 'bar',
      data: { labels: [''], datasets: [{ label: '', data: [0], backgroundColor:'#00FF00' }] },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: {
            anchor: 'start',
            align: 'start',
            color: 'black',
            font: { family: 'Impact', size: 48, weight: 'bold' },
            formatter: function() { return safeText }
          }
        },
        scales: { x: { display: false }, y: { display: false } }
      }
    }

    const url = `https://quickchart.io/chart?w=512&h=512&c=${encodeURIComponent(JSON.stringify(chartConfig))}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = await res.buffer()

    // Convertir la imagen a sticker .webp
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