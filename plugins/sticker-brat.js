import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const formatTextForApi = (text) => {
    if (!text) return '_';
    return text
        .replace(/-/g, '__')
        .replace(/_/g, '--')
        .replace(/\s/g, '_')
        .replace(/\?/g, '~q')
        .replace(/%/g, '~p')
        .replace(/\//g, '~s')
        .replace(/#/g, '~h')
        .replace(/"/g, "''");
};

const fetchBrat = async (text) => {
    const backgroundImageUrl = 'https://i.postimg.cc/RFrz9m8N/green-square.png';
    const topText = formatTextForApi(text);
    const bottomText = '_';

    const url = `https://api.memegen.link/images/custom/${topText}/${bottomText}.png?background=${backgroundImageUrl}`;
    
    console.log('URL Generada (para depuración):', url);

    // --- LA CORRECCIÓN ESTÁ AQUÍ ---
    // Añadimos cabeceras (headers) para simular ser un navegador y evitar el error 415.
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 20000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Accept': 'image/png,image/webp,image/apng,*/*;q=0.8',
        }
    });
    // --- FIN DE LA CORRECCIÓN ---

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
        const stiker = await sticker(buffer, false, global.packsticker, global.packsticker2);

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        } else {
            throw new Error("✧ No se pudo generar el sticker.");
        }
    } catch (error) {
        console.error(error);
        return conn.sendMessage(m.chat, {
            text: `⚠︎ Ocurrió un error al contactar la API. Por favor, intenta de nuevo.`,
        }, { quoted: m });
    }
}

handler.command = ['brat']
handler.tags = ['sticker']
handler.help = ['brat *<texto>*']

export default handler;