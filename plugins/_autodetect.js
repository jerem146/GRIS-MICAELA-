let usuario = `@${m.sender.split`@`[0]}`
let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'

// Definición de los nuevos estilos de mensajes
const mensajes = {
    nombre: `📝 *¡Nuevo nombre para el grupo!* 📝\n\n> El administrador ${usuario} ha cambiado el nombre a:\n> *${m.messageStubParameters[0]}*`,
    foto: `🖼️ *¡La foto del grupo ha cambiado!* 🖼️\n\n> ${usuario} actualizó la imagen del perfil.`,
    edit: `⚙️ *Ajustes del grupo actualizados* ⚙️\n\n> ${usuario} ha configurado que *${m.messageStubParameters[0] == 'on' ? 'solo los administradores' : 'todos los participantes'}* puedan editar la información del grupo.`,
    newlink: `🔗 *¡El enlace de invitación ha cambiado!* 🔗\n\n> ${usuario} ha restablecido el enlace del grupo.`,
    status: `🚦 *Estado del grupo modificado* 🚦\n\n> El grupo ha sido *${m.messageStubParameters[0] == 'on' ? 'cerrado' : 'abierto'}* por ${usuario}.\n> Ahora, *${m.messageStubParameters[0] == 'on' ? 'solo los administradores' : 'todos los participantes'}* pueden enviar mensajes.`,
    admingp: `👑 *¡Nuevo administrador!* 👑\n\n> @${m.messageStubParameters[0].split`@`[0]} ha sido promovido a administrador por ${usuario}.`,
    noadmingp: `💔 *Un administrador menos* 💔\n\n> @${m.messageStubParameters[0].split`@`[0]} ya no es administrador. Acción realizada por ${usuario}.`
};

// Lógica para enviar el mensaje correspondiente al evento
if (chat.detect && m.messageStubType == 21) {
    await this.sendMessage(m.chat, { text: mensajes.nombre, mentions: [m.sender] }, { quoted: fkontak });
} else if (chat.detect && m.messageStubType == 22) {
    await this.sendMessage(m.chat, { image: { url: pp }, caption: mensajes.foto, mentions: [m.sender] }, { quoted: fkontak });
} else if (chat.detect && m.messageStubType == 23) {
    await this.sendMessage(m.chat, { text: mensajes.newlink, mentions: [m.sender] }, { quoted: fkontak });
} else if (chat.detect && m.messageStubType == 25) {
    await this.sendMessage(m.chat, { text: mensajes.edit, mentions: [m.sender] }, { quoted: fkontak });
} else if (chat.detect && m.messageStubType == 26) {
    await this.sendMessage(m.chat, { text: mensajes.status, mentions: [m.sender] }, { quoted: fkontak });
} else if (chat.detect && m.messageStubType == 29) {
    await this.sendMessage(m.chat, { text: mensajes.admingp, mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak });
} else if (chat.detect && m.messageStubType == 30) {
    await this.sendMessage(m.chat, { text: mensajes.noadmingp, mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak });
}
// ... (el resto de tu código)```

*/### Cambios realizados:

1.  **Agrupación de Mensajes:** Se creó un objeto `mensajes` para tener todas las plantillas de texto organizadas en un solo lugar, lo que facilita futuras modificaciones.
2.  **Uso de Emojis Temáticos:** Cada mensaje ahora comienza con un emoji que representa visualmente la acción (📝 para nombre, 🖼️ para foto, ⚙️ para ajustes, etc.).
3.  **Títulos en Negrita:** Se añadieron títulos descriptivos en negrita para que el propósito del mensaje sea claro a simple vista.
4.  **Redacción Mejorada:** Se ajustó el texto para que sea más directo y amigable, mejorando la legibilidad.
5.  **Mantenimiento de la Funcionalidad:** La lógica del código (`if/else if`) y las variables dinámicas como `usuario` y `m.messageStubParameters` se mantuvieron intactas para asegurar que todo siga funcionando como antes.

Simplemente reemplaza la sección de definición de variables de texto de tu código original con esta nueva versión para aplicar el cambio de estilo.*/