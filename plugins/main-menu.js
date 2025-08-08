let handler = async (m, { conn, args }) => {
let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
let user = global.db.data.users[userId]
let name = conn.getName(userId)
let _uptime = process.uptime() * 1000
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    
let txt = `୨♡୧ 𝑯𝒐𝒍𝒊𝒘𝒂, soy *${botname}* 💖
︶︶︶︶︶︶︶︶︶︶︶
𓆩♡𓆪 Bienvenida a mi menú, bombón~
╭─❥
│💋 *Cliente:* @${userId.split('@')[0]}
│💗 *Modo:* Público (disponible 24/7 😘)
│👠 *Soy:* ${(conn.user.jid == global.conn.user.jid ? 'Bot Principal 🩷' : 'Bot Secundaria 💅')}
│⏳ *Encendida hace:* ${uptime}
│🌸 *Usuarios bellos:* ${totalreg}
│🧃 *Comandos:* ${totalCommands} listos para ti
│✨ *Motor:* Baileys Multi Device
╰───────────────୨୧

🍓 ¿Quieres que sea hot corazón 😘
⋆｡°✩ 𝑴𝒊 𝒑𝒆𝒒𝒖𝒆ñ𝒐 𝒍𝒖𝒄𝒆𝒓𝒊𝒕𝒐 ✩°｡⋆  
❝ 𓆩『 𝐁𝐮𝐬𝐜𝐚𝐝𝐨𝐫𝐞𝐬 』𓆪 ❞  
♡̶⃝ 𝒑𝒂𝒓𝒂 𝒒𝒖𝒆 𝒏𝒂𝒅𝒂 𝒔𝒆 𝒕𝒆 𝒆𝒔𝒄𝒂𝒑𝒆... ♡̶⃝

✿ *#tiktoksearch • #tiktoks*  
╰⨯ 𝒄𝒂𝒛𝒂 𝒍𝒐𝒔 𝒗𝒊𝒅𝒆í𝒕𝒐𝒔 𝒎á𝒔 𝒉𝒐𝒕 𝒅𝒆 𝑻𝒊𝒌𝑻𝒐𝒌 💦

✿ *#tweetposts*  
╰⨯ 𝒑𝒐𝒔𝒕𝒔 𝒑𝒊𝒄𝒂𝒏𝒕𝒆𝒔 𝒅𝒆 𝑿, 𝒔𝒊𝒎𝒑𝒍𝒆𝒔𝒎𝒆𝒏𝒕𝒆 𝒖𝒇...

✿ *#ytsearch • #yts*  
╰⨯ 𝒃𝒖𝒔𝒄𝒂 𝒆𝒍 𝒗𝒊𝒅𝒆𝒐 𝒒𝒖𝒆 𝒕𝒆 𝒉𝒂𝒄𝒆 𝒃𝒂𝒊𝒍𝒂𝒓 🎶

✿ *#githubsearch*  
╰⨯ 𝒑𝒓𝒐𝒈𝒓𝒂𝒎𝒂𝒅𝒐𝒓𝒆𝒔 𝒚 𝒄𝒐𝒅𝒊𝒈𝒐𝒔, 𝒃𝒖𝒆𝒏𝒐𝒔 𝒚 𝒉𝒂𝒄𝒌𝒆𝒓𝒔 😈

✿ *#cuevana • #cuevanasearch*  
╰⨯ 𝒑𝒂𝒍 𝒑𝒂𝒍𝒐𝒎𝒊𝒕𝒂𝒔 𝒚 𝒖𝒏 𝒑𝒍𝒂𝒏 𝒔𝒐𝒂𝒗𝒆 𝒆𝒏 𝒕𝒖 𝒄𝒂𝒎𝒂 🍿

✿ *#google*  
╰⨯ 𝒆𝒍 𝒃𝒖𝒔𝒄𝒂𝒅𝒐𝒓 𝒅𝒆 𝒕𝒖𝒔 𝒑𝒆𝒄𝒂𝒅𝒊𝒕𝒐𝒔 😏

✿ *#pin • #pinterest*  
╰⨯ 𝒇𝒐𝒕𝒊𝒕𝒐𝒔 𝒆𝒏𝒄𝒂𝒏𝒕𝒂𝒅𝒐𝒓𝒂𝒔 𝒚 𝒂𝒓𝒕 🎀

✿ *#imagen • #image*  
╰⨯ 𝒃𝒖𝒔𝒄𝒂 𝒆𝒏 𝑮𝒐𝒐𝒈𝒍𝒆 𝒍𝒐 𝒒𝒖𝒆 𝒕𝒆 𝒆𝒏𝒕𝒆𝒓𝒏𝒆𝒄𝒆 𝒐 𝒆𝒙𝒄𝒊𝒕𝒂 😚

✿ *#infoanime*  
╰⨯ 𝒕𝒖 𝒘𝒂𝒊𝒇𝒖 𝒕𝒆 𝒆𝒔𝒑𝒆𝒓𝒂 𝒆𝒏 𝒍𝒂 𝒑𝒂𝒏𝒕𝒂𝒍𝒍𝒂 ✧

✿ *#hentaisearch • #searchhentai*  
╰⨯ 𝒔𝒖𝒔𝒑𝒊𝒓𝒐𝒔 𝒚 𝒈𝒆𝒎𝒊𝒅𝒐𝒔 𝒅𝒆 𝒕𝒖 𝒂𝒏𝒊𝒎𝒆... 💦

✿ *#xnxxsearch • #xnxxs*  
╰⨯ 𝒍𝒐 𝒉𝒖𝒎𝒆𝒅𝒐 𝒚 𝒓𝒊𝒄𝒐 𝒆𝒔𝒕á 𝒂 𝒖𝒏 𝒄𝒍𝒊𝒄 😳

✿ *#xvsearch • #xvideossearch*  
╰⨯ 𝒍𝒐𝒔 𝒎𝒐𝒎𝒆𝒏𝒕𝒐𝒔 𝒉𝒐𝒕 𝒒𝒖𝒆 𝒕𝒆 𝒑𝒐𝒏𝒆𝒏 𝒓𝒐𝒋𝒂 😈

✿ *#pornhubsearch • #phsearch*  
╰⨯ 𝒍𝒐𝒔 𝒔𝒆𝒄𝒓𝒆𝒕𝒐𝒔 𝒎á𝒔 𝒉𝒐𝒕 𝒅𝒆𝒍 𝒊𝒏𝒕𝒆𝒓𝒏𝒆𝒕 🔥

✿ *#npmjs*  
╰⨯ 𝒍𝒐 𝒕𝒆𝒄𝒏𝒐𝒍ó𝒈𝒊𝒄𝒐 𝒕𝒂𝒎𝒃𝒊é𝒏 𝒆𝒔 𝒔𝒆𝒙𝒚 💻

⋆｡°✩ 𝑴𝒊 𝒔𝒆𝒙𝒚 𝒎𝒆𝒏𝒖, 𝒔𝒊𝒆𝒎𝒑𝒓𝒆 𝒑𝒂𝒓𝒂 𝒕𝒊… ✩°｡⋆

✦˖°⌜ 💸 𝑬𝒄𝒐𝒏𝒐𝒎𝒊́𝒂 & 𝑹𝑷𝑮 𝒉𝒐𝒕 ⌟°˖✦  
❝ 𝒈𝒂𝒏𝒂 𝒅𝒊𝒏𝒆𝒓𝒊𝒕𝒐, 𝒓𝒐𝒃𝒂 𝒄𝒐𝒓𝒂𝒛𝒐𝒏𝒆𝒔... 𝒐 𝒒𝒖𝒆𝒎𝒂 𝒐𝒓𝒐 💋 ❞

୨୧ *#w • #work • #trabajar*  
↳ 💼 Ponte sexy y trabaja por ${moneda}

୨୧ *#slut • #prostituirse*  
↳ 💋 Usa tus encantos... gana ${moneda} como solo tú sabes 😈

୨୧ *#cf • #suerte*  
↳ 🎲 Juega cara o cruz… ¡y que la suerte te bese!

୨୧ *#crime • #crimen*  
↳ 🖤 Ladrón de noche… o de pasiones 💸

୨୧ *#ruleta • #roulette • #rt*  
↳ ❤️🖤 Apuesta al rojo... o al negro... como tu mood 😘

୨୧ *#casino • #apostar*  
↳ 🎰 Bienvenida al pecado: el casino es tuyo, baby.

୨୧ *#slot*  
↳ 🍒 Prueba suerte con estilo, muñeca.

୨୧ *#cartera • #wallet*  
↳ 💖 Mira cuánto tienes en tu bolsita caliente.

୨୧ *#banco • #bank*  
↳ 🏦 Guarda tus ${moneda}… o escóndelos de los ladrones 💅

୨୧ *#deposit • #depositar • #d*  
↳ 💎 Deposita lo que quieras... menos mi amor 😘

୨୧ *#with • #retirar • #withdraw*  
↳ 💳 Retira tus ${moneda} y gástalos en placer.

୨୧ *#transfer • #pay*  
↳ 💌 Regálale un poco de amor (o XP) a alguien~

୨୧ *#miming • #minar • #mine*  
↳ ⛏️ Baja y cava, cariño. El tesoro espera.

୨୧ *#buyall • #buy*  
↳ 🛍️ Gasta XP como una reina 👑

୨୧ *#daily • #diario*  
↳ 💞 Reclamita diaria para tu nena consentida 💋

୨୧ *#cofre*  
↳ 🎁 Un cofrecito lleno de sorpresas traviesas~

୨୧ *#weekly • #semanal*  
↳ 📆 Cada semana... te espero con un regalito 💌

୨୧ *#monthly • #mensual*  
↳ 🌙 Mes nuevo, juguetito nuevo 😈

୨୧ *#steal • #robar • #rob*  
↳ 🔓 Roba a otros... y a mí, si puedes~

୨୧ *#robarxp • #robxp*  
↳ ✨ ¿XP ajeno? Mmm, atrevida tú~

୨୧ *#eboard • #baltop*  
↳ 🏆 Ranking de los más ricos… y quizás los más calientes 💶

୨୧ *#aventura • #adventure*  
↳ 🗺️ Aventúrate en mi reino mágico RPG~ ⚔️

୨୧ *#curar • #heal*  
↳ 💊 Recupérate, bombón. Aún hay dragones por vencer.

୨୧ *#cazar • #hunt • #berburu*  
↳ 🐺 ¡A cazar tesoros… y pecados!

୨୧ *#inv • #inventario*  
↳ 🎒 Mira todos tus ítems y prepárate para lo que venga~

୨୧ *#mazmorra • #explorar*  
↳ 🕸️ Una dungeon sexy espera por ti, valiente~

୨୧ *#halloween*  
↳ 🎃 Truco o trato... yo soy ambos.

୨୧ *#christmas • #navidad*  
↳ 🎄 Regalos envueltos en moñitos (como yo 💝)

｡･:*:･ﾟ★,｡･:*:･ﾟ☆ 𝑬𝒔𝒕𝒂 𝒃𝒐𝒕 𝒆𝒔 𝒎𝒂́𝒔 𝒓𝒊𝒄𝒂 𝒄𝒖𝒂𝒏𝒅𝒐 𝒋𝒖𝒆𝒈𝒂𝒔 𝒄𝒐𝒏 𝒆𝒍𝒍𝒂… 💋

✦— 𓆩『 👑 𝐌𝐞𝐧𝐮́ 𝐆𝐫𝐮𝐩𝐨𝐬 』𓆪 —✦

🌸 ʚ Gestión con estilo y poder 💋

💌 #hidetag  
↳ Menciona a tod@s en silencio 🤫

📄 #infogrupo | #gp  
↳ Muestra info sexy del grupo 💅

📡 #listonline  
↳ ¿Quién anda conectad@, amor? 🌐

🎀 #setwelcome | #setbye  
↳ Personaliza bienvenidas y despedidas 🌈

🔗 #link | #revoke  
↳ Comparte o reinicia el enlace del grupo 💞

🛡️ #admins | #kick | #add  
↳ Menciona, saca o agrega usuarios 🧤

📢 #grupo open / close  
↳ Abre o cierra el chat del grupo ✨

👑 #promote | #demote  
↳ Admins van... admins vienen 💼

🖼️ #gpbanner | #gpname | #gpdesc  
↳ ¡Cambia imagen, nombre o descripción! 🎨

🚫 #warn | #unwarn | #advlist  
↳ Advertencias en modo cute pero firme 💢

💬 #mute | #unmute  
↳ Silencia o deja hablar a alguien 😼

🗳️ #poll  
↳ Haz encuestas kawaii 📝

🧹 #delete  
↳ Elimina mensajitos no deseados 💣

👻 #fantasmas | #kickfantasmas  
↳ Limpia los inactivos del grupo 🧼

💞 #tagall | #invocar  
↳ ¡Todos presentes, bebés! 😘

🌟 #setemoji  
↳ Cambia el emoji del grupo 🌺

🌍 #listnum | #kicknum  
↳ Adiós usuarios de ciertos países 🌐

╭˚♡༉『 🍓 𝐆𝐚𝐜𝐡𝐚 ✧彡』༉♡˚╮
│
│ ⌗ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐩𝐚𝐫𝐚 𝐥𝐚𝐬 𝐜𝐚𝐳𝐚𝐝𝐨𝐫𝐚𝐬 𝐝𝐞 𝐖𝐚𝐢𝐟𝐮𝐬 ♡
│
│ 💌 #rollwaifu | #rw | #roll
│ ⊹ Saca una waifu o husbando aleatorio 💘
│
│ 💍 #claim | #c | #reclamar
│ ⊹ Reclama ese personaje antes que te lo ganen 💋
│
│ 💕 #harem | #waifus | #claims
│ ⊹ Mira a tus amores atrapados 💞
│
│ 📷 #charimage | #waifuimage | #wimage
│ ⊹ Mira su fotito toda kawaii 📸
│
│ 📖 #charinfo | #winfo | #waifuinfo
│ ⊹ Toda la info de tu waifu/husbando favorito ✨
│
│ 🎁 #givechar | #givewaifu | #regalar
│ ⊹ Comparte el amor regalando un personaje 💝
│
│ 🔥 #vote | #votar
│ ⊹ Sube el valor de tu personaje fav 💦
│
│ 🌸 #waifusboard | #waifustop | #topwaifus
│ ⊹ El ranking de las waifus más deseadas 💎
│
╰⊱♡⸝⸝ Gracias por jugar conmigo, mi amor~ ˚₊‧꒰ა 🍒 ໒꒱ ‧₊˚

╭─❀⃟𖣔⃟𖣔⃟𖣔⃟『 💮 𝐒𝐓𝐈𝐂𝐊𝐄𝐑𝐒 💮 』𖣔⃟𖣔⃟𖣔⃟❀─╮
│
│ ✿ 𝘾𝙤𝙢𝙖𝙣𝙙𝙤𝙨 𝙥𝙖𝙧𝙖 𝙘𝙧𝙚𝙖𝙧 𝙨𝙩𝙞𝙘𝙠𝙚𝙧𝙨 𝙠𝙖𝙬𝙖𝙞 ✨
│
│ 💕 *#sticker*  • *#s*
│ ╰› 🧃 De imagen o video → sticker~
│
│ 💋 *#setmeta*
│ ╰› Personaliza tu pack con autor 🍓
│
│ 💄 *#delmeta*
│ ╰› Elimina los datos de tu pack 💅
│
│ 💫 *#pfp*  • *#getpic*
│ ╰› Foto de perfil de algún contacto 😘
│
│ 💌 *#qc*
│ ╰› Sticker de texto/usuario en burbuja 💭
│
│ 💖 *#toimg*  • *#img*
│ ╰› Sticker a imagen sensual 🌸
│
│ 🍓 *#brat*  • *#ttp*  • *#attp*
│ ╰› Sticker animado con texto~ 💞
│
│ 🌈 *#emojimix*
│ ╰› Fusiona 2 emojis 🦄🍒
│
│ 💍 *#wm*
│ ╰› Cambia autor/pack con tu estilo 💗
╰───────⊹୨💖୧⊹───────╯

✦— 𓆩『 💋 𝐇𝐞𝐫𝐫𝐚𝐦𝐢𝐞𝐧𝐭𝐚𝐬 𝐇𝐎𝐓 💄 』𓆪 —✦

🌸 ʚ Funciones traviesas pero útiles 😈

💦 #cal | #calcular  
↳ Déjame resolverte... ecuaciones 📉

🔥 #tiempo | #clima  
↳ ¿Calor o frío? Yo siempre estoy ardiente ☀️❄️

🕰️ #horario  
↳ El tiempo pasa... y yo contigo ⏳

💋 #fake | #fakereply  
↳ Juguemos a lo prohibido... chats falsos 😏

💖 #hd | #remini  
↳ Te dejo aún más nítido y sexy 😘

🎶 #letra  
↳ Tus canciones, mis susurros 🎧💋

👁️ #read | #ver  
↳ Lo que era secreto, ahora lo vemos juntos 🔥

🔍 #shazam | #whatmusic  
↳ Te digo qué suena... y qué me enciende 😼

📸 #ssweb  
↳ Capturo todo... incluso tus deseos 👄

🔁 #tamaño  
↳ Yo ajusto lo que tú me pidas... 👀

👅 #say + texto  
↳ Déjame decirlo por ti, pero más rico 💬💄

🫦 #todoc  
↳ Creo documentos... o fantasías 😽

🌹 #trad  
↳ Traduce, pero con pasión 💞

✦— 𓆩『 🌸 𝐌𝐞𝐧𝐮́ 𝐀𝐧𝐢𝐦𝐞 』𓆪 —✦

🌺 ʚ Reacciones anime cute & atrevidas 🍥

😠 #angry | #enojado  
↳ Enójate con estilo 💢

🩷 #bite  
↳ Muerde con cariño (o no tanto) 😈

😝 #bleh  
↳ Saca la lengua traviesa 😛

🥰 #blush  
↳ Te sonrojas como waifu tímida ✨

🥱 #bored | #aburrido  
↳ Qué flojera... 💤

😭 #cry  
↳ Lágrimas dramáticas de anime 😭

🫂 #cuddle  
↳ ¡Un abracito tierno! 🧸

💃 #dance  
↳ Baila como si nadie mirara 💃

🍷 #drunk  
↳ Un poco ebria pero linda 😵‍💫

🍙 #eat | #comer  
↳ Ñam ñam, ¡delicioso! 🍜

🤦 #facepalm  
↳ ¿En serio dijiste eso? 🙄

😁 #happy | #feliz  
↳ Saltitos de alegría 🌈

💞 #hug  
↳ Abrazos que derriten corazones 🫶

💦 #impregnate | #preg  
↳ Solo si estás lista… 👀🔥

🔪 #kill  
↳ Modo yandere ON 😈🔪

💋 #kiss | #besar | #kiss2  
↳ ¡Muack! Besito coqueto 💋

🤣 #laugh  
↳ Ríete sin piedad 😂

👅 #lick  
↳ Lamer, pero en plan anime 🔥

💘 #love | #amor  
↳ Cupido flechó de nuevo 🏹

🐾 #pat  
↳ Acaricia como neko 🐱

👉 #poke  
↳ Poke poke~ ☝️

😤 #pout  
↳ Haciendo pucheros 💢

👊 #punch  
↳ Toma esto~ 👊

🏃 #run  
↳ ¡Corre, que te pillan! 🏃‍♀️

😢 #sad | #triste  
↳ Dramática y adorable 🥺

😨 #scared  
↳ ¡Tengo miedo! 🫣

🔥 #seduce  
↳ Modo seductora activado 😘💦

😳 #shy | #timido  
↳ Me pongo rojita 🥹

🖐 #slap  
↳ ¡Pum! Bofetón con glamour 💅

🌞 #dias | 🌙 #noches  
↳ Buenos días o dulces sueños ✨

😴 #sleep  
↳ Hora de mimir 💤

🚬 #smoke  
↳ Fumando con estilo (o peligro) 😌

🧠 #think  
↳ Pensando en ti~ 🤔💭


╭───〔💋 𝐍𝐒𝐅𝐖 ─ 𝙃𝙤𝙩 +𝟏𝟖 〕───╮
│ 🍓 *#anal* + @user
│     ↳ Sexo anal
│ 🍑 *#blowjob* / *#bj* + @user
│     ↳ Mamada
│ 🍒 *#fuck* / *#coger* + @user
│     ↳ Follar
│ 🛁 *#bath* + @user
│     ↳ Bañarse juntos
│ 🍥 *#boobjob* + @user
│     ↳ Rusa
│ 💦 *#cum* + @user
│     ↳ Venirse en alguien
│ 🥵 *#fap* + @user
│     ↳ Masturbarse
│ 🦶 *#footjob* + @user
│     ↳ Paja con pies
│ 😘 *#kiss* / *#undress* + @user
│     ↳ Beso / Desnudar
│ 🍷 *#69* + @user
│     ↳ Posición 69
│ 🍇 *#spank* + @user
│     ↳ Nalgada
│ 🧴 *#lickpussy* + @user
│     ↳ Lamer
│ 🐾 *#grabboobs* / *#suckboobs* + @user
│     ↳ Tocar / Chupar
│ ☕ *#cafe*
│     ↳ Tómate algo sexy con alguien
│ 🎀 *#yuri* / *#tijeras* + @user
│     ↳ Chicas traviesas
│ 🌸 *#waifu*
│     ↳ Busca tu waifu hot
│ 🔍 *#rule34* + [tags]
│     ↳ Buscar imágenes +18
│ 💖 *#ppcouple* / *#ppcp*
│     ↳ Imágenes para parejas
╰───────────────⟢

╭───〔🎮 𝐉𝐔𝐄𝐆𝐎𝐒 — 𝙁𝙪𝙣 & 𝙁𝙡𝙞𝙧𝙩〕───╮
│ 🧡 *#amistad* / *#amigorandom*
│     ↳ Haz un nuevo amigo
│ 🤝 *#formarpareja* / *#formarpareja5*
│     ↳ Crea parejas o grupitos
│ 💞 *#ship* / *#pareja* + @user
│     ↳ ¿Son el uno para el otro?
│ 🫦 *#paja* / *#pajeame*
│     ↳ La bot se pone traviesa contigo
│ 😏 *#chupalo* + @user
│     ↳ Que te la chupe 👀
│ 🍳 *#chaqueta* / *#jalamela*
│     ↳ Hazte una 😳
│ 🤭 *#piropo*
│     ↳ Un cumplido travieso
│ 💬 *#pregunta*
│     ↳ Pregúntame lo que quieras~
│ 😂 *#chiste* / *#meme*
│     ↳ Ríete un rato
│ 🧠 *#iq* / *#iqtest* + @user
│     ↳ ¿Listo o solo guapo?
│ 🧩 *#ahorcado* / *#ppt* / *#mates*
│     ↳ Juega y gana~
│ ✨ *#top* / *#sorteo*
│     ↳ Participa en el ranking o sorteos
│ 👀 *#personalidad* + @user
│     ↳ ¿Cómo eres realmente?
│ 🔮 *#consejo* / *#frase* / *#facto*
│     ↳ Palabras sabias de tu bot
│ 🎭 *#nombreninja*
│     ↳ Tu alias oculto
│ 🔠 *#morse*
│     ↳ Traductor misterioso
│ 🔫 *#doxear* + @user
│     ↳ Doxeo falso (diversión dark)
│ 🧂 *#marron* + @user
│     ↳ Humor negro (usa con cuidado)
│ 💔 *#suicidar*
│     ↳ Bot dramática 💔
│ 🥚 *#huevo* + @user
│     ↳ Tócale el huevito 🥚😳
│ 👏 *#aplauso* + @user
│     ↳ Aplaude como se merece
│ 🤺 *#pvp* / *#suit* + @user
│     ↳ Combate de bots
│ 🧩 *#sopa* / *#buscarpalabra*
│     ↳ Sopa de letras 🔍
│ 🔄 *#ttt*
│     ↳ Crea una sala de juego
╰───────────────⟢

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
}}}, { quoted: m })
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
