// plugins/mute.js
const handler = async (m, { conn, command, args, isAdmin }) => {
  if (!m.isGroup) return m.reply('🔒 Este comando solo funciona en grupos.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  if (!chat.mutedUsers) chat.mutedUsers = {}

  const mentioned = m.mentionedJid ? m.mentionedJid[0] : args[0]
  if (!mentioned) return m.reply('✳️ Debes mencionar al usuario a mutear/desmutear.')

  if (!isAdmin) return m.reply('❌ Solo los admins pueden usar este comando.')

  if (command === 'mute') {
    chat.mutedUsers[mentioned] = { warnings: 0 }
    return m.reply(`✅ El usuario @${mentioned.split('@')[0]} ha sido muteado.`, { mentions: [mentioned] })
  }

  if (command === 'unmute') {
    delete chat.mutedUsers[mentioned]
    return m.reply(`✅ El usuario @${mentioned.split('@')[0]} ha sido desmuteado.`, { mentions: [mentioned] })
  }
}

handler.command = ['mute', 'unmute']
handler.group = true
handler.admin = true
handler.tags = ['group']
handler.help = ['mute @usuario', 'unmute @usuario']

// 🔹 Middleware para borrar mensajes de muteados
handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  const chat = global.db.data.chats[m.chat]
  if (!chat || !chat.mutedUsers) return

  const senderId = m.key.participant || m.sender
  const mutedUser = chat.mutedUsers[senderId]

  if (mutedUser) {
    // Intentar borrar mensaje si el bot es admin
    try {
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          id: m.key.id,
          participant: m.key.participant || m.sender
        }
      })
    } catch (e) {
      console.log('⚠️ Error al borrar mensaje:', e)
    }

    // Sumar advertencia
    mutedUser.warnings = (mutedUser.warnings || 0) + 1

    if (mutedUser.warnings >= 3) {
      await conn.sendMessage(m.chat, {
        text: `🚫 El usuario @${senderId.split('@')[0]} fue eliminado por insistir en hablar muteado.`,
        mentions: [senderId]
      })
      try {
        await conn.groupParticipantsUpdate(m.chat, [senderId], "remove")
      } catch {
        await conn.sendMessage(m.chat, {
          text: `⚠️ No pude eliminar a @${senderId.split('@')[0]}, revisa si el bot es admin.`,
          mentions: [senderId]
        })
      }
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

export default handler