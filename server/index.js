const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const AbortController = require('abort-controller');

const ttsEndPoint = "https://api.wellsaidlabs.com/v1/tts/stream";
const lookupEndpoint = "https://api.wellsaidlabs.com/v1/tts/respelling_suggestions?word=";
const librariesEndpoint = "https://api.wellsaidlabs.com/v1/tts/replacement_libraries";

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

app.get('/respelling_suggestions', async (req, res) => {
  const abortController = new AbortController();
  const word = req.query.word;

  req.on('aborted', () => {
    // Graceful end of the TTS stream when a client connection is aborted
    abortController.abort()
  })

  const ttsResponse = await fetch(lookupEndpoint + word, {
    signal: abortController.signal,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.WELLSAID_API_KEY,
    }
  });
  
  res.writeHead(ttsResponse.status, ttsResponse.headers.raw());
  res.flushHeaders();

  ttsResponse.body.pipe(res)
});

app.post('/replacement_libraries', async (req, res) => {
  const abortController = new AbortController();
  const name = req.body.name;

  req.on('aborted', () => {
    // Graceful end of the TTS stream when a client connection is aborted
    abortController.abort()
  })
  
  const ttsResponse = await fetch(librariesEndpoint, {
    signal: abortController.signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.WELLSAID_API_KEY,
    },    
    body: JSON.stringify({
      name,
    }),
  });
  
  res.writeHead(ttsResponse.status, ttsResponse.headers.raw());
  res.flushHeaders();

  ttsResponse.body.pipe(res)
});

app.get('/replacement_libraries', async (req, res) => {
  const abortController = new AbortController();
  const id = req.query.id;

  req.on('aborted', () => {
    // Graceful end of the TTS stream when a client connection is aborted
    abortController.abort()
  })
  
  const ttsResponse = await fetch(librariesEndpoint +'/' + id, {
    signal: abortController.signal,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.WELLSAID_API_KEY,
    }
  });
  
  res.writeHead(ttsResponse.status, ttsResponse.headers.raw());
  res.flushHeaders();

  ttsResponse.body.pipe(res)
});

app.post('/replacement_libraries/:id', async (req, res) => {
  const abortController = new AbortController();
  const id = req.params.id;
  const original = req.body.replacement;
  const replacement = req.body.replacement;
  const is_phonetic_respelling = req.body.is_phonetic_respelling;
  const enabled = req.body.enabled;

  req.on('aborted', () => {
    // Graceful end of the TTS stream when a client connection is aborted
    abortController.abort()
  })
  
  const ttsResponse = await fetch(librariesEndpoint + "/" + id + "/replacements", {
    signal: abortController.signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.WELLSAID_API_KEY,
    },    
    body: JSON.stringify({
      original,
      replacement_text: replacement,
      is_phonetic_respelling,
      enabled
    }),
  });
  
  res.writeHead(ttsResponse.status, ttsResponse.headers.raw());
  res.flushHeaders();

  ttsResponse.body.pipe(res)
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
