let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

    let txt = `
*⌬━━━━▣━━◤◉‿◉◢━━▣━━━━━⌬*

Hola *@${userId.split('@')[0]}* soy *${botname}*

╔══════⌬『 𝑰 𝑵 𝑭 𝑶 』
║ ✎ *Cliente:* @${userId.split('@')[0]}
║ ✎ *Bot:* ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Secundario 💅')}
║ ✎ *Modo:* Público
║ ✎ *Usuarios »* ${totalreg}
║ ✎ *Tiempo Activo:* ${uptime}
║ ✎ *Comandos »* ${totalCommands}
╚══════ ♢.💥.♢ ══════➤

*sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
${redes}

*◤━━━━━ ☆. 🌀 .☆ ━━━━━◥*
⚙ *𝑳𝑰𝑺𝑻𝑨 𝑫𝑬 𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺*
    `.trim()

    await conn.sendMessage(m.chat, { 
        text: txt,
        contextInfo: {
            mentionedJid: [userId],
            externalAdReply: {                
                title: botname,
                body: textbot,
                mediaType: 1,
                mediaUrl: redes,
                sourceUrl: redes,
                thumbnail: await (await fetch(banner)).buffer(),
                showAdAttribution: false,
                containsAutoReply: true,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60)
    let minutes = Math.floor((ms / (1000 * 60)) % 60)
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    return `${hours}h ${minutes}m ${seconds}s`
}