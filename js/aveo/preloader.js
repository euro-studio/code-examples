// Прелоадер

$(function() {
  'use strict';

  var Preloader = function() {
    this.preloader_ = $('#preloader');

    if (this.preloader_.length === 0) {
      return;
    }

    this.init_();
  };

  Preloader.CLASS_START = 'start';
  Preloader.CLASS_STOP = 'stop';

  Preloader.prototype.init_ = function() {
    var t = this;

    this.preloader_.addClass(Preloader.CLASS_START);

    setTimeout(function() {
      t.preloader_.addClass(Preloader.CLASS_STOP);

      setTimeout(function() {
        t.preloader_.remove();
      }, 1000);
    }, 1700);
  };

  return new Preloader();
});
