import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const fetchSticker = async (text) => {
    const url = `https://api.neoxr.eu/brat`
    const response = await axios.get(url, {
        params: { text, apikey: 'Paimon' },
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
            text: `❀ Por favor, responde a un mensaje o ingresa un texto para crear el Sticker.`,
        }, { quoted: m })
    }

    try {
        const buffer = Buffer.from(await fetchSticker(text))
        let userId = m.sender
        let packstickers = global.db.data.users[userId] || {}
        let texto1 = packstickers.text1 || global.packsticker
        let texto2 = packstickers.text2 || global.packsticker2

        let stiker = await sticker(buffer, false, texto1, texto2)

        if (stiker) {
            return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
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