const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

exports.handler = async function (event, context) {
  const apiId = parseInt(process.env.TELEGRAM_API_ID);
  const apiHash = process.env.TELEGRAM_API_HASH;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  // Obtiene el ID del mensaje/película enviado por la URL (ejemplo: ?id=123)
  const messageId = parseInt(event.queryStringParameters.id);

  if (!messageId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Falta el parámetro ?id=ID_DEL_MENSAJE" }),
    };
  }

  try {
    const client = new TelegramClient(new StringSession(""), apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.start({ botAuthToken: botToken });

    // Tu canal privado
    const chatId = parseInt(process.env.TELEGRAM_CHANNEL_ID); 
    const messages = await client.getMessages(chatId, { ids: [messageId] });

    if (!messages || !messages[0] || !messages[0].media) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Video o mensaje no encontrado" }),
      };
    }

    // Retransmite el video en bloques (Stream)
    const buffer = await client.downloadMedia(messages[0].media, {});

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
