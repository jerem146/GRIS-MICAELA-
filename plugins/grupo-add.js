let handler = async (m, { conn, command, text, participants }) => {
  const emoji = '✅'
  const emoji2 = '⚠️'
  const cmd = command.toLowerCase()

  // Extrae y normaliza JID desde texto tipo "51963896243" -> "51963896243@s.whatsapp.net"
  const jidFromText = (txt) => {
    const digits = txt.replace(/\D/g, '')
    if (!digits) return null
    return `${digits}@s.whatsapp.net`
  }

  // Extrae número limpio para mostrar en @mención (sin @s.whatsapp.net)
  const cleanNumber = (jid) => {
    return jid.replace(/\D/g, '').replace(/swhatsappnet$/i, '') // queda por si hay sufijos raros
  }

  // Enviar invitación por link como fallback
  const enviarInvitacion = async (target) => {
    try {
      const code = await conn.groupInviteCode(m.chat)
      const inviteLink = 'https://chat.whatsapp.com/' + code
      await conn.sendMessage(target, {
        text: `📩 *Has sido invitado al grupo por @${m.sender.split('@')[0]}:*\n${inviteLink}\n\n(｡•́‿•̀｡) ¡Te esperamos!`
      }, { mentions: [m.sender] })

      m.reply(`${emoji} *Invitación enviada a @${cleanNumber(target)}*`, null, {
        mentions: [target]
      })
    } catch (err) {
      console.error('Error enviando invitación fallback:', err)
      m.reply(`${emoji2} *No se pudo invitar al usuario de ninguna forma.*`)
    }
  }

  let user = null
  if (['add', 'agregar', 'añadir'].includes(cmd)) {
    if (m.quoted) {
      user = m.quoted.sender
    } else if (text) {
      if (text.includes('+') || /\s/.test(text))
        return conn.reply(m.chat, `${emoji2} *Ingrese el número sin "+" ni espacios.*`, m)
      if (isNaN(text.replace(/\D/g, '')))
        return conn.reply(m.chat, `${emoji2} *Ingrese solo números.*`, m)
      user = jidFromText(text)
      if (!user)
        return conn.reply(m.chat, `${emoji2} *Número inválido.*`, m)
    } else {
      return conn.reply(m.chat, `${emoji2} *Responda el mensaje o escriba un número para agregar.*`, m)
    }

    // Verificar si ya está en el grupo
    const isInGroup = Array.isArray(participants) && participants.some(p => p.id === user)
    if (isInGroup) return m.reply(`${emoji2} *El usuario ya está en el grupo.*`)

    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'add')
      m.reply(`${emoji} *Usuario agregado correctamente.*`)
    } catch (e) {
      console.error('Error agregando directamente:', e)
      m.reply(`${emoji2} *No se pudo agregar directamente. Enviando enlace de invitación...*`)
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
      user = jidFromText(text)
      if (!user)
        return conn.reply(m.chat, `${emoji2} *Número inválido.*`, m)
    } else {
      return conn.reply(m.chat, `${emoji2} *Responda el mensaje o escriba un número para invitar.*`, m)
    }

    await enviarInvitacion(user)
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