const pg = require('pg');
const pool = new pg.Pool({
  user: 'brox',
  host:'127.0.0.1',
  database: 'testdb'
});

console.time('query took: ');
module.exports.insertData = async (dataArr) => {
  const valuesArray = [];
  const paramsArray = [];

  for (let i = 0; i < dataArr.length; i++) {
    valuesArray.push(`($${i+1})`);
    let jsonObj = JSON.stringify(dataArr[i]);
    paramsArray.push(jsonObj);
  }
  const valuesString = valuesArray.join(',  ');
  const testLoadQuery = `INSERT INTO testtable(data) VALUES ${valuesString}`;

  const response = await pool.query(testLoadQuery, paramsArray)
    .then(response => response.rowCount);

  return response;
}

module.exports.getEntryByID = async (id = 100) => {
  const queryString = `SELECT data FROM testtable WHERE id = $1`;

  const response = await pool.query(queryString, [id])

  return response;
}

// (async () => {
//   const response = await module.exports.getEntryByID();
//   console.log(JSON.stringify(response.rows[0].data));
//   pool.end();
//   console.timeEnd('query took: ');
// })();

module.exports.endPool = () => {
  pool.end();
}