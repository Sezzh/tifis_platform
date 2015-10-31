var $ = require('jquery');

function userModule() {
    var btnprofessor = $('[data-btn="professor"]');
    btnprofessor.addEventListener('click', function(event) {
        console.log(event);
    });
}

module.exports = userModule;
