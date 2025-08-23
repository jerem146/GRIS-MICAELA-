let handler = async (m, { conn, text, args, command, isAdmin, participants }) => {
  if (!m.isGroup) return m.reply('🔒 Este comando solo funciona en grupos.')
  if (!isAdmin) return m.reply('❌ Solo los administradores pueden usar este comando.')

  let user = m.mentionedJid[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)
  if (!user) return m.reply('✳️ Debes mencionar al usuario o poner su número.')

  let target = global.db.data.users[user]
  if (!target) return m.reply('⚠️ Usuario no encontrado en la base de datos.')

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

// 🔹 Hook before: advierte y expulsa si sigue hablando muteado
handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  let user = global.db.data.users[m.sender]
  if (!user?.muto) return

  // borrar mensaje
  try {
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.sender } })
  } catch { }

  user.warnMute = (user.warnMute || 0) + 1

  if (user.warnMute >= 3) {
    await conn.sendMessage(m.chat, { text: `🚫 @${m.sender.split('@')[0]} fue eliminado por insistir en hablar muteado.`, mentions: [m.sender] })
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    user.muto = false
    user.warnMute = 0
  } else {
    await conn.sendMessage(m.chat, { text: `⚠️ @${m.sender.split('@')[0]} estás muteado. Advertencia ${user.warnMute}/3.`, mentions: [m.sender] })
  }
}