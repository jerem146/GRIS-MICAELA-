const handlerMute = async (m, { conn, args }) => {
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
  m.reply(`El usuario ${userId} ha sido muteado con éxito`)
}

handlerMute.command = ['mut']
handlerMute.admin = true

const handlerUnmute = async (m, { conn, args }) => {
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
  m.reply(`El usuario ${userId} ha sido desmuteado con éxito`)
}

handlerUnmute.command = ['unmut']
handlerUnmute.admin = true

export { handlerMute, handlerUnmute }