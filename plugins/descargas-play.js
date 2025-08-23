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

    // Búsqueda si no es un enlace
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      const search = await yts(args.join(' '))
      if (!search.videos || search.videos.length === 0) return m.reply('❌ No se encontraron resultados para tu búsqueda.')
      videoInfo = search.videos[0]
      url = videoInfo.url
    } else {
      const idMatch = url.match(ytIdRegex)
      const id = idMatch ? idMatch[1] : null
      if (!id) return m.reply('❌ No se pudo extraer un ID de video válido del enlace.')
      const search = await yts({ videoId: id })
      if (!search || (!search.video && !search.title)) return m.reply('❌ No se pudo obtener la información del video.')
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

    await m.reply(`⏳ Procesando *${videoInfo.title}*... Por favor espera un momento.`)

    // --- Intentar API principal ---
    let download = null
    let data = null
    console.log(`[API Principal] Intentando con: ${apiUrl}`)
    try {
      const res = await fetch(apiUrl, { timeout: 45000 }) // Timeout aumentado
      if (!res.ok) throw new Error(`La API principal respondió con un error: ${res.status} ${res.statusText}`)
      
      const json = await res.json()
      console.log('[API Principal] Respuesta JSON:', JSON.stringify(json, null, 2))

      data = json.data || {}
      download = data.download || data.url || (isAudio ? data.audio : data.video)
    } catch (e) {
      console.error("[API Principal] Error:", e.message)
      // No detenemos el flujo, permitimos que pase a la API de respaldo
    }

    // --- Si falla, usar API de respaldo (fallback) ---
    if (!download) {
      console.log("[Fallback] La API principal falló, intentando con API de respaldo.")
      const fallbackApi = `https://nightapi.is-a.dev/api/ytvideo?url=${encodeURIComponent(url)}`
      console.log(`[Fallback] Intentando con: ${fallbackApi}`)
      try {
        const res2 = await fetch(fallbackApi)
        if (!res2.ok) throw new Error(`La API de respaldo respondió con un error: ${res2.status} ${res2.statusText}`)
        const json2 = await res2.json()
        console.log('[Fallback] Respuesta JSON:', JSON.stringify(json2, null, 2))
        data = json2
        download = json2.url || null
      } catch (e) {
        console.error("[Fallback] Error:", e.message)
      }
    }

    if (!download) {
      return m.reply('❌ Lo siento, ambas APIs fallaron al intentar obtener el enlace de descarga. Intenta con otro video o más tarde.')
    }

    console.log(`[Éxito] Enlace de descarga obtenido: ${download}`)

    const title = data.title || videoInfo.title || 'Sin título'
    const thumbnail = data.thumbnail || videoInfo.thumbnail || ''
    const duration = videoInfo.timestamp || 'Desconocida'
    const tipo = isAudio ? 'Audio' : 'Video'
    const safeTitle = sanitizeFileName(title)

    // --- Enviar mensaje informativo con miniatura ---
    const details = `
📌 Título : *${title}*
📁 Duración : *${duration}*
🎧 Tipo : *${tipo}*
🌐 Fuente : *YouTube*
    `.trim()

    await conn.sendMessage(m.chat, {
        text: details,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: '🎬 Descargando y enviando archivo...',
            thumbnailUrl: thumbnail,
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m })

    // --- Enviar archivo final ---
    if (isAudio) {
      await conn.sendMessage(m.chat, { 
        audio: { url: download }, 
        mimetype: 'audio/mpeg', 
        fileName: `${safeTitle}.mp3` 
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, { 
        video: { url: download }, 
        mimetype: 'video/mp4', 
        fileName: `${safeTitle}.mp4`, 
        caption: `✧ Aquí tienes: ${title}` 
      }, { quoted: m })
    }

  } catch (e) {
    console.error("Error en handler de descarga:", e)
    // ¡IMPORTANTE! Se responde al usuario con el error real para facilitar la depuración.
    m.reply(`❌ Se produjo un error al procesar la solicitud:\n\n*${e.message}*`)
  }
}

handler.help = ['play', 'ytmp3', 'play2', 'ytmp4']
handler.tags = ['downloader']
handler.command = ['play', 'play2', 'ytmp3', 'ytmp4', 'ytv', 'mp4', 'playaudio', 'yta']

export default handler