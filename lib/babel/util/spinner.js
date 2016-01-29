var $ = require('jquery');

class SpinnerLoader {
  constructor(spinnerContainer, spinnerContainerClass, spinner, spinnerClass) {
    this._spinnerContainer = $(spinnerContainer);
    this._spinner = $(spinner);
    this._spinnerContainerClass = [];
    this._spinnerClass = spinnerClass;
    for (var i = 0; i < spinnerContainerClass.length; i++) {
      this._spinnerContainerClass.push(spinnerContainerClass[i]);
    }
  }

  get spinner() {
    return this._spinner;
  }

  get spinnerContainer() {
    return this._spinnerContainer;
  }

  get spinnerClass() {
    return this._spinnerClass;
  }

  get spinnerContainerClass() {
    return this._spinnerContainerClass;
  }

  handlerSpinner() {
    this.spinner.toggleClass(this.spinnerClass);
    for (var i = 0; i < this.spinnerContainerClass.length; i++) {
      this.spinnerContainer.toggleClass(this.spinnerContainerClass[i]);
    }
  }

}

module.exports = SpinnerLoader;
