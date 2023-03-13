const { getClient } = require('../db/dbfunctions_namen');

function getAll(querytext, modul) {
   const promise = new Promise(
     (resolve, reject) => {
      let data;
      let client = getClient();
      client
        .connect()
        .then(() => console.log('Connected by: ' + modul))
        .catch(e => console.error('Adressen - connection error:', e.message))
      client
        .query(querytext)
        .then(results => {
          console.log(modul + " is requesting the DB");
          data = results.rows;
          resolve(results.rows);
        })
        .catch(err => reject("Adressen - error in accessing the DB: "+ err))
        .then(() => client.end())
    }
  );
  console.log(modul + " is getting the post");
  return promise;
}

module.exports = { getAll };
