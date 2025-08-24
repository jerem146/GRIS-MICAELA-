import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const bratMaker = async (text) => {
  text = text.toLowerCase()
  // QuickChart API ajusta automáticamente tamaño de fuente
  const url = `https://quickchart.io/image?bkg=8ACE00&f=impact&text=${encodeURIComponent(text)}&w=512&h=512&fc=000000&textWrap=true`
  
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  return response.data
}

let handler = async (m, { conn, text }) => {
  if (m.quoted) text = m.quoted.text || text
  if (!text) return m.reply('❀ Ingresa un texto o responde un mensaje para hacer tu sticker brat.')

  try {
    const buffer = await bratMaker(text)
    let userId = m.sender
    let packstickers = global.db.data.users[userId] || {}
    let texto1 = packstickers.text1 || global.packsticker
    let texto2 = packstickers.text2 || global.packsticker2

    let stiker = await sticker(buffer, false, texto1, texto2)
    if (stiker) {
      await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    } else {
      throw new Error("✧ No se pudo generar el sticker.")
    }
  } catch (err) {
    await m.reply(`⚠︎ Error: ${err.message}`)
  }
}

handler.command = ['brat']
handler.tags = ['sticker']
handler.help = ['brat *<texto>*']

export default handler