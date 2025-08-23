// grupo-mute.js
let handler = async (m, { conn, text, args, command, isAdmin }) => {
  if (!m.isGroup) return m.reply('🔒 Este comando solo funciona en grupos.')
  if (!isAdmin) return m.reply('❌ Solo los administradores pueden usar este comando.')

  let user = m.mentionedJid[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)
  if (!user) return m.reply('✳️ Debes mencionar al usuario o poner su número.')

  // Crear usuario si no existe en la base de datos
  if (!global.db.data.users[user]) {
    global.db.data.users[user] = {
      exp: 0,
      coin: 10,
      diamond: 3,
      bank: 0,
      level: 0,
      role: 'Nuv',
      muto: false,
      warnMute: 0,
      registered: false,
      premium: false,
      premiumTime: 0,
      banned: false
    }
  }

  let target = global.db.data.users[user]

  if (command === 'mute') {
    target.muto = true
    target.warnMute = 0
    m.reply(`✅ El usuario @${user.split('@')[0]} ha sido muteado.`, null, { mentions: [user] })
  }

  if (command === 'unmute') {
    target.muto = false
    target.warnMute = 0
    m.reply(`✅ El usuario @${user.split('@')[0]} ha sido desmuteado.`, null, { mentions: [user] })
  }
}

handler.command = /^mute|unmute$/i
handler.group = true
handler.admin = true
export default handler

// 🚨 Hook before: controlar mensajes de muteados
handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  let user = global.db.data.users[m.sender]
  if (!user?.muto) return

  // Eliminar mensaje de muteado
  try {
    await conn.sendMessage(m.chat, {
      delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender }
    })
  } catch { }

  // Sumar advertencia
  user.warnMute = (user.warnMute || 0) + 1

  if (user.warnMute >= 3) {
    await conn.sendMessage(m.chat, {
      text: `🚫 @${m.sender.split('@')[0]} fue eliminado por insistir en hablar estando muteado.`,
      mentions: [m.sender]
    })
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    user.muto = false
    user.warnMute = 0
  } else {
    await conn.sendMessage(m.chat, {
      text: `⚠️ @${m.sender.split('@')[0]} estás muteado. Advertencia ${user.warnMute}/3.`,
      mentions: [m.sender]
    })
  }
}