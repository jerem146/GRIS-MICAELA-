import fetch from 'node-fetch'
import FormData from 'form-data'

async function uploadImage(buffer) {
  const form = new FormData()
  form.append('fileToUpload', buffer, 'image.jpg')
  form.append('reqtype', 'fileupload')

  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Error al subir la imagen a Catbox')
  return await res.text()
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await m.react('🕓')

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''

    if (!/image\/(jpe?g|png|webp)/.test(mime)) {
      return conn.sendMessage(m.chat, {
        text: `❀ Por favor, envía o responde a una imagen en formato JPG, PNG o WEBP usando *${usedPrefix + command}*`,
        ...global.rcanal
      }, { quoted: m })
    }

    await conn.sendMessage(m.chat, {
      text: `✧ Mejorando tu imagen, espera...`,
      ...global.rcanal
    }, { quoted: m })

    let img = await q.download?.()
    if (!img) throw new Error('No se pudo descargar la imagen.')

    let uploadedUrl = await uploadImage(img)
    if (!uploadedUrl.startsWith('http')) throw new Error('No se pudo obtener una URL válida de Catbox.')

    // Usar la nueva API
    const apiUrl = `https://myapiadonix.vercel.app/api/ends/upscale?imageUrl=${encodeURIComponent(uploadedUrl)}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`La API de mejora devolvió un error: ${res.statusText}`)
    
    const data = await res.json()
    if (data.status !== 'success' || !data.result_url) {
      throw new Error('La API no pudo procesar la imagen o no devolvió un resultado.')
    }

    // --- **VERIFICACIÓN AÑADIDA** ---
    // Descargar la imagen mejorada y verificar que sea una imagen real
    const improvedRes = await fetch(data.result_url)
    if (!improvedRes.ok) {
      throw new Error('No se pudo descargar la imagen mejorada desde la URL de resultado.')
    }
    
    // Verificar el tipo de contenido para asegurarse de que es una imagen
    const contentType = improvedRes.headers.get('content-type')
    if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('El resultado devuelto por la API no es una imagen válida.')
    }

    const buffer = await improvedRes.buffer()
    if (!buffer || buffer.length === 0) {
        throw new Error('El archivo de la imagen mejorada está vacío.')
    }
    
    // --- **ORDEN CORREGIDO** ---
    // 1. Enviar la imagen mejorada
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: '✅ *Imagen mejorada con éxito*',
      ...global.rcanal
    }, { quoted: m })

    // 2. Solo si lo anterior tuvo éxito, reaccionar con el check
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('✖️')
    await conn.sendMessage(m.chat, {
      // Usar el mensaje de error real para un mejor diagnóstico
      text: `❌ Error al mejorar la imagen:\n*${e.message}*`,
      ...global.rcanal
    }, { quoted: m })
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['remini', 'hd', 'enhance']

export default handler