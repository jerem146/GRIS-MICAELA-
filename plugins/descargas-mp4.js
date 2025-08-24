import fetch from "node-fetch"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `✦ Uso correcto:\n${usedPrefix + command} <enlace de YouTube>\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/dQw4w9WgXcQ`, m)
    }

    // Llamamos a la API
    const api = await (await fetch(`https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(text)}`)).json()

    // Extraemos datos
    const result = api?.result?.url || api?.url || null
    const titulo = api?.result?.title || api?.title || "video"

    if (!result) {
      return conn.reply(m.chat, "⚠︎ No se pudo obtener el video. Intenta con otro enlace.", m)
    }

    // Mandamos el archivo de video
    await conn.sendMessage(m.chat, { 
      video: { url: result }, 
      fileName: `${titulo}.mp4`, 
      caption: `「✦」Descargando: *${titulo}*`, 
      mimetype: 'video/mp4' 
    }, { quoted: m })

  } catch (e) {
    return conn.reply(m.chat, `⚠︎ Error al procesar el comando: ${e.message}`, m)
  }
}

handler.command = ['ytmp4', 'ytv', 'mp4']
handler.help = ['ytmp4 <url>']
handler.tags = ['descargas']
handler.group = true

export default handler