export async function before(m) {
    if (!m.text || !global.prefix.test(m.text)) return

    const usedPrefix = global.prefix.exec(m.text)[0]
    const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()

    // Ignorar si el comando no empieza con una letra
    if (!/^[a-zA-Z]/.test(command)) return

    const validCommand = (command, plugins) => {
        for (let plugin of Object.values(plugins)) {
            if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)) {
                return true
            }
        }
        return false
    }

    if (!command) return
    if (command === "bot") return

    if (validCommand(command, global.plugins)) {
        let chat = global.db.data.chats[m.chat]
        let user = global.db.data.users[m.sender]    

        if (chat.isBanned) {
            const avisoDesactivado = `《✦》El bot *${botname}* está desactivado en este grupo.\n\n> ✦ Un *administrador* puede activarlo con el comando:\n> » *${usedPrefix}bot on*`
            await m.reply(avisoDesactivado)
            return
        }

        if (!user.commands) user.commands = 0
        user.commands += 1
    }
    // No mostrar nada si el comando es inválido
}