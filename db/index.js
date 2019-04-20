const pg = require('pg');
const pool = new pg.Pool({
  user: 'brox',
  host:'127.0.0.1',
  database: 'testdb'
});

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