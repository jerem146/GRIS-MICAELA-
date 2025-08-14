import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.isGroup || m.messageStubType !== 28) return true // 28 = GROUP_PARTICIPANT_ADD

  const chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return true

  const who = m.messageStubParameters?.[0]
  if (!who) return true

  const taguser = `@${who.split('@')[0]}`
  const totalMembers = participants.length
  const defaultImage = 'https://files.catbox.moe/xr2m6u.jpg'
  const welcomeMessage = chat.welcomeMessage || global.welcom1 || 'Bienvenido/a :'

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${who.split('@')[0]}:${who.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
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

  const txt = '✦ ゲ◜៹ BIENVENIDA ៹◞ゲ ✦'
  const bienvenida = `
╭━━━〔 ${textbot} 〕╮
┃ ✦ 𝑯𝒐𝒍𝒂 ${taguser}
┃ ❖ *${welcomeMessage}*
┃
┃ ✦ *Grupo:* ${groupMetadata.subject}
┃ ✦ *Miembros:* ${totalMembers}
╰━━━━━━━━━━━━━⳹
⚔ Usa *#profile* para ver tu ficha.`

  await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak)
  return true
}