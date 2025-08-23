import fetch from 'node-fetch'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

const ytIdRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const sanitizeFileName = (name = "") =>
  name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").trim().slice(0, 60);

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) return m.reply(`✅ Uso correcto: ${usedPrefix + command} <enlace o nombre>`)

  try {
    let url = args[0]
    let videoInfo = null

    // Búsqueda si no es link
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      const search = await yts(args.join(' '))
      if (!search.videos || search.videos.length === 0) return m.reply('No se encontraron resultados.')
      videoInfo = search.videos[0]
      url = videoInfo.url
    } else {
      const idMatch = url.match(ytIdRegex)
      const id = idMatch ? idMatch[1] : url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
      const search = await yts({ videoId: id })
      if (!search || (!search.video && !search.title)) return m.reply('No se pudo obtener información del video.')
      videoInfo = search.video ? search.video : search
      url = videoInfo.url || `https://youtu.be/${id}`
    }

    if (videoInfo.seconds > 3780) return m.reply('⛔ El video supera el límite de duración permitido (63 minutos).')

    let apiUrl = ''
    let isAudio = false

    if (['play', 'ytmp3', 'playaudio', 'yta'].includes(command.toLowerCase())) {
      apiUrl = `https://myapiadonix.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`
      isAudio = true
    } else if (['play2', 'ytmp4', 'ytv', 'mp4'].includes(command.toLowerCase())) {
      apiUrl = `https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`
    } else {
      return m.reply('Comando no reconocido.')
    }

    // Intentar API principal
    let download = null
    let data = null
    try {
      const res = await fetch(apiUrl, { timeout: 30000 })
      const json = await res.json()
      data = json.data || {}
      download = data.download || data.url || (isAudio ? data.audio : data.video)
    } catch {}

    // Si falla, usar NightAPI como fallback
    if (!download) {
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

    // Enviar mensaje informativo con miniatura
    const details = `
📌 Título : *${title}*
📁 Duración : *${duration}*
🎧 Tipo : *${tipo}*
🌐 Fuente : *YouTube*
    `.trim()

    // Descargar miniatura como buffer
    let thumbBuffer = null
    try {
      if (thumbnail) {
        const arrayBuffer = await (await fetch(thumbnail)).arrayBuffer()
        thumbBuffer = Buffer.from(arrayBuffer)
      }
    } catch { thumbBuffer = null }

    // Mensaje preview con miniatura
    await conn.sendMessage(
      m.chat,
      {
        text: details,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: '🎬 Video de YouTube',
            thumbnailUrl: thumbnail,
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

    // Enviar archivo real con miniatura si existe
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
    console.error("Error en handler de descarga:", e)
    m.reply('❌ Se produjo un error al procesar la solicitud.')
  }
}

handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['downloader']
handler.command = ['play', 'play2', 'ytmp3', 'ytmp4', 'ytv', 'mp4', 'playaudio', 'yta']

export default handler