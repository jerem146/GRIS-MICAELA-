let handler = async (m, { conn, command, text, participants }) => {
  const emoji = '✅'
  const emoji2 = '⚠️'
  const cmd = command.toLowerCase()

  // Normaliza texto a JID válido
  const jidFromText = txt => {
    const digits = String(txt || '').replace(/\D/g, '')
    if (!digits) return null
    return `${digits}@s.whatsapp.net`
  }

  // Extrae JID del mensaje citado de forma robusta
  const jidFromQuoted = (quoted) => {
    if (!quoted) return null
    if (quoted.sender) return quoted.sender
    if (quoted.key?.participant) return quoted.key.participant
    return null
  }

  // Limpia para mostrar en mención
  const cleanNumber = jid => {
    return String(jid || '').replace(/@s\.whatsapp\.net$/i, '').replace(/\D/g, '')
  }

  // Enviar invitación por enlace
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
      console.error('Error fallback invitación:', err)
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
    } else {
      return conn.reply(m.chat, `${emoji2} *Responda el mensaje o escriba un número para agregar.*`, m)
    }

    if (!user) {
      console.log('DEBUG: m.quoted =', JSON.stringify(m.quoted, null, 2))
      return conn.reply(m.chat, `${emoji2} *No se pudo identificar al usuario desde el reply o el número ingresado.*`, m)
    }

    if (!user.endsWith('@s.whatsapp.net')) user = jidFromText(user) // normaliza si vino sin sufijo

    // validación mínima: número suficientemente largo
    const cleaned = cleanNumber(user)
    if (cleaned.length < 8) return conn.reply(m.chat, `${emoji2} *Número demasiado corto o inválido.*`, m)

    const isInGroup = Array.isArray(participants) && participants.some(p => p.id === user)
    if (isInGroup) return m.reply(`${emoji2} *El usuario ya está en el grupo.*`)

    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'add')
      m.reply(`${emoji} *Usuario agregado correctamente.*`)
    } catch (e) {
      console.error('Error agregando directamente:', e)
      // diagnóstico simplificado
      let motivo = 'No se pudo agregar directamente.'
      if (e?.output?.payload?.message) motivo += ` (${e.output.payload.message})`
      m.reply(`${emoji2} *${motivo} Intentando con enlace...*`)
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
    } else {
      return conn.reply(m.chat, `${emoji2} *Responda el mensaje o escriba un número para invitar.*`, m)
    }

    if (!user) {
      console.log('DEBUG: m.quoted =', JSON.stringify(m.quoted, null, 2))
      return conn.reply(m.chat, `${emoji2} *No se pudo identificar al usuario para invitar.*`, m)
    }

    if (!user.endsWith('@s.whatsapp.net')) user = jidFromText(user)

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