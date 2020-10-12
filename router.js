const express = require('express');
const path = require('path');
const router = express.Router();
const Views = require('./views/views.model');
const fs = require('fs');

router.get('/*.svg', async (req, res) => {
  // console.log(new URL(req.url));
  console.log('host', req.headers.referer);
  //   console.log(counter);
  const url = path.join(req.headers.host, req.path);

  console.log(url);
  //   if (counter[url]) {
  //     counter[url] = counter[url] + 1;
  //   } else {
  //     counter[url] = 1;
  //   }

  try {
    const views = await Views.findOneAndUpdate(
      { url: url },
      { $inc: { count: 1 } },
      { upsert: true, new: true, fields: { count: true, _id: false } }
    );
    // const count = await Hits.countDocuments();
    // console.log('Count', count);
    console.log(views);
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
    <text x="17" y="14">Views</text>
    <text x="64" y="14">${views.count}</text>
  </g>
</svg>`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
if (process.env.IS_LOCAL) {
  router.get('/*', async (req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    fs.createReadStream('index.html').pipe(res);
  });
}

module.exports = router;
