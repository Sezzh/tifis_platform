var $ = require('jquery');
import PathApi from './path.js';


class SignatureApi {
  constructor(username, periodUrlName) {
    this._baseUrl = document.location.origin;
    this._signaturesUrl = `${this.baseUrl}/get-signatures/${username}/` +
    `${periodUrlName}`;
  }

  get signaturesUrl() {
    return this._signaturesUrl;
  }

  get baseUrl() {
    return this._baseUrl;
  }

  findSignatures() {
    if (sessionStorage['signatures']) {
      sessionStorage.removeItem('signatures');
    }
    return Promise.resolve($.get(this.signaturesUrl)).then((data) => {
      sessionStorage.setItem('signatures', JSON.stringify(data));
      return Promise.resolve(data);
    });
  }

  selectedSignature(signatureName) {
    var signatures = JSON.parse(sessionStorage['signatures']);
    for (var i = 0; i < signatures.length; i++) {
      if (signatures[i].fields.name_url === signatureName) {
        this.saveCurrentSignature(signatures[i]);
      }
    }
  }

  newSignature() {

  }

  getCurrentSignature() {
    var currentSignature;
    var signature;
    var path = new PathApi();
    if (sessionStorage['currentSignature']) {
      currentSignature = JSON.parse(sessionStorage['currentSignature']);
      if (path.signature === currentSignature.fields.name_url) {
        signature = Promise.resolve(currentSignature);
      } else {
        signature = this.findSignatures().then((data) => {
          return this.chooseCurrentSignature(data.signatures, path.signature);
        });
      }
    } else {
      signature = this.findSignatures().then((data) => {
        return this.chooseCurrentSignature(data.signatures, path.signature);
      });
    }
    return signature;
  }

  chooseCurrentSignature(data, signature) {
    var currentSignature;
    for (var i = 0; i < data.length; i++) {
      if (data[i].fields.name_url === signature) {
        currentSignature = data[i];
      }
    }
    this.saveCurrentSignature(currentSignature);
    return Promise.resolve(currentSignature);
  }

  saveCurrentSignature(signature) {
    if (sessionStorage['currentSignature']) {
      sessionStorage.removeItem('currentSignature');
    }
    sessionStorage.setItem('currentSignature', JSON.stringify(signature));
  }

}

module.exports = SignatureApi;
