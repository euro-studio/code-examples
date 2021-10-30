// Слайдер преимущества на главной

$(function() {
  'use strict';

  var HomeAdvSlider = function() {
    this.homeAdvSlider_ = $('.home-adv');

    if (this.homeAdvSlider_.length === 0) {
      return;
    }

    this.homeAdvSliderItems_ = this.homeAdvSlider_.find('.home-adv__items');
    this.homeAdvSliderItem_ = this.homeAdvSliderItems_.find('.home-adv__item');
    this.homeAdvSliderControls_ = this.homeAdvSliderItem_.find('.home-adv__controls');
    this.homeAdvSliderControlPrev_ = this.homeAdvSliderControls_.find('.home-adv__control_prev');
    this.homeAdvSliderControlNext_ = this.homeAdvSliderControls_.find('.home-adv__control_next');
    this.homeAdvSliderBullets_ = this.homeAdvSliderControls_.find('.home-adv__bullets');
    this.init_();
  };

  HomeAdvSlider.CLASS_ACTIVE = 'active';
  HomeAdvSlider.CLASS_HIDDEN = 'hidden';

  HomeAdvSlider.prototype.init_ = function() {
    var sliderWidth = this.homeAdvSlider_.outerWidth();
    var itemLength = this.homeAdvSliderItem_.length;
    var firstItem = this.homeAdvSliderItem_.first();

    this.homeAdvSliderItems_.width(sliderWidth * itemLength);
    firstItem.addClass(HomeAdvSlider.CLASS_ACTIVE);

    this.homeAdvSliderItem_.each(function(index, el) {
      var t = this;
      var $item = $(el);
      var $itemBg = $item.attr('data-img');
      var $itemIndex = $(el).index();

      $item.css('background-image', 'url(/tpl/img/' + $itemBg + '.jpg)');

      for (var i = 0; i < itemLength; i++) {
        $item.find('.home-adv__bullets').append('<span></span>');
      }

      $item.find('.home-adv__bullets > span').eq($itemIndex).addClass(HomeAdvSlider.CLASS_ACTIVE);
    });

    if (itemLength == 1) {
      this.homeAdvSliderControls_.hide();
    }

    this.attachEvent_();
  };

  HomeAdvSlider.prototype.attachEvent_ = function() {
    var t = this;
    var swipeAdvSlider = new Hammer(document.querySelector('.home-adv__items'));

    $(window).on('resize', function() {
      var sliderWidth = t.homeAdvSlider_.outerWidth();
      var itemLength = t.homeAdvSliderItem_.length;
      var currentItem = t.homeAdvSlider_.find('.home-adv__item.' + HomeAdvSlider.CLASS_ACTIVE).index('.home-adv__item');

      t.homeAdvSliderItems_.width(sliderWidth * itemLength);
      t.homeAdvSliderItems_.css('transform', 'translate3d(-' + (sliderWidth * currentItem) + 'px,0,0)');
    });

    this.homeAdvSlider_.on('click', '.home-adv__bullets > span', function() {

      if ($(this).is('.' + HomeAdvSlider.CLASS_ACTIVE)) {
        return;
      }

      var activeItem = t.homeAdvSlider_.find('.home-adv__item.' + HomeAdvSlider.CLASS_ACTIVE);
      var currentBulletIndex = activeItem.find('.home-adv__bullets > span.' + HomeAdvSlider.CLASS_ACTIVE).index();
      var activeBulletIndex = $(this).index();
      var indexDifference = Math.abs(currentBulletIndex - activeBulletIndex);

      if (activeBulletIndex < currentBulletIndex) {
        t.setPrevActiveItem_(indexDifference);
      } else if (activeBulletIndex > currentBulletIndex) {
        t.setNextActiveItem_(indexDifference);
      }
    });

    this.homeAdvSlider_.on('click', '.home-adv__control_next', function() {
      t.setNextActiveItem_();
    })

    this.homeAdvSlider_.on('click', '.home-adv__control_prev', function() {
      t.setPrevActiveItem_();
    });

    swipeAdvSlider.on('swiperight', function() {
      t.setPrevActiveItem_();
    });

    swipeAdvSlider.on('swipeleft', function() {
      t.setNextActiveItem_();
    });
  };

  HomeAdvSlider.prototype.setNextActiveItem_ = function(indexDifference) {
    var t = this;
    var currentItemIndex = indexDifference || 1;
    var sliderWidth = t.homeAdvSlider_.outerWidth();
    var activeSliderItem = t.homeAdvSlider_.find('.home-adv__item.' + HomeAdvSlider.CLASS_ACTIVE);

    if (t.homeAdvSliderItems_.is('.' + HomeAdvSlider.CLASS_ACTIVE)) {
      return;
    }

    t.homeAdvSlider_.find('.home-adv__item').eq(currentItemIndex).addClass(HomeAdvSlider.CLASS_ACTIVE);
    activeSliderItem.removeClass(HomeAdvSlider.CLASS_ACTIVE);
    t.homeAdvSliderItems_
      .addClass(HomeAdvSlider.CLASS_ACTIVE)
      .css('transform', 'translate3d(-' + (sliderWidth * currentItemIndex) + 'px,0,0)');

    setTimeout(function() {

      for (var i = 0; i < currentItemIndex; i++) {
        t.homeAdvSlider_.find('.home-adv__item').eq(0).remove().appendTo(t.homeAdvSliderItems_);
      }

      t.homeAdvSliderItems_
        .removeClass(HomeAdvSlider.CLASS_ACTIVE)
        .css('transform', 'translate3d(0,0,0)');
    }, 1000);
  };

  HomeAdvSlider.prototype.setPrevActiveItem_ = function(indexDifference) {
    var t = this;
    var currentItemIndex = indexDifference || 1;
    var sliderWidth = t.homeAdvSlider_.outerWidth();
    var activeSliderItem = t.homeAdvSlider_.find('.home-adv__item.' + HomeAdvSlider.CLASS_ACTIVE);
    var lastItem = t.homeAdvSlider_.find('.home-adv__item').eq(-1);

    if (t.homeAdvSliderItems_.is('.' + HomeAdvSlider.CLASS_ACTIVE)) {
      return;
    }

    for (var i = 0; i < currentItemIndex; i++) {
      t.homeAdvSlider_.find('.home-adv__item').eq(-1).remove().prependTo(t.homeAdvSliderItems_);
    }

    t.homeAdvSlider_.find('.home-adv__item').eq(0).addClass(HomeAdvSlider.CLASS_ACTIVE);
    activeSliderItem.removeClass(HomeAdvSlider.CLASS_ACTIVE);
    t.homeAdvSliderItems_.css('transform', 'translate3d(-' + (sliderWidth * currentItemIndex) + 'px,0,0)');

    setTimeout(function() {
      t.homeAdvSliderItems_
        .addClass(HomeAdvSlider.CLASS_ACTIVE)
        .css('transform', 'translate3d(0,0,0)');
    }, 0);

    setTimeout(function() {
      t.homeAdvSliderItems_.removeClass(HomeAdvSlider.CLASS_ACTIVE);
    }, 1000);
  };

  return new HomeAdvSlider();
});
