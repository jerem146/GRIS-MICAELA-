/* 
- tagall By Angel-OFC  
- etiqueta en un grupo a todos
- https://whatsapp.com/channel/0029VaJxgcB0bIdvuOwKTM2Y
*/
const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🍫';
  m.react(customEmoji);
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }
  const pesan = args.join` `;
  const oi = `*» INFO :* ${pesan}`;
  let teks = `*[ ! ] Invocando a los integrantes del grupo*\n\n*${botname}* *~> Invocador* : _${m.sender.split('@')[0]}_\n*~> Mensaje* : _${pesan}_\n\n`;
  teks += participants.map((mem) => `╠➥ @${mem.id.split('@')[0]}`).join('\n');
  teks = `╔═══ஜ۩۞۩ஜ═══╗\n` + teks + `\n╚═══════════`;
  conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) });
};