import fetch from 'node-fetch'

var handler = async (m, { conn }) => {
  if (!m.isGroup) return conn.reply(m.chat, 'Este comando solo se puede usar en grupos.', m)
  if (!conn.groupInviteCode) return conn.reply(m.chat, 'El bot debe ser administrador.', m)

  const groupMetadata = await conn.groupMetadata(m.chat)
  const groupName = groupMetadata.subject
  const inviteCode = await conn.groupInviteCode(m.chat)
  const profilePicture = await conn.profilePictureUrl(m.chat, 'image').catch(() => null)

  let thumbnailBuffer = null
  if (profilePicture) {
    try {
      const res = await fetch(profilePicture)
      thumbnailBuffer = await res.buffer()
    } catch (e) {
      console.log('❌ No se pudo descargar la imagen del grupo.')
    }
  }

  const fakeForwardMessage = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast'
    },
    message: {
      groupInviteMessage: {
        groupJid: m.chat,
        inviteCode: inviteCode,
        groupName: groupName,
        caption: `¡Únete a *${groupName}*!`,
        jpegThumbnail: thumbnailBuffer
      }
    }
  }

  await conn.relayMessage(m.chat, fakeForwardMessage.message, { messageId: m.key.id })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler