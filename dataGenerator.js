const faker = require('faker');
const fs = require('fs');
const loremHipsum = require('lorem-hipsum');
const pgdb = require('./db/index.js');

console.time('duration data gen and seed');

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

const generateData = async () => {
  //number of entries to generate -- defaults to 100k if not provided as arg
  const entryQty = process.argv[2] || 100000;
  // number of entries per file -- defaults to 10k, or 1/10th of total entries if total is < 100k
  const entriesPerFile = process.argv[3] || (entryQty >= 100000 ? 10000 : Math.floor(entryQty/10));
  let dataList = [];
  let fileNameSerial = 0;

  for (let i = 0; i <= entryQty; i++) {
      let albumData = {};

      albumData.albumID = i;
      albumData.comments = makeComments();

      dataList.push(albumData);

      if (i !==0 && i % entriesPerFile === 0 || i == entryQty) { // if i is a multiple of entriesPerFile
        fileNameSerial++;
        let notifySerial = fileNameSerial;

        console.log(`writing batch ${notifySerial}...`)

        const response = await pgdb.insertData(dataList);

        console.log(`batch ${notifySerial} complete! Rows written: `, response);

        dataList = [];
      }
    }
    console.timeEnd('duration data gen and seed');
}

generateData();

// iterate 'qty' times
// when iterator == threshold (provided via arg), save file and increment filename counter
// else when iterator == qty, save file (handles final batch)