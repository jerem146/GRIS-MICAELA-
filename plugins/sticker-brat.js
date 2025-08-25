import { sticker } from '../lib/sticker.js'
import axios from 'axios'

// --- FUNCIÓN MODIFICADA PARA USAR LA NUEVA API ---
const fetchBrat = async (text) => {
    // URL de la imagen de fondo verde (512x512)
    const backgroundImageUrl = 'https://i.postimg.cc/RFrz9m8N/green-square.png';

    // La API de memes necesita que el texto esté formateado para la URL.
    // Reemplazamos espacios con guiones bajos (_), y caracteres especiales.
    // Usamos la primera línea de texto como el texto superior del "meme".
    // El texto inferior lo dejamos en blanco con un solo guion bajo.
    const topText = text.replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\//g, '~s');
    const bottomText = '_';

    const url = `https://api.memegen.link/images/custom/${topText}/${bottomText}.png?background=${backgroundImageUrl}`;
    
    console.log('URL Generada:', url); // Esto te ayudará a ver la URL que se está creando

    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 20000
    });
    return response.data;
}

let handler = async (m, { conn, text }) => {
    if (m.quoted) {
        text = m.quoted.text || m.quoted.caption || text;
    }
    if (!text) {
        return conn.sendMessage(m.chat, {
            text: `❀ Por favor, responde a un mensaje o ingresa un texto para crear el Sticker.\n\n❀ *Ejemplo:*\n.brat TE AMO MUCHO`,
        }, { quoted: m });
    }

    try {
        // La nueva API no maneja bien los saltos de línea, así que los unimos con un espacio.
        // Si quieres un salto de línea, tendrás que crear dos stickers separados.
        const textoProcesado = text.split('|').join(' ');

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
        console.error(error); // Muestra el error completo en la consola
        return conn.sendMessage(m.chat, {
            text: `⚠︎ Ocurrió un error. Es posible que la API no haya podido procesar el texto. Intenta con otras palabras.`,
        }, { quoted: m });
    }
}

handler.command = ['brat']
handler.tags = ['sticker']
// El uso de "|" ya no es práctico con esta API, así que lo simplificamos.
handler.help = ['brat *<texto>*']

export default handler;