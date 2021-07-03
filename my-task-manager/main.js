/* eslint-disable no-console */
const path = require('path');
const { app, ipcMain } = require('electron');
const mdb = require('./mdb');
const Window = require('./Window');

require('electron-reload')(__dirname);

function main() {
  const mainWindow = new Window({
    file: path.join('renderer', 'index.html'),
  });

  let addTaskWin;
  let updateTaskWin;

  mainWindow.once('show', () => {
    mdb.createDBAndTables().then(() => {
      mdb
        .getTasks()
        .then((rows) => {
          mainWindow.send('tasks', rows);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  ipcMain.on('add-task-window', () => {
    if (!addTaskWin) {
      addTaskWin = new Window({
        file: path.join('renderer', 'add.html'),
        width: 800,
        height: 800,
        // close with the main window
        parent: mainWindow,
      });

      // cleanup
      addTaskWin.on('closed', () => {
        addTaskWin = null;
        // mainWindow.reload()
      });
    }
  });
  ipcMain.on('update-task-window', (event, taskInfo) => {
    if (!updateTaskWin) {
      updateTaskWin = new Window({
        file: path.join('renderer', 'update.html'),
        width: 800,
        height: 800,
        // close with the main window
        parent: mainWindow,
        webPreferences: {
          additionalArguments: [`recordInfo=${taskInfo}`],
        },
      });
      // cleanup
      updateTaskWin.on('closed', () => {
        updateTaskWin = null;
        // mainWindow.reload()
      });
    }
    updateTaskWin.once('show', () => {
      mdb.getTaskDetails(taskInfo).then((rows) => {
        console.log(rows);

        updateTaskWin.send('updateTaskInfo', rows);
      }).catch((error) => {
        console.log(error);
      });
    });
  });

  ipcMain.on('add-task', (event, task) => {
    mdb.insertTask(task).then(() => {
      mdb.getTasks().then((rows) => {
        mainWindow.send('tasks', rows);
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  });
  ipcMain.on('update-task', (event, task) => {
    mdb.updateTask(task).then(() => {
      mdb.getTasks().then((rows) => {
        mainWindow.send('tasks', rows);
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  });

  ipcMain.on('delete-task', (event, deleteTaskInfo) => {
    mdb.deleteTask(deleteTaskInfo).then(() => {
      mdb.getTasks().then((rows) => {
        console.log(rows);
        mainWindow.send('tasks', rows);
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  });
  ipcMain.on('search-tasks', (event, searchStr) => {
    mdb.searchTasks(searchStr).then((rows) => {
      mainWindow.send('tasks', rows);
    }).catch((error) => {
      console.log(error);
    });
  });
  ipcMain.on('refresh-tasks', () => {
    mdb.getTasks().then((rows) => {
      mainWindow.send('tasks', rows);
    }).catch((error) => {
      console.log(error);
    });
  });
}

app.on('ready', main);

app.on('window-all-closed', () => {
  app.quit();
});
