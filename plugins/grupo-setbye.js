let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`${emoji} Por favor, proporciona un mensaje de despedida.\n> Ejemplo: #setbye Adiós @user, te extrañaremos 😿`);

  let chat = global.db.data.chats[m.chat]
  chat.despMessage = text.trim()

  m.reply(`${emoji} El mensaje de despedida ha sido actualizado:\n\n💔 ${chat.despMessage}`)
}

handler.help = ['setbye']
handler.tags = ['tools']
handler.command = ['setbye']
handler.owner = false
handler.admin = true

export default handler