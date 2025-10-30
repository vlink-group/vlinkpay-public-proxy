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

// Baonail phone contact endpoint
router.post('/baonail/phone-contact', async (req, res) => {
  try {
    const { cID, phpSessionId, url, id } = req.body;
    
    // List of user agents for rotation
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];
    
    // Randomly select a user agent
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const formData = new URLSearchParams();
    formData.append('id', id);
    formData.append('func', 'check');
    formData.append('mylang', 'vi');
    
    const response = await axios.post('https://baonail.com/contact_info.php', formData.toString(), {
      timeout: 100000,
      headers: {
        'User-Agent': randomUserAgent,
        'Accept': 'text/html, */*; q=0.01',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cookie': `cID=${cID}; PHPSESSID=${phpSessionId}`,
        'Referer': url,
        'Origin':'https://baonail.com',
        'X-Requested-With':'XMLHttpRequest',
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });

    // Format response as JSON for n8n compatibility
    res.json({
      status: 'success',
      message: 'Request completed successfully',
      data: {
        raw_response: response.data,
        response_type: typeof response.data === 'string' ? 'html/text' : 'json',
        status_code: response.status,
        headers: response.headers,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Baonail API error:', error.message);
    
    let errorMessage = 'Failed to fetch contact information from Baonail';
    let statusCode = 500;
    let errorDetails = null;

    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout - Baonail API took too long to respond';
      statusCode = 504;
    } else if (error.response) {
      errorMessage = `Baonail API error: ${error.response.status} ${error.response.statusText}`;
      statusCode = error.response.status;
      errorDetails = {
        status_code: error.response.status,
        response_data: error.response.data,
        headers: error.response.headers
      };
    } else if (error.request) {
      errorMessage = 'Network error - Unable to reach Baonail API';
      statusCode = 503;
    }

    res.status(statusCode).json({
      status: 'error',
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;