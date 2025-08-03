/* 
- tagall By Angel-OFC  
- etiqueta en un grupo a todos
- https://whatsapp.com/channel/0029VaJxgcB0bIdvuOwKTM2Y
*/
const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '';
  m.react(customEmoji);
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }
  const pesan = args.join` `;
  let teks = `*[ ! ] Invocando a los integrantes del grupo*\n\n*Gawr Gura* *BOT* *~> Invocador* : _@${m.sender.split('@')[0]}_\n*~> Mensaje* : _${pesan}_\n\n`;
  teks += `╔═══ஜ۩۞۩ஜ═══╗\n`;
  for (const mem of participants) {
    teks += `╠➥ @${mem.id.split('@')[0]}\n`;
  }
  teks += `╚═══════════`;
  conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) });
};

handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall'];
handler.admin = true;
handler.group = true;
export default handler;