const faker = require('faker');
const fs = require('fs');
const bson = require('bson');
const loremHipsum = require('lorem-hipsum');

let dataList = [];
const entryQty = process.argv[2];
const entriesPerFile = process.argv[3];
let fileNameSerial = 0;

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

  dataList.push(albumData);

  if (i !==0 && i % entriesPerFile === 0) { // if i is a multiple of entriesPerFile (10, 20, 30, 40)
    let dataBatch = dataList.slice();
    dataList = [];
    fileNameSerial++;

    fs.writeFile(`./data/testData${fileNameSerial}.json`, JSON.stringify(dataBatch), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`saved file ${fileNameSerial}`);
      }
    })
  } else if (i == entryQty) {
    fileNameSerial++;
    fs.writeFile(`./data/testData${fileNameSerial}.json`, JSON.stringify(dataList), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`saved file ${fileNameSerial}`);
      }
    });
  }
}



// iterate 'qty' times
// when iterator == threshold (provided via arg), save file and increment filename counter
// when iterator == qty, save file (handles final batch)