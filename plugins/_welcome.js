import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  const chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return true

  const who = m.messageStubParameters?.[0]
  if (!who) return true

  const taguser = `@${who.split('@')[0]}`
  const totalMembers = participants.length
  const defaultImage = 'https://files.catbox.moe/xr2m6u.jpg'
  
  // --- Objeto de contacto ---
  const fkontak = { /* ... tu objeto fkontak ... */ }

  let img
  try {
    const pp = await conn.profilePictureUrl(who, 'image')
    img = await (await fetch(pp)).buffer()
  } catch {
    img = await (await fetch(defaultImage)).buffer()
  }

  // --- LÓGICA DE BIENVENIDA ---
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    // 1. Define un mensaje por defecto
    const defaultWelcome = `
${taguser} SE UNE AL VIAJE 🌸

┌─〔 BIENVENIDA 〕─
│ 🌿 @user
│ 🌳 *GRUPO:* @group
│ 📊 *MIEMBROS:* @count
└──────────────

¡DISFRUTA TU ESTADÍA! ✨`

    // 2. Usa el mensaje personalizado si existe, si no, usa el de por defecto
    let welcomeTxt = chat.welcomeMessage || defaultWelcome

    // 3. Reemplaza las variables en el mensaje final
    const finalWelcome = welcomeTxt
      .replace('@user', taguser)
      .replace('@group', groupMetadata.subject)
      .replace('@count', totalMembers)

    await conn.sendMessage(m.chat, {
      image: img,
      caption: finalWelcome,
      mentions: [who]
    }, { quoted: fkontak })
  
  // --- LÓGICA DE DESPEDIDA ---
  } else if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) {
    // 1. Define un mensaje de despedida por defecto
    const defaultBye = `
${taguser} CONTINÚA SU VIAJE 👋

┌─〔 DESPEDIDA 〕─
│ 🌿 @user
│ 🌳 *GRUPO:* @group
│ 📊 *MIEMBROS:* @count
└──────────────

¡HASTA PRONTO! 🌸`

    // 2. Usa el mensaje personalizado si existe
    let byeTxt = chat.despMessage || defaultBye

    // 3. Reemplaza las variables (importante: usamos totalMembers - 1)
    const finalBye = byeTxt
      .replace('@user', taguser)
      .replace('@group', groupMetadata.subject)
      .replace('@count', totalMembers - 1)

    await conn.sendMessage(m.chat, {
      image: img,
      caption: finalBye,
      mentions: [who]
    }, { quoted: fkontak })
  }

  return true
}```

### ¿Cómo funciona ahora?

1.  **Un admin usa el comando**: `#setwelcome ¡Hey @user, bienvenido a @group!`.
2.  **Se guarda el mensaje**: Tu bot guarda ese texto en la base de datos para ese chat en específico.
3.  **Alguien se une**: El código `before.js` se activa, ve que hay un mensaje personalizado guardado (`chat.welcomeMessage`).
4.  **Reemplaza las variables**: Toma ese mensaje y reemplaza `@user` por la mención del nuevo miembro, `@group` por el nombre del grupo y `@count` por el número de miembros.
5.  **Envía el mensaje final**: Envía el mensaje completamente personalizado.
6.  Si un admin nunca ha usado `#setwelcome`, el bot simplemente usará el mensaje por defecto que definimos dentro del código.