const pg = require('pg');
const pool = new pg.Pool({
  user: 'brox', // should be a superuser on your local postgres setup
  host:'127.0.0.1',
  database: 'postgres'
});

const makeTableQuery = `CREATE TABLE IF NOT EXISTS albumdata (id SERIAL PRIMARY KEY, data JSON NOT NULL)`
pool.query(makeTableQuery);

module.exports.insertData = async (dataArr) => {
  try {
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