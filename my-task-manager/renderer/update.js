/* eslint-disable no-undef */
const { ipcRenderer } = require('electron');

ipcRenderer.on('updateTaskInfo', (event, tasks) => {
  document.getElementById('update-task-info').value = tasks[0].taskinfo;
  document.getElementById('update-task-description').children[0].innerHTML = tasks[0].taskdescription;
  document.getElementById('update-task-group').value = tasks[0].taskgroup;
  document.getElementById('update-task-priority').value = tasks[0].taskpriority;
  document.getElementById('update-task-tags').value = tasks[0].tasktags;
  document.getElementById('update-task-id').value = tasks[0].randomId;
  document.getElementById('update-task-createdon').value = tasks[0].createdon;
  document.getElementById('update-task-status').value = tasks[0].status;
});
document.getElementById('updateTaskbtntop').addEventListener('click', () => {
  ipcRenderer.send('update-task', [document.getElementById('update-task-info').value, document.getElementById('update-task-description').children[0].innerHTML, document.getElementById('update-task-group').value, document.getElementById('update-task-priority').value, document.getElementById('update-task-tags').value, document.getElementById('update-task-status').value, document.getElementById('update-task-createdon').value, document.getElementById('update-task-id').value]);
  window.close();
});
document.getElementById('updateTaskbtnbtm').addEventListener('click', () => {
  ipcRenderer.send('update-task', [document.getElementById('update-task-info').value, document.getElementById('update-task-description').children[0].innerHTML, document.getElementById('update-task-group').value, document.getElementById('update-task-priority').value, document.getElementById('update-task-tags').value, document.getElementById('update-task-status').value, document.getElementById('update-task-createdon').value, document.getElementById('update-task-id').value]);
  window.close();
});
