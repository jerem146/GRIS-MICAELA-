import fetch from 'node-fetch'
import yts from 'yt-search'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) return m.reply(`⚠️ Uso correcto: ${usedPrefix + command} <enlace o nombre>`)

  try {
    await m.react('🕓')

    // Nombre del bot desde config
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

    // Si no es link, hacer búsqueda
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      let search = await yts(args.join(' '))
      if (!search.videos?.length) return m.reply('⚠️ No se encontraron resultados.')
      videoInfo = search.videos[0]
      url = videoInfo.url
    } else {
      let id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
      let search = await yts({ videoId: id })
      if (search?.title) videoInfo = search
    }

    // Limite 63 min
    if (videoInfo?.seconds > 3780) return m.reply('⛔ El video supera el límite de 63 minutos.')

    // Llamada a API
    let apiUrl = `https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`
    let res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Error al conectar con la API.')
    let json = await res.json()

    // Extraer datos flexibles
    let title = json?.data?.title || json?.result?.title || videoInfo?.title || "video"
    let thumbnail = json?.data?.thumbnail || json?.result?.thumbnail || videoInfo?.thumbnail
    let download = json?.data?.download || json?.result?.url || json?.url
    let quality = json?.data?.quality || json?.result?.quality || "Desconocida"

    if (!download) throw new Error("⚠ No se encontró el enlace de descarga en la API.")

    // Contacto
    let fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: "status@broadcast" },
      message: {
        contactMessage: {
          displayName: nombreBot,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Bot;;;\nFN:${nombreBot}\nTEL;type=CELL;type=VOICE;waid=50493732693:+504 93732693\nEND:VCARD`,
          jpegThumbnail: null
        }
      }
    }

    // Duración formateada
    let dur = videoInfo?.seconds || 0
    let h = Math.floor(dur / 3600)
    let m_ = Math.floor((dur % 3600) / 60)
    let s = dur % 60
    let duration = [h, m_, s].map(v => v.toString().padStart(2, '0')).join(':')

    // Preview
    let caption = `> 🎬 *${title}*
> ⏱️ Duración: ${duration}
> 📺 Calidad: ${quality}`

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: fkontak })

    // Video final
    await conn.sendMessage(m.chat, {
      video: { url: download },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
    }, { quoted: fkontak })

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ Ocurrió un error procesando tu solicitud.')
  }
}

handler.help = ['ytmp4 <url|texto>']
handler.tags = ['downloader']
handler.command = ['ytmp4', 'ytv', 'mp4']

export default handler