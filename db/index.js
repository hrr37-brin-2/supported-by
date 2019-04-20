const pg = require('pg');
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

module.exports.pool = pool;