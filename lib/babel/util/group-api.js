var $ = require('jquery');

class GroupApi {
  constructor(username, periodName, signatureName) {
    this._baseUrl = document.location.origin;
    this._groupsUrl = `${this.baseUrl}/get-groups/${username}/${periodName}/` +
      `${signatureName}`;
  }

  get baseUrl() {
    return this._baseUrl;
  }

  get groupsUrl() {
    return this._groupsUrl;
  }

  findGroups() {
    if (sessionStorage['groups']) {
      sessionStorage.removeItem('groups');
    }
    return Promise.resolve($.get(this.groupsUrl)).then((data) => {
      sessionStorage.setItem('groups', JSON.stringify(data));
      return Promise.resolve(data);
    });
  }

  selectedGroup(nameUrl) {
    var groups = JSON.parse(sessionStorage['groups']);
    if (sessionStorage['currentGroup']) {
      sessionStorage.removeItem('currentGroup');
    }
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].fields.name_url === nameUrl) {
        sessionStorage.setItem('currentGroup', JSON.stringify(groups[i]));
      }
    }
  }

}

module.exports = GroupApi;
