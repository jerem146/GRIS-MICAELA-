let handler = async (m, { conn }) => {
  let chat = global.db.data.chats[m.chat]
  chat.welcomeMessage = null // o también puedes usar delete chat.welcomeMessage

  m.reply(`${emoji} El mensaje de bienvenida ha sido restablecido a su valor predeterminado.`)
}

handler.help = ['resetwelcome']
handler.tags = ['tools']
handler.command = ['resetwelcome']
handler.owner = false
handler.admin = true

export default handler