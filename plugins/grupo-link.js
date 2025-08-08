let handler = async (m, { conn, args }) => {
  // Si quieres que funcione con solo escribir el comando sin argumentos
  let code = 'GJAsdPyhLrVGW0i5F7JQAZ' // Código de invitación del grupo (puedes poner dinámico si quieres)

  await conn.sendMessage(m.chat, {
    groupInviteMessage: {
      groupJid: '1234567890-123456@g.us', // El ID real del grupo
      inviteCode: code, // Código de invitación
      groupName: 'ꕥ 𝖬ichi v2 ( BETA )☄︎', // Nombre del grupo
      caption: '¡Únete a nuestro grupo oficial!', // Texto que aparece debajo del título
      jpegThumbnail: await conn.profilePictureUrl('1234567890-123456@g.us', 'image') // Imagen del grupo
        .then(url => fetch(url).then(res => res.buffer()))
        .catch(() => null)
    }
  }, { quoted: m })
}

handler.command = ['grupolink', 'linkgrupo']
export default handler