const app = require('./server.js');

const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log (`Servidor escuchando en http://localhost:${PORT}`);
})
server.on('error', err => console.log(`Server error ${err}`));