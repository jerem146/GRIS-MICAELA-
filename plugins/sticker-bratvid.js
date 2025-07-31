import axios from 'axios'
import { sticker } from '../lib/sticker.js'

// Llama a la API tipo bratvid (texto animado)
const fetchStickerVideo = async (text) => {
    const response = await axios.get(`https://bratvid-tuapp.onrender.com/maker/bratvid`, {
        params: {
            text,           // texto a animar (ej: grrrrrrrr)
            style: 'giftext', // estilo animado
            format: 'webp', // salida webp (sticker)
            t: 3,           // duración (s)
            size: 512,      // resolución
            fps: 15
        },
        responseType: 'arraybuffer',
        timeout: 20000
    })
    if (!response.data) throw new Error('Error al obtener el video de la API.')
    return response.data
}

let handler = async (m, { conn, text }) => {
    if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else if (!text) {
        return conn.sendMessage(m.chat, {
            text: '❀ Por favor, responde a un mensaje o ingresa un texto para crear el *BratVid* animado.'
        }, { quoted: m })
    }

    // Firma (pack y author)
    let userId = m.sender
    let packstickers = global.db.data.users[userId] || {}
    let texto1 = packstickers.text1 || global.packsticker
    let texto2 = packstickers.text2 || global.packsticker2

    try {
        // Llamamos la API que genera el bratvid
        const videoBuffer = await fetchStickerVideo(text)

        // Convertimos a sticker y firmamos
        const stickerBuffer = await sticker(videoBuffer, null, texto1, texto2)

        // Enviamos el sticker animado
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })

    } catch (e) {
        await conn.sendMessage(m.chat, {
            text: `⚠︎ Ocurrió un error: ${e.message}`
        }, { quoted: m })
    }
}

handler.help = ['bratvid <texto>']
handler.tags = ['sticker']
handler.command = ['bratvid', 'bratv']

export default handler