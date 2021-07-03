/* eslint-disable no-plusplus */
const sqlite3 = require('sqlite3').verbose();
const os = require('os');

module.exports.createDBAndTables = function () {
  // eslint-disable-next-line prefer-template
  const database = new sqlite3.Database(`${os.homedir()}/mytaskmanager.db`);
  return new Promise((resolve, reject) => {
    database.run(
      'CREATE TABLE if not exists mytasks (id INTEGER PRIMARY KEY,randomId TEXT,taskinfo TEXT,taskdescription TEXT,taskgroup TEXT,taskpriority TEXT,tasktags TEXT,status TEXT,createdon DATETIME DEFAULT CURRENT_TIMESTAMP,updatedon DATETIME DEFAULT CURRENT_TIMESTAMP)',
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
        // get the last insert id
        database.close();
      },
    );
  });
};

module.exports.insertTask = function (taskInfo) {
  const database = new sqlite3.Database(`${os.homedir()}/mytaskmanager.db`);
  return new Promise((resolve, reject) => {
    database.run(
      'INSERT INTO mytasks(randomId,taskinfo,taskdescription,taskgroup,taskpriority,tasktags,status) VALUES(?,?,?,?,?,?,?)',
      taskInfo,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
        // get the last insert id
        database.close();
      },
    );
  });
};
module.exports.updateTask = function (taskInfo) {
  const database = new sqlite3.Database(`${os.homedir()}/mytaskmanager.db`);
  return new Promise((resolve, reject) => {
    database.run(
      'update mytasks set taskinfo=?,taskdescription=?,taskgroup=?,taskpriority=?,tasktags=?,status=?,createdon=?,updatedon=CURRENT_TIMESTAMP where randomid=?',
      taskInfo,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
        // get the last insert id
        database.close();
      },
    );
  });
};
module.exports.searchTasks = function (searchStr) {
  const db = new sqlite3.Database(`${os.homedir()}/mytaskmanager.db`);
  return new Promise((resolve, reject) => {
    const cols = ['taskinfo', 'taskdescription', 'taskgroup', 'tasktags'];
    let queryStr = '';
    for (let i = 0; i < cols.length; i++) {
      if (queryStr === '') {
        queryStr = `${queryStr + cols[i]} like '%${searchStr[0]}%'`;
      } else {
        queryStr = `${queryStr} or ${cols[i]} like '%${searchStr[0]}%'`;
      }
    }
    db.all(
      `SELECT * FROM mytasks where ${queryStr}`,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
        db.close();
      },
    );
  });
};
module.exports.getTasks = function () {
  const db = new sqlite3.Database(`${os.homedir()}/mytaskmanager.db`);

  return new Promise((resolve, reject) => {
    let query;
    const archived = false;
    if (archived === true) {
      query = 'SELECT * FROM mytasks order by updatedon desc';
    } else {
      query = "SELECT * FROM mytasks where status!='Archived' order by updatedon desc";
    }
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
      db.close();
    });
  });
};
module.exports.getTaskDetails = function (taskId) {
  const db = new sqlite3.Database(`${os.homedir()}/mytaskmanager.db`);
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM mytasks where randomId=? order by updatedon desc',
      [taskId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
        db.close();
      },
    );
  });
};
module.exports.deleteTask = function (taskUpdateInfo) {
  const database = new sqlite3.Database(`${os.homedir()}/mytaskmanager.db`);

  return new Promise((resolve, reject) => {
    database.run(
      'update mytasks set status=\'Archived\' where randomId=?',
      taskUpdateInfo,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }

        // get the last insert id
        database.close();
      },
    );
  });
};
