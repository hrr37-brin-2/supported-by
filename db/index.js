const pg = require('pg');
const pool = new pg.Pool({
  user: 'brox',
  host:'127.0.0.1',
  database: 'testdb'
});

const query = `SELECT * FROM pasta`;

pool.query(query, (err, results) => {
  if (err) {
    console.log(`db query error: `, err);
  } else {
    console.log(`db query successful! Results: `, results);
  }

  pool.end();
})