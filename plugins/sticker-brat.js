import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Uso correcto: *${usedPrefix + command} <texto>*`)

  try {
    // Formatear texto multilínea (se mantiene a la izquierda)
    let texto = text.replace(/\\n/g, '\n')

    // API QuickChart para generar imagen con texto alineado a la izquierda
    let url = `https://quickchart.io/chart?bkg=white&c={type:'wordcloud',options:{text:'${texto}',rotation:0,fontFamily:'Arial',fontWeight:'bold',minFontSize:40,maxFontSize:60,color:'black',backgroundColor:'white'}}`

    let res = await fetch(url)
    if (!res.ok) throw await res.text()
    let buffer = await res.buffer()

    // Convertir imagen en sticker
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