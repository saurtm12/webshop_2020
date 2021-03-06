const http = require('http');
const { handleRequest } = require('./routes');
const mongoose = require('mongoose');

const url = process.env.DBURL || 'mongodb://localhost:27017/Test_WebShopDb';

mongoose.connect(url, {useNewUrlParser: true}, { useUnifiedTopology: true } );
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const PORT = process.env.PORT || 3000;
const server = http.createServer(handleRequest);

server.on('error', err => {
  console.error(err);
  server.close();
});

server.on('close', () => console.log('Server closed.'));

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
