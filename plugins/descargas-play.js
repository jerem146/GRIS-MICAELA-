import yts from "yt-search";
import ytdl from "ytdl-core";
import { PassThrough } from "stream";

const ytIdRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const toSansSerifPlain = (text = "") =>
  text
    .split("")
    .map((char) => {
      const map = {
        a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
        j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
        s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
        A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨",
        J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
        S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
        0: "𝟢", 1: "𝟣", 2: "𝟤", 3: "𝟥", 4: "𝟦", 5: "𝟧", 6: "𝟨", 7: "𝟩", 8: "𝟪", 9: "𝟫"
      };
      return map[char] || char;
    })
    .join("");

const formatViews = (views) => {
  if (views == null) return "Desconocido";
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
  return views.toString();
};

const safeSend = async (conn, chat, message, opts = {}) => {
  try {
    await conn.sendMessage(chat, message, opts);
  } catch (e) {
    console.warn("sendMessage fallo:", e?.message || e);
  }
};

const handler = async (m, { conn, text, command }) => {
  const query = (text || "").trim();
  if (!query) return m.reply(toSansSerifPlain("✦ Ingresa el nombre o link de un video."));

  // Reacción
  await safeSend(conn, m.chat, { react: { text: "🕐", key: m.key } });

  // Buscar video
  let video;
  try {
    const ytIdMatch = ytIdRegex.exec(query);
    const search = ytIdMatch ? await yts({ videoId: ytIdMatch[1] }) : await yts(query);
    video = ytIdMatch ? search.video : Array.isArray(search.all) ? search.all[0] : null;
  } catch (err) {
    console.error("Error buscando video:", err);
    return m.reply(toSansSerifPlain("✦ Error al buscar el video."));
  }

  if (!video) return m.reply(toSansSerifPlain("✦ No se encontró el video."));

  const {
    title = "Sin título",
    timestamp = "Desconocido",
    views = null,
    url = "",
    thumbnail = "",
    author = { name: "Desconocido" },
    ago = "Desconocido"
  } = video;

  // Construir caption informativo
  const infoCaption = [
    "✧─── ･ ｡ﾟ★: *.✦ .* :★. ───✧",
    "⧼ ᰔᩚ ⧽  M U S I C  -  Y O U T U B E",
    "",
    `» ✧ « *${title}*`,
    `> ➩ Canal › *${author.name}*`,
    `> ➩ Duración › *${timestamp}*`,
    `> ➩ Vistas › *${formatViews(views)}*`,
    `> ➩ Publicado › *${ago}*`,
    `> ➩ Link › *${url}*`,
    "",
    command.toLowerCase() === "play"
      ? "> ✰ Enviando audio... ✧"
      : "> ✰ Enviando video (ytmp4)... ✧"
  ].join("\n");

  // Enviar mini info primero
  await safeSend(
    conn,
    m.chat,
    {
      image: { url: thumbnail },
      caption: infoCaption
    },
    { quoted: m }
  );

  // Descargar y enviar según comando
  try {
    if (command.toLowerCase() === "play") {
      // Audio only
      const stream = ytdl(url, { filter: "audioonly", quality: "highestaudio" });
      const pass = new PassThrough();
      stream.pipe(pass);
      await safeSend(
        conn,
        m.chat,
        {
          audio: pass,
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`
        },
        { quoted: m }
      );
    } else if (command.toLowerCase() === "ytmp4") {
      // Video mp4 con audio integrado (progresivo)
      const stream = ytdl(url, {
        quality: "highest",
        filter: (f) => f.container === "mp4" && f.hasVideo && f.hasAudio
      });
      const pass = new PassThrough();
      stream.pipe(pass);
      await safeSend(
        conn,
        m.chat,
        {
          video: pass,
          caption: `✧ Aquí tienes: *${title}* (ytmp4)`
        },
        { quoted: m }
      );
    } else {
      return m.reply(toSansSerifPlain("✦ Comando no reconocido. Usa 'play' para audio o 'ytmp4' para video."));
    }
  } catch (err) {
    console.error("Error en descarga/envío:", err);
    return m.reply(toSansSerifPlain("✦ Falló la descarga. Intenta de nuevo más tarde."));
  }
};

handler.command = ["play", "ytmp4"];
handler.register = true;
export default handler;
