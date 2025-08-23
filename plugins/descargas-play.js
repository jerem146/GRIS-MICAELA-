import fetch from 'node-fetch'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

// Expresión regular para extraer el ID de un video de YouTube desde varias URL.
const ytIdRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

// Función para limpiar y sanitizar nombres de archivo, eliminando caracteres no permitidos.
const sanitizeFileName = (name = "") =>
  name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").trim().slice(0, 60);

let handler = async (m, { conn, args, command, usedPrefix }) => {
  // Si no se proporcionan argumentos (enlace o nombre), se envía un mensaje de uso.
  if (!args[0]) return m.reply(`✅ Uso correcto: ${usedPrefix + command} <enlace o nombre>`)

  try {
    let url = args[0]
    let videoInfo = null

    // Si el argumento no es un enlace de YouTube, se realiza una búsqueda.
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      const search = await yts(args.join(' '))
      if (!search.videos || search.videos.length === 0) return m.reply('No se encontraron resultados.')
      videoInfo = search.videos[0]
      url = videoInfo.url
    } else {
      // Si es un enlace, se extrae el ID y se busca la información del video.
      const idMatch = url.match(ytIdRegex)
      const id = idMatch ? idMatch[1] : null
      const search = await yts({ videoId: id })
      if (!search || (!search.video && !search.title)) return m.reply('No se pudo obtener información del video.')
      videoInfo = search.video ? search.video : search
      url = videoInfo.url || `https://youtu.be/${id}`
    }

    // Se establece un límite de duración para los videos (63 minutos).
    if (videoInfo.seconds > 3780) return m.reply('⛔ El video supera el límite de duración permitido (63 minutos).')

    let apiUrl = ''
    let isAudio = false

    // Se determina la URL de la API a usar según el comando (audio o video).
    if (['play', 'ytmp3', 'playaudio', 'yta'].includes(command.toLowerCase())) {
      apiUrl = `https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`
      isAudio = true
    } else if (['play2', 'ytmp4', 'ytv', 'mp4'].includes(command.toLowerCase())) {
      // Aquí se utiliza la API para MP4 que solicitaste.
      apiUrl = `https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`
    } else {
      return m.reply('Comando no reconocido.')
    }

    // Se intenta obtener el enlace de descarga desde la API principal.
    let download = null
    let data = null
    try {
      const res = await fetch(apiUrl, { timeout: 30000 })
      const json = await res.json()
      data = json.data || {}
      download = data.download || data.url || (isAudio ? data.audio : data.video)
    } catch (e) {
      console.error("Error con la API principal:", e)
    }

    // Si la API principal falla, se intenta con una API de respaldo (fallback).
    if (!download) {
      console.log("API principal falló, intentando con fallback...")
      const fallbackApi = `https://nightapi.is-a.dev/api/ytvideo?url=${encodeURIComponent(url)}`
      const res2 = await fetch(fallbackApi)
      const json2 = await res2.json()
      data = json2
      download = json2.url || null
      if (!download) throw new Error('No se pudo obtener URL de descarga de ninguna API.')
    }

    const title = data.title || videoInfo.title || 'Sin título'
    const thumbnail = data.thumbnail || videoInfo.thumbnail || ''
    const duration = videoInfo.timestamp || 'Desconocida'
    const tipo = isAudio ? 'Audio' : 'Video'
    const safeTitle = sanitizeFileName(title)

    // Se prepara y envía un mensaje informativo con la miniatura del video.
    const details = `
📌 Título : *${title}*
📁 Duración : *${duration}*
🎧 Tipo : *${tipo}*
🌐 Fuente : *YouTube*
    `.trim()

    let thumbBuffer = null
    try {
      if (thumbnail) {
        const arrayBuffer = await (await fetch(thumbnail)).arrayBuffer()
        thumbBuffer = Buffer.from(arrayBuffer)
      }
    } catch { thumbBuffer = null }

    // Mensaje de vista previa con miniatura y detalles.
    await conn.sendMessage(
      m.chat,
      {
        text: details,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: '🎬 Descargando...',
            thumbnailUrl: thumbnail,
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

    // Se envía el archivo (audio o video) al chat.
    if (isAudio) {
      await conn.sendMessage(
        m.chat,
        { audio: { url: download }, mimetype: 'audio/mpeg', fileName: `${safeTitle}.mp3`, ptt: false },
        { quoted: m }
      )
    } else {
      const msg = {
        video: { url: download },
        mimetype: 'video/mp4',
        fileName: `${safeTitle}.mp4`,
        caption: `✧ Aquí tienes: ${title}`
      }
      if (thumbBuffer) msg.jpegThumbnail = thumbBuffer
      await conn.sendMessage(m.chat, msg, { quoted: m })
    }

  } catch (e) {
    console.error("Error en el handler de descarga:", e)
    m.reply('❌ Se produjo un error al procesar la solicitud. Por favor, intenta de nuevo.')
  }
}

// Se definen los comandos que activarán este handler.
handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['downloader']
handler.command = ['play', 'play2', 'ytmp3', 'ytmp4', 'ytv', 'mp4', 'playaudio', 'yta']

export default handler