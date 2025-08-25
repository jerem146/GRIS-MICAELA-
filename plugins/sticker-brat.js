import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const fetchBrat = async (text) => {
    // La URL interpreta '%0A' como un salto de línea, encodeURIComponent se encarga de eso.
    const url = `https://placehold.co/512x512/8ACE00/000000.png?text=${encodeURIComponent(text)}&font=arial`
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
        // --- MODIFICACIÓN: Se añade un ejemplo de uso con salto de línea. ---
        return conn.sendMessage(m.chat, {
            text: `❀ Por favor, responde a un mensaje o ingresa un texto para crear el Sticker.\n\n❀ Usa '|' para agregar un salto de línea.\n\n❀ *Ejemplo:*\n.brat Hola buenas | Cómo estás`,
        }, { quoted: m })
    }

    try {
        // --- MODIFICACIÓN: Se procesa el texto para reemplazar '|' por saltos de línea (\n). ---
        const textoProcesado = text.split('|').join('\\n');

        // Se pasa el texto ya procesado para generar la imagen.
        const buffer = Buffer.from(await fetchBrat(textoProcesado));
        
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
// --- MODIFICACIÓN: Se actualiza el texto de ayuda. ---
handler.help = ['brat *<texto1> | <texto2>*']

export default handler