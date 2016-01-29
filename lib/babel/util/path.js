var $ = require('jquery');

class PathApi {
  constructor() {
    var pathArray = [];
    this._path = decodeURI(document.location.pathname);
    this._username;
    this._period;
    this._signature;
    this._group;
    pathArray = this.path.split('/');
    pathArray.pop();
    pathArray.shift();
    for (var i = 0; i < pathArray.length; i++) {
      if (i === 0) {
        this.username = pathArray[i];
      } else if (i === 1) {
        this.period = pathArray[i];
      } else if (i === 2) {
        this.signature = pathArray[i];
      } else if (i === 3) {
        this.group = pathArray[i];
      }
    }

  }

  get path() {
    return this._path;
  }

  get username() {
    return this._username;
  }

  get period() {
    return this._period;
  }

  get signature() {
    return this._signature;
  }

  get group() {
    return this._group;
  }

  set username(username) {
    this._username = username;
  }

  set period(period) {
    this._period = period;
  }

  set signature(signature) {
    this._signature = signature;
  }

  set group(group) {
    this._group = group;
  }
}


module.exports = PathApi;
