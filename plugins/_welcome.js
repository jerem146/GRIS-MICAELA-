import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  const chat = global.db.data.chats[m.chat]
  if (!chat?.welcome) return true

  const who = m.messageStubParameters?.[0]
  if (!who) return true

  const taguser = `@${who.split('@')[0]}`
  const totalMembers = participants?.length || 0
  const defaultImage = 'https://files.catbox.moe/xr2m6u.jpg'
  const welcomeMessage = chat.welcomeMessage || global.welcom1 || ''
  const despMessage = chat.despMessage || global.welcom2 || ''

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

  const firma = "© ⍴᥆ᥕᥱrᥱძ ᑲᥡ ᗪ卂尺Ҝ"

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    const header = '↷✦; w e l c o m e ❞'
    const bienvenida = [
      `✿ *Bienvenid@* a *${groupMetadata.subject}*`,
      `✰ ${taguser}, qué gusto :D`,
      `✦ Ahora somos *${totalMembers}*`,
      ``,
      `${welcomeMessage}`.trim(),
      ``,
      `•(=^●ω●^=)• Disfruta tu estadía en el grupo!`,
      `> ✐ Puedes usar *#profile* para ver tu perfil.`,
      ``,
      `${firma}`
    ].join("\n")

    await conn.sendMini(m.chat, header, dev, bienvenida, img, img, redes, fkontak)

  } else if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) {
    const header = '↷✦; g o o d b y e ❞'
    const bye = [
      `✿ *Adiós* de *${groupMetadata.subject}*`,
      `✰ ${taguser}`,
      `✦ Ahora somos *${totalMembers}*`,
      ``,
      `${despMessage}`.trim(),
      ``,
      `•(=^●ω●^=)• Te esperamos pronto!`,
      `> ✐ Puedes usar *#profile* para ver tu perfil.`,
      ``,
      `${firma}`
    ].join("\n")

    await conn.sendMini(m.chat, header, dev, bye, img, img, redes, fkontak)
  }

  return true
}