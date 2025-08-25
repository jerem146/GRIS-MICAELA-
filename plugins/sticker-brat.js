import { sticker } from '../lib/sticker.js'
import axios from 'axios'

// --- FUNCIÓN MEJORADA PARA FORMATEAR EL TEXTO ---
// Esta función convierte el texto al formato especial que la API requiere.
const formatTextForApi = (text) => {
    if (!text) return '_'; // Si no hay texto, devuelve un guion bajo.
    return text
        .replace(/-/g, '__')  // Guiones (-) se convierten en doble guion bajo (__)
        .replace(/_/g, '--')  // Guiones bajos (_) se convierten en doble guion (-)
        .replace(/\s/g, '_')   // Espacios se convierten en guion bajo (_)
        .replace(/\?/g, '~q')  // Signos de interrogación (?) se convierten en ~q
        .replace(/%/g, '~p')   // Porcentajes (%) se convierten en ~p
        .replace(/\//g, '~s')  // Barras inclinadas (/) se convierten en ~s
        .replace(/#/g, '~h')   // Almohadillas (#) se convierten en ~h
        .replace(/"/g, "''"); // Comillas dobles (") se convierten en comillas simples dobles ('')
};

const fetchBrat = async (text) => {
    const backgroundImageUrl = 'https://i.postimg.cc/RFrz9m8N/green-square.png';
    
    // Usamos la nueva función para asegurar que el texto esté bien formateado
    const topText = formatTextForApi(text);
    const bottomText = '_'; // Dejamos el texto de abajo vacío

    const url = `https://api.memegen.link/images/custom/${topText}/${bottomText}.png?background=${backgroundImageUrl}`;
    
    console.log('URL Generada (para depuración):', url);

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
            text: `❀ Por favor, responde a un mensaje o ingresa un texto para crear el Sticker.\n\n❀ *Ejemplo:*\n.brat ¿seguro?`,
        }, { quoted: m });
    }

    try {
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
        console.error(error);
        return conn.sendMessage(m.chat, {
            text: `⚠︎ Ocurrió un error. Es posible que la API no haya podido procesar el texto. Intenta con otras palabras.`,
        }, { quoted: m });
    }
}

handler.command = ['brat']
handler.tags = ['sticker']
handler.help = ['brat *<texto>*']

export default handler;