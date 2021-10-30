var Preloader = function(images, opt_callback) {
  this.images_ = images;
  this.callback = opt_callback || null;
  this.loaderEl_;
  this.progressBarEl_;
  this.currentProgressEl_;
  this.loadedImages_ = [];
  this.progressEvent = jQuery.Event('progress');
  this.loadEvent = jQuery.Event('images_load');
  this.body_ = jQuery('body');
};

Preloader.prototype.init = function() {
  this.body_.addClass('loading');
  this.loaderEl_ = jQuery('<div class="loader"/>');
  this.progressBarEl_ = jQuery('<div class="progress_bar"/>');
  this.currentProgressEl_ = jQuery('<div class="progress"/>');
  this.currentProgressEl2_ = jQuery('<div class="percent"/>');
  this.progressBarEl_.append(this.currentProgressEl_);
  this.progressBarEl_.append(this.currentProgressEl2_);
  this.loaderEl_.append(this.progressBarEl_);
  this.body_.append(this.loaderEl_);
  this.body_.trigger(this.progressEvent);
  this.progressEvent.total = this.images_.length;
  this.progressEvent.progress = this.currentProgressEl_;
  this.progressEvent.percent = this.currentProgressEl2_;
  this.body_.trigger(this.loadEvent);
  this.attachEvents_();
  this.load(0);
};

Preloader.prototype.attachEvents_ = function() {
  var that = this;
  var percents = jQuery('<ins/>');
  var isMetro = jQuery('.metro').length > 0;
  this.currentProgressEl2_.append(percents);
  this.body_.on('images_load', function () {
    that.onImageLoad();
    setTimeout(function() {
      that.body_.removeClass('loading').addClass('loaded');
      that.progressBarEl_.remove();
    }, 300);
    setTimeout(function() {
      that.body_.removeClass('loaded');
      that.loaderEl_.remove();
      if (typeof that.callback === 'function') {
        that.callback();
      }
    }, 1700);
  });

  this.body_.on('progress', function (e) {
    var percentage = (Math.round(((e.loaded * 100) / e.total) - 100) * (-1));
    percents.text(Math.round((e.loaded * 100) / e.total) + '%');
    if(isMetro){
      that.currentProgressEl_[0].style.width = percentage + "%";
    }else{
      that.currentProgressEl_[0].style.height = percentage + "%";
    }
  });
};

Preloader.prototype.load = function(index) {
  var that = this;
  var image = new Image();
  this.progressEvent.loaded = index + 1;
  image.onload = function() {
    that.loadedImages_.push(image);
    index = index + 1;
    if (index < that.images_.length) {
      that.load(index);
      //document.body.dispatchEvent(that.progressEvent);
      that.body_.trigger(that.progressEvent);
    } else {
      //document.body.dispatchEvent(that.loadEvent);
      that.body_.trigger(that.loadEvent);
    }
  };

  image.src = this.images_[index].src;
  if (this.images_[index].type) {
    image.classList.add(this.images_[index].type);
  }
};

Preloader.prototype.onImageLoad = function() {
};

Preloader.prototype.getLoadedImages = function() {
  return this.loadedImages_;
};
