/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
const { shell } = require('electron');
const { ipcRenderer } = require('electron');

require('linkifyjs/plugins/hashtag'); // optional
const linkifyHtml = require('linkifyjs/html');

const deleteTask = (e) => {
  ipcRenderer.send('delete-task', e.target.value);
};
const updateTask = (e) => {
  ipcRenderer.send('update-task-window', e.target.value);
};

document.getElementById('searchTasksBtn').addEventListener('click', () => {
  document.getElementById('searchFilter').innerHTML = document.getElementById('search-task-info').value;
  ipcRenderer.send('search-tasks', [
    document.getElementById('search-task-info').value,
  ]);
});

document.getElementById('createTaskBtn').addEventListener('click', () => {
  ipcRenderer.send('add-task-window');
});
document.getElementById('refreshTaskBtn').addEventListener('click', () => {
  document.getElementById('searchFilter').innerHTML = '';
  document.getElementById('search-task-info').value = '';
  ipcRenderer.send('refresh-tasks');
});

ipcRenderer.on('tasks', (event, tasks) => {
  const taskList = document.getElementById('mytasktable-body');
  const taskItems = tasks.reduce((html, task) => {
    let taskDes = linkifyHtml(task.taskdescription, {
      defaultProtocol: 'https',
      target: {
        url: '_blank',
      },
      format(value, type) {
        if (type === 'url' && value.length > 50) {
          value = `${value.slice(0, 70)}…`;
        }
        return value;
      },
      className: 'task-desc-link',
    });
    taskDes = taskDes.replace(/\r\n|\r|\n/g, '<br />');

    html += `<tr>
              <td><div style="word-wrap: break-word; width:150px">${task.taskinfo}</div></td>
              <td><div style="word-wrap: break-word;overflow-y: scroll; height:300px;">${taskDes}</div></td>
              <td>
              <div style="width:50px">
                <div class="popover popover-left">
                <button class="btn btn-link">Details</button><br/>
                  <div class="popover-container">
                    <div class="card">

                      <div class="card-body">


                          <div class="text-bold">Group</div>
                          <div class="tile-subtitle">${task.taskgroup}</div>


                          <div class="text-bold">Tags</div>
                          <div class="tile-subtitle">${task.tasktags}</div>


                          <div class="text-bold">Priority</div>
                          <div class="tile-subtitle">${task.taskpriority}</div>


                          <div class="text-bold">Status</div>
                          <div class="tile-subtitle">${task.status}</div>


                          <div class="text-bold">Created on</div>
                          <div class="tile-subtitle">${task.createdon}</div>


                          <div class="text-bold">Update on</div>
                          <div class="tile-subtitle">${task.updatedon}</div>


                      </div>

                      </div>

                  </div>
                </div>
              </div>
    <button class="update-task-btn btn btn-link" name="${task.randomId}" value="${task.randomId}">Update</button><br/>
    <button class="delete-task-btn btn btn-link" name="${task.randomId}" value="${task.randomId}">Archive</button>
    </div></td></tr>`;

    return html;
  }, '');

  taskList.innerHTML = taskItems;
  taskList.querySelectorAll('.delete-task-btn').forEach((item) => {
    item.addEventListener('click', deleteTask);
  });
  taskList.querySelectorAll('.update-task-btn').forEach((item) => {
    item.addEventListener('click', updateTask);
  });
  taskList.querySelectorAll('.task-desc-link').forEach((linkA) => {
    linkA.addEventListener('click', (event) => {
      if (
        event.target.tagName === 'A'
        && event.target.href.startsWith('http')
      ) {
        event.preventDefault();

        shell.openExternal(event.target.href);
      }
    });
  });
});
