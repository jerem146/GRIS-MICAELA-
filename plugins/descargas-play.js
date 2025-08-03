import fetch from "node-fetch";
import yts from "yt-search";

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

// Formatea vistas grandes
const formatViews = (views) => {
  if (views == null) return "Desconocido";
  if (typeof views !== "number") return views.toString();
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
  return views.toString();
};

// Sanitiza nombre de archivo
const sanitizeFileName = (name = "") => name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").slice(0, 50);

// Envío seguro
const safeSend = async (conn, chat, message, opts = {}) => {
  try {
    await conn.sendMessage(chat, message, opts);
  } catch (e) {
    console.warn("sendMessage error:", e?.message || e);
  }
};

const handler = async (m, { conn, text = "", command }) => {
  const query = text.trim();
  if (!query) return m.reply(toSansSerifPlain("✦ Ingresa el nombre o link de un video."));

  // Reacción de espera
  await safeSend(conn, m.chat, { react: { text: "🕐", key: m.key } });

  // Buscar video en YouTube
  let video;
  try {
    const ytIdMatch = ytIdRegex.exec(query);
    const search = ytIdMatch ? await yts({ videoId: ytIdMatch[1] }) : await yts(query);
    video = ytIdMatch
      ? search.video
      : Array.isArray(search.all)
      ? search.all[0]
      : search.video;
  } catch (err) {
    console.error("Error en búsqueda:", err);
    return m.reply(toSansSerifPlain("✦ Error al buscar el video."));
  }

  if (!video) return m.reply(toSansSerifPlain("✦ No se encontró el video."));

  // Desestructurar con valores por defecto
  const {
    title = "Sin título",
    timestamp = "Desconocido",
    views = null,
    url = "",
    thumbnail = "",
    author = { name: "Desconocido" },
    ago = "Desconocido"
  } = video;

  const cleanTitle = sanitizeFileName(title);
  const vistas = formatViews(typeof views === "number" ? views : null);
  const canal = author?.name || "Desconocido";

  // Caption informativo
  const captionInfo = [
    "✧─── ･ ｡ﾟ★: *.✦ .* :★. ───✧",
    "⧼ ᰔᩚ ⧽  M U S I C  -  Y O U T U B E",
    "",
    `» ✧ « *${title}*`,
    `> ➩ Canal › *${canal}*`,
    `> ➩ Duración › *${timestamp}*`,
    `> ➩ Vistas › *${vistas}*`,
    `> ➩ Publicado › *${ago || "desconocido"}*`,
    `> ➩ Link › *${url}*`,
    "",
    command.toLowerCase().includes("mp4")
      ? "> ✰ Descargando video (ytmp4)... ✧"
      : "> ✰ Descargando audio... ✧"
  ].join("\n");

  // Enviar la info primero
  await safeSend(
    conn,
    m.chat,
    {
      image: { url: thumbnail },
      caption: captionInfo
    },
    { quoted: m }
  );

  const lower = command.toLowerCase();

  // Ramas de audio vs video
  if (["play", "ytmp3", "playaudio", "yta"].includes(lower)) {
    // Audio vía API de ytmp3
    try {
      const audioApi = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`;
      const resp = await fetch(audioApi, { timeout: 30000 });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();

      // Ajusta según la estructura real: intento estándar
      const audioUrl =
        json?.result?.download?.url ||
        json?.url ||
        json?.result?.url ||
        (json?.result && typeof json.result === "string" ? json.result : null);
      const audioTitle = json?.result?.title || title;

      if (!audioUrl) throw new Error("No se obtuvo URL de audio.");

      await safeSend(
        conn,
        m.chat,
        {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: `${sanitizeFileName(audioTitle)}.mp3`
        },
        { quoted: m }
      );
    } catch (e) {
      console.error("Error descargando audio:", e);
      return m.reply(
        m.chat,
        toSansSerifPlain("⚠︎ No se pudo descargar el audio. Intenta más tarde."),
        m
      );
    }
  } else if (["ytmp4", "ytv", "mp4"].includes(lower)) {
    // Video vía endpoint de ytmp4
    try {
      const videoApi = `https://myapiadonix.vercel.app/api/ytmp4?url=${encodeURIComponent(url)}`;
      const resp = await fetch(videoApi, { timeout: 30000 });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();

      // Ajusta según la respuesta real
      const videoUrl =
        json?.result?.download?.url ||
        json?.url ||
        json?.result?.url ||
        (json?.result && typeof json.result === "string" ? json.result : null);
      const videoTitle = json?.result?.title || title;

      if (!videoUrl) throw new Error("No se obtuvo URL de video.");

      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption: `✧ Aquí tienes: *${videoTitle}* (ytmp4)`
        },
        { quoted: m }
      );
    } catch (e) {
      console.error("Error descargando video:", e);
      return m.reply(
        m.chat,
        toSansSerifPlain("⚠︎ No se pudo descargar el video. Intenta más tarde."),
        m
      );
    }
  } else {
    return m.reply(
      toSansSerifPlain("✦ Usa `play`/`ytmp3` para audio o `ytmp4`/`mp4` para video."),
      m
    );
  }
};

handler.command = ["play", "ytmp3", "playaudio", "yta", "ytmp4", "ytv", "mp4"];
handler.register = true;
export default handler;