/* eslint-disable linebreak-style */
/* eslint-disable class-methods-use-this */
/* eslint-disable linebreak-style */
export default class Storage {
  save(data) {
    localStorage.setItem('tasks', JSON.stringify(data));
  }

  load() {
    return localStorage.getItem('tasks');
  }
}
