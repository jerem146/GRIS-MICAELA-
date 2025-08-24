import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const fetchBrat = async (text) => {
    // Siempre en minúsculas estilo Charli
    text = text.toLowerCase()

    // Generador: fondo verde brat (#8ACE00), texto negro, centrado y en Impact Bold
    const url = `https://placehold.co/512x512/8ACE00/000000.png?text=${encodeURIComponent(text)}&font=impact&bold=true`
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