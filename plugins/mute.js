// plugins/mute.js
const handler = async (m, { conn, command, args, isAdmin }) => {
  if (!m.isGroup) return m.reply('🔒 Este comando solo funciona en grupos.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  if (!chat.mutedUsers) chat.mutedUsers = {}

  // 🔹 Normalizar el JID del usuario
  let mentioned
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    mentioned = m.mentionedJid[0]
  } else if (m.quoted) {
    mentioned = m.quoted.sender
  } else if (args[0]) {
    mentioned = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  }

  if (!mentioned || typeof mentioned !== 'string') {
    return m.reply('✳️ Debes mencionar, responder o escribir el número del usuario.')
  }

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
    try {
      // Intentar eliminar mensaje
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          id: m.key.id,
          participant: senderId
        }
      })
    } catch (e) {
      console.log('⚠️ No pude borrar mensaje:', e.message)
    }

    // Advertencias
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