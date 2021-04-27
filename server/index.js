const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const AbortController = require('abort-controller');

const ttsEndPoint = "https://api.wellsaidlabs.com/v1/tts/stream";

const app = express();
app.use(bodyParser.json());
app.use(pino);

app.post('/stream', async (req, res) => {
  const abortController = new AbortController();
  const avatarId = req.body.avatarId;
  const text = req.body.text;

  req.on('aborted', () => {
    // Graceful end of the TTS stream when a client connection is aborted
    abortController.abort()
  })

  /**
   * Should this request fail, make sure to check the response headers
   * to try to find a root cause.
   * 
   * Rate-limiting headers:
   * x-quota-limit: 200
   * x-quota-remaining: 191
   * x-quota-reset: 1622226323630
   * x-rate-limit-limit: 5
   * x-rate-limit-remaining: 4
   * x-rate-limit-reset: 1619635874002
   */
  const ttsResponse = await fetch(ttsEndPoint, {
    signal: abortController.signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.WELLSAID_API_KEY,
    },
    body: JSON.stringify({
      speaker_id: avatarId,
      text,
    }),
  });
  
  res.writeHead(ttsResponse.status, ttsResponse.headers.raw());
  res.flushHeaders();

  ttsResponse.body.pipe(res)
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
