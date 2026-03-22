'use strict';

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = Number(process.env.PORT) || 5000;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const BODY_LIMIT = process.env.BODY_LIMIT || '1mb';
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS) || 60000;
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 100;

const CROP_WATER_API_URL = process.env.CROP_WATER_API_URL || 'http://localhost:8001';
const SOIL_MOISTURE_API_URL = process.env.SOIL_MOISTURE_API_URL || 'http://localhost:8000';
const VILLAGE_WATER_API_URL = process.env.VILLAGE_WATER_API_URL || 'http://localhost:8003';
const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:8004';

function log(level, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  console.log(JSON.stringify(entry));
}

function requireInternalKey(req, res, next) {
  const key = req.get('x-internal-key');
  if (!INTERNAL_API_KEY) {
    log('error', 'INTERNAL_API_KEY not set');
    return res.status(503).json({ error: 'Server misconfiguration' });
  }
  if (!key || key !== INTERNAL_API_KEY) {
    log('warn', 'Rejected request: missing or invalid x-internal-key', { path: req.path });
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

async function runModel1() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { model: 'model1', ok: true };
}

async function runModel2() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { model: 'model2', ok: true };
}

async function runModel3() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { model: 'model3', ok: true };
}

function validateBody(req, res, next) {
  if (!req.body || typeof req.body !== 'object') {
    log('warn', 'Empty or invalid JSON body', { path: req.path });
    return res.status(400).json({ error: 'Empty or invalid JSON body' });
  }
  if (Object.keys(req.body).length === 0) {
    log('warn', 'Empty body object', { path: req.path });
    return res.status(400).json({ error: 'Empty body' });
  }
  next();
}

const app = express();

app.use(helmet());

app.use(
  '/crop-water',
  createProxyMiddleware({
    target: CROP_WATER_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/crop-water': '' },
    on: {
      error: (err, req, res) => {
        log('error', 'Crop Water proxy error', { error: err.message });
        res.status(502).json({ error: 'Crop Water API unavailable' });
      },
    },
  })
);
app.use(
  '/soil-moisture',
  createProxyMiddleware({
    target: SOIL_MOISTURE_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/soil-moisture': '' },
    on: {
      error: (err, req, res) => {
        log('error', 'Soil Moisture proxy error', { error: err.message });
        res.status(502).json({ error: 'Soil Moisture API unavailable' });
      },
    },
  })
);
app.use(
  '/village-water',
  createProxyMiddleware({
    target: VILLAGE_WATER_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/village-water': '' },
    on: {
      error: (err, req, res) => {
        log('error', 'Village Water proxy error', { error: err.message });
        res.status(502).json({ error: 'Village Water API unavailable' });
      },
    },
  })
);
app.use(
  '/chatbot',
  createProxyMiddleware({
    target: CHATBOT_API_URL,
    changeOrigin: true,
    pathRewrite: { '^/chatbot': '' },
    on: {
      error: (err, req, res) => {
        log('error', 'Chatbot proxy error', { error: err.message });
        res.status(502).json({ error: 'Chatbot API unavailable' });
      },
    },
  })
);

app.use(express.json({ limit: BODY_LIMIT }));
app.use((req, res, next) => {
  req.setTimeout(REQUEST_TIMEOUT_MS);
  res.setTimeout(REQUEST_TIMEOUT_MS);
  next();
});

const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    log('warn', 'Rate limit exceeded', { path: req.path, ip: req.ip });
    res.status(429).json({ error: 'Too many requests' });
  },
});
app.use(limiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/model1', requireInternalKey, validateBody, async (req, res) => {
  try {
    const result = await runModel1();
    log('info', 'model1 completed', {});
    res.json(result);
  } catch (err) {
    log('error', 'model1 error', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/model2', requireInternalKey, validateBody, async (req, res) => {
  try {
    const result = await runModel2();
    log('info', 'model2 completed', {});
    res.json(result);
  } catch (err) {
    log('error', 'model2 error', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/model3', requireInternalKey, validateBody, async (req, res) => {
  try {
    const result = await runModel3();
    log('info', 'model3 completed', {});
    res.json(result);
  } catch (err) {
    log('error', 'model3 error', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  log('error', 'Unhandled error', { error: err.message, path: req.path });
  res.status(500).json({ error: 'Internal server error' });
});

if (!INTERNAL_API_KEY) {
  log('error', 'INTERNAL_API_KEY must be set in environment');
  process.exit(1);
}

const server = app.listen(PORT, () => {
  log('info', 'Server listening', { port: PORT });
});

function shutdown(signal) {
  log('info', `Received ${signal}, shutting down gracefully`);
  server.close(() => {
    log('info', 'Server closed');
    process.exit(0);
  });
  setTimeout(() => {
    log('error', 'Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
