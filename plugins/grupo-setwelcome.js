let handler = async (m, { conn, text, isRowner }) => {
  if (!text) return m.reply(`${emoji} Por favor, proporciona una bienvenida personalizada.\n> Ejemplo: #setwelcome Hola @user, bienvenido al grupo ✨`);

  let chat = global.db.data.chats[m.chat]
  chat.welcomeMessage = text.trim()

  m.reply(`${emoji} La nueva bienvenida del grupo ha sido establecida:\n\n📝 ${chat.welcomeMessage}`)
}

handler.help = ['setwelcome']
handler.tags = ['tools']
handler.command = ['setwelcome']
handler.owner = false
handler.admin = true

export default handler;