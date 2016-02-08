var $ = require('jquery');
import PathApi from './path.js';


class PeriodApi {
  constructor(username) {
    this._baseUrl = document.location.origin;
    this._periodsUrl = `${this.baseUrl}/get-periods/${username}`;
    this._newPeriodUrl;
  }

  get baseUrl() {
    return this._baseUrl;
  }

  get periodsUrl() {
    return this._periodsUrl;
  }

  get newPeriodUrl() {
    return this._newPeriodUrl;
  }

  set newPeriodUrl(url) {
    this._newPeriodUrl = url;
  }

  findPeriods() {
    if (sessionStorage['periods']) {
      sessionStorage.removeItem('periods');
    }
    return Promise.resolve($.get(this.periodsUrl)).then((data) => {
      sessionStorage.setItem('periods', JSON.stringify(data.periods));
      return Promise.resolve(data);
    });
  }

  newPeriod(data) {
    return Promise.resolve($.post(this.newPeriodUrl, data))
      .then((response) => {
      return response;
    });
  }

  selectedPeriod(periodName) {
    var periods = JSON.parse(sessionStorage['periods']);
    for (var i = 0; i < periods.length; i++) {
      if (periods[i].fields.name_url === periodName) {
        this.saveCurrentPeriod(periods[i]);
      }
    }

  }

  deletePeriod() {

  }

  getCurrentPeriod() {
    var pathApi = new PathApi();
    var currentPeriod;
    var period;
    if (sessionStorage['currentPeriod']) {
      currentPeriod = JSON.parse(sessionStorage['currentPeriod']);
      if (pathApi.period === currentPeriod.fields.name_url) {
        period = Promise.resolve(currentPeriod);
      } else {
        period = this.findPeriods().then((data) => {
          return this.chooseCurrentPeriod(data.periods, pathApi.period);
        });
      }
    } else {
      period = this.findPeriods().then((data) => {
        return this.chooseCurrentPeriod(data.periods, pathApi.period);
      });
    }
    return period;
  }

  saveCurrentPeriod(period) {
    if (sessionStorage['currentPeriod']) {
      sessionStorage.removeItem('currentPeriod');
    }
    sessionStorage.setItem('currentPeriod', JSON.stringify(period));
  }

  chooseCurrentPeriod(data, period) {
    var currentPeriod;
    for (var i = 0; i < data.length; i++) {
      if (data[i].fields.name_url === period) {
        currentPeriod = data[i];
      }
    }
    this.saveCurrentPeriod(currentPeriod);
    return Promise.resolve(currentPeriod);
  }
}

module.exports = PeriodApi;
