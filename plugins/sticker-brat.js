import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const bratMaker = async (text) => {
  const url = `https://fakeimg.pl/512x512/8ACE00/000000/?font=impact&font_size=70&text=${encodeURIComponent(text)}`
  const resp = await axios.get(url, { responseType: 'arraybuffer' })
  return resp.data
}

let handler = async (m, { conn, text }) => {
  if (m.quoted) text = m.quoted.text || m.quoted.caption || text
  if (!text) return conn.sendMessage(m.chat, { text: '❀ Ingresa un texto para crear el sticker brat.' }, { quoted: m })

  try {
    const buffer = await bratMaker(text)
    let pack = global.db.data.users[m.sender] || {}
    let texto1 = pack.text1 || global.packsticker
    let texto2 = pack.text2 || global.packsticker2

    const stkr = await sticker(buffer, false, texto1, texto2)
    if (stkr) await conn.sendFile(m.chat, stkr, 'sticker.webp', '', m)
    else throw new Error('✧ No pudo generar el sticker.')
  } catch (e) {
    return conn.sendMessage(m.chat, { text: `⚠︎ Error: ${e.message}` }, { quoted: m })
  }
}

handler.command = ['brat']
handler.tags = ['sticker']
handler.help = ['brat *<texto>*']
export default handler