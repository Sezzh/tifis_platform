var $ = require('jquery');
var Cookies = require('js-cookie');

function GroupModule() {

  var $btnProfessor = document.querySelector('[data-btn="professor"]');
  $btnProfessor.on('click', (event) => {
    console.log('trigger event from GroupModule');
    console.log(event);
  });

}

module.exports = GroupModule;
