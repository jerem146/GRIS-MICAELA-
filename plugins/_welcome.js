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
    const txt = 'ゲ◜៹ NUEVO MIEMBRO ៹◞ゲ'
    const bienvenida = `┏╼★${textbot}
┋「 Bienvenido 」
┗╼★ 「 ${taguser} 」
 ┋❖ ${welcomeMessage}
 ┋❀ Grupo: ${groupMetadata.subject}
 ┋❀ Miembros: ${totalMembers}
 ┗━━━━━━━━━━━━━━━┅ ⳹
> ✐ Puedes usar *#profile* para ver tu perfil.`

    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak)

  } else if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) {
    const txt1 = 'ゲ◜៹ BYE MIEMBRO ៹◞ゲ'
    const bye = `┏╼★${textbot}
┋「 ADIÓS 👋 」
┗╼★ 「 ${taguser} 」
 ┋❖ ${despMessage}
 ┋❀ Grupo: ${groupMetadata.subject}
 ┋❀ Miembros: ${totalMembers}
 ┗━━━━━━━━━━━━━━━┅ ⳹
> > ${global.dev}`

    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak)
  }

  return true
}