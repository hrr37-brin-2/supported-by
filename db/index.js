const pg = require('pg');
require('dotenv').config();
const pool = new pg.Pool({
  user: process.env.PG_EC2_USER, // should be a superuser on your local postgres setup
  port: 5432,
  password: process.env.PG_EC2_PW,
  host: process.env.PG_EC2_HOST,
  database: 'bandland'
});

module.exports.insertData = async (dataArr) => {

  try {
    const valuesArray = [];
    const paramsArray = [];

    const makeTableQuery = `CREATE TABLE IF NOT EXISTS albumdata (id SERIAL PRIMARY KEY, data JSON NOT NULL)`
    const makeTableResult = await pool.query(makeTableQuery);

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
  } catch(e) {
    console.log('error during PostgreSQL db insert: ', e);
  }
}

module.exports.getEntryByID = async (id) => {
  try {
    console.log(`processing getEntryByID query for id ${id}`)
    const queryString = `SELECT data FROM albumdata WHERE id = $1`;
    const response = await pool.query(queryString, [id])
    return response;
  } catch(e) {
    console.log(`error getting entry at id ${id}: `, e)
  }
}

module.exports.deleteEntryByID = async (id) => {
  try {
    console.log(`processing deleteEntryByID query for id ${id}`)
    const queryString = `DELETE FROM albumdata WHERE id = $1`;
    const response = await pool.query(queryString, [id]);
    return response;
  } catch(e) {
    console.log(`error deleting entry at id ${id}: `, e);
  }
}

module.exports.addEntry = async (comments) => {
  try {
    console.log(`processing addEntry query`)
    const queryString = `INSERT INTO albumdata(data) VALUES ($1)`;
    const response = await pool.query(queryString, [comments]);
    return response;
  } catch(e) {
    console.log(`error adding entry: `, e);
  }
}

module.exports.updateEntryByID = async(id, comments) => {
  try {
    console.log(`processing updateEntryByID query for id ${id}`)
    const queryString = `UPDATE albumdata SET data = $1 WHERE id = $2`;
    const response = await pool.query(queryString, [comments, id]);
    return response;
  } catch(e) {
    console.log(`error updating entry at id ${id}: `, e);
  }
}

module.exports.endPool = () => {
  pool.end();
}