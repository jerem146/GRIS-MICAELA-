const handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin }) => {
  const emoji = '⚠️';
  const emoji2 = '❌';

  if (!args[0]) return conn.reply(m.chat, `${emoji} Ingrese algún prefijo de país para ejecutar el comando.\nEjemplo: ${usedPrefix + command} 51`, m);
  if (isNaN(args[0])) return conn.reply(m.chat, `${emoji} El prefijo debe ser numérico.\nEjemplo: ${usedPrefix + command} 212`, m);

  const lol = args[0].replace(/[+]/g, '');
  const bot = global.db.data.settings[conn.user.jid] || {};

  // Filtrar participantes por prefijo de número
  const ps = participants
    .map(u => u.id)
    .filter(v => {
      const numero = v.split('@')[0];
      return v !== conn.user.jid && numero.startsWith(lol);
    });

  if (ps.length === 0) return conn.reply(m.chat, `${emoji2} Aquí no hay ningún número con el prefijo +${lol}`, m);

  const numeros = ps.map(v => '⭔ @' + v.replace(/@.+/, ''));
  const delay = ms => new Promise(res => setTimeout(res, ms));

  switch (command) {
    case 'listanum':
    case 'listnum':
      return conn.reply(m.chat, `${emoji} Lista de números con el prefijo +${lol} en este grupo:\n\n` + numeros.join('\n'), m, { mentions: ps });

    case 'kicknum':
      if (!bot.restrict) return conn.reply(m.chat, `${emoji} Este comando está deshabilitado por el propietario del bot.`, m);
      if (!isBotAdmin) return conn.reply(m.chat, `${emoji2} El bot no es administrador del grupo.`, m);

      await conn.reply(m.chat, `♻️ Iniciando eliminación de usuarios con el prefijo +${lol}...`, m);

      const ownerGroup = m.chat.split`-`[0] + '@s.whatsapp.net';

      for (const user of ps) {
        const numero = user.split('@')[0];

        // Verificaciones para evitar eliminar al owner o al bot
        if (
          user === ownerGroup ||
          user === conn.user.jid ||
          global.owner.includes(numero) ||
          user === isSuperAdmin
        ) continue;

        try {
          await delay(2000);
          const res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
          if (res[0]?.status === '404') {
            const errorMsg = `@${numero} ya fue eliminado o salió del grupo.`;
            await conn.reply(m.chat, errorMsg, m, { mentions: [user] });
          }
          await delay(3000);
        } catch (e) {
          const errorMsg = `❌ No se pudo eliminar a @${numero}`;
          await conn.reply(m.chat, errorMsg, m, { mentions: [user] });
        }
      }

      break;
  }
};

handler.command = ['kicknum', 'listnum', 'listanum'];
handler.group = true;
handler.botAdmin = true;
handler.admin = true;
handler.fail = null;

export default handler;