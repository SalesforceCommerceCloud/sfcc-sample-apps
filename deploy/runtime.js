import color from 'colors';
import express from 'express'
import path from 'path';


let app = express();

app.use(express.static(__dirname + "/public"));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log('======== Example SFRA runtime ======== ');
    console.log(`🌩 Client Server up on ==============> http://localhost:${server.address().port} <=========== Client UI ========== 🌩`.yellow);
});

