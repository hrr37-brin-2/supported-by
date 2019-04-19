const faker = require('faker');
const fs = require('fs');
// const bson = require('bson');
// const loremHipsum = require('lorem-hipsum');

let dataList = [];

//number of entries to generate -- defaults to 100k if not provided as arg
const entryQty = process.argv[2] || 100000;
// number of entries per file -- defaults to 10k, or 1/10th of total entries if total is < 100k
const entriesPerFile = process.argv[3] || (entryQty >= 100000 ? 10000 : Math.floor(entryQty/10));

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
    // comment.text = loremHipsum({
    //   count: 2,
    //   units: 'sentences',
    //   sentenceLowerBound: 3,
    //   sentenceUpperBound: 8,
    //   format: 'plain'
    // })
    comment.text = "With hard driving guitars and pounding drums (two kits at the band’s live shows) backing Hull’s pain-laden narratives, Manchester Orchestra has found the “Golden Ticket” into the mainstream.";

    albumData.comments.push(comment);
  }

  dataList.push(albumData);

  if (i !==0 && i % entriesPerFile === 0) { // if i is a multiple of entriesPerFile (10, 20, 30, 40)
    let dataBatch = dataList.slice();
    dataList = [];
    fileNameSerial++;
    let notifySerial = fileNameSerial;
    console.log(`writing file ${notifySerial}...`)

    // fs.writeFile(`./data/testData${fileNameSerial}.json`, JSON.stringify(dataBatch), (err) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(`saved file ${notifySerial}`);
    //   }
    // })
    fs.writeFileSync(`./data/testData${fileNameSerial}.json`, JSON.stringify(dataBatch));
    console.log(`saved file ${notifySerial}`);
  } else if (i == entryQty) {
    fileNameSerial++;
    let notifySerial = fileNameSerial;
    console.log(`writing file ${notifySerial}...`);

    fs.writeFile(`./data/testData${fileNameSerial}.json`, JSON.stringify(dataList), (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`saved file ${notifySerial}`);
      }
    });
  }
}

// iterate 'qty' times
// when iterator == threshold (provided via arg), save file and increment filename counter
// else when iterator == qty, save file (handles final batch)