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
  const welcomeMessage = chat.welcomeMessage || global.welcom1 || 'Bienvenido/a :'
  const despMessage = chat.despMessage || global.welcom2 || 'Se fue 😿'

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
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

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const txt = '🈶「 NUEVO CAMARADA 」🈶'
    const bienvenida = `
╭━━━〔 ${textbot} 〕━━━╮
┃ 🏯 𝑯𝒐𝒏𝒐𝒓 𝒚 𝒃𝒊𝒆𝒏𝒗𝒆𝒏𝒊𝒅𝒂  
┃ ╭───────────────╮
┃ │ ${taguser}
┃ │ ${welcomeMessage}
┃ ╰───────────────╯
┃
┃ 📜 Grupo: ${groupMetadata.subject}
┃ 👥 Miembros: ${totalMembers}
╰━━━━━━━━━━━━━━━⳹
🍃 *Usa #profile para ver tu ficha de viajero*`

    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak)

  } else if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) {
    const txt1 = '💨「 DESPEDIDA 」💨'
    const bye = `
╭━━━〔 ${textbot} 〕━━━╮
┃ 🌸 𝑬𝒍 𝒗𝒊𝒆𝒏𝒕𝒐 𝒔𝒆 𝒍𝒍𝒆𝒗𝒂 𝒂...
┃ ╭───────────────╮
┃ │ ${taguser}
┃ │ ${despMessage}
┃ ╰───────────────╯
┃
┃ 📜 Grupo: ${groupMetadata.subject}
┃ 👥 Miembros: ${totalMembers}
╰━━━━━━━━━━━━━━━⳹
🏮 ${global.dev}`

    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak)
  }

  return true
}