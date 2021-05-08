/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable linebreak-style */
/* eslint-disable import/extensions */
import Widget from './widget';

import Storage from './storage';

const storage = new Storage();
const widget = new Widget();
const elTasks = document.querySelector('#tasks');
let draggedEl = null;
let ghostEl = null;
let widthEl;
let heightEl;
let topEl;
let leftEl;

function elDragDrop(e, element) {
  const closest = document.elementFromPoint(e.clientX, e.clientY);
  const { top } = closest.getBoundingClientRect();

  if (closest.classList.contains('item-task')) {
    if (e.pageY > window.scrollY + top + closest.offsetHeight / 2) {
      closest
        .closest('.item-tasks')
        .insertBefore(element, closest.nextElementSibling);
    } else {
      closest.closest('.item-tasks').insertBefore(element, closest);
    }
  } else if (
    closest.classList.contains('item-tasks')
    && !closest.querySelector('.item-task')
  ) {
    closest.append(element);
  }
}

function objectTasks() {
  const todoTasks = document.querySelectorAll('#todo .item-tasks .item-task');
  const inProgressTasks = document.querySelectorAll(
    '#in-progress .item-tasks .item-task',
  );
  const doneTasks = document.querySelectorAll('#done .item-tasks .item-task');

  const objTasks = {
    todo: [],
    inProgress: [],
    done: [],
  };

  for (const item of todoTasks) {
    objTasks.todo.push(item.textContent.replace(' ✖', ''));
  }

  for (const item of inProgressTasks) {
    objTasks.inProgress.push(item.textContent.replace(' ✖', ''));
  }

  for (const item of doneTasks) {
    objTasks.done.push(item.textContent.replace(' ✖', ''));
  }
  storage.save(objTasks);
}

document.addEventListener('DOMContentLoaded', () => {
  const storageData = JSON.parse(storage.load());
  if (storageData !== null) {
    widget.initTasks(storageData);
  }
});

elTasks.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('add-task')) {
    e.target.parentNode.querySelector('.input-task').classList.remove('hidden');
    e.target.classList.add('hidden');
  } else if (e.target.classList.contains('btnRemoveTask')) {
    e.target
      .closest('.col')
      .querySelector('.add-task')
      .classList.remove('hidden');
    e.target.parentNode.classList.add('hidden');
  } else if (e.target.classList.contains('btnAdTask')) {
    const elAddTask = e.target
      .closest('.col')
      .querySelector('.item-tasks');
    const elInput = e.target.closest('.input-task').querySelector('#text-task');
    widget.addTask(elAddTask, elInput.value);
    elInput.value = '';
    e.target
      .closest('.col')
      .querySelector('.add-task')
      .classList.remove('hidden');
    e.target.parentNode.classList.add('hidden');
    objectTasks();
  } else if (e.target.classList.contains('del-task')) {
    const itemDel = e.target.parentNode;
    itemDel.parentNode.removeChild(itemDel);
    objectTasks();
  } else if (e.target.classList.contains('item-task')) {
    e.preventDefault();
    e.target.querySelector('.del-task').classList.add('hidden');
    const { top, left } = e.target.getBoundingClientRect();
    draggedEl = e.target;
    widthEl = draggedEl.offsetWidth;
    heightEl = draggedEl.offsetHeight;
    leftEl = e.pageX - left;
    topEl = e.pageY - top;

    ghostEl = e.target.cloneNode(true);
    ghostEl.innerHTML = '';
    ghostEl.style.backgroundColor = 'white';
    ghostEl.style.width = `${widthEl}px`;
    ghostEl.style.height = `${heightEl}px`;

    draggedEl.classList.add('dragged');
    e.target.parentNode.insertBefore(ghostEl, e.target.nextElementSibling);
    draggedEl.style.backgroundColor = 'white';
    draggedEl.style.left = `${e.pageX - leftEl}px`;
    draggedEl.style.top = `${e.pageY - topEl}px`;
    draggedEl.style.width = `${widthEl}px`;
    draggedEl.style.height = `${heightEl}px`;
  }
});

elTasks.addEventListener('mousemove', (e) => {
  if (draggedEl) {
    e.preventDefault();
    elDragDrop(e, ghostEl);
    draggedEl.style.left = `${e.pageX - leftEl}px`;
    draggedEl.style.top = `${e.pageY - topEl}px`;
  }
});

elTasks.addEventListener('mouseup', (e) => {
  if (draggedEl) {
    elDragDrop(e, draggedEl);
    ghostEl.parentNode.removeChild(ghostEl);
    draggedEl.classList.remove('dragged');
    draggedEl.style = '';
    ghostEl = null;
    draggedEl = null;
    objectTasks();
  }
});
