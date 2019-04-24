const faker = require('faker');
const fs = require('fs');
const loremHipsum = require('lorem-hipsum');
const pgdb = require('./db/index.js');
const cass = require('./db/indexCass.js');

console.time('duration of data gen and seed');

//======= OPTION SETUP =======//
//number of entries to generate -- defaults to 100k if not provided as arg
const entryQty = process.argv[2] || 100000;

//#region save method (a database or the file system)
let saveDataTo;
if (process.argv[3] == 'fs' || process.argv[3] == 'pg' || process.argv[3] == 'cass') {
  saveDataTo = process.argv[3];
} else {
  saveDataTo = 'fs';
}
//#endregion

//#region batch calculation
let entriesPerBatch;
if (saveDataTo == 'cass') {
  entriesPerBatch = 5;
} else if (saveDataTo == 'pg'){
  if (entryQty <= 30000) {
    entriesPerBatch = Math.floor(entryQty/10);
  } else {
    entriesPerBatch = 30000;
  }
} else if (saveDataTo == 'fs') {
  if (entryQty <= 1000000) {
    entriesPerBatch = Math.floor(entryQty/10);
  } else {
    entriesPerBatch = 100000;
  }
}
//#endregion

// handle large data sets for postgres, where query bound to params list caps out at ~30k params
if (saveDataTo == 'pg' && entryQty > 100000) {
  entriesPerBatch = 30000;
}
//======= COMMENT BUILDER HELPER FUNCTION =======//
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

//======= MAIN DATA GENERATOR =======//
const generateData = async () => {
  let dataList = [];
  let fileNameSerial = 0;

  for (let i = 1; i <= entryQty; i++) {
      let albumData = {};

      albumData.albumID = i;
      albumData.comments = makeComments();

      dataList.push(albumData);

      if (i !==0 && i % entriesPerBatch === 0 || i == entryQty) { // if i is a multiple of entriesPerBatch
        fileNameSerial++;

        console.log(`writing batch ${fileNameSerial}...`)

        if (saveDataTo == 'pg') {
          const response = await pgdb.insertData(dataList);
          console.log(`batch ${fileNameSerial} complete! Rows written: `, response);
        } else if (saveDataTo == 'fs') {
          fs.writeFileSync(`./data/testData${fileNameSerial}.json`, JSON.stringify(dataList));
          console.log(`file ${fileNameSerial} written!`);
        } else if (saveDataTo == 'cass') {
          const response = await cass.insertData(dataList);
        }

        dataList = [];
      }
    }
    pgdb.endPool();
    cass.shutdown();
    console.timeEnd('duration of data gen and seed');
}

generateData();

// iterate 'qty' times
// when iterator == threshold (provided via arg), save file and increment filename counter
// else when iterator == qty, save file (handles final batch)