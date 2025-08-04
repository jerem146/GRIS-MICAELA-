let handler = async (m, { conn, command, text, participants }) => {
  const emoji = '✅'
  const emoji2 = '⚠️'
  const cmd = command.toLowerCase()

  // Normaliza JID desde texto tipo "51963896243" -> "51963896243@s.whatsapp.net"
  const jidFromText = txt => {
    const digits = String(txt).replace(/\D/g, '')
    if (!digits) return null
    return `${digits}@s.whatsapp.net`
  }

  // Número limpio para mostrar en @mención
  const cleanNumber = jid => {
    return String(jid).replace(/@s\.whatsapp\.net$/i, '').replace(/\D/g, '')
  }

  // Extrae JID del mensaje citado de forma segura
  const jidFromQuoted = (quoted) => {
    if (!quoted) return null
    return quoted.sender || quoted.key?.participant || quoted.key?.remoteJid || null
  }

  // Enviar invitación por link como fallback
  const enviarInvitacion = async (target) => {
    try {
      const code = await conn.groupInviteCode(m.chat)
      const inviteLink = 'https://chat.whatsapp.com/' + code
      await conn.sendMessage(target, {
        text: `📩 *Has sido invitado al grupo por @${cleanNumber(m.sender)}:*\n${inviteLink}\n\n(｡•́‿•̀｡) ¡Te esperamos!`
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
      user = jidFromQuoted(m.quoted)
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

    if (!user) return conn.reply(m.chat, `${emoji2} *No se pudo identificar al usuario.*`, m)

    // Si viene en formato sin @, normalizar
    if (!user.endsWith('@s.whatsapp.net')) {
      user = jidFromText(user)
    }

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
      user = jidFromQuoted(m.quoted)
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

    if (!user) return conn.reply(m.chat, `${emoji2} *No se pudo identificar al usuario.*`, m)
    if (!user.endsWith('@s.whatsapp.net')) {
      user = jidFromText(user)
    }

    await enviarInvitacion(user)
    return
  }
}

handler.help = ['add <número o responder>', 'invitar <número o responder>']
handler.tags = ['group']
handler.command = ['add', 'agregar', 'añadir', 'invitar', 'invite']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler