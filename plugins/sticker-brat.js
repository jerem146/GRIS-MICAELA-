import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Uso correcto: *${usedPrefix + command} <texto>*`)

  try {
    let safeText = text.replace(/\n/g, '\\n').replace(/"/g, '\\"')

    // Configuración especial de QuickChart para SOLO texto
    const chartConfig = {
      type: 'custom',
      data: { datasets: [] },
      options: {
        plugins: {
          renderText: {
            text: safeText,
            color: 'black',
            font: {
              size: 64,
              family: 'Impact',
              weight: 'bold'
            },
            position: 'top-left'
          }
        }
      }
    }

    // Fondo verde
    const url = `https://quickchart.io/chart?w=512&h=512&bkg=%2300FF00&c=${encodeURIComponent(JSON.stringify(chartConfig))}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buffer = await res.buffer()

    // Convertir en sticker
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