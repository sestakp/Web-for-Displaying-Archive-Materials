const express = require('express');
const cors = require('cors');
const { URL } = require('url');

const app = express();
const PORT = 8081;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(cors());

app.get('/proxy', async (req, res) => {
  const imageUrl = req.query.url;



  if (!imageUrl) {
    console.error("missing url param")
    return res.status(400).send('Missing "url" parameter');
  }


  try {
    const fetchModule = await import('node-fetch');
    const fetch = fetchModule.default;

    const parsedUrl = new URL(imageUrl);
    let domain = parsedUrl.protocol + "//" +parsedUrl.hostname;
    
    console.log("referer: ", domain || 'https://www.mza.cz')
    console.log("host: ", parsedUrl.hostname)
    
    const customRequestHeaders = {
        'Referer': domain || 'https://www.mza.cz',
        //'Host': parsedUrl.hostname
    };

    const headers = {
        //...req.headers,
        ...customRequestHeaders,
    };

    const response = await fetch(imageUrl, { headers });

    for (const [key, value] of response.headers) {
      
      //res.setHeader(key, value);
    }

    //const origin = req.headers.referer || "http://localhost:3000";
    //const origin = "http://localhost:3000"
    const origin = req.get('Referer') || "http://localhost:3000";
    //console.log("origin: ", req.get('Referer'))
    const sanitizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

    res.setHeader("Access-Control-Allow-Origin", sanitizedOrigin)

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    //console.log("content type : ", contentType)

    //console.log("body: ", response.body)
    //res.set('Content-Type', contentType);


    console.log("response status: ", response.status)
    res.status(response.status);
    
    
    response.body.pipe(res);
    
  } catch (error) {
    console.error("Raised error: ", error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});