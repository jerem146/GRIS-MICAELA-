import fetch from 'node-fetch'

var handler = async (m, { conn }) => {
  if (!m.isGroup) return conn.reply(m.chat, '❗ Este comando solo funciona en grupos.', m)
  if (!conn.groupInviteCode) return conn.reply(m.chat, '❗ El bot debe ser administrador para obtener el enlace.', m)

  const metadata = await conn.groupMetadata(m.chat)
  const groupName = metadata.subject
  const inviteCode = await conn.groupInviteCode(m.chat)
  const profileUrl = await conn.profilePictureUrl(m.chat, 'image').catch(() => null)

  let thumbnail = null
  if (profileUrl) {
    try {
      const res = await fetch(profileUrl)
      thumbnail = await res.buffer()
    } catch (e) {
      console.log('❌ No se pudo obtener la imagen del grupo.')
    }
  }

  const fakeMsg = {
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
        caption: '',
        jpegThumbnail: thumbnail
      }
    }
  }

  await conn.relayMessage(m.chat, fakeMsg.message, { messageId: m.key.id })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler