const faker = require('faker');
const fs = require('fs');
const loremHipsum = require('lorem-hipsum');
const pgdb = require('./db/index.js');

let dataList = [];

//number of entries to generate -- defaults to 100k if not provided as arg
const entryQty = process.argv[2] || 100000;
// number of entries per file -- defaults to 10k, or 1/10th of total entries if total is < 100k
const entriesPerFile = process.argv[3] || (entryQty >= 100000 ? 10000 : Math.floor(entryQty/10));

const makeComments = () => {
  const comments = [];
  const commentCount = Math.floor(Math.random() * 10);

  for (let x = 0; x < commentCount; x++) {
    const comment = {};
    comment.username = faker.name.findName();
    comment.avatar = faker.image.cats();
    comment.text = loremHipsum({
      count: 2,
      units: 'sentences',
      sentenceLowerBound: 3,
      sentenceUpperBound: 8,
      format: 'plain'
    })
    comments.push(comment);
  }
  return comments;
}

let fileNameSerial = 0;

for (let i = 0; i <= entryQty; i++) {
  let albumData = {};
  console.log(i);

  albumData.albumID = i;
  albumData.comments = makeComments();

  dataList.push(albumData);

  if (i !==0 && i % entriesPerFile === 0) { // if i is a multiple of entriesPerFile (10, 20, 30, 40)

    fileNameSerial++;
    let notifySerial = fileNameSerial;
    console.log(`writing batch ${notifySerial}...`)

    // fs.writeFileSync(`./data/testData${fileNameSerial}.json`, JSON.stringify(dataList));

    pgdb.insertData(dataList, (err, results) => {
      if (err) {
        console.log(`batch ${notifySerial} error: `, err);
      } else {
        console.log(`batch ${notifySerial} success!: `, results)
        dataList = [];
      }
    })

  } else if (i == entryQty) {
    fileNameSerial++;
    let notifySerial = fileNameSerial;
    console.log(`writing batch ${notifySerial}...`);

    pgdb.insertData(dataList, (err, results) => {
      if (err) {
        console.log(`batch ${notifySerial} error on json object ${results}. *Error*: `, err);
      } else {
        console.log(`batch ${notifySerial} success!: `, results)
        dataList = [];
      }
    })
  }
}

// iterate 'qty' times
// when iterator == threshold (provided via arg), save file and increment filename counter
// else when iterator == qty, save file (handles final batch)