import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const fetchSticker = async (text, attempt = 1) => {
    try {
        // API principal
        const response = await axios.get('https://api.nekorinn.my.id/maker/brat-v2', {
            params: { text },
            responseType: 'arraybuffer',
            timeout: 15000
        })
        return response.data
    } catch (error) {
        // Si la API principal falla (502, 500, 404...) intentamos con otra
        if ((error.response?.status === 502 || error.response?.status === 500) && attempt === 1) {
            const alt = await axios.get(`https://api.lolhuman.xyz/api/brat?apikey=PAIMON&text=${encodeURIComponent(text)}`, {
                responseType: 'arraybuffer',
                timeout: 15000
            })
            return alt.data
        }
        throw error
    }
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