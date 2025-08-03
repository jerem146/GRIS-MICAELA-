const handler = async (m, { conn, args }) => {
  const userId = m.mentionedJid[0] || args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  if (!userId) return m.reply('Debes mencionar a un usuario o proporcionar su número de teléfono')
  const user = global.db.data.users[userId]
  if (!user) return m.reply('El usuario no existe en la base de datos')
  user.muto = true
  m.reply(`El usuario ${user.name} ha sido muteado con éxito`)
}

handler.command = ['muteado']
handler.admin = true
export default handler