import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const fetchBratImage = async (text) => {
    // Construye la URL según los parámetros esperados por el generador QuickBrat
    const url = `https://quickbrat.com/api/generate` // Ejemplo; revisa si esta API existe o adapta el frontend
    const response = await axios.get(url, {
        params: { text },
        responseType: 'arraybuffer',
        timeout: 20000
    })
    return response.data // Buffer de la imagen PNG
}

let handler = async (m, { conn, text }) => {
    if (m.quoted) {
        text = m.quoted.text || m.quoted.caption || text
    }
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `❀ Por favor, responde a un mensaje o ingresa un texto para crear el sticker brat.`,
        }, { quoted: m })
    }

    try {
        const pngBuffer = Buffer.from(await fetchBratImage(text))
        let userId = m.sender
        let packstickers = global.db.data.users[userId] || {}
        let texto1 = packstickers.text1 || global.packsticker
        let texto2 = packstickers.text2 || global.packsticker2

        // Crear sticker a partir del PNG
        const stiker = await sticker(pngBuffer, false, texto1, texto2)

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
        } else {
            throw new Error("✧ No se pudo generar el sticker.")
        }
    } catch (err) {
        return conn.sendMessage(m.chat, {
            text: `⚠︎ Ocurrió un error: ${err.message}`,
        }, { quoted: m })
    }
}

handler.command = ['brat']
handler.tags = ['sticker']
handler.help = ['brat *<texto>*']

export default handler