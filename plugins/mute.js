// plugins/grupo-mute.js

let handler = async (m, { conn, command, args, isAdmin, participants }) => {
  if (!m.isGroup) return m.reply('🔒 Este comando solo funciona en grupos.')

  // Inicializar chat en la base de datos si no existe
  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}
  if (!chat.mutedUsers) chat.mutedUsers = {}

  // Sacar usuario mencionado
  let mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null
  if (!mentioned && args[0]) {
    if (args[0].includes('@')) {
      mentioned = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    } else if (args[0].match(/^[0-9]+$/)) {
      mentioned = args[0] + '@s.whatsapp.net'
    }
  }

  if (!mentioned) return m.reply('✳️ Debes mencionar o escribir el número del usuario.')

  if (!isAdmin) return m.reply('❌ Solo los administradores pueden usar este comando.')

  if (command === 'mute') {
    chat.mutedUsers[mentioned] = { warnings: 0 }
    return m.reply(`✅ El usuario @${mentioned.split('@')[0]} ha sido muteado.`, null, { mentions: [mentioned] })
  }

  if (command === 'unmute') {
    delete chat.mutedUsers[mentioned]
    return m.reply(`✅ El usuario @${mentioned.split('@')[0]} ha sido desmuteado.`, null, { mentions: [mentioned] })
  }
}

handler.command = ['mute', 'unmute']
handler.group = true
handler.admin = true
export default handler

// 🚨 Bloquear mensajes de muteados
handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.mutedUsers) return

  let senderId = m.key.participant || m.sender
  let mutedUser = chat.mutedUsers[senderId]

  if (mutedUser) {
    // Intentar borrar mensaje
    try {
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: m.key.fromMe || false,
          id: m.key.id,
          participant: m.key.participant || m.sender
        }
      })
    } catch { }

    // Sumar advertencia
    mutedUser.warnings = (mutedUser.warnings || 0) + 1

    if (mutedUser.warnings >= 3) {
      // Expulsar al usuario tras 3 advertencias
      await conn.sendMessage(m.chat, {
        text: `🚫 El usuario @${senderId.split('@')[0]} fue eliminado por insistir en enviar mensajes estando muteado.`,
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