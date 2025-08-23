handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.mutedUsers) return

  let senderId = m.key.participant || m.sender
  let mutedUser = chat.mutedUsers[senderId]

  if (mutedUser) {
    // 🟢 Borrar mensaje si el bot es admin
    try {
      let groupMetadata = await conn.groupMetadata(m.chat)
      let botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
      let botData = groupMetadata.participants.find(p => p.id === botNumber)

      if (botData?.admin) {
        await conn.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: m.key.fromMe,
            id: m.key.id,
            participant: m.key.participant || m.sender
          }
        })
      }
    } catch (e) {
      console.error('Error al borrar mensaje:', e)
    }

    // 🟠 Advertencias
    mutedUser.warnings = (mutedUser.warnings || 0) + 1

    if (mutedUser.warnings >= 3) {
      // 🚨 Expulsar tras 3 advertencias
      await conn.sendMessage(m.chat, {
        text: `🚫 El usuario @${senderId.split('@')[0]} fue eliminado por insistir en hablar estando muteado.`,
        mentions: [senderId]
      })
      await conn.groupParticipantsUpdate(m.chat, [senderId], 'remove')
      delete chat.mutedUsers[senderId]
    } else {
      await conn.sendMessage(m.chat, {
        text: `⚠️ @${senderId.split('@')[0]} estás muteado. Si sigues enviando mensajes serás eliminado (${mutedUser.warnings}/3).`,
        mentions: [senderId]
      })
    }
    return true
  }
}