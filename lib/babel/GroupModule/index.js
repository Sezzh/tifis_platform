var $ = require('jquery');
var Cookies = require('js-cookie');
var Hammer = require('hammerjs');
var periodItemTemplate = require('./period-list-item/template.jade');
var signatureItemTemplate = require('./signature-list-item/template.jade');
var groupItemTemplate = require('./group-list-item/template.jade');
import PeriodApi from '../util/period-api.js';
import UserApi from '../util/user-api.js';
import SignatureApi from '../util/signature-api.js';
import GroupApi from '../util/group-api.js';
import SpinnerLoader from '../util/spinner.js';

function GroupModule() {
  var baseUrl = document.location.origin;
  var userApi;
  var periodApi;
  var signatureApi;
  var groupApi;
  var spinnerLoader = new SpinnerLoader(
    '[data-groupmodule-section="spinner_container"]',
    ['u--height-lost', 'u--margin-lost'],
    '[data-groupmodule-section="spinner"]',
    'u--height-lost'
  );


  if ($('[data-usermodule="user_nav"]').length) {
    userApi = new UserApi();
  }

  if ($('[data-groupmodule-section="period"]').length) {
    userApi.getUserData().then((response) => {
      periodApi = new PeriodApi(userApi.username);
      periodApi.findPeriods().then((data) => {
        spinnerLoader.handlerSpinner();
        renderPeriods(data);
        });
    });
  }

  if ($('[data-groupmodule-section="signature"]').length) {
    userApi.getUserData().then((response) => {
      periodApi = new PeriodApi(userApi.username);
      periodApi.getCurrentPeriod().then((currentPeriod) => {
        signatureApi =
          new SignatureApi(userApi.username, currentPeriod.fields.name_url);
        signatureApi.findSignatures().then((data) => {
          spinnerLoader.handlerSpinner();
          renderSignatures(data);
        });
      });
    });
  }

  if($('[data-groupmodule-section="group"]').length) {
    var currentSignature = JSON.parse(sessionStorage['currentSignature']);
    var currentPeriod = JSON.parse(sessionStorage['currentPeriod']);
    userApi.getUserData().then((response) => {
      groupApi =
        new GroupApi(userApi.username, currentPeriod.fields.name_url, currentSignature.fields.name_url);
      groupApi.findGroups().then((data) => {
        spinnerLoader.handlerSpinner();
        renderGroups(data);
      });
    });
  }

  if ($('[data-groupmodule-btn="add_period"]').length) {
    var $btnAddPeriod = $('[data-groupmodule-btn="add_period"]');
    $btnAddPeriod.on('click', (event) => {
      openForm();
    });
  }

  var $newPeriodForm = $('[data-groupmodule-form="new_period"]');
  $newPeriodForm.submit((event) => {
    spinnerLoader.handlerSpinner();
    event.preventDefault();
    periodApi.newPeriodUrl = event.target.action;
    var csrftoken = Cookies.get('csrftoken');
    var xhrData = {
      csrfmiddlewaretoken: csrftoken,
      period_name: document.querySelector('[name="period_name"]').value,
      start_month: document.querySelector('[name="start_month"]').value,
      start_day: document.querySelector('[name="start_day"]').value,
      start_year: document.querySelector('[name="start_year"]').value,
      end_month: document.querySelector('[name="end_month"]').value,
      end_day: document.querySelector('[name="end_day"]').value,
      end_year: document.querySelector('[name="end_year"]').value
    };
    periodApi.newPeriod(xhrData).then((response) => {
      closeForm();
      periodApi.findPeriods().then((data) => {
        spinnerLoader.handlerSpinner();
        renderPeriods(data);
      });
    });
  });

  function openForm() {
    var $form = $('[data-groupmodule-form="new_period"]');
    $form.toggleClass('period-new-form--visible');
  }

  function closeForm() {
    var $form = $('[data-groupmodule-form="new_period"]');
    $form.toggleClass('period-new-form--visible');
  }

  function renderSignatures(data) {
    var $structureItem;
    var itemList = [];
    var parent = '[data-groupmodule-section="signature_list"]';
    var dataAtt = 'data-groupmodule-name-url';
    var dataSpanName = 'name';
    var dataSpanCareer = 'career';
    var itemElement;
    var linkElement;
    var spanElement;
    var href;
    var selectedSignatureName;
    var target;
    var currentPeriod = JSON.parse(sessionStorage['currentPeriod']);
    for (var i = 0; i < data.length; i++) {
      $structureItem = $($.parseHTML(signatureItemTemplate()));
      for (var j = 0; j < $structureItem.length; j++) {
        itemElement = $structureItem[j];
        for (var k = 0; k < itemElement.children.length; k++) {
          linkElement = itemElement.children[k];
          linkElement.href = `${baseUrl}/${userApi.username}/` +
            `${currentPeriod.fields.name_url}/${data[i].fields.name_url}`;
          linkElement.setAttribute(dataAtt, data[i].fields.name_url);
          $(linkElement).on('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            target = event.currentTarget;
            href = event.currentTarget.href;
            for (var n = 0; n < target.attributes.length; n++) {
              if (target.attributes[n].name === dataAtt) {
                selectedSignatureName = target.attributes[n].value;
              }
            }
            signatureApi.selectedSignature(selectedSignatureName);
            location.href = href;
          });
          for (var l = 0; l < linkElement.children.length; l++) {
            spanElement = linkElement.children[l];
            for (var m = 0; m < spanElement.attributes.length; m++) {
              if (spanElement.attributes[m].value === dataSpanName) {
                spanElement.innerHTML = data[i].fields.name;
              } else if (spanElement.attributes[m].value === dataSpanCareer) {
                spanElement.innerHTML = data[i].fields.career;
              }
            }
          }
        }
      }
      itemList.push($structureItem);
    }
    fillList(itemList, parent);
  }

  function renderGroups(data) {
    var $structureItem;
    var itemList = [];
    var parent = '[data-groupmodule-section="group_list"]';
    var dataAtt = 'data-groupmodule-name-url';
    var href;
    var target;
    var selectedGroupName;
    var itemElement;
    var linkElement;
    var currentPeriod = JSON.parse(sessionStorage['currentPeriod']);
    var currentSignature = JSON.parse(sessionStorage['currentSignature']);
    for (var i = 0; i < data.length; i++) {
      $structureItem = $($.parseHTML(groupItemTemplate()));
      for (var k = 0; k < $structureItem.length; k++) {
        itemElement = $structureItem[k];
        for (var j = 0; j < itemElement.children.length; j++) {
          linkElement = itemElement.children[j];
          linkElement.href = `${baseUrl}/` +
            `${userApi.username}/` +
            `${currentPeriod.fields.name_url}/` +
            `${currentSignature.fields.name_url}/` +
            `${data[i].fields.name_url}`;
          linkElement.setAttribute(dataAtt, data[i].fields.name_url);
          linkElement.innerHTML = data[i].fields.name;
          $(linkElement).on('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            target = event.currentTarget;
            href = target.href;
            for (var i = 0; i < target.attributes.length; i++) {
              if (target.attributes[i].name === dataAtt) {
                selectedGroupName = target.attributes[i].value;
              }
            }
            groupApi.selectedGroup(selectedGroupName);
            location.href = href;
          });
        }
      }
      itemList.push($structureItem);
    }
    fillList(itemList, parent);
  }

  function renderPeriods(data) {
    var $structureItem;
    var itemList = [];
    var parent = '[data-groupmodule-section="period_list"]';
    var dataAtt = 'data-groupmodule-name-url';
    var href;
    var target;
    var selectedPeriodName;
    for (var i = 0; i < data.length; i++) {
      $structureItem = $($.parseHTML(periodItemTemplate()));
      $structureItem.each((index, element) => {
        for (var j = 0; j < element.children.length; j++) {
          element.children[j].setAttribute(
            'href', `${baseUrl}/${userApi.username}/${data[i].fields.name_url}`
          );
          element.children[j]
            .setAttribute(dataAtt, data[i].fields.name_url);
          element.children[j].innerHTML = data[i].fields.name;
          $(element.children[j]).on('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            target = event.currentTarget;
            href = event.target.href;
            for (var i = 0; i < target.attributes.length; i++) {
              if (target.attributes[i].name === dataAtt) {
                selectedPeriodName = target.attributes[i].value;
              }
            }
            periodApi.selectedPeriod(selectedPeriodName);
            location.href = href;
          });
        }
      });
      itemList.push($structureItem);
    }
    fillList(itemList, parent);
  }

  function fillList(itemlist, parent) {
    var $list = $(parent);
    $list.children().remove();
    for (var i = 0; i < itemlist.length; i++) {
      itemlist[i].appendTo($list);
    }
  }

}

module.exports = GroupModule;
