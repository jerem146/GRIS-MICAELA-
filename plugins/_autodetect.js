let usuario = `@${m.sender.split`@`[0]}`
let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'
let nombre, foto, edit, newlink, status, admingp, noadmingp
nombre = `❀ ${usuario} Ha cambiado el nombre del grupo.\n\n> ✦ Ahora el grupo se llama:\n> *${m.messageStubParameters[0]}*.`
foto = `❀ Se ha cambiado la imagen del grupo.\n\n> ✦ Acción hecha por:\n> » ${usuario}`
edit = `❀ ${usuario} Ha permitido que ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} puedan configurar el grupo.`
newlink = `❀ El enlace del grupo ha sido restablecido.\n\n> ✦ Acción hecha por:\n> » ${usuario}`
status = `❀ El grupo ha sido ${m.messageStubParameters[0] == 'on' ? '*cerrado*' : '*abierto*'} Por ${usuario}\n\n> ✦ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} pueden enviar mensaje.`
admingp = `❀ @${m.messageStubParameters[0].split`@`[0]} Ahora es admin del grupo.\n\n> ✦ Acción hecha por:\n> » ${usuario}`
noadmingp = `❀ @${m.messageStubParameters[0].split`@`[0]} Deja de ser admin del grupo.\n\n> ✦ Acción hecha por:\n> » ${usuario}`

if (chat.detect && m.messageStubType == 2) {
const uniqid = (m.isGroup ? m.chat : m.sender)
const sessionPath = './Sessions/'
for (const file of await fs.readdir(sessionPath)) {
if (file.includes(uniqid)) {
await fs.unlink(path.join(sessionPath, file))
console.log(`${chalk.yellow.bold('[ Archivo Eliminado ]')} ${chalk.greenBright(`'${file}'`)}\n` +
`${chalk.blue('(Session PreKey)')} ${chalk.redBright('que provoca el "undefined" en el chat')}`
)}}

} else if (chat.detect && m.messageStubType == 21) {
await this.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })  
} else if (chat.detect && m.messageStubType == 22) {
await this.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })
} else if (chat.detect && m.messageStubType == 23) {
await this.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })
} else if (chat.detect && m.messageStubType == 25) {
await this.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })  
} else if (chat.detect && m.messageStubType == 26) {
await this.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })  
} else if (chat.detect && m.messageStubType == 29) {
await this.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })
} else if (chat.detect && m.messageStubType == 30) {
await this.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })
} else {
if (m.messageStubType == 2) return
console.log({messageStubType: m.messageStubType,
messageStubParameters: m.messageStubParameters,
type: WAMessageStubType[m.messageStubType], 
})
}}
export default handler