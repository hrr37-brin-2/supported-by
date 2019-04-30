require('newrelic');
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// const User = require('../database/index.js');
const PORT = 3000;
const db = require('../db/index.js');

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   const timestamp = new Date();
//   console.log(`serving a ${req.method} request to url ${req.url} at ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}. Body: `, req.body);

//   next();
// })

app.use('/bundle/', express.static(__dirname + '/../client/dist/bundle.js'));
app.use('/', express.static(__dirname + '/../client/dist/'))
app.use('/:id', express.static(__dirname + '/../client/dist'));


app.get('/support/:id', async (req, res) => {
  try {
    const albumId = req.params.id;
    const response = await db.getEntryByID(albumId);

    res.json(response);
  } catch(e) {
    res.send('error in GET request: ', e);
  }
});

app.post('/support', async (req, res) => {
  try {
    const commentsData = JSON.stringify(req.body);
    const response = await db.addEntry(commentsData);

    res.json(response);
  } catch(e) {
    res.send('error in POST request: ', e);
  }
})

app.put('/support/:id', async (req, res) => {
  try {
  const albumId = req.params.id;
  const commentsData = JSON.stringify(req.body);
  const response = await db.updateEntryByID(albumId, commentsData);

  res.json(response);
  } catch(e) {
    res.send('error in PUT request: ', e);
  }
})

app.delete('/support/:id', async (req, res) => {
  try {
    let albumId = req.params.id;
    const response = await db.deleteEntryByID(albumId);

    res.json(response);
  } catch(e) {
    res.send('error in DELETE request: ', e);
  }
})


app.listen(PORT, () => console.log(`listening on port ${PORT}`));

// test change
