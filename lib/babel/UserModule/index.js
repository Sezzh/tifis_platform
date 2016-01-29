var $ = require('jquery');

import UserApi from '../util/user-api.js';

function UserModule() {
  if ($('[data-usermodule="user_nav"]').length) {
    var user = new UserApi();
    user.getUserData().then((response) => {
      console.log(response);
    });
  }
}

module.exports = UserModule;
