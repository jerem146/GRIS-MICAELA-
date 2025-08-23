// mute.js
const handler = async (m, { conn, command, args, isAdmin }) => {
  if (!m.isGroup) return m.reply('🔒 Solo funciona en grupos.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  if (!chat.mutedUsers) chat.mutedUsers = {}

  // ✅ Corregido: obtener el usuario mencionado o número
  let mentioned = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : args[0] 
      ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' 
      : null

  if (!mentioned) return m.reply(`✳️ Debes mencionar o escribir el número del usuario.`)

  if (!isAdmin) return m.reply('❌ Solo admins pueden mutear/desmutear usuarios.')

  if (command === 'mute') {
    chat.mutedUsers[mentioned] = { warnings: 0 }
    return conn.sendMessage(m.chat, { 
      text: `✅ El usuario @${mentioned.split('@')[0]} ha sido muteado.`,
      mentions: [mentioned]
    }, { quoted: m })
  }

  if (command === 'unmute') {
    delete chat.mutedUsers[mentioned]
    return conn.sendMessage(m.chat, { 
      text: `✅ Usuario @${mentioned.split('@')[0]} ha sido desmuteado.`,
      mentions: [mentioned]
    }, { quoted: m })
  }
}

handler.command = ['mute', 'unmute']
handler.group = true
handler.tags = ['group']
handler.help = ['mute @usuario', 'unmute @usuario']

// --- Middleware para borrar mensajes ---
handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.mutedUsers) return

  let senderId = m.key.participant || m.sender
  let mutedUser = chat.mutedUsers[senderId]

  if (mutedUser) {
    try {
      let groupMetadata = await conn.groupMetadata(m.chat)
      let botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
      let botData = groupMetadata.participants.find(p => p.id === botNumber)

      if (botData?.admin) {
        // Borrar mensaje real
        await conn.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            id: m.key.id,
            participant: senderId
          }
        })
      } else {
        // Avisar si no tiene permisos
        await conn.sendMessage(m.chat, {
          text: `❌ Mensaje de @${senderId.split('@')[0]} bloqueado (bot no es admin).`,
          mentions: [senderId]
        })
      }
    } catch (e) {
      console.error('Error al intentar borrar:', e)
    }

    // Contar advertencias
    mutedUser.warnings = (mutedUser.warnings || 0) + 1

    if (mutedUser.warnings >= 3) {
      await conn.sendMessage(m.chat, {
        text: `🚫 El usuario @${senderId.split('@')[0]} fue eliminado por insistir en hablar muteado.`,
        mentions: [senderId]
      })
      try {
        await conn.groupParticipantsUpdate(m.chat, [senderId], 'remove')
      } catch (e) {
        await conn.sendMessage(m.chat, {
          text: `⚠️ No pude eliminar a @${senderId.split('@')[0]} (bot no es admin).`,
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