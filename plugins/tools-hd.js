import fetch from 'node-fetch'
import FormData from 'form-data'

async function uploadImage(buffer) {
  const form = new FormData()
  form.append('fileToUpload', buffer, 'image.jpg')
  form.append('reqtype', 'fileupload')

  const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Error al subir la imagen')
  return await res.text()
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await m.react('🕓')

    // Obtener el mensaje objetivo (citada) o el mismo
    const quoted = m.quoted && m.quoted.message ? m.quoted : null
    const target = quoted ? quoted : m

    // Intenta inferir el mime de varias formas
    let mime = ''
    if (target.message) {
      // estructura típica de Baileys
      const msg = target.message
      mime = msg.imageMessage?.mimetype ||
             msg.videoMessage?.mimetype ||
             msg.documentMessage?.mimetype ||
             msg.stickerMessage?.mimetype ||
             msg?.mimetype || ''
    } else {
      mime = (target.msg || target).mimetype || target.mediaType || ''
    }

    // Depuración ligera si no detecta mime (puedes quitar en producción)
    if (!mime) {
      console.log('[hd] no se detectó mime en target, contenido bruto:', {
        hasQuoted: !!quoted,
        raw: Object.keys(target).slice(0, 10)
      })
    }

    if (!mime) {
      return await conn.sendMessage(
        m.chat,
        {
          text: `❀ Por favor, responde a una imagen válida con *${usedPrefix + command}* para mejorarla.` ,
          ...global.rcanal
        },
        { quoted: m }
      )
    }

    if (!/image\/(jpe?g|png|webp)/i.test(mime)) {
      return await conn.sendMessage(
        m.chat,
        {
          text: `✧ El formato (${mime}) no es compatible, usa JPG, PNG o WEBP.`,
          ...global.rcanal
        },
        { quoted: m }
      )
    }

    await conn.sendMessage(
      m.chat,
      {
        text: `✧ Mejorando tu imagen, espera...`,
        ...global.rcanal
      },
      { quoted: m }
    )

    // Descargar la imagen. Tu wrapper usa .download()
    let img
    if (quoted && typeof quoted.download === 'function') {
      img = await quoted.download()
    } else if (typeof m.download === 'function') {
      img = await m.download()
    } else {
      // intentar sacar el stream manual si tienes downloadContentFromMessage disponible
      throw new Error('No se encontró método de descarga en el mensaje.');
    }

    if (!img || !(img instanceof Buffer)) {
      throw new Error('No pude descargar la imagen correctamente.')
    }

    let uploadedUrl = await uploadImage(img)

    const apiUrl = `https://fastapi.alifproject.cloud/api/ai/upscalev2?url=${encodeURIComponent(uploadedUrl)}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error(`Error en la API: ${res.status} ${res.statusText}`)
    const data = await res.json()

    if (data.status !== 'success' || !data.data?.result_url) throw new Error('No se pudo mejorar la imagen.')

    const improvedRes = await fetch(data.data.result_url)
    if (!improvedRes.ok) throw new Error('Falló la descarga de la imagen mejorada.')
    const buffer = await improvedRes.buffer()

    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: '✅ *Imagen mejorada con éxito*',
        ...global.rcanal
      },
      { quoted: m }
    )

    await m.react('✅')
  } catch (e) {
    console.error('[hd] error:', e)
    try {
      await m.react('✖️')
    } catch {}
    await conn.sendMessage(
      m.chat,
      {
        text: '❌ *Error al mejorar la imagen, inténtalo más tarde.*',
        ...global.rcanal
      },
      { quoted: m }
    )
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['remini', 'hd', 'enhance']

export default handler