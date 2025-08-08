var handler = async (m, { conn, args }) => {
  let group = m.chat
  let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)

  // Obtener la imagen del grupo
  let pp = './media/imagen-grupo.jpg' // imagen por defecto
  try {
    pp = await conn.profilePictureUrl(group, 'image')
  } catch (e) {
    console.log('No se pudo obtener la foto del grupo, usando imagen por defecto.')
  }

  // Texto de mensaje
  let texto = `✿:･✧ ɢʀᴜᴘᴏ ᴅᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ✧･:✿\n\n📎 *Enlace:* ${link}`

  // Botón
  const buttons = [
    { buttonId: link, buttonText: { displayText: '🌐 Ver grupo' }, type: 1 }
  ]

  let buttonMessage = {
    image: { url: pp },
    caption: texto,
    footer: '© 𝘾𝙖𝙧𝙡𝙮 𝘽𝙤𝙩',
    buttons: buttons,
    headerType: 4
  }

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler