let handler = async (m, { conn, command, text, participants }) => {
  const emoji = '✅'
  const emoji2 = '⚠️'

  let user = null
  const cmd = command.toLowerCase()

  const extractUserFromText = (txt) => {
    const cleaned = txt.replace(/\D/g, '')
    if (!cleaned) return null
    return `${cleaned}@s.whatsapp.net`
  }

  // Helper para enviar invitación si no se puede agregar directamente
  const enviarInvitacion = async (target) => {
    try {
      const code = await conn.groupInviteCode(m.chat)
      const inviteLink = 'https://chat.whatsapp.com/' + code
      await conn.sendMessage(target, {
        text: `📩 *Has sido invitado al grupo por @${m.sender.split('@')[0]}:*\n${inviteLink}\n\n(｡•́‿•̀｡) ¡Te esperamos!`
      }, { mentions: [m.sender] })

      m.reply(`${emoji} *Invitación enviada a @${target.split('@')[0]}*`, null, {
        mentions: [target]
      })
    } catch (err) {
      console.error('Error enviando invitación fallback:', err)
      m.reply(`${emoji2} *No se pudo invitar al usuario de ninguna forma.*`)
    }
  }

  if (['add', 'agregar', 'añadir'].includes(cmd)) {
    if (m.quoted) {
      user = m.quoted.sender
    } else if (text) {
      if (text.includes('+') || /\s/.test(text))
        return conn.reply(m.chat, `${emoji2} *Ingrese el número sin "+" ni espacios.*`, m)
      if (isNaN(text.replace(/\D/g, '')))
        return conn.reply(m.chat, `${emoji2} *Ingrese solo números.*`, m)
      user = extractUserFromText(text)
      if (!user)
        return conn.reply(m.chat, `${emoji2} *Número inválido.*`, m)
    } else {
      return conn.reply(m.chat, `${emoji2} *Responda el mensaje o escriba un número para agregar.*`, m)
    }

    const isInGroup = Array.isArray(participants) && participants.some(p => p.id === user)
    if (isInGroup) return m.reply(`${emoji2} *El usuario ya está en el grupo.*`)

    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'add')
      m.reply(`${emoji} *Usuario agregado correctamente.*`)
    } catch (e) {
      console.error('Error agregando directamente:', e)
      // Fallback: enviar invitación si no se pudo agregar (p. ej. fue eliminado o tiene privacidad)
      await enviarInvitacion(user)
    }
    return
  }

  if (['invitar', 'invite'].includes(cmd)) {
    if (m.quoted) {
      user = m.quoted.sender
    } else if (text) {
      if (text.includes('+') || /\s/.test(text))
        return conn.reply(m.chat, `${emoji2} *Ingrese el número sin "+" ni espacios.*`, m)
      if (isNaN(text.replace(/\D/g, '')))
        return conn.reply(m.chat, `${emoji2} *Ingrese solo números.*`, m)
      user = extractUserFromText(text)
      if (!user)
        return conn.reply(m.chat, `${emoji2} *Número inválido.*`, m)
    } else {
      return conn.reply(m.chat, `${emoji2} *Responda el mensaje o escriba un número para invitar.*`, m)
    }

    try {
      await enviarInvitacion(user)
    } catch (e) {
      console.error('Error en invitar:', e)
      m.reply(`${emoji2} *No se pudo enviar la invitación.*`)
    }
    return
  }
}

handler.help = ['add <número> (responder)', 'invitar <número o responder>']
handler.tags = ['group']
handler.command = ['add', 'agregar', 'añadir', 'invitar', 'invite']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler