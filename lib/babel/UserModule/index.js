var $ = require('jquery');

function UserModule() {

    var btnProfessor = $('[data-btn="professor"]');
    btnProfessor[0].addEventListener('click', function() {
        openLoginRegisterForm(btnProfessor[0].getAttribute('data-btn'));
    });

    var btnStudent = $('[data-btn="student"]');
    btnStudent[0].addEventListener('click', function() {
        openLoginRegisterForm(btnStudent[0].getAttribute('data-btn'));
    });

    function openLoginRegisterForm(element) {
        /*
         *Its work is to apply, handle and show the respective form for
         *professors and students
         */
        var headerElement = $('.js-header');
        if (element === 'professor') {

            var formSectionElement = $('[data-section="professor"]');

            if (headerElement.hasClass('header--background')) {
                headerElement.toggleClass('header--background');
                headerElement.toggleClass('u--professor-color');
            } else if (headerElement.hasClass('u--student-color')) {
                headerElement.toggleClass('u--student-color');
                headerElement.toggleClass('u--professor-color');
            } else if (!headerElement.hasClass('u--professor-color')) {
                headerElement.toggleClass('u--professor-color');
            } else if (headerElement.hasClass('u--professor-color')) {
                headerElement.toggleClass('u--professor-color');
                headerElement.toggleClass('header--background');
            }
            formSectionElement.toggleClass('u--max-width');
            formSectionElement.next().toggleClass('u--min-width');
            btnStudent.toggleClass('u--min-width');
            btnProfessor.toggleClass('mdl-button--big');
        } else if (element === 'student') {
            headerElement.toggleClass('header--background');
            headerElement.toggleClass('u--student-color');

        }
    }

}

module.exports = UserModule;
