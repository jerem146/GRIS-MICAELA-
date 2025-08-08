var handler = async (m, { conn }) => {
  if (!m.isGroup) return

  let id = m.chat
  let pp = await conn.profilePictureUrl(id, 'image').catch(_ => null)
  let groupMetadata = await conn.groupMetadata(id)
  let groupName = groupMetadata.subject
  let groupDesc = groupMetadata.desc?.toString() || ''
  let code = await conn.groupInviteCode(id)

  await conn.sendMessage(m.chat, {
    groupInviteMessage: {
      groupJid: id,
      inviteCode: code,
      groupName: groupName,
      caption: `✨ Aquí tienes el enlace del grupo ✨\n\n「 ${groupName} 」\n\n${groupDesc}`,
      jpegThumbnail: pp ? await (await fetch(pp)).buffer() : null
    }
  }, { quoted: m })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler