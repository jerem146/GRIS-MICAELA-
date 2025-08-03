const handlerMute = async (m, { conn, args }) => {
  if (!m.isGroup) return
  if (!m.isAdmin) return m.reply('Solo los administradores pueden ejecutar este comando')
  const userId = m.mentionedJid[0] || args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  if (!userId) return m.reply('Debes mencionar a un usuario o proporcionar su número de teléfono')
  let user = global.db.data.users[userId]
  if (!user) {
    user = global.db.data.users[userId] = {
      muto: false,
      // Agrega otras propiedades que necesites
    }
  }
  user.muto = true
  const userName = await conn.getName(userId)
  m.reply(`El usuario ${userName} ha sido muteado con éxito`)
}

handlerMute.command = ['muteado']
handlerMute.admin = true

const handlerUnmute = async (m, { conn, args }) => {
  if (!m.isGroup) return
  if (!m.isAdmin) return m.reply('Solo los administradores pueden ejecutar este comando')
  const userId = m.mentionedJid[0] || args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  if (!userId) return m.reply('Debes mencionar a un usuario o proporcionar su número de teléfono')
  let user = global.db.data.users[userId]
  if (!user) {
    user = global.db.data.users[userId] = {
      muto: false,
      // Agrega otras propiedades que necesites
    }
  }
  user.muto = false
  const userName = await conn.getName(userId)
  m.reply(`El usuario ${userName} ha sido desmuteado con éxito`)
}

handlerUnmute.command = ['desmuteado']
handlerUnmute.admin = true

export { handlerMute, handlerUnmute }