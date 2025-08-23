const defaultImage = 'https://files.catbox.moe/ubftco.jpg'

async function isAdminOrOwner(m, conn) {
  try {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const participant = groupMetadata.participants.find(p => p.id === m.sender)
    return participant?.admin || m.fromMe
  } catch {
    return false
  }
}

const handler = async (m, { conn, command, args, isAdmin }) => {
  if (!m.isGroup) return m.reply('🔒 Solo funciona en grupos.')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  if (!chat.mutedUsers) chat.mutedUsers = {}

  const mentioned = m.mentionedJid ? m.mentionedJid[0] : args[0]
  if (!mentioned) return m.reply('✳️ Menciona al usuario a mutear/desmutear.')

  if (!isAdmin) return m.reply('❌ Solo admins pueden mutear/desmutear usuarios.')

  if (command === 'mute') {
    chat.mutedUsers[mentioned] = { warnings: 0 }
    return m.reply(`✅ Usuario muteado correctamente.`)
  }

  if (command === 'unmute') {
    delete chat.mutedUsers[mentioned]
    return m.reply(`✅ Usuario desmuteado correctamente.`)
  }
}

handler.command = ['mute', 'unmute']
handler.group = true
handler.register = false
handler.tags = ['group']
handler.help = ['mute @usuario', 'unmute @usuario']

handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  const chat = global.db.data.chats[m.chat]
  if (!chat || !chat.mutedUsers) return

  const senderId = m.key.participant || m.sender
  const mutedUser = chat.mutedUsers[senderId]

  if (mutedUser) {
    try {
      // Borrar mensaje si es posible
      await conn.sendMessage(m.chat, {
        delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: senderId }
      })
    } catch {
      const userTag = `@${senderId.split('@')[0]}`
      await conn.sendMessage(m.chat, {
        text: `⚠️ No pude eliminar el mensaje de ${userTag}. Puede que me falten permisos.`,
        mentions: [senderId]
      })
    }

    // Sumar advertencia
    mutedUser.warnings = (mutedUser.warnings || 0) + 1

    if (mutedUser.warnings >= 3) {
      await conn.sendMessage(m.chat, {
        text: `🚫 El usuario @${senderId.split('@')[0]} fue eliminado por insistir en hablar muteado.`,
        mentions: [senderId]
      })
      await conn.groupParticipantsUpdate(m.chat, [senderId], "remove")
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