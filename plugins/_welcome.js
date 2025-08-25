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
  const defaultImage = 'https://files.catbox.moe/xr2m6u.jpg' // Imagen por si el usuario no tiene foto de perfil

  // --- ASEGÚRATE DE PONER EL NOMBRE DE TU BOT AQUÍ ---
  const botName = 'GRIS-MICA' // Nombre del bot que aparecerá en el mensaje

  // Función para obtener la fecha actual en formato DD/MM/YYYY
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
        "displayName": "GRIS-MD",
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

  // Mensaje cuando un usuario se une
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICANT_ADD) {
    const welcomeMessage = `
${taguser} SE UNE AL VIAJE

┌─〔 BIENVENIDA 〕─
│ 🌿 ${taguser} se unió a
│ ${botName}
│
│ 🧁 NOMBRE:
│ +${who.split('@')[0]}
│
│ 🗓️ ENTRADA: ${getCurrentDate()}
└──────────────

SUKI TE DA LA BIENVENIDA CON CARIÑO 🌸
`
    await conn.sendMessage(m.chat, {
        image: img,
        caption: welcomeMessage,
        mentions: [who]
    }, { quoted: fkontak })

  // Mensaje cuando un usuario sale
  } else if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) {
    const farewellMessage = `
${taguser} CONTINÚA SU VIAJE 👋

┌─〔 DESPEDIDA 〕─
│ 🌿 ${taguser} salió de
│ ${botName}
│
│ 🧁 NOMBRE:
│ +${who.split('@')[0]}
│
│ 🗓️ SALIDA: ${getCurrentDate()}
└──────────────

MICAELA-MD TE RECORDARÁ CON CARIÑO 🌸
`
    await conn.sendMessage(m.chat, {
        image: img,
        caption: farewellMessage,
        mentions: [who]
    }, { quoted: fkontak })
  }

  return true
}