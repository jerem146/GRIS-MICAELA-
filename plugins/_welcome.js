import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  const chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return true

  const who = m.messageStubParameters?.[0]
  if (!who) return true

  const taguser = `@${who.split('@')[0]}`
  
  // ---> ESTA VARIABLE YA CONTIENE EL NÚMERO DE MIEMBROS
  const totalMembers = participants.length
  
  const defaultImage = 'https://files.catbox.moe/xr2m6u.jpg'
  const botName = 'SukiBot - MDไอ'

  const getCurrentDate = () => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const fkontak = {
    key: {
      fromMe: false,
      participant: `0@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: "status@broadcast" } : {})
    },
    message: {
      "contactMessage": {
        "displayName": "SukiBot-MD",
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${who.split('@')[0]}:${who.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    }
  }

  let img
  try {
    const pp = await conn.profilePictureUrl(who, 'image')
    img = await (await fetch(pp)).buffer()
  } catch {
    img = await (await fetch(defaultImage)).buffer()
  }

  // --- MENSAJE DE BIENVENIDA ---
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const welcomeMessage = `
${taguser} SE UNE AL VIAJE 🌸

┌─〔 BIENVENIDA 〕─
│ 🌿 @${who.split('@')[0]}
│
│ 🧁 NOMBRE: +${who.split('@')[0]}
│ 🗓️ ENTRADA: ${getCurrentDate()}
│
│ 🌳 *GRUPO:* ${groupMetadata.subject}
│ 📊 *MIEMBROS:* ${totalMembers}
└──────────────

¡DISFRUTA TU ESTADÍA! ✨
`
    await conn.sendMessage(m.chat, {
        image: img,
        caption: welcomeMessage,
        mentions: [who]
    }, { quoted: fkontak })

  // --- MENSAJE DE DESPEDIDA ---
  } else if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) {
    const farewellMessage = `
${taguser} CONTINÚA SU VIAJE 👋

┌─〔 DESPEDIDA 〕─
│ 🌿 @${who.split('@')[0]}
│
│ 🧁 NOMBRE: +${who.split('@')[0]}
│ 🗓️ SALIDA: ${getCurrentDate()}
│
│ 🌳 *GRUPO:* ${groupMetadata.subject}
│ 📊 *MIEMBROS:* ${totalMembers - 1}
└──────────────

¡HASTA PRONTO! 🌸
`
    await conn.sendMessage(m.chat, {
        image: img,
        caption: farewellMessage,
        mentions: [who]
    }, { quoted: fkontak })
  }

  return true
}