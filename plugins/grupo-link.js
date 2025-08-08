var handler = async (m, { conn }) => {
  let group = m.chat
  let code = await conn.groupInviteCode(group)
  let link = 'https://chat.whatsapp.com/' + code

  // Primer mensaje decorado
  await conn.reply(m.chat, '⋆｡°✩ ɪɴᴠɪᴛᴀᴄɪᴏ́ɴ ᴅᴇʟ ɢʀᴜᴘᴏ ✩°｡⋆\n\n⬇️ Aquí tienes el enlace de este grupo:', m)

  // Segundo mensaje: solo el link (para activar el preview del grupo)
  await conn.sendMessage(m.chat, { text: link }, { quoted: m })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler