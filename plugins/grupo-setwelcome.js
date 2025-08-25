let handler = async (m, { conn, text, isRowner }) => {
  if (!text) return m.reply(`📝 Por favor, proporciona un mensaje de bienvenida.

Puedes usar estas variables:
*@user* - Mención del nuevo miembro
*@group* - Nombre del grupo
*@count* - Cantidad de miembros

*Ejemplo:*
#setwelcome ¡Hola @user! Bienvenido/a a @group. Ahora somos @count miembros.`);

  let chat = global.db.data.chats[m.chat]
  chat.welcomeMessage = text.trim()

  m.reply(`✅ La bienvenida del grupo ha sido establecida.`)
}

handler.help = ['setwelcome']
handler.tags = ['group']
handler.command = ['setwelcome', 'bienvenida']
handler.admin = true

export default handler;