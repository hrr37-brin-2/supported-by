const pg = require('pg');
const pool = new pg.Pool({
  user: 'brox', // should be a superuser on your local postgres setup
  host:'127.0.0.1',
  database: 'postgres'
});

const makeTableQuery = `CREATE TABLE IF NOT EXISTS albumdata (id SERIAL PRIMARY KEY, data JSON NOT NULL)`
pool.query(makeTableQuery);

module.exports.insertData = async (dataArr) => {
  const valuesArray = [];
  const paramsArray = [];

  for (let i = 0; i < dataArr.length; i++) {
    valuesArray.push(`($${i+1})`);
    let jsonObj = JSON.stringify(dataArr[i]);
    paramsArray.push(jsonObj);
  }
  const valuesString = valuesArray.join(',  ');
  const testLoadQuery = `INSERT INTO albumdata(data) VALUES ${valuesString}`;

  const response = await pool.query(testLoadQuery, paramsArray)
    .then(response => response.rowCount);

  return response;
}

module.exports.getEntryByID = async (id) => {
  console.log(`processing getEntryByID query for id ${id}`)
  const queryString = `SELECT data FROM albumdata WHERE id = $1`;
  const response = await pool.query(queryString, [id])
  return response;
}

module.exports.deleteEntryByID = async (id) => {
  console.log(`processing deleteEntryByID query for id ${id}`)
  const queryString = `DELETE FROM albumdata WHERE id = $1`;
  const response = await pool.query(queryString, [id]);
  return response;
}

module.exports.addEntry = async (comments) => {
  console.log(`processing addEntry query`)
  const queryString = `INSERT INTO albumdata(data) VALUES ($1)`;
  const response = await pool.query(queryString, [comments]);
  return response;
}

module.exports.updateEntryByID = async(id, comments) => {
  console.log(`processing updateEntryByID query for id ${id}`)
  const queryString = `UPDATE albumdata SET data = $1 WHERE id = $2`;
  const response = await pool.query(queryString, [comments, id]);
  return response;
}

// test query
// (async () => {
//   const response = await module.exports.deleteEntryByID(28);
//   console.log(JSON.stringify(response));
//   pool.end();
// })();

module.exports.endPool = () => {
  pool.end();
}