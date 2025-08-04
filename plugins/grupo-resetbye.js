let handler = async (m, { conn }) => {
  let chat = global.db.data.chats[m.chat]
  chat.despMessage = null // o también puedes usar delete chat.despMessage

  m.reply(`${emoji} El mensaje de despedida ha sido restablecido a su valor predeterminado.`)
}

handler.help = ['resetbye']
handler.tags = ['tools']
handler.command = ['resetbye']
handler.owner = false
handler.admin = true

export default handler