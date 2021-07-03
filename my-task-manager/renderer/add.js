/* eslint-disable no-undef */
const { ipcRenderer } = require('electron');

document.getElementById('addTaskbtntop').addEventListener('click', () => {
  ipcRenderer.send('add-task', [`${document.getElementById('add-task-info').value.substring(1, 10).replace(/ /g, '')}-${Math.floor(Math.random() * 100)}${1}`, document.getElementById('add-task-info').value, document.getElementById('add-task-description').children[0].innerHTML, document.getElementById('add-task-group').value, document.getElementById('add-task-priority').value, document.getElementById('add-task-tags').value, document.getElementById('add-task-status').value]);
  window.close();
});
document.getElementById('addTaskbtnbtm').addEventListener('click', () => {
  ipcRenderer.send('add-task', [`${document.getElementById('add-task-info').value.substring(1, 10).replace(/ /g, '')}-${Math.floor(Math.random() * 100)}${1}`, document.getElementById('add-task-info').value, document.getElementById('add-task-description').children[0].innerHTML, document.getElementById('add-task-group').value, document.getElementById('add-task-priority').value, document.getElementById('add-task-tags').value, document.getElementById('add-task-status').value]);
  window.close();
});
