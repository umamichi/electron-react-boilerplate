import express from 'express';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 6340;

export default class Server {
  start() {
    // const pino = require('express-pino-logger')(); // logger

    // app.use(pino);

    app.all('*', function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });

    // jsons
    app.get('/jsons/:jsonName', function (req, res) {
      var json = fs.readFileSync('./assets/jsons/' + req.params.jsonName);
      res.setHeader('Content-Type', 'application/json');
      res.send(json);
    });

    if (process.env.NODE_ENV === 'development') {
      // assetsディレクトリを指定
      app.use(express.static('./assets'));
    } else {
      // for Mac
      // /resources/app/assets にファイルを配置しないと見に行けない
      
      // for Windows
      app.use(express.static('../../skytree-assets'));
    }

    const server = app.listen(PORT, err => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`express server at http://localhost:${PORT}`);
    });
  }
}
