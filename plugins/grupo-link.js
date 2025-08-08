var handler = async (m, { conn }) => {
  if (!m.isGroup) throw 'Este comando solo se puede usar en grupos.'
  if (!conn.groupInviteCode) throw 'El bot necesita ser administrador del grupo.'

  const code = await conn.groupInviteCode(m.chat)
  const metadata = await conn.groupMetadata(m.chat)
  const url = 'https://chat.whatsapp.com/' + code

  await conn.sendMessage(m.chat, {
    text: url,
    inviteLinkGroupTypeV2: {
      inviteCode: code,
      inviteLink: url,
      groupName: metadata.subject,
      groupJid: m.chat
    }
  }, { quoted: m })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler