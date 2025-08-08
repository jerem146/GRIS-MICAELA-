var handler = async (m, { conn }) => {
  if (!m.isGroup) return conn.reply(m.chat, 'Este comando solo funciona en grupos.', m)
  if (!conn.groupMetadata) return conn.reply(m.chat, 'No se pudo obtener la metadata del grupo.', m)

  let group = m.chat
  let metadata = await conn.groupMetadata(group)
  let groupName = metadata.subject || 'Grupo'
  let groupDesc = metadata.desc || 'Sin descripción.'
  let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)

  let pp = './media/menus/img-grupo.png'
  try {
    pp = await conn.profilePictureUrl(group, 'image')
  } catch (e) {}

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: `✿ 𝐍𝐎𝐌𝐁𝐑𝐄: ${groupName}\n✿ 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎́𝐍: ${groupDesc}\n✿ 𝐄𝐍𝐋𝐀𝐂𝐄: ${link}`,
    footer: 'Presiona el botón para unirte o compartir.',
    buttons: [
      { buttonText: { displayText: '「 Ver grupo 」' }, type: 1, url: link }
    ]
  }, { quoted: m })
}

handler.help = ['link', 'enlace']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler