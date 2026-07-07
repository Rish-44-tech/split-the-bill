const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Test Server Works!</h1>');
});

app.listen(3000, () => {
    console.log('🚀 Test server is listening perfectly on port 3005!');
});