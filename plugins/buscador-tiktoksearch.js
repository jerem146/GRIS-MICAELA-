import axios from 'axios';
const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent
} = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(message.chat, "❀ Por favor, ingrese un texto para realizar una búsqueda en TikTok.", message);
  }

  async function createVideoMessage(url) {
    const { videoMessage } = await generateWAMessageContent({
      video: { url }
    }, {
      upload: conn.waUploadToServer
    });
    return videoMessage;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  try {
    await conn.reply(message.chat, '✧ *ENVIANDO SUS RESULTADOS..*', message);

    // Llamada a la API de Starlights
    const { data } = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(text)}`);
    if (!data || !data.data || data.data.length === 0) {
      return conn.reply(message.chat, "❌ No se encontraron resultados para: " + text, message);
    }

    let searchResults = data.data;
    shuffleArray(searchResults);
    let topResults = searchResults.slice(0, 7);

    // Crear los cards del carrusel
    let results = [];
    for (let result of topResults) {
      results.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: '' }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "♡  ͜ ۬︵࣪᷼⏜݊᷼𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨⏜࣪᷼︵۬ ͜ " }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: result.title,
          hasMediaAttachment: true,
          videoMessage: await createVideoMessage(result.nowm) // video sin marca de agua
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
      });
    }

    const messageContent = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: "✧ RESULTADOS DE: " + text
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "♡  ͜ ۬︵࣪᷼⏜݊᷼𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨⏜࣪᷼︵۬ ͜ "
            }),
            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards: results
            })
          })
        }
      }
    }, { quoted: message });

    await conn.relayMessage(message.chat, messageContent.message, { messageId: messageContent.key.id });

  } catch (error) {
    console.error(error);
    conn.reply(message.chat, `⚠︎ *OCURRIÓ UN ERROR:* ${error.message}`, message);
  }
};

handler.help = ["tiktoksearch <texto>"];
handler.tags = ["buscador"];
handler.command = ["tiktoksearch", "ttss", "tiktoks"];
handler.register = false;
handler.group = true;

export default handler;