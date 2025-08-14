let handler = async (m, { conn, args, usedPrefix, command }) => {
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => icono) 

    // Determinar acción: open o close
    let action = (args[0] || '').toLowerCase()
    let setting

    if (action === 'open') setting = 'not_announcement'
    else if (action === 'close') setting = 'announcement'
    else {
        return conn.reply(
            m.chat,
            `${emoji} *Elija una opción válida para configurar el grupo*\n\nEjemplo:\n` +
            `*✰ ${usedPrefix}${command} open* - Permitir que todos escriban\n` +
            `*✰ ${usedPrefix}${command} close* - Solo admins pueden escribir`,
            m
        )
    }

    await conn.groupSettingUpdate(m.chat, setting)

    if (setting === 'not_announcement') {
        m.reply(`${emoji} *El grupo está abierto. Todos pueden escribir.*`)
    } else if (setting === 'announcement') {
        m.reply(`${emoji2} *El grupo está cerrado. Solo los administradores pueden escribir.*`)
    }
}

handler.help = ['group open / close']
handler.tags = ['grupo']
handler.command = ['group', 'grupo']
handler.admin = true
handler.botAdmin = true

export default handler