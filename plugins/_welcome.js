import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  const chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return true

  const who = m.messageStubParameters?.[0]
  if (!who) return true

  // --- CONFIGURACIÓN AUTOMÁTICA ---
  // ✨ ESTA LÍNEA TOMA EL NOMBRE AUTOMÁTICAMENTE DE TU CONFIGURACIÓN GLOBAL ✨
  const botName = global.botname || 'Mi Bot'; // Si no encuentra un nombre global, usará 'Mi Bot' como respaldo.
  const textbot = botName; 
  // ------------------------------------

  const taguser = `@${who.split('@')[0]}`
  const totalMembers = participants.length
  const defaultImage = 'https://files.catbox.moe/xr2m6u.jpg'
  const welcomeMessage = chat.welcomeMessage || '¡Bienvenido/a!'
  const despMessage = chat.despMessage || 'Se fue 😿'

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        displayName: botName, // Usa el nombre automático
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${botName};;;\nFN:${botName}\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  let img
  try {
    const pp = await conn.profilePictureUrl(who, 'image')
    img = await (await fetch(pp)).buffer()
  } catch {
    img = await (await fetch(defaultImage)).buffer()
  }

  // --- BIENVENIDA CON TU DISEÑO ORIGINAL ---
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const bienvenida = `
╭━━━〔 ${textbot} 〕╮
┃ ✦ 𝑯𝒐𝒍𝒂 ${taguser}
┃ ❖ *${welcomeMessage}*
┃
┃ ✦ *Grupo:* ${groupMetadata.subject}
┃ ✦ *Miembros:* ${totalMembers}
╰━━━━━━━━━━━━━⳹
⚔ Usa *#profile* para ver tu ficha.`

    await conn.sendMini(m.chat, '', '', bienvenida, img, img, global.redes, fkontak)

  // --- DESPEDIDA CON TU DISEÑO ORIGINAL ---
  } else if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) {
    const bye = `
╭━━━〔 ${textbot} 〕╮
┃ ❖ ${taguser}
┃ ✦ *${despMessage}*
┃
┃ ✦ *Grupo:* ${groupMetadata.subject}
┃ ✦ *Miembros:* ${totalMembers - 1}
╰━━━━━━━━━━━━━━━⳹`
    
    await conn.sendMini(m.chat, '', '', bye, img, img, global.redes, fkontak)
  }

  return true
}