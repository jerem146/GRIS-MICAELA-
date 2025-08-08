var handler = async (m, { conn }) => {
  if (!m.isGroup) throw 'Este comando solo funciona en grupos.'
  if (!conn.groupInviteCode) throw 'El bot necesita ser admin para generar el link.'

  const code = await conn.groupInviteCode(m.chat)
  const metadata = await conn.groupMetadata(m.chat)
  const url = 'https://chat.whatsapp.com/' + code

  await conn.sendMessage(m.chat, {
    groupInviteMessage: {
      groupJid: m.chat,
      inviteCode: code,
      groupName: metadata.subject,
      caption: url,
      jpegThumbnail: await conn.profilePictureUrl(m.chat, 'image').catch(() => null)
    }
  }, { quoted: m })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler