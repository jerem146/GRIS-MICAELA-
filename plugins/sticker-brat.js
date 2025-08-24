import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const bratMaker = async (text) => {
  text = text.toLowerCase()
  const config = {
    type: 'bar',
    data: {
      labels: [''],
      datasets: [{
        label: text,
        data: [1],
        backgroundColor: '#8ACE00'
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: { family: 'Impact', size: 120, weight: 'bold' },
            color: '#000000'
          }
        }
      },
      scales: { x: { display: false }, y: { display: false } }
    }
  }
  const url = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(config))}&w=512&h=512&f=png`

  const resp = await axios.get(url, { responseType: 'arraybuffer' })
  return resp.data
}

let handler = async (m, { conn, text }) => {
  if (m.quoted) text = m.quoted.text || m.quoted.caption || text
  if (!text) return conn.sendMessage(m.chat, { text: '❀ Ingresa un texto para crear el sticker brat.' }, { quoted: m })

  try {
    const buffer = await bratMaker(text)
    let pack = global.db.data.users[m.sender] || {}
    let texto1 = pack.text1 || global.packsticker
    let texto2 = pack.text2 || global.packsticker2

    const stkr = await sticker(buffer, false, texto1, texto2)
    if (stkr) await conn.sendFile(m.chat, stkr, 'sticker.webp', '', m)
    else throw new Error('✧ No pudo generar el sticker.')
  } catch (e) {
    return conn.sendMessage(m.chat, { text: `⚠︎ Error: ${e.message}` }, { quoted: m })
  }
}

handler.command = ['brat']
handler.tags = ['sticker']
handler.help = ['brat *<texto>*']
export default handler