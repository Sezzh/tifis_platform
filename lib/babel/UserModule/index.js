var $ = require('jquery');
var Cookies = require('js-cookie');
/**
 * variables with "$" means a jquery DOM object instead of normal
 * DOM object.
 */

function UserModule() {

    var $btnProfessor = $('[data-btn="professor"]');
    $btnProfessor[0].addEventListener('click', () => {
        var args = {
            entitySelected: 'professor',
            entityNoSelected: 'student',
            btn: $btnProfessor
        };
        openLoginRegisterForm(args);
    });

    var $btnStudent = $('[data-btn="student"]');
    $btnStudent[0].addEventListener('click', () => {
        var args = {
            entitySelected: 'student',
            entityNoSelected: 'professor',
            btn: $btnStudent
        };
        openLoginRegisterForm(args);
    });

    var $registerForm = $('[data-form-registry="form"]');
    $registerForm.submit((event) => {
        event.preventDefault();
        var fragArgs = {
            attribute: 'data-form-registry',
            attributeValue: 'error',
            parentClass: 'main-login-container__section__form-container' +
                '__registry-form__error-container',
            childClass: 'main-login-container__section__form-container' +
                '__registry-form__error-container__msg'
        };
        //validation process on this function
        validateRegistryForm(fragArgs);
    });

    var $passwordRepeatField = $(
            '[data-form-registry="password_repeat"]');
    $passwordRepeatField[0].addEventListener('keyup', (event) => {
        var fragArgs = {
            attribute: 'data-form-registry',
            attributeValue: 'error',
            parentClass: 'main-login-container__section__form-container' +
                '__registry-form__error-container',
            childClass: 'main-login-container__section__form-container' +
                '__registry-form__error-container__msg'
        };
        validateFields($('[data-form-registry="password"]').val(),
                         $passwordRepeatField.val(), event, fragArgs);
    });

    var $emailRepeatField = $('[data-form-registry="email_repeat"]');
    $emailRepeatField[0].addEventListener('keyup', (event) => {
        var fragArgs = {
            attribute: 'data-form-registry',
            attributeValue: 'error',
            parentClass: 'main-login-container__section__form-container' +
                '__registry-form__error-container',
            childClass: 'main-login-container__section__form-container' +
                '__registry-form__error-container__msg'
        };
        validateFields($('[data-form-registry="email"]').val(),
                         $emailRepeatField.val(), event, fragArgs);
    });
    /**
     * check if this if really works
     */
    if (document.querySelector('[data-language="btn_language"]') != null) {
      var $languageBtn = $('[data-language="btn_language"]');
      $languageBtn[0].addEventListener('click', (event) => {
        var $languageContainer = $('[data-language="container"]');
        $languageContainer.toggleClass('u--show-container');
        $languageContainer.toggleClass('u--show-language-menu');
      });
    }

    /**
     * openLoginRegisterForm()
     * Its work is to apply, handle and show the respective form for
     * professors and students.
     * @param <object> args
     */
    function openLoginRegisterForm(args) {
        var $headerElement = $('.js-header');
        var $formSectionElement = $('[data-form-registry="container"]');
        var $btnContainerEntity =
            $('[data-btn-container=' + args.entitySelected + ']');
        var $btnContainerNoEntity =
            $('[data-btn-container=' + args.entityNoSelected + ']');

        //form style change
        $formSectionElement
            .toggleClass('u--heightChange')
            .toggleClass('u--' + args.entitySelected + '-background');


        //Header style change
        if ($headerElement.hasClass('header--background')) {
            $headerElement
                .toggleClass('header--background')
                .toggleClass('u--' + args.entitySelected + '-color');
        } else if ($headerElement.hasClass('u--' + args.entityNoSelected +
                   '-color')) {
            $headerElement
                .toggleClass('u--' + args.entityNoSelected + '-color')
                .toggleClass('u--' + args.entitySelected + '-color');
        } else if (!$headerElement.hasClass('u--' + args.entitySelected +
                   '-color')) {
            $headerElement.toggleClass('u--' + args.entitySelected + '-color');
        } else if ($headerElement.hasClass('u--' + args.entitySelected +
                   '-color')) {
            $headerElement
                .toggleClass('u--' + args.entitySelected + '-color')
                .toggleClass('header--background');
        }

        //btn style change
        $btnContainerEntity.toggleClass('u--max-width');
        args.btn.toggleClass('mdl-button--form-active');
        $btnContainerNoEntity.toggleClass('u--min-width');

        //set the type of account
        setInputTypeAccount(args.entitySelected);

        //set bright line style
        setBrightLineFieldsStyle(args.entitySelected, args.entityNoSelected);
        //getting the phrases
        if (!sessionStorage.getItem('phrase')) {
            getPhrases().then((data) => {
                sessionStorage.setItem('professor',
                    JSON.stringify(data.professor));
                sessionStorage.setItem('student',
                    JSON.stringify(data.student));
                sessionStorage.setItem('phrase',
                    JSON.stringify({callmade: true}));
                setPhrase(args.entitySelected);
            });
        } else {
            if (sessionStorage.getItem('containerPhrase')) {
                $('.js-main-login-container__section__phrase').remove();
            }
            setPhrase(args.entitySelected);
        }
    }

    function setPhrase(key) {
        var fragArgs = { elements: [] };
        var $phraseElement;
        var frag;
        fragArgs.elements.push({
            name: 'h3',
            styleClases: [
                'main-login-container__section__phrase',
                'js-main-login-container__section__phrase'
            ]
        });
        fragArgs.elements[0].content = sessionStorage.getItem(key);
        frag = createAdvanceFrags(fragArgs);
        $('[data-form-registry="form"]').before(frag);
        sessionStorage.setItem('containerPhrase',
            JSON.stringify({container: true}));
    }

    function setBrightLineFieldsStyle(entitySelected, entityNoSelected) {
        var classChoice = 'mdl-textfield__label--' + entitySelected;
        var classNoChoice = 'mdl-textfield__label--'+ entityNoSelected;
        $('.mdl-js-textfield').each(function() {
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].tagName === 'LABEL') {
                    if (this.children[i].classList.contains(classNoChoice)) {
                        this.children[i].classList.remove(classNoChoice);
                        this.children[i].classList.add(classChoice);
                    } else if (this.children[i].classList
                               .contains(classChoice)) {
                        this.children[i].classList.remove(classChoice);
                        this.children[i].classList.add(classChoice);
                    }
                    this.children[i].classList.add(classChoice);
                }
            }
        });
    }


    /**
     * validateRegistryForm()
     * Its work is for validate the mail and the password equals with its
     * secound textfield and watch if any field is empty, because all fields
     * must be filled.
     * @param <object> fragArgs
     * @return <boolean> flag
     */
    function validateRegistryForm(fragArgs) {
        var form = document.querySelector('[data-form-registry="form"]');
        var email =
            document.querySelector('[data-form-registry="email"]');
        var repeatEmail =
            document.querySelector('[data-form-registry="email_repeat"]');
        var username =
            document.querySelector('[data-form-registry="username"]');
        var password =
            document.querySelector('[data-form-registry="password"]');
        var repeatPassword =
            document.querySelector('[data-form-registry="password_repeat"]');
        var enrollment =
            document.querySelector('[data-form-registry="enrollment"]');
        var name =
            document.querySelector('[data-form-registry="name"]');
        var lastName =
            document.querySelector('[data-form-registry="last_name"]');
        var motherLastName =
            document.querySelector('[data-form-registry="mother_last_name"]');
        var antibotField =
            document.querySelector('[data-form-registry="username_b"]');
        var accountType =
            document.querySelector('[data-form-registry="account_type"]');
        var arrayWithErrors = [];
        var arrayFields = [
            email,
            repeatEmail,
            username,
            password,
            repeatPassword,
            enrollment,
            name,
            lastName,
            motherLastName,
        ];
        var EMPTY_FIELD = 'Tienes algún campo vacio,' +
            ' no puedes dejar campos vacios.';
        var EMPTY_FIELDS = 'Tienes campos vacios, ' +
            'todos los campos son obligatorios.';
        var LABEL_CHILD_POSITION = 3; //the position in DOM of the label
        var domFragment;
        var flag = false;
        var mailEquals = false;
        var passEquals = false;
        var fieldsFilled = false;
        var countError = 0;
        var parent;
        var sibling;
        var formAtt = {};
        var args = { elements: [] };
        var csrftoken = Cookies.get('csrftoken');
        var xhrData;
        var xhrUrl;
        for (var i = 0; i < form.attributes.length; i++) {
            if (form.attributes[i].name === 'data-form-registry') {
                formAtt.dataAttribute = '[' + form.attributes[i].name + '=' +
                '"' + form.attributes[i].value + '"]';
                formAtt.dataValue = form.attributes[i].value;
            }
        }
        for (var i = 0; i < arrayFields.length; i++) {
            if (!arrayFields[i].value) {
                arrayWithErrors[i] = false; //the fild is empty
            } else {
                arrayWithErrors[i] = true; //the field has something
            }
        }
        for (var i = 0; i < arrayWithErrors.length; i++) {
            if (!arrayWithErrors[i]) {
                countError = countError + 1;
                parent = arrayFields[i].parentNode;
                sibling = parent.childNodes[LABEL_CHILD_POSITION];
                parent.className += '  ' + 'is-focused';
                sibling.className += '  ' +
                    'mdl-textfield__label--validate-error';
            }
        }

        args.elements.push({
            name: 'span',
            styleClases: [
                fragArgs.childClass
            ]
        },
        {
            name: 'div',
            styleClases: [
                fragArgs.parentClass
            ],
            attributesList: [
                fragArgs.attribute
            ],
            attributeValueList: [
                fragArgs.attributeValue
            ]
        });

        if (countError === 0) {
            fieldsFilled = true;
        } else if (countError === 1) {
            args.elements[0].content = EMPTY_FIELD;
            domFragment = createAdvanceFrags(args);
            appendErrorRegistryFormToEnd(domFragment, formAtt.dataAttribute);
        } else if (countError > 1) {
            args.elements[0].content = EMPTY_FIELDS;
            domFragment = createAdvanceFrags(args);
            appendErrorRegistryFormToEnd(domFragment, formAtt.dataAttribute);
        }
        if (email.value === repeatEmail.value) {
            mailEquals = true;
        } else {

        }
        if (password.value === repeatPassword.value) {
            passEquals = true;
        } else {

        }
        if (mailEquals && passEquals && fieldsFilled &&
            !antibotField.innerHTML) {
            var xhrData = {
                csrfmiddlewaretoken: csrftoken,
                email: email.value,
                username: username.value,
                password: password.value,
                enrollment: enrollment.value,
                name: name.value,
                last_name: lastName.value,
                mother_last_name: motherLastName.value,
                account_type: ''
            };
            for (var i = 0; i < form.attributes.length; i++) {
                if (form.attributes[i].name === 'action') {
                    xhrUrl = form.attributes[i].value;
                }
            }
            for (var i = 0; i < accountType.attributes.length; i++) {
                if (accountType.attributes[i].name === 'value') {
                    xhrData.account_type = accountType.attributes[i].value;
                }
            }
            //here we send the form with AJAX

            Promise.resolve($.post(xhrUrl, xhrData)).then((response) => {
                args.elements[0].content = response.message + ' ' +
                    'Usuario: ' + response.username;
                domFragment = createAdvanceFrags(args);
                appendErrorRegistryFormToEnd(
                    domFragment,
                    formAtt.dataAttribute);
            });
        }
    }

    function setInputTypeAccount(value) {
        var field =
            document.querySelector('[data-form-registry="account_type"]');
        for (var i = 0; i < field.attributes.length; i++) {
            if (field.attributes[i].name === 'value') {
                field.attributes[i].value = value;
            }
        }
    }
    /**
     * createAdvanceFrags()
     * This creates a HTML element frag that can be append to the DOM tree.
     * @param {object} args This is a param with this structure:
     *     args:{elements: [{name:<string>, styleClases: [], attributesList: []
     *     , attributeValueList: [], content:<string>}]};
     *     You can create any levels of tags embedded in one parent node.
     * @return {object} frag a DOM element frag that can be append to the DOM
     *     tree.
     *
     */
    function createAdvanceFrags(args) {
        var frag = document.createDocumentFragment();
        var arrayElements = [];
        var loopControl = true;
        var child;
        var parent;
        for (var i = 0; i < args.elements.length; i++) {
            arrayElements.push(document.createElement(args.elements[i].name));
            if (args.elements[i].styleClases) {
                if (args.elements[i].styleClases.length > 0) {
                    for (var j = 0; j < args.elements[i].styleClases.length;
                         j++) {
                        arrayElements[i]
                            .classList.add(args.elements[i].styleClases[j]);
                    }
                }
            }
            if (args.elements[i].attributesList) {
                if (args.elements[i].attributesList.length > 0) {
                    for (var j = 0; j < args.elements[i].attributesList.length;
                         j++) {
                        arrayElements[i].setAttribute(
                            args.elements[i].attributesList[j],
                            args.elements[i].attributeValueList[j]);
                    }
                }
            }
            if (args.elements[i].content !== '') {
                if (!args.elements[i].content) {
                    arrayElements[i].innerHTML = '';
                } else {
                    arrayElements[i].innerHTML = args.elements[i].content;
                }
            }
        }
        while (loopControl) {
            if (arrayElements.length === 0) {
                frag.appendChild(parent);
                loopControl = false;
            } else if (arrayElements.length === 1) {
                parent = arrayElements.shift();
                if (child) {
                    parent.appendChild(child);
                }
            } else {
                child = arrayElements.shift();
                arrayElements[0].appendChild(child);
            }
        }
        return frag;
    }

    /**
     * Append the message error to the DOM tree and remove any other error
     * inserted before.
     * @param <object> fragment
     * @param <string> parent DOM selector
     */
    function appendErrorRegistryFormToEnd(fragment, parent) {
        var actualError = '[' + fragment.lastChild.attributes[1].name + '=' +
            '"' +  fragment.lastChild.attributes[1].value + '"' + ']';
        parent = document.querySelector(parent);
        if (document.querySelector(actualError)) {
            parent.removeChild(document.querySelector(actualError));
        }
        parent.appendChild(fragment);
    }

    function validateFields(value, valueToMatch, event, fragArgs) {
        var NO_MATCH = 'Estos campos no coinciden.';
        var MATCH = 'Coinciden.';
        var domFragment;
        var parent = event.target.parentNode;
        var grandParent = parent.parentNode;
        var args = { elements: [] };

        args.elements.push({
            name: 'span',
            styleClases: [
                fragArgs.childClass
            ]
        },
        {
            name: 'div',
            styleClases: [
                fragArgs.parentClass
            ],
            attributesList: [
                fragArgs.attribute
            ],
            attributeValueList: [
                fragArgs.attributeValue
            ]
        });
        if (value !== valueToMatch) {
            args.elements[0].content = NO_MATCH;
            domFragment = createAdvanceFrags(args);
            appendErrorMatchMessage(domFragment, grandParent, parent);
        } else {
            args.elements[0].content = MATCH;
            domFragment = createAdvanceFrags(args);
            appendErrorMatchMessage(domFragment, grandParent, parent);
        }
    }

    function appendErrorMatchMessage(fragment, grandParent, parent) {
        var actualError = '[' + fragment.lastChild.attributes[1].name + '=' +
            '"' +  fragment.lastChild.attributes[1].value + '"' + ']';
        if (document.querySelector(actualError)) {
            grandParent.removeChild(document.querySelector(actualError));
        }
        grandParent.insertBefore(fragment, parent.nextSibling);
    }

    function getPhrases() {
        return Promise.resolve($.get('/static/general/js/phrases.json'))
            .then((res) => {
                var data = JSON.parse(res);
                return Promise.resolve(data);
            });
    }
}

module.exports = UserModule;
