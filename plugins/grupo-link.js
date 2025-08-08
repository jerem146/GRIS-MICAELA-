var handler = async (m, { conn }) => {
  if (!m.isGroup) throw 'Este comando solo se puede usar en grupos.'
  if (!conn.groupInviteCode) throw 'El bot necesita ser administrador.'

  const code = await conn.groupInviteCode(m.chat)
  const metadata = await conn.groupMetadata(m.chat)

  await conn.sendMessage(m.chat, {
    forward: {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
      },
      message: {
        groupInviteMessage: {
          groupJid: m.chat,
          inviteCode: code,
          groupName: metadata.subject,
          caption: `https://chat.whatsapp.com/${code}`,
          jpegThumbnail: null
        }
      }
    }
  })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler