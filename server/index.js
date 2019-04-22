const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// const User = require('../database/index.js');
const PORT = 3003;
const db = require('../db/index.js');

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use((req, res, next) => {
  const timestamp = new Date();
  console.log(`serving a ${req.method} request to url ${req.url} at ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}. Body: `, req.body);

  next();
})

app.use('/', express.static(__dirname + '/../client/dist/'))
app.use('/:id', express.static(__dirname + '/../client/dist'));

app.get('/support/:id', async (req, res) => {
  const albumId = req.params.id;
  const response = await db.getEntryByID(albumId);
  res.json(response);
});

app.post('/support', async (req, res) => {
  const commentsData = JSON.stringify(req.body);
  const response = await db.addEntry(commentsData)
  res.json(response);
})

app.put('/support/:id', async (req, res) => {
  const albumId = req.params.id;
  const commentsData = JSON.stringify(req.body);
  //TODO: implement db access
  const response = await db.updateEntryByID(albumId, commentsData);
  res.json(response);
})

app.delete('/support/:id', async (req, res) => {
  let albumId = req.params.id;

  //TODO: implement db access

  res.send(`DELETE request received for id ${albumId}, thanks`)
})


app.listen(PORT, () => console.log(`listening on port ${PORT}`));
