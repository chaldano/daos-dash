const { Client } = require('pg');


function getClient() {
  const client = new Client({
    user: 'kbb',
    host: 'att',
    database: 'swf',
    password: 'dime!trans',
    port: '5432',
    // connectionTimeoutMillis: '5000',
    // query_timeout: '1000',
  })

  return client;
}

module.exports = { getClient };
