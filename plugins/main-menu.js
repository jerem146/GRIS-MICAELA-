let handler = async (m, { conn, args }) => {
let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
let user = global.db.data.users[userId]
let name = conn.getName(userId)
let _uptime = process.uptime() * 1000
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

let txt = `⌬━━━━▣━━◤◉‿◉◢━━▣━━━━━⌬

Hola *@${userId.split('@')[0]}* soy *${botname}*

╔══════⌬『 𝑰 𝑵 𝑭 𝑶 』
║ ✎ *Cliente:* @${userId.split('@')[0]}
║ ✎ *Bot:* ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Secundaria 💅')}
║ ✎ *Modo:* Privado 
║ ✎ *Usuarios »* ${totalreg}
║ ✎ *Tiempo Activo:* ${uptime}
║ ✎ *Comandos »* ${totalCommands}
╚══════ ♢.💥.♢ ══════➤

*sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
https://whatsapp.com/channel/0029Vb6LUgzJZg3yFilYpy1v

◤━━━━━ ☆. 🌀 .☆ ━━━━━◥
⚙ *𝑳𝑰𝑺𝑻𝑨 𝑫𝑬 𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺*

*┏━━━━▣━━⌬〘 BUSCADORES 🔍 〙*
∫➤ /tiktoksearch  
∫➤ /tiktoks  
∫➤ /tweetposts  
∫➤ /ytsearch  
∫➤ /yts  
∫➤ /githubsearch  
∫➤ /cuevana  
∫➤ /cuevanasearch  
∫➤ /google  
∫➤ /pin  
∫➤ /pinterest  
∫➤ /imagen  
∫➤ /image  
∫➤ /infoanime  
∫➤ /hentaisearch  
∫➤ /searchhentai  
∫➤ /xnxxsearch  
∫➤ /xnxxs  
∫➤ /xvsearch  
∫➤ /xvideossearch  
∫➤ /pornhubsearch  
∫➤ /phsearch  
∫➤ /npmjs  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*

*┏━━━━▣━━⌬〘 GRUPO - ADMINS 🛡️ 〙*
∫➤ /hidetag  
∫➤ /tag  
∫➤ /gp  
∫➤ /infogrupo  
∫➤ /linea  
∫➤ /listonline  
∫➤ /setwelcome  
∫➤ /setbye  
∫➤ /link  
∫➤ /admins  
∫➤ /admin  
∫➤ /restablecer  
∫➤ /revoke  
∫➤ /grupo  
∫➤ /gruop  
∫➤ /group  
∫➤ /kick  
∫➤ /add  
∫➤ /añadir  
∫➤ /agregar  
∫➤ /promote  
∫➤ /demote  
∫➤ /gpbanner  
∫➤ /groupimg  
∫➤ /gpname  
∫➤ /groupname  
∫➤ /gpdesc  
∫➤ /groupdesc  
∫➤ /advertir  
∫➤ /warn  
∫➤ /warning  
∫➤ /unwarn  
∫➤ /delwarn  
∫➤ /advlist  
∫➤ /listadv  
∫➤ /bot on  
∫➤ /bot off  
∫➤ /mute  
∫➤ /unmute  
∫➤ /encuesta  
∫➤ /poll  
∫➤ /delete  
∫➤ /del  
∫➤ /fantasmas  
∫➤ /kickfantasmas  
∫➤ /invocar  
∫➤ /tagall  
∫➤ /todos  
∫➤ /setemoji  
∫➤ /setemo  
∫➤ /listnum  
∫➤ /kicknum  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*

*┏━━━━▣━━⌬〘 DESCARGAS 📥 〙*
∫➤ /tiktok  
∫➤ /tt  
∫➤ /mediafire  
∫➤ /mf  
∫➤ /pinvid  
∫➤ /pin  
∫➤ /pinterest  
∫➤ /pinvideo  
∫➤ /mega  
∫➤ /mg  
∫➤ /play  
∫➤ /ytmp3  
∫➤ /ytmp4  
∫➤ /fb  
∫➤ /facebook  
∫➤ /twitter  
∫➤ /x  
∫➤ /ig  
∫➤ /instagram  
∫➤ /tts  
∫➤ /tiktoks  
∫➤ /terabox  
∫➤ /tb  
∫➤ /ttimg  
∫➤ /ttmp3  
∫➤ /gitclone  
∫➤ /xvideosdl  
∫➤ /xnxxdl  
∫➤ /apk  
∫➤ /modapk  
∫➤ /tiktokrandom  
∫➤ /ttrandom  
∫➤ /npmdl  
∫➤ /npmdownloader  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*

*┏━━━━▣━━⌬〘 ECONOMÍA 💰 〙*
∫➤ /w  
∫➤ /work  
∫➤ /trabajar  
∫➤ /slut  
∫➤ /protituirse  
∫➤ /cf  
∫➤ /suerte  
∫➤ /crime  
∫➤ /crimen  
∫➤ /ruleta  
∫➤ /roulette  
∫➤ /rt  
∫➤ /casino  
∫➤ /apostar  
∫➤ /slot  
∫➤ /cartera  
∫➤ /wallet  
∫➤ /banco  
∫➤ /bank  
∫➤ /deposit  
∫➤ /depositar  
∫➤ /d  
∫➤ /with  
∫➤ /retirar  
∫➤ /withdraw  
∫➤ /transfer  
∫➤ /pay  
∫➤ /miming  
∫➤ /minar  
∫➤ /mine  
∫➤ /buyall  
∫➤ /buy  
∫➤ /daily  
∫➤ /diario  
∫➤ /cofre  
∫➤ /weekly  
∫➤ /semanal  
∫➤ /monthly  
∫➤ /mensual  
∫➤ /steal  
∫➤ /robar  
∫➤ /rob  
∫➤ /robarxp  
∫➤ /robxp  
∫➤ /eboard  
∫➤ /baltop  
∫➤ /aventura  
∫➤ /adventure  
∫➤ /curar  
∫➤ /heal  
∫➤ /cazar  
∫➤ /hunt  
∫➤ /berburu  
∫➤ /inv  
∫➤ /inventario  
∫➤ /mazmorra  
∫➤ /explorar  
∫➤ /halloween  
∫➤ /christmas  
∫➤ /navidad  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*

*┏━━━━▣━━⌬〘 GACHA 🎴 〙*
∫➤ /rollwaifu  
∫➤ /rw  
∫➤ /roll  
∫➤ /claim  
∫➤ /c  
∫➤ /reclamar  
∫➤ /harem  
∫➤ /waifus  
∫➤ /claims  
∫➤ /charimage  
∫➤ /waifuimage  
∫➤ /wimage  
∫➤ /charinfo  
∫➤ /winfo  
∫➤ /waifuinfo  
∫➤ /givechar  
∫➤ /givewaifu  
∫➤ /regalar  
∫➤ /vote  
∫➤ /votar  
∫➤ /waifusboard  
∫➤ /waifustop  
∫➤ /topwaifus  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*

*┏━━━━▣━━⌬〘 STICKERS ✨ 〙*
∫➤ /sticker  
∫➤ /s  
∫➤ /setmeta  
∫➤ /delmeta  
∫➤ /pfp  
∫➤ /getpic  
∫➤ /qc  
∫➤ /toimg  
∫➤ /img  
∫➤ /brat  
∫➤ /ttp  
∫➤ /attp  
∫➤ /emojimix  
∫➤ /wm  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*

*┏━━━━▣━━⌬〘 CONVERTIDORES ⚡ 〙*
∫➤ /calcular  
∫➤ /cal  
∫➤ /tiempo  
∫➤ /clima  
∫➤ /horario  
∫➤ /fake  
∫➤ /fakereply  
∫➤ /enhance  
∫➤ /remini  
∫➤ /hd  
∫➤ /letra  
∫➤ /read  
∫➤ /readviewonce  
∫➤ /ver  
∫➤ /whatmusic  
∫➤ /shazam  
∫➤ /ss  
∫➤ /ssweb  
∫➤ /length  
∫➤ /tamaño  
∫➤ /say  
∫➤ /decir  
∫➤ /todoc  
∫➤ /toducument  
∫➤ /translate  
∫➤ /traducir  
∫➤ /trad  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*

*┏━━━━▣━━⌬〘 PERFÍL 📝 〙*
∫➤ /profile  
∫➤ /marry  
∫➤ /divorce  
∫➤ /setgenre  
∫➤ /setgenero  
∫➤ /delgenre  
∫➤ /delgenero  
∫➤ /setbirth  
∫➤ /setnacimiento  
∫➤ /delbirth  
∫➤ /delnacimiento  
∫➤ /setdescription  
∫➤ /setdesc  
∫➤ /deldescription  
∫➤ /deldesc  
∫➤ /lb  
∫➤ /lboard  
∫➤ /confesiones  
∫➤ /confesar  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*

*┏━━━━▣━━⌬〘 ANIMÉ ✨ 〙*
∫➤ /angry  
∫➤ /enojado  
∫➤ /bite  
∫➤ /bleh  
∫➤ /blush  
∫➤ /bored  
∫➤ /aburrido  
∫➤ /cry  
∫➤ /cuddle  
∫➤ /dance  
∫➤ /drunk  
∫➤ /eat  
∫➤ /comer  
∫➤ /facepalm  
∫➤ /happy  
∫➤ /feliz  
∫➤ /hug  
∫➤ /impregnate  
∫➤ /preg  
∫➤ /kill  
∫➤ /kiss  
∫➤ /besar  
∫➤ /kiss2  
∫➤ /laugh  
∫➤ /lick  
∫➤ /love  
∫➤ /amor  
∫➤ /pat  
∫➤ /poke  
∫➤ /pout  
∫➤ /punch  
∫➤ /run  
∫➤ /sad  
∫➤ /triste  
∫➤ /scared  
∫➤ /seduce  
∫➤ /shy  
∫➤ /timido  
∫➤ /slap  
∫➤ /dias  
∫➤ /days  
∫➤ /noches  
∫➤ /nights  
∫➤ /sleep  
∫➤ /smoke  
∫➤ /think  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*

*┏━━━━▣━━⌬〘 NSFW 🔥 〙*
∫➤ /anal  
∫➤ /waifu  
∫➤ /bath  
∫➤ /blowjob  
∫➤ /mamada  
∫➤ /bj  
∫➤ /boobjob  
∫➤ /cum  
∫➤ /fap  
∫➤ /ppcouple  
∫➤ /ppcp  
∫➤ /footjob  
∫➤ /fuck  
∫➤ /coger  
∫➤ /fuck2  
∫➤ /cafe  
∫➤ /coffe  
∫➤ /violar  
∫➤ /perra  
∫➤ /grabboobs  
∫➤ /grop  
∫➤ /lickpussy  
∫➤ /rule34  
∫➤ /r34  
∫➤ /sixnine  
∫➤ /69  
∫➤ /spank  
∫➤ /nalgada  
∫➤ /suckboobs  
∫➤ /undress  
∫➤ /encuerar  
∫➤ /yuri  
∫➤ /tijeras  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*

*┏━━━━▣━━⌬〘 JUEGOS 🎮 〙*
∫➤ /amistad  
∫➤ /amigorandom  
∫➤ /chaqueta  
∫➤ /jalamela  
∫➤ /chiste  
∫➤ /consejo  
∫➤ /doxeo  
∫➤ /doxear  
∫➤ /facto  
∫➤ /formarpareja  
∫➤ /formarpareja5  
∫➤ /frase  
∫➤ /huevo  
∫➤ /chupalo  
∫➤ /aplauso  
∫➤ /marron  
∫➤ /suicidar  
∫➤ /iq  
∫➤ /iqtest  
∫➤ /meme  
∫➤ /morse  
∫➤ /nombreninja  
∫➤ /paja  
∫➤ /pajeame  
∫➤ /personalidad  
∫➤ /piropo  
∫➤ /pregunta  
∫➤ /ship  
∫➤ /pareja  
∫➤ /sorteo  
∫➤ /top  
∫➤ /formartrio  
∫➤ /ahorcado  
∫➤ /mates  
∫➤ /matematicas  
∫➤ /ppt  
∫➤ /sopa  
∫➤ /buscarpalabra  
∫➤ /pvp  
∫➤ /suit  
∫➤ /ttt  
*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*


`.trim()

await conn.sendMessage(m.chat, { 
  image: await (await fetch(banner)).buffer(),
  caption: txt,
  mentions: [userId]
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