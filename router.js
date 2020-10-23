const express = require('express');
const path = require('path');
const router = express.Router();
const Views = require('./views/views.model');
const fs = require('fs');

router.get('/*.svg', async (req, res) => {
  console.log('host', req.headers);
  if (
    (req.headers.via &&
      req.headers.via.includes('github-camo') &&
      req.headers['user-agent'] &&
      req.headers['user-agent'].includes('github-camo')) ||
    (req.headers['sec-fetch-site'] &&
      req.headers['sec-fetch-site'] === 'same-origin' &&
      req.headers.referer &&
      req.headers.referer === 'https://views.hectane.com/') ||
    process.env.IS_LOCAL === 'true'
  ) {
    const url = path.join(req.headers.host, req.path);
    // console.log(url);
    try {
      const views = await Views.findOneAndUpdate(
        { url: url },
        { $inc: { count: 1 } },
        { upsert: true, new: true, fields: { count: true, _id: false } }
      ).lean();
      // console.log(views);
      res.contentType('image/svg+xml')
        .send(`<svg xmlns="http://www.w3.org/2000/svg" width="90" height="20">
    <rect width="40" height="20" fill="#555" />
    <rect x="40" width="50" height="20" fill="#4c1" />
    <rect rx="3" width="90" height="20" fill="transparent" />
    <g
      fill="#fff"
      text-anchor="middle"
      font-family="Verdana,Geneva,sans-serif"
      font-size="10"
    >
      <text x="18" y="14">Views</text>
      <text x="64" y="14">${views.count}</text>
    </g>
  </svg>`);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.contentType('image/svg+xml')
      .send(`<svg xmlns="http://www.w3.org/2000/svg" width="130" height="20">
      <rect width="80" height="20" fill="#555"/>
      <rect x="80" width="50" height="20" fill="#f30000" style="color: #f30000;"/>
      <rect rx="3" width="130" height="20" fill="transparent"/>
      <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,sans-serif" font-size="10">
        <text x="35" y="14">Non Github</text>
        <text x="104" y="14">0</text>
      </g>
  </svg>`);
  }
});
if (process.env.IS_LOCAL === 'true') {
  router.get('/*', async (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    fs.createReadStream('index.html').pipe(res);
  });
}

module.exports = router;
