const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('../database/index.js');
const PORT = 3003;

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.send('yooooo');
// })

app.use((req, res, next) => {
  const timestamp = new Date();
  console.log(`serving a ${req.method} request to url ${req.url} at ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds}. Body: `, req.body);

  next();
})

app.use('/', express.static(__dirname + '/../client/dist/'))
app.use('/:id', express.static(__dirname + '/../client/dist'));


app.get('/api/users/:id', (req, res) => {
  let id = req.params.id;
  User.getUser(id, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

app.get('/support/:id', (req, res) => { //returns
  let albumId = req.params.id;

  User.getUsersForAlbum(albumId, (err, albumUsers) => {
    if (err) {
      console.log(err);
    } else {
      res.json(albumUsers);
    }
  });
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
