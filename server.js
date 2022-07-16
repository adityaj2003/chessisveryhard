var express = require('express');
var app = express();
const cors = require('cors');
app.use((req, res, next) => {
      res.header("Cross-Origin-Embedder-Policy", "require-corp");
      res.header("Cross-Origin-Opener-Policy", "same-origin");
      next();
    });
app.use(cors({
    origin: 'https://www.section.io'
}));
app.use(express.static(__dirname + '/')); //__dir and not _dir
const PORT = process.env.PORT || 8080;
app.listen(port);
console.log('server on' + port);
