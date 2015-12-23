var $ = require('jquery');
var Cookies = require('js-cookie');
/**
 * variables with "$" means a jquery DOM object instead of normal
 * DOM object.
 */

/**
 * UserModule()
 * This function provides functionality for userModule views.
 *
 */
function UserModule() {

  //functionality for professor button.
  var $btnProfessor = $('[data-usermodule-btn="professor"]');
  $btnProfessor.on('click', () => {
    var args = {
      entitySelected: 'professor',
      entityNoSelected: 'student',
      btn: $btnProfessor
    };
    openLoginRegisterForm(args);
  });

  //functionality for student button.
  var $btnStudent = $('[data-usermodule-btn="student"]');
  $btnStudent.on('click', () => {
    var args = {
      entitySelected: 'student',
      entityNoSelected: 'professor',
      btn: $btnStudent
    };
    openLoginRegisterForm(args);
  });

  //handle the submit request when sending the form for registry an account.
  var $registerForm = $('[data-usermodule-form-registry="form"]');
  $registerForm.submit((event) => {
    event.preventDefault();
    var fragArgs = {
      attribute: 'data-usermodule-form-registry',
      attributeValue: 'error',
      parentClass: 'main-login-container__section__form-container' +
        '__registry-form__error-container',
      childClass: 'main-login-container__section__form-container' +
        '__registry-form__error-container__msg'
    };
    //validation process on this function
    validateRegistryForm(fragArgs);
  });

  //This part of code is for validate if two passwords equals.
  var $passwordRepeatField =
    $('[data-usermodule-form-registry="password_repeat"]');
  $passwordRepeatField.on('keyup', (event) => {
    var fragArgs = {
      attribute: 'data-usermodule-form-registry',
      attributeValue: 'error',
      parentClass: [
        'main-login-container__section__form-container' +
        '__registry-form__error-container',
        'main-login-container__section__form-container' +
        '__registry-form__error-container--validate'
      ],
      childClass: 'material-icons'
    };
    validateFields($('[data-usermodule-form-registry="password"]').val(),
                   $passwordRepeatField.val(), event, fragArgs);
  });

  //This part of the code is for validate if two emails equals.
  var $emailRepeatField = $('[data-usermodule-form-registry="email_repeat"]');
  $emailRepeatField.on('keyup', (event) => {
    var fragArgs = {
      attribute: 'data-usermodule-form-registry',
      attributeValue: 'error',
      parentClass: [
        'main-login-container__section__form-container' +
        '__registry-form__error-container',
        'main-login-container__section__form-container' +
        '__registry-form__error-container--validate'
      ],
      childClass: 'material-icons'
    };
    validateFields($('[data-usermodule-form-registry="email"]').val(),
                   $emailRepeatField.val(), event, fragArgs);
  });

  /**
   * check if this if really works.
   * if btn_language is in the DOM tree, then add the functionality for
   * change the languange with the menu.
   */
  if (document.querySelector('[data-language="btn_language"]') != null) {
    var $languageBtn = $('[data-language="btn_language"]');
    $languageBtn.on('click', (event) => {
      var $languageContainer = $('[data-language="container"]');
      $languageContainer.toggleClass('u--show-container');
      $languageContainer.toggleClass('u--show-language-menu');
    });
  }

  /**
   * openLoginRegisterForm()
   * It's work is to apply, handle and show the respective form for
   * professors and students.
   * @param {object} args This object contains the entitySelected,
   *     entityNoSelected and the btn DOM object.
   */
  function openLoginRegisterForm(args) {
    var $headerElement = $('.js-header');
    var $formSectionElement = $('[data-usermodule-form-registry="container"]');
    var $btnContainerEntity =
      $('[data-usermodule-btn-container=' + args.entitySelected + ']');
    var $btnContainerNoEntity =
      $('[data-usermodule-btn-container=' + args.entityNoSelected + ']');

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
        sessionStorage.setItem('professor', JSON.stringify(data.professor));
        sessionStorage.setItem('student', JSON.stringify(data.student));
        sessionStorage.setItem('phrase', JSON.stringify({callmade: true}));
        setPhrase(args.entitySelected);
      });
    } else {
      if (sessionStorage.getItem('containerPhrase')) {
        $('.js-main-login-container__section__phrase').remove();
      }
      setPhrase(args.entitySelected);
    }
  }

  /**
   * setPhrase()
   * It's work is to set into the sessionStorage the phrases that, this view
   * use for show a little phrase when shows up the registry form, also creates
   * the DOM frag and appends the frag into the DOM tree.
   * @param {key} string entitySelected which says to this function about what
   *     type of phrase has to set up.
   */
  function setPhrase(key) {
    var fragArgs = {elements: []};
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
    $('[data-usermodule-form-registry="form"]').before(frag);
    sessionStorage.setItem('containerPhrase',
                           JSON.stringify({container: true}));
  }

  /**
   * setBrightLineFieldsStyle()
   * It's work is to change the line in the form acording to the color palette
   * in the css for professor and student.
   * @param {string} entitySelected what styles class we are going to add.
   * @param {string} entityNoSelected what styles we are going to remove.
   */
  function setBrightLineFieldsStyle(entitySelected, entityNoSelected) {
    var classChoice = 'mdl-textfield__label--' + entitySelected;
    var classNoChoice = 'mdl-textfield__label--'+ entityNoSelected;
    $('.mdl-js-textfield').each(function() {
      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].tagName === 'LABEL') {
          if (this.children[i].classList.contains(classNoChoice)) {
            this.children[i].classList.remove(classNoChoice);
            this.children[i].classList.add(classChoice);
          } else if (this.children[i].classList.contains(classChoice)) {
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
   * @param {object} fragArgs An object which contains strings for styles
   *     based on:
   *     <ul>
   *     <li>attribute
   *     <li>attributeValue
   *     <li>parentClass
   *     <li>childClass
   *     </ul>
   */
  function validateRegistryForm(fragArgs) {
    var form =
      document.querySelector('[data-usermodule-form-registry="form"]');
    var email =
      document.querySelector('[data-usermodule-form-registry="email"]');
    var repeatEmail =
      document.querySelector('[data-usermodule-form-registry="email_repeat"]');
    var username =
      document.querySelector('[data-usermodule-form-registry="username"]');
    var password =
      document.querySelector('[data-usermodule-form-registry="password"]');
    var repeatPassword =
      document
        .querySelector('[data-usermodule-form-registry="password_repeat"]');
    var enrollment =
      document.querySelector('[data-usermodule-form-registry="enrollment"]');
    var name =
      document.querySelector('[data-usermodule-form-registry="name"]');
    var lastName =
      document.querySelector('[data-usermodule-form-registry="last_name"]');
    var motherLastName =
      document
        .querySelector('[data-usermodule-form-registry="mother_last_name"]');
    var antibotField =
      document.querySelector('[data-usermodule-form-registry="username_b"]');
    var accountType =
      document.querySelector('[data-usermodule-form-registry="account_type"]');
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
    var args = {elements: []};
    var csrftoken = Cookies.get('csrftoken');
    var xhrData;
    var xhrUrl;
    for (var i = 0; i < form.attributes.length; i++) {
      if (form.attributes[i].name === 'data-usermodule-form-registry') {
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
        sibling.className += '  ' + 'mdl-textfield__label--validate-error';
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
    }
    if (password.value === repeatPassword.value) {
      passEquals = true;
    }
    if (mailEquals && passEquals && fieldsFilled && !antibotField.innerHTML) {
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
        appendErrorRegistryFormToEnd(domFragment, formAtt.dataAttribute);
      });
    }
  }

  /**
   * setInputTypeAccount()
   * It's work is to set into data-usermodule-form-registry="account_type"
   * a value for a hidden input to handle if is an account for student or
   * professor.
   * @param {string} value The value for the input hidden type account.
   */
  function setInputTypeAccount(value) {
    var field =
      document.querySelector('[data-usermodule-form-registry="account_type"]');
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
   * @return {object} frag A DOM element frag that can be append to the DOM
   *     tree.
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
          for (var j = 0; j < args.elements[i].styleClases.length; j++) {
            arrayElements[i].classList.add(args.elements[i].styleClases[j]);
          }
        }
      }
      if (args.elements[i].attributesList) {
        if (args.elements[i].attributesList.length > 0) {
          for (var j = 0; j < args.elements[i].attributesList.length; j++) {
            arrayElements[i]
              .setAttribute(args.elements[i].attributesList[j],
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
   * validateFields()
   * Validates if two values between them match, then creates the frag and
   * appends it to the DOM tree.
   * @param {string} value var to compare.
   * @param {string} valueToMatch var to mach.
   * @param {object} event DOM element who trigger the event.
   * @param {object} fragArgs object that contains this attributes:
   *     <ul>
   *     <li> attribute
   *     <li> attributeValue
   *     <li> parentClass
   *     <li> childClass
   *     </ul>
   */
  function validateFields(value, valueToMatch, event, fragArgs) {
    var NO_MATCH = 'close';
    var MATCH = 'check';
    var noMatchColor = 'md-redcolor';
    var matchColor = 'md-greencolor';
    var domFragment;
    var parent = event.target.parentNode;
    var grandParent = parent.parentNode;
    var args = {elements: []};

    args.elements.push({
      name: 'i',
      styleClases: [
        fragArgs.childClass
      ]
    },
    {
      name: 'div',
      styleClases: [],
      attributesList: [
        fragArgs.attribute
      ],
      attributeValueList: [
        fragArgs.attributeValue
      ]
    });

    for (var i = 0; i < fragArgs.parentClass.length; i++) {
      args.elements[1].styleClases.push(fragArgs.parentClass[i]);
    }

    if (value !== valueToMatch) {
      args.elements[0].content = NO_MATCH;
      args.elements[0].styleClases.push(noMatchColor);
      //debugger
      domFragment = createAdvanceFrags(args);
      appendErrorMatchMessage(domFragment, grandParent, parent);
    } else {
      args.elements[0].content = MATCH;
      args.elements[0].styleClases.push(matchColor);
      domFragment = createAdvanceFrags(args);
      appendErrorMatchMessage(domFragment, grandParent, parent);
    }
  }

  /**
   * appendErrorMatchMessage()
   * It's work is to append an error message in to the DOM tree depends on
   * the parameters we are sending and remove any other error message in the
   * same grandParent content.
   * @param {object} fragment The DOM frag to be append.
   * @param {string} grandParent The value of the grand parent where will be
   *     the fragment.
   * @param {string} parent The value of the sibling where we want to append
   *     the new child of grand parent.
   */
  function appendErrorMatchMessage(fragment, grandParent, parent) {
    var actualError = '[' + fragment.lastChild.attributes[1].name + '=' +
      '"' +  fragment.lastChild.attributes[1].value + '"' + ']';
    if (document.querySelector(actualError)) {
      grandParent.removeChild(document.querySelector(actualError));
    }
    grandParent.insertBefore(fragment, parent.nextSibling);
  }

  /**
   * appendErrorRegistryFormToEnd()
   * Append the message error to the DOM tree and remove any other error
   * inserted before.
   * @param {object} fragment
   * @param {string} parent DOM selector
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

  /**
   * getPhrases()
   * An AJAX call using jquery $.get() using ES6 promises.
   * @return {object} Promises returns a Promises with the result of the AJAX
   *     call.
   */
  function getPhrases() {
    return Promise.resolve($.get('/static/general/js/phrases.json'))
      .then((res) => {
        return Promise.resolve(res);
      });
  }
}

module.exports = UserModule;
