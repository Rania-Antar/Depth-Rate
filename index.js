const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./database/inkyfada', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the data database');
  });
  db.serialize(() => {

   
  db.all('SELECT * FROM Records', [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        console.log("Records");
        console.log(row.name);
        console.log("***********************************************************************************");
      });
    });
    db.all('SELECT * FROM Events', [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
            console.log("Events");
          console.log(row.name);
        });
      });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
  });

  //Error: SQLITE_CORRUPT: database disk image is malformed