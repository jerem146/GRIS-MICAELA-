import axios from 'axios'
import { sticker } from '../lib/sticker.js'

/**
 * CONFIGURA AQUÍ TUS ENDPOINTS "MAKER" GRATUITOS (similares a velyn)
 * - Puedes poner los tuyos (Render/Workers) o públicos que tengas.
 * - Deben aceptar: ?text=...   ó   ?video_url=...
 * - El primero que responda bien, gana. Si todos fallan, usa Tenor/GIPHY.
 */
const MAKER_ENDPOINTS = [
  // Ejemplos de formato (reemplaza por los tuyos reales):
  'https://api.nekorinn.my.id/maker/brat-v2',         // si existe para ti
  'https://bratvid-tuapp.onrender.com/maker/brat-v2', // tu Render (gratis)
  'https://tuusuario.workers.dev/maker/bratgif',      // tu Cloudflare Worker (gratis)
].filter(Boolean);

// (Opcional) Fallbacks de búsqueda si los "maker" fallan
// Define estas keys en tu entorno global:
const TENOR_KEY = global.tenorKey || ''; // https://tenor.googleapis.com/
const GIPHY_KEY = global.giphyKey || ''; // https://developers.giphy.com/

const AXIOS_OPTS = {
  responseType: 'arraybuffer',
  timeout: 15000,
  headers: {
    'User-Agent': 'CarlyBot/1.0 (+baileys)',
  },
};

const isUrl = (s = '') => /^https?:\/\/\S+/i.test(s);

/**
 * Intenta llamar a endpoints "maker" en orden. Soporta ?text= o ?video_url=
 */
const fetchFromMaker = async (query) => {
  if (!MAKER_ENDPOINTS.length) throw new Error('No hay endpoints maker configurados.');

  let lastErr;
  for (const base of MAKER_ENDPOINTS) {
    try {
      const params = isUrl(query) ? { video_url: query } : { text: query };
      const { data, headers, status } = await axios.get(base, { ...AXIOS_OPTS, params });
      if (status >= 200 && status < 300 && data && data.byteLength > 0) {
        // Acepta image/webp, image/gif, video/mp4 (si tu maker devuelve mp4)
        const ctype = (headers['content-type'] || '').toLowerCase();
        if (/(image\/webp|image\/gif|video\/mp4|application\/octet-stream)/.test(ctype) || data.byteLength > 0) {
          return data;
        }
      }
      lastErr = new Error(`Maker no válido: ${base} (status ${status})`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('Todos los maker fallaron.');
};

/**
 * Fallback: Tenor (GIF/Stickers). Requiere TENOR_KEY.
 * Busca por texto "brat <query>" y baja el GIF.
 */
const fetchFromTenor = async (query) => {
  if (!TENOR_KEY) throw new Error('TENOR_KEY no configurada.');
  const q = isUrl(query) ? 'brat' : `brat ${query}`.trim();
  const url = 'https://tenor.googleapis.com/v2/search';
  const { data } = await axios.get(url, {
    responseType: 'json',
    timeout: 12000,
    params: { q, key: TENOR_KEY, limit: 1, media_filter: 'gif,tinygif' },
  });
  const results = data?.results || [];
  if (!results.length) throw new Error('Tenor sin resultados.');
  const media = results[0]?.media_formats;
  const gifUrl = media?.gif?.url || media?.tinygif?.url;
  if (!gifUrl) throw new Error('Tenor sin GIF utilizable.');
  const gifBuf = (await axios.get(gifUrl, AXIOS_OPTS)).data;
  return gifBuf;
};

/**
 * Fallback: GIPHY (stickers/gif). Requiere GIPHY_KEY.
 */
const fetchFromGiphy = async (query) => {
  if (!GIPHY_KEY) throw new Error('GIPHY_KEY no configurada.');
  const q = isUrl(query) ? 'brat' : `brat ${query}`.trim();
  const url = 'https://api.giphy.com/v1/stickers/search'; // también existe /gifs/search
  const { data } = await axios.get(url, {
    responseType: 'json',
    timeout: 12000,
    params: { api_key: GIPHY_KEY, q, limit: 1, rating: 'pg-13' },
  });
  const arr = data?.data || [];
  if (!arr.length) throw new Error('GIPHY sin resultados.');
  const images = arr[0]?.images || {};
  const gifUrl = images?.downsized?.url || images?.original?.url || images?.fixed_height?.url;
  if (!gifUrl) throw new Error('GIPHY sin GIF utilizable.');
  const gifBuf = (await axios.get(gifUrl, AXIOS_OPTS)).data;
  return gifBuf;
};

/**
 * Orquestador: Maker -> Tenor -> GIPHY
 * Devuelve buffer animado (webp/gif/mp4), luego lo pasamos a sticker()
 */
const fetchStickerAnimated = async (query) => {
  // 1) Maker (gratis si usas tu propio Render/Worker o algún público)
  try { return await fetchFromMaker(query); } catch (_) {}

  // 2) Tenor (gratis con key)
  try { return await fetchFromTenor(query); } catch (_) {}

  // 3) GIPHY (gratis con key)
  try { return await fetchFromGiphy(query); } catch (e) {
    throw e;
  }
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Si el usuario respondió a un texto, úsalo; si pegó una URL, también sirve
  if (m.quoted && typeof m.quoted.text === 'string' && m.quoted.text.trim()) {
    text = m.quoted.text.trim();
  }

  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `❀ Por favor, responde a un mensaje **con texto** o envía \`${usedPrefix + command} <texto|url_video>\`.\n` +
            `• Texto: se generará un "brat" animado con el texto.\n` +
            `• URL: se intentará crear el sticker a partir del video (si tu endpoint lo soporta).`
    }, { quoted: m });
  }

  const userId = m.sender;
  const packstickers = (global.db?.data?.users?.[userId]) || {};
  const texto1 = packstickers.text1 || global.packsticker;   // packname
  const texto2 = packstickers.text2 || global.packsticker2;  // author

  try {
    const animBuffer = await fetchStickerAnimated(text);
    // Tu helper sticker() convierte a webp y setea metadatos
    const stickerBuffer = await sticker(animBuffer, null, texto1, texto2);

    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `⚠︎ Ocurrió un error al generar el sticker.\n` +
            `• Detalle: ${e?.message || e}\n` +
            `• Sugerencia: configura al menos **1 endpoint** en MAKER_ENDPOINTS o agrega **TENOR/GIPHY keys**.`
    }, { quoted: m });
  }
};

handler.help = ['bratvid <texto|url_video>']
handler.tags = ['sticker']
handler.command = ['bratvid', 'bratv']

export default handler