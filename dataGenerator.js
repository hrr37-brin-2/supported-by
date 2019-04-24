const faker = require('faker');
const fs = require('fs');
const loremHipsum = require('lorem-hipsum');
const pgdb = require('./db/index.js');
const cass = require('./db/indexCass.js');

console.time('duration data gen and seed');

//======= OPTION SETUP =======//
//number of entries to generate -- defaults to 100k if not provided as arg
const entryQty = process.argv[2] || 100000;

// number of entries per file -- defaults to 10k, or 1/10th of total entries if total is < 100k
let entriesPerBatch = process.argv[3] || (entryQty >= 100000 ? 10000 : Math.floor(entryQty/10));

//ENTRIES PER BATCH:
// - always use 5 for cassandra
// - for fs, ePB should never exceed 100k
// - for pg, ePB should never exceed 30k
//

// where to save data -- database or file system
let saveDataTo = 'pg';
if (process.argv[4] == 'fs') {
  saveDataTo = 'fs';
} else if (process.argv[4] == 'cass') {
  saveDataTo = 'cass';
  entriesPerBatch = 5;
}

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
    entriesPerbatch = Math.floor(entryQty/10);
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
    console.timeEnd('duration data gen and seed');
}

generateData();

// iterate 'qty' times
// when iterator == threshold (provided via arg), save file and increment filename counter
// else when iterator == qty, save file (handles final batch)