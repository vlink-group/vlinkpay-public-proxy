const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working correctly',
    data: {
      service: 'VLinkPay Public Proxy',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

router.get('/proxy-info', (req, res) => {
  res.json({
    status: 'success',
    message: 'Proxy information',
    data: {
      cors_enabled: true,
      allowed_methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowed_headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
      max_request_size: '10MB'
    }
  });
});

router.post('/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Test endpoint working',
    data: {
      received_body: req.body,
      received_headers: req.headers,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
});

router.get('/exchange/market/info', async (req, res) => {
  try {
    const response = await axios.get('https://vlinkexchange.com/matching/public/active-markets?limit=500', {
      timeout: 10000,
      headers: {
        'User-Agent': 'VLinkPay-Public-Proxy/1.0.0',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });

    res.json(response.data);

  } catch (error) {
    
    let errorMessage = 'Failed to fetch VLinkExchange market data';
    let statusCode = 500;

    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout - VLinkExchange API took too long to respond';
      statusCode = 504;
    } else if (error.response) {
      errorMessage = `VLinkExchange API error: ${error.response.status} ${error.response.statusText}`;
      statusCode = error.response.status;
    } else if (error.request) {
      errorMessage = 'Network error - Unable to reach VLinkExchange API';
      statusCode = 503;
    }

    res.status(statusCode).json({
      status: 'error',
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
});

router.post('/proxy', async (req, res) => {
  try {
    const { url, method = 'GET', headers = {}, body } = req.body;

    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'URL is required'
      });
    }

    res.json({
      status: 'success',
      message: 'Proxy request received',
      data: {
        target_url: url,
        method: method,
        headers: headers,
        body: body,
        note: 'This is a mock response. Implement actual proxy logic here.'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Proxy request failed',
      error: error.message
    });
  }
});

module.exports = router;