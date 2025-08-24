import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

// Expresión regular para extraer el ID de un video de YouTube
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // Verifica si se proporcionó un texto de búsqueda
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m)
    }

    // Busca el ID del video en el texto o realiza una búsqueda en YouTube
    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytSearchResult = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    let videoInfo
    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      videoInfo = ytSearchResult.all.find(item => item.videoId === videoId) || ytSearchResult.videos.find(item => item.videoId === videoId)
    } else {
      videoInfo = ytSearchResult.videos?.[0]
    }
    
    // Si no se encuentran resultados, informa al usuario
    if (!videoInfo) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }

    // Extrae la información del video
    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo

    // Formatea los datos para mostrarlos
    const vistas = formatViews(views)
    const canal = author ? author.name : 'Desconocido'
    
    // Construye el mensaje de información del video
    const infoMessage = `「✦」Descargando *<${title || 'Desconocido'}>*\n\n> ✧ Canal » *${canal}*\n> ✰ Vistas » *${vistas || 'Desconocido'}*\n> ⴵ Duración » *${timestamp || 'Desconocido'}*\n> ✐ Publicado » *${ago || 'Desconocido'}*\n> 🜸 Link » ${url}`
    
    const thumb = (await conn.getFile(thumbnail))?.data
    const messageConfig = {
      contextInfo: {
        externalAdReply: {
          title: 'Bot de WhatsApp', // Puedes personalizar el 'botname' aquí
          body: 'Desarrollador', // Puedes personalizar el 'dev' aquí
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }
    
    // Envía el mensaje de información
    await conn.reply(m.chat, infoMessage, m, messageConfig)
    
    // Lógica para descargar audio (comandos 'play', 'yta', 'ytmp3', etc.)
    if (['play', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      try {
        // --- INTEGRACIÓN DE LA API ---
        const apiResponse = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)
        const apiJson = await apiResponse.json()
        
        const downloadUrl = apiJson.result.download.url
        
        if (!downloadUrl) throw new Error('El enlace de audio no se generó correctamente.')
        
        // Envía el archivo de audio
        await conn.sendMessage(m.chat, { 
          audio: { url: downloadUrl }, 
          fileName: `${apiJson.result.title}.mp3`, 
          mimetype: 'audio/mpeg' 
        }, { quoted: m })

      } catch (e) {
        console.error(e);
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Esto puede deberse a que el archivo es demasiado pesado o a un error en la API. Por favor, intenta nuevamente más tarde.', m)
      }
    
    // Lógica para descargar video (comandos 'play2', 'ytv', 'ytmp4', etc.)
    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      try {
        const response = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`) // Considera cambiar esta API key si no es tuya
        const json = await response.json()
        await conn.sendFile(m.chat, json.data.url, `${json.title}.mp4`, title, m)
      } catch (e) {
        console.error(e);
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Esto puede deberse a que el archivo es demasiado pesado o a un error en la API. Por favor, intenta nuevamente más tarde.', m)
      }
    }

  } catch (error) {
    console.error(error);
    return m.reply(`⚠︎ Ocurrió un error inesperado: ${error.message}`)
  }
}

handler.command = handler.help = ['play', 'yta', 'ytmp3', 'play2', 'ytv', 'ytmp4', 'playaudio', 'mp4']
handler.tags = ['descargas']
handler.group = true

export default handler

// Función para formatear el número de vistas
function formatViews(views) {
  if (views === undefined) {
    return "No disponible"
  }

  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1)}B`
  } else if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M`
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}k`
  }
  return views.toLocaleString()
}