const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  keyspace: 'testyboi'
})

module.exports.insertData = async (dataArr) => {
  try {
    const queries = dataArr.map((entry) => {
      return {
        query: `INSERT INTO albumdata (albumID, comments) VALUES (?, ?)`,
        params: [entry.albumId, JSON.stringify(entry.comments)]
      }
    })

    const response = await client.batch(queries, {prepare: true});

    return response;
  } catch(e) {
    console.log('error in cassandra DB insert: ', e);
  }
}

/*
const queries = [
  {
    query: 'UPDATE user_profiles SET email=? WHERE key=?',
    params: [ emailAddress, 'hendrix' ]
  },
  {
    query: 'INSERT INTO user_track (key, text, date) VALUES (?, ?, ?)',
    params: [ 'hendrix', 'Changed email', new Date() ]
  }
];
*/