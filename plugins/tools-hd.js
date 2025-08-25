import axios from 'axios'
import FormData from "form-data"

async function upscaleImage(imageData) {
  try {
    const apiUrl = "https://myapiadonix.vercel.app/api/ends/upscale";
    const formData = new FormData();
    
    // --- LA CORRECCIÓN ESTÁ AQUÍ ---
    // El campo correcto que la API espera es 'file', no 'image'.
    formData.append('file', Buffer.from(imageData), {
        filename: 'upscale.jpg',
        contentType: 'image/jpeg'
    });
    // --- FIN DE LA CORRECCIÓN ---

    const { data } = await axios.post(apiUrl, formData, {
        headers: formData.getHeaders(),
        responseType: 'arraybuffer'
    });

    return data;
  } catch (error) {
    console.error("Error en la API de upscale:", error.message);
    throw new Error('La API no pudo procesar la imagen.');
  }
}

const handler = async (m, { conn }) => {
  try {    
    await m.react('🕓')
    
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";

    if (!mime) {
      return conn.reply(m.chat, `❀ Por favor, envía una imagen o responde a ella con este comando.`, m);
    }
    if (!/image\/(jpe?g|png)/.test(mime)) {
      return m.reply(`✧ El formato del archivo (${mime}) no es compatible. Solo se aceptan imágenes.`);
    }

    conn.reply(m.chat, `❀ Mejorando la calidad de la imagen, por favor espera...`, m);  
    
    let img = await q.download?.();
    let processedImage = await upscaleImage(img);

    const successMessage = '❀ ¡Calidad mejorada con éxito!';
    await conn.sendFile(m.chat, processedImage, 'enhanced.jpg', successMessage, m);
    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('✖️');
    conn.reply(m.chat, `✧ Ocurrió un error. ${e.message}`, m);
  }
};

handler.help = ["hd"];
handler.tags = ["tools"];
handler.command = ["remini", "hd", "enhance"];

export default handler;