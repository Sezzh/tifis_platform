var $ = require('jquery');

class UserApi {
  constructor() {
    this._baseUrl = document.location.origin;
    this._userUrl = `${this.baseUrl}/get-current-user`;
    this._username;
    this._emaill;
    this._enrollment;
    this._name;
    this._fatherLastName;
    this._motherLastName;
  }

  deleteSessionStorageItem() {
    if(sessionStorage['user']) {
      sessionStorage.removeItem('user');
    }
  }

  saveValues(data) {
    this.username = data.username;
    this.email = data.email;
    this.enrollment = data.enrollment;
    this.name = data.name;
    this.fatherLastName = data.father_last_name;
    this.motherLastName = data.mother_last_name;
  }

  getUserData() {
    let data;
    if (!sessionStorage['user']) {
      return Promise.resolve($.get(this.userUrl)).then((response) => {
        sessionStorage.setItem('user', JSON.stringify(response));
        this.saveValues(response);
        return Promise.resolve('done');
      });
    } else {
      data = JSON.parse(sessionStorage['user']);
      this.saveValues(data);
      return Promise.resolve('done');
    }
  }

  get baseUrl() {
    return this._baseUrl;
  }

  get userUrl() {
    return this._userUrl;
  }

  get username() {
    return this._username;
  }

  get email() {
    return this._email;
  }

  get enrollment() {
    return this._enrolloment;
  }

  get name() {
    return this._name;
  }

  get fatherLastName() {
    return this._fatherLastName;
  }

  get motherLastName() {
    return this._motherLastName;
  }

  set username(username) {
    this._username = username;
  }

  set email(email) {
    this._email = email;
  }

  set enrollment(enrollment) {
    this._enrollment = enrollment;
  }

  set name(name) {
    this._name = name;
  }

  set fatherLastName(fatherLastName) {
    this._fatherLastName = fatherLastName;
  }

  set motherLastName(motherLastName) {
    this._motherLastName = motherLastName;
  }
}

module.exports = UserApi;
