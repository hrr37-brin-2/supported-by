const pg = require('pg');
const fs = require('fs');
const pool = new pg.Pool({
  user: 'brox',
  host:'127.0.0.1',
  database: 'testdb'
});

// module.exports.insertData = (dataArr, callback) => {

//   for (let i = 0; i < dataArr.length; i++) {
//     let jsonObj = JSON.stringify(dataArr[i]);

//     const testLoadQuery = 'INSERT INTO testtable(data) VALUES ($1)';

//     pool.query(testLoadQuery, [jsonObj], (err, results) => {
//       if (err) {
//         callback(err, jsonObj);
//       }
//     })
//   }
// }

module.exports.insertData = (dataArr, callback) => {

  const valuesArray = [];
  const paramsArray = [];

  for (let i = 0; i < dataArr.length; i++) {
    // for query string: need a string that looks like '($0), ($1), ...' with a param for every item in array
    valuesArray.push(`($${i+1})`);
    // for actual params array: need an array of json objects for the numbered query string params to map to
    let jsonObj = JSON.stringify(dataArr[i]);
    console.log(`adding json obj #${i} to the query builder`)
    paramsArray.push(jsonObj);

  }
  const valuesString = valuesArray.join(',  ');
  const testLoadQuery = `INSERT INTO testtable(data) VALUES ${valuesString}`;

    pool.query(testLoadQuery, paramsArray, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    })
}
/*
  === Plan to implement DB insert within data gen script, while maintaining modularity ===

  - write Postgres DB insertion script in separate file which inserts 1 JSON object to 'data' column of albums table
  - determine how best to keep db connection open for entire process (rather than open/close for each insertion)
  - refactor dataGenerator to pass each generated JSON obj to the DB function
  - instead of passing JSON objects 1 at a time, what if arrays of objects are passed as batches, then inside the DB function the array is iterated, and each object is stringified and stored
  - could maintain existing batch logic in data gen func
  -
*/