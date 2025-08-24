import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const wrapText = (str, maxWords = 4) => {
  const words = str.split(" ")
  let lines = []
  for (let i = 0; i < words.length; i += maxWords) {
    lines.push(words.slice(i, i + maxWords).join(" "))
  }
  return lines.join("\n")
}

const calcFontSize = (lines) => {
  if (lines <= 2) return 150
  if (lines <= 3) return 120
  if (lines <= 4) return 90
  return 70
}

const fetchBrat = async (text) => {
    text = text.toLowerCase()
    const wrapped = wrapText(text, 4)
    const lines = wrapped.split("\n").length
    const size = calcFontSize(lines)

    const url = `https://placehold.co/512x512/8ACE00/000000.png?text=${encodeURIComponent(wrapped)}&font=impact&bold=true&size=${size}`
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 20000
    })
    return response.data
}

let handler = async (m, { conn, text }) => {
    if (m.quoted) {
        text = m.quoted.text || m.quoted.caption || text
    }
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `❀ Por favor, responde a un mensaje o ingresa un texto para crear el Sticker brat.`,
        }, { quoted: m })
    }

    try {
        const buffer = Buffer.from(await fetchBrat(text))
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
    } catch (error) {
        return conn.sendMessage(m.chat, {
            text: `⚠︎ Ocurrió un error: ${error.message}`,
        }, { quoted: m })
    }
}

handler.command = ['brat']
handler.tags = ['sticker']
handler.help = ['brat *<texto>*']

export default handler