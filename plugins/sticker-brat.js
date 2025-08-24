import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Uso correcto: *${usedPrefix + command} <texto>*`)

  try {
    // Convertir saltos de línea y caracteres especiales para la URL
    let safeText = encodeURIComponent(text.replace(/\n/g, '%0A'))

    // QuickChart Text API → texto multilínea, fondo verde
    let url = `https://quickchart.io/render/text?text=${safeText}&fontSize=48&color=black&backgroundColor=%2300FF00&width=512&height=512&format=png&align=left`

    let res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    let buffer = await res.buffer()

    // Convertir a sticker
    let stkr = await sticker(buffer, false, 'Brat', 'Texto')
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