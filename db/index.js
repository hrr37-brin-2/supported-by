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
    // for query string: need a string that looks like '($0), ($1), ...' with a param for every item in array
    valuesArray.push(`($${i+1})`);
    // for actual params array: need an array of json objects for the numbered query string params to map to
    let jsonObj = JSON.stringify(dataArr[i]);
    paramsArray.push(jsonObj);
  }
  const valuesString = valuesArray.join(',  ');
  const testLoadQuery = `INSERT INTO testtable(data) VALUES ${valuesString}`;

  const response = await pool.query(testLoadQuery, paramsArray)
    .then(response => response.rowCount);

  return response;
}