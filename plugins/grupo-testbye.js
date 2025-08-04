let handler = async (m, { conn, text, participants, groupMetadata }) => {
  if (!m.isGroup) return m.reply('❗ Este comando solo funciona en grupos.')

  const defaultImage = 'https://files.catbox.moe/xr2m6u.jpg'
  const totalMembers = participants.length
  const byeMessage = global.welcom2 || 'Adiós :'
  const taguser = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
  const nombre = await conn.getName(taguser)
  const tag = '@' + taguser.split('@')[0]

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
    const pp = await conn.profilePictureUrl(taguser, 'image')
    img = await (await fetch(pp)).buffer()
  } catch {
    img = await (await fetch(defaultImage)).buffer()
  }

  const txt = '✦◜៹ USUARIO RETIRADO ៹◞✦'
  const despedida = `┏╼★${textbot}
┋「 Despedida 」
┗╼★ 「 ${tag} 」
 ┋❖ ${byeMessage}
 ┋❀ Grupo: ${groupMetadata.subject}
 ┋❀ Quedan: ${totalMembers}
 ┗━━━━━━━━━━━━━━━┅ ⳹
> ✐ Que tengas un buen viaje.`

  await conn.sendMini(m.chat, txt, dev, despedida, img, img, redes, fkontak)
}
handler.command = ['testbye']
handler.group = true
handler.admin = false
handler.botAdmin = false

export default handler