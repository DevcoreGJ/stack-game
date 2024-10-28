const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/log', (req, res) => {
    const logMessage = req.body.message + '\n';
    fs.appendFile('game-log.txt', logMessage, (err) => {
        if (err) throw err;
    });
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Log server running at http://localhost:${port}`);
});
