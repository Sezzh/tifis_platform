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
    if (sessionStorage['currentSignature']) {
      sessionStorage.removeItem('currentSignature');
    }
    for (var i = 0; i < signatures.length; i++) {
      if (signatures[i].fields.name_url === signatureName) {
        sessionStorage
          .setItem('currentSignature', JSON.stringify(signatures[i]));
      }
    }
  }

  newSignature() {

  }

}

module.exports = SignatureApi;
