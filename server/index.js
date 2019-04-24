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
  console.time('GET request took');
  const albumId = req.params.id;
  const response = await db.getEntryByID(albumId);
  console.timeEnd('GET request took');
  res.json(response);
});

app.post('/support', async (req, res) => {
  console.time('POST request took');
  const commentsData = JSON.stringify(req.body);
  const response = await db.addEntry(commentsData)
  console.timeEnd('POST request took');
  res.json(response);
})

app.put('/support/:id', async (req, res) => {
  console.time('PUT request took');
  const albumId = req.params.id;
  const commentsData = JSON.stringify(req.body);
  const response = await db.updateEntryByID(albumId, commentsData);
  console.timeEnd('PUT request took');
  res.json(response);
})

app.delete('/support/:id', async (req, res) => {
  console.time('DELETE request took');
  let albumId = req.params.id;
  const response = await db.deleteEntryByID(albumId);
  console.timeEnd('DELETE request took');
  res.json(response);
})


app.listen(PORT, () => console.log(`listening on port ${PORT}`));
