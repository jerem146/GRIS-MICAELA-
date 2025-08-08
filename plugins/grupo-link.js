var handler = async (m, { conn }) => {
  let group = m.chat
  let pp = await conn.profilePictureUrl(group, 'image').catch(_ => 'https://telegra.ph/file/265c672094dfa87caea19.jpg')
  let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
  let caption = `✿:･✧ *Link del grupo* ✧･:✿\n\n${link}`

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: caption,
    footer: 'Presiona el botón para ir al grupo',
    buttons: [
      {
        buttonId: link,
        buttonText: { displayText: '🌐 Ver grupo' },
        type: 1
      }
    ],
    headerType: 4
  }, { quoted: m })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler