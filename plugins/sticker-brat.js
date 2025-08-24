import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Uso correcto: *${usedPrefix + command} <texto>*`)

  try {
    let safeText = text.replace(/\"/g, '\\"')

    // Genera imagen con fondo verde y texto negro
    let url = `https://quickchart.io/chart?bkg=%2300FF00&c={
      type:'bar',
      data:{labels:[""],datasets:[{label:"",data:[1]}]},
      options:{
        indexAxis:'y',
        plugins:{
          datalabels:{
            anchor:'start',
            align:'start',
            color:'black',
            font:{size:40},
            formatter:()=>"${safeText}"
          },
          legend:{display:false},
          tooltip:{enabled:false}
        },
        scales:{x:{display:false},y:{display:false}}
      }
    }`

    let res = await fetch(url)
    if (!res.ok) throw await res.text()
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