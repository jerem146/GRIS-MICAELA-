let handler = async (m, { conn, usedPrefix, command, args }) => {
  const chat = global.db.data.chats[m.chat]

  // Si el chat no está registrado
  if (!chat) {
    return conn.reply(m.chat, `✧ Este chat aún no está registrado en la base de datos.`, m)
  }

  if (command === 'bot') {
    const estado = chat.isBanned ? 'desactivado 🔴' : 'en línea 🟢'

    // Si no se proporciona argumento, mostrar estado actual
    if (!args[0]) {
      return conn.reply(m.chat, `✧ Estoy *${estado}* en este grupo.`, m)
    }

    // Convertir argumento a minúsculas
    const option = args[0].toLowerCase()

    if (option === 'off') {
      if (chat.isBanned) return conn.reply(m.chat, `《✦》${botname} ya estaba desactivado.`, m)
      chat.isBanned = true
      return conn.reply(m.chat, `❀ Has *desactivado* a ${botname}.`, m)
    }

    if (option === 'on') {
      if (!chat.isBanned) return conn.reply(m.chat, `《✦》${botname} ya estaba activado.`, m)
      chat.isBanned = false
      return conn.reply(m.chat, `❀ Has *activado* a ${botname}.`, m)
    }

    return conn.reply(m.chat, `✧ Opción no válida. Usa *${usedPrefix}bot on* o *${usedPrefix}bot off*.`, m)
  }
}

handler.help = ['bot']
handler.tags = ['grupo']
handler.command = ['bot']
handler.admin = true
handler.group = true

export default handler