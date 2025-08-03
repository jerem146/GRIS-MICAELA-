// creado por Ado. Adaptado y reforzado.

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
    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const configPath = path.join('./JadiBots', botActual, 'config.json')

    let nombreBot = global.namebot || '⎯⎯⎯⎯⎯⎯ Bot Principal ⎯⎯⎯⎯⎯⎯'
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        if (config.name) nombreBot = config.name
      } catch {}
    }

    let url = args[0]
    let videoInfo = null

    // Determinar si es link de YouTube o búsqueda por texto
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      const search = await yts(args.join(' '))
      if (!search.videos || search.videos.length === 0) return m.reply('No se encontraron resultados.')
      videoInfo = search.videos[0]
      url = videoInfo.url
    } else {
      // Extraer ID robustamente
      const idMatch = url.match(ytIdRegex)
      const id = idMatch ? idMatch[1] : (url.split('v=')[1]?.split('&')[0] || url.split('/').pop())
      const search = await yts({ videoId: id })
      if (!search || (!search.video && !search.title)) return m.reply('No se pudo obtener información del video.')
      videoInfo = search.video ? search.video : search
      url = videoInfo.url || `https://youtu.be/${id}`
    }

    // Límite de duración: 63 minutos = 3780 segundos
    if (videoInfo.seconds > 3780) {
      return m.reply(`⛔ El video supera el límite de duración permitido (63 minutos).`)
    }

    // Determinar API y tipo
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

    // Llamada a la API de conversión
    const res = await fetch(apiUrl, { timeout: 30000 })
    if (!res.ok) throw new Error(`Error en la API (${res.status})`)
    const json = await res.json()

    // Dependiendo de la estructura, ajustar
    // Se asume algo como: { success: true, data: { title, thumbnail, quality, download: "url" } }
    if (!json || (json.success === false && !json.data)) {
      throw new Error('No se pudo obtener información válida del video.')
    }

    // Normalizar extracción
    const data = json.data || {}
    const title = data.title || data.video?.title || 'Sin título'
    const thumbnail = data.thumbnail || data.thumb || ''
    const quality = data.quality || data.video?.quality || (isAudio ? 'Audio' : 'Video')
    let download = data.download || data.url || (isAudio ? data.audio : data.video) || null

    if (!download) {
      // algunos endpoints devuelven structure distinta
      // intenta buscar en result.download.url como fallback
      download = data.result?.download?.url || data.result?.url || null
    }

    if (!download) throw new Error('No se recibió URL de descarga.')

    const duration = videoInfo?.timestamp || 'Desconocida'
    const tipo = isAudio ? 'Audio' : 'Video'

    // Mensaje informativo con tarjeta
    const details = `
📌 Título : *${title}*
📁 Duración : *${duration}*
📥 Calidad : *${quality}*
🎧 Tipo : *${tipo}*
🌐 Fuente : *YouTube*
    `.trim()

    await conn.sendMessage(
      m.chat,
      {
        text: details,
        contextInfo: {
          externalAdReply: {
            title: nombreBot,
            body: 'Procesando...',
            thumbnailUrl: thumbnail,
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: m }
    )

    // Enviar el archivo
    const safeTitle = sanitizeFileName(title)
    if (isAudio) {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: download },
          mimetype: 'audio/mpeg',
          fileName: `${safeTitle}.mp3`,
          ptt: false
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: download },
          mimetype: 'video/mp4',
          fileName: `${safeTitle}.mp4`,
          caption: `✧ Aquí tienes: ${title}`
        },
        { quoted: m }
      )
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
      

  
  