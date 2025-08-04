let handler = async (m, { conn, text, participants, groupMetadata }) => {
  if (!m.isGroup) return m.reply('❗ Este comando solo funciona en grupos.')

  const defaultImage = 'https://files.catbox.moe/xr2m6u.jpg'
  const totalMembers = participants.length
  const welcomeMessage = global.welcom1 || 'Bienvenido/a :'
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

  const txt = 'ゲ◜៹ NUEVO MIEMBRO ៹◞ゲ'
  const bienvenida = `┏╼★${textbot}
┋「 Bienvenido 」
┗╼★ 「 ${tag} 」
 ┋❖ ${welcomeMessage}
 ┋❀ Grupo: ${groupMetadata.subject}
 ┋❀ Miembros: ${totalMembers}
 ┗━━━━━━━━━━━━━━━┅ ⳹
> ✐ Puedes usar *#profile* para ver tu perfil.`

  await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak)
}
handler.command = ['testwelcome']
handler.group = true
handler.admin = false
handler.botAdmin = false

export default handler