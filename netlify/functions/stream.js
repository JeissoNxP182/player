const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

exports.handler = async function (event) {
  const rawId = event.queryStringParameters?.id;
  const messageId = Number.parseInt(rawId, 10);

  if (!Number.isInteger(messageId) || messageId <= 0) {
    return jsonResponse(400, {
      error: "ID inválido",
      detalle: "Usa la URL /stream?id=123"
    });
  }

  const apiId = Number.parseInt(process.env.TELEGRAM_API_ID, 10);
  const apiHash = process.env.TELEGRAM_API_HASH;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = Number.parseInt(
    process.env.TELEGRAM_CHANNEL_ID,
    10
  );

  const missing = [];

  if (!Number.isInteger(apiId) || apiId <= 0) {
    missing.push("TELEGRAM_API_ID");
  }

  if (!apiHash) {
    missing.push("TELEGRAM_API_HASH");
  }

  if (!botToken) {
    missing.push("TELEGRAM_BOT_TOKEN");
  }

  if (!Number.isInteger(channelId)) {
    missing.push("TELEGRAM_CHANNEL_ID");
  }

  if (missing.length) {
    console.error(
      "Variables de entorno faltantes:",
      missing
    );

    return jsonResponse(500, {
      error: "Configuración incompleta en Netlify",
      variables_faltantes: missing
    });
  }

  let client;

  try {
    client = new TelegramClient(
      new StringSession(""),
      apiId,
      apiHash,
      {
        connectionRetries: 3
      }
    );

    await client.start({
      botAuthToken: botToken
    });

    const messages = await client.getMessages(
      channelId,
      {
        ids: [messageId]
      }
    );

    const message = messages?.[0];

    if (!message) {
      return jsonResponse(404, {
        error: "Mensaje no encontrado",
        id: messageId
      });
    }

    if (!message.media) {
      return jsonResponse(404, {
        error: "El mensaje no contiene un archivo multimedia",
        id: messageId
      });
    }

    console.log(
      `Descargando archivo de Telegram. ID: ${messageId}`
    );

    const buffer = await client.downloadMedia(
      message.media,
      {}
    );

    if (
      !buffer ||
      !Buffer.isBuffer(buffer) ||
      buffer.length === 0
    ) {
      return jsonResponse(404, {
        error: "Telegram no devolvió datos del archivo",
        id: messageId
      });
    }

    let contentType = "video/mp4";

    if (message.media?.document) {
      const mimeType =
        message.media.document.mimeType;

      if (
        typeof mimeType === "string" &&
        mimeType.trim()
      ) {
        contentType = mimeType;
      }
    }

    console.log(
      `Archivo listo. ID: ${messageId}, ` +
      `tamaño: ${buffer.length} bytes, ` +
      `tipo: ${contentType}`
    );

    return {
      statusCode: 200,

      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Range, Content-Type",
        "Accept-Ranges": "bytes"
      },

      body: buffer.toString("base64"),
      isBase64Encoded: true
    };

  } catch (error) {
    console.error(
      "Error en /stream:",
      error
    );

    return jsonResponse(500, {
      error:
        "No se pudo obtener el vídeo desde Telegram",
      detalle:
        error?.message || String(error)
    });

  } finally {
    if (client) {
      try {
        await client.disconnect();
      } catch (disconnectError) {
        console.error(
          "Error cerrando Telegram:",
          disconnectError
        );
      }
    }
  }
};

function jsonResponse(statusCode, data) {
  return {
    statusCode,

    headers: {
      "Content-Type":
        "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store"
    },

    body: JSON.stringify(data)
  };
}
