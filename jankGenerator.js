const faker = require('faker');
const fs = require('fs');
const bson = require('bson');
const loremHipsum = require('lorem-hipsum');

const dataList = [];
const entryQty = process.argv[2];

fs.writeFileSync('jankData.json', '[');

for (let i = 0; i <= entryQty; i++) {
  let albumData = {};

  albumData.albumID = i;
  let commentCount = Math.floor(Math.random() * 10);

  albumData.comments = [];

  for (let x = 0; x < commentCount; x++) {
    let comment = {};
    comment.username = faker.name.findName();
    comment.avatar = faker.image.cats();
    comment.text = loremHipsum({
      count: 2,
      units: 'sentences',
      sentenceLowerBound: 3,
      sentenceUpperBound: 8,
      format: 'plain'
    })

    albumData.comments.push(comment);
  }

  // dataList.push(albumData);
  fs.appendFileSync('jankData.json', `${JSON.stringify(albumData)},`);
}

fs.appendFileSync('jankData.json', '{}]');
