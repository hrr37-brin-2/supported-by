const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'bandland',
  localDataCenter: 'datacenter1'
})

module.exports.shutdown = () => {
  client.shutdown();
}

module.exports.insertData = async (dataArr) => {
  const makeTableQuery = `CREATE TABLE IF NOT EXISTS albumdata (albumid INT, comments TEXT, PRIMARY KEY (albumid))`;

  client.execute(makeTableQuery, (err, res) => {
    if (err) {
      console.log(err);
    }
  });

  try {
    const queries = dataArr.map((entry) => {
      return {
        query: `INSERT INTO albumdata (albumID, comments) VALUES (?, ?)`,
        params: [Number(entry.albumID), JSON.stringify(entry.comments)]
      }
    })
    const response = await client.batch(queries, {prepare: true});
    return response;
  } catch(e) {
    console.log('error during Cassandra db insert: ', e);
  }
}