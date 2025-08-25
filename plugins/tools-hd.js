import axios from 'axios'
import FormData from "form-data"

// --- NUEVA FUNCIÓN PARA USAR LA API DE ADONIX ---
// Reemplaza la antigua función 'remini'
async function upscaleImage(imageData) {
  try {
    const apiUrl = "https://myapiadonix.vercel.app/api/ends/upscale";
    const formData = new FormData();
    
    // La nueva API espera el archivo en un campo llamado 'image'
    formData.append('image', Buffer.from(imageData), {
        filename: 'upscale.jpg',
        contentType: 'image/jpeg'
    });

    const { data } = await axios.post(apiUrl, formData, {
        headers: formData.getHeaders(), // Esto es importante para enviar el formato correcto
        responseType: 'arraybuffer'     // Le pedimos a axios que nos devuelva la imagen directamente
    });

    return data;
  } catch (error) {
    console.error("Error en la API de upscale:", error.message);
    // Lanza un error personalizado para que el handler lo pueda atrapar
    throw new Error('La API no pudo procesar la imagen.');
  }
}


// --- TU HANDLER, AHORA USANDO LA NUEVA FUNCIÓN ---
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
    
    // Aquí llamamos a nuestra nueva función en lugar de a 'remini'
    let processedImage = await upscaleImage(img);

    // Se envía la imagen procesada de vuelta al usuario
    const successMessage = '❀ ¡Calidad mejorada con éxito!';
    await conn.sendFile(m.chat, processedImage, 'enhanced.jpg', successMessage, m);
    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('✖️');
    // Enviamos un mensaje de error más específico al usuario
    conn.reply(m.chat, `✧ Ocurrió un error. ${e.message}`, m);
  }
};

handler.help = ["hd"];
handler.tags = ["tools"];
handler.command = ["remini", "hd", "enhance"];

export default handler;