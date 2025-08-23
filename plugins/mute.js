// plugins/mute.js

let handler = async (m, { conn, text, usedPrefix, command, participants }) => {
    // Identificar al usuario a mutear (por mención o respondiendo a un mensaje)
    let user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null;
    if (!user) return m.reply(`❮✦❯ Para mutear a un usuario, menciónalo o responde a uno de sus mensajes.\n\n> → Ejemplo:\n*${usedPrefix + command} @usuario*`);

    // Evitar mutear al propio bot
    if (user === conn.user.jid) return m.reply('❮✦❯ No me puedo mutear a mí mismo.');

    // Verificar si el usuario ya está en la base de datos
    let dbUser = global.db.data.users[user];
    if (!dbUser) {
        // Si no está, lo inicializamos
        global.db.data.users[user] = {
            muto: true,
            // Aquí puedes añadir otros valores por defecto si es necesario
        };
    } else {
        // Si ya existe, solo cambiamos el estado de 'muto'
        dbUser.muto = true;
    }
    
    let mentionedUser = `@${user.split('@')[0]}`;
    await conn.reply(m.chat, `*${mentionedUser} ha sido muteado.*\n\n❮✦❯ A partir de ahora, sus mensajes serán eliminados automáticamente.`, m, { mentions: [user] });
}

handler.help = ['mute @usuario'];
handler.tags = ['group'];
handler.command = /^(mute|mutear)$/i;

// Permisos: Solo para administradores de grupo y el bot debe ser admin
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;