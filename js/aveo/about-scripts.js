// Шаблон страницы о компании

$(function() {
  'use strict';

  var AboutPage = function() {
    this.aboutPage_ = $('.page-about');

    if (this.aboutPage_.length === 0) {
      return;
    }

    this.doc_ = $(document);
    this.body_ = $(document.body);
    this.win_ = $(window);

    this.aboutPageHeaderBg_ = $('.header__bg');
    this.aboutPageServices_ = $('.services');
    this.aboutPageServicesContent_ = $('.services__content');
    this.aboutPageServicesBg_ = $('.services__bg');
    this.aboutPageServicesBgBig_ = $('.services__bg-big');

    this.aboutSlider_ = $('.quotes');
    this.aboutSliderWrapper_ = this.aboutSlider_.find('.quotes__slides');
    this.aboutSliderItem_ = this.aboutSliderWrapper_.find('.quotes__item');

    this.init_();
  };

  AboutPage.CLASS_ACTIVE = 'active';
  AboutPage.CLASS_HIDDEN = 'hidden';
  AboutPage.CLASS_FIXED = 'fixed';

  AboutPage.prototype.init_ = function() {
    var randomSlide = Math.round(Math.random() * this.aboutSliderItem_.length);
    this.aboutSlider_.find('.quotes__item').eq(randomSlide).remove().prependTo(this.aboutSliderWrapper_);
    
    this.fixBlocks_();
    this.fixServicesBgOpacity_();
    this.attachEvent_();
  };

  AboutPage.prototype.attachEvent_ = function() {
    var t = this;

    this.win_
      .on('scroll', function() {
        t.fixBlocks_();
        t.fixServicesBgOpacity_();
      })
      .on('resize', this.fixBlocks_.bind(t), this.fixServicesBgOpacity_.bind(t))
      .on('resize', function() {
        t.aboutSliderEvents_();
      });


    this.aboutSliderEvents_();
  };

  AboutPage.prototype.fixBlocks_ = function() {
    var t = this;
    var winTop = t.win_.scrollTop();
    var winH = t.win_.height();

    var servicesOffset = t.aboutPageServices_.offset().top;
    var servicesHeight = t.aboutPageServices_.outerHeight();

    if (winTop <= winH * 2) {
      t.aboutPageHeaderBg_.addClass(AboutPage.CLASS_FIXED);
    } else {
      t.aboutPageHeaderBg_.removeClass(AboutPage.CLASS_FIXED);
    }

    if ((winTop >= servicesOffset) && ((winTop + winH) < (servicesOffset + servicesHeight))) {
      t.aboutPageServicesBg_.addClass(AboutPage.CLASS_FIXED).removeAttr('style');
    } else if ((winTop + winH) >= (servicesOffset + servicesHeight)) {
      t.aboutPageServicesBg_.removeClass(AboutPage.CLASS_FIXED).css({
        top: 'auto',
        bottom: 0
      });
    } else {
      t.aboutPageServicesBg_.removeClass(AboutPage.CLASS_FIXED).css({  
        top: 0,
        bottom: 'auto'
      });
    }
  };

  AboutPage.prototype.fixServicesBgOpacity_ = function() {
    var t = this;
    var winTop = $(window).scrollTop();
    var winH = $(window).height();

    var servicesOffset = t.aboutPageServices_.offset().top;
    var servicesHeight = t.aboutPageServices_.outerHeight();

    var min = servicesOffset + (winH / 2 - 150);
    var max = servicesOffset + winH / 2 - min;
    var pos =  winTop - min;

    if (winTop >= servicesOffset) {

      if (pos <= 0) {
        pos = 0;
      } else if (pos >= max) {
        pos = max;
      }

      t.aboutPageServicesBgBig_.css({
        opacity: pos / max
      });

      t.aboutPageServicesContent_.css({
        opacity: 1 - pos / max * 2
      });
    }
  };

  AboutPage.prototype.aboutSliderEvents_ = function() {
    var t = this;
    var swipeSlider = new Hammer(document.querySelector('.quotes'));
    var currentItem = this.aboutSlider_.find('.quotes__item').eq(0);

    t.aboutSlider_.css('height',currentItem.height());

    t.aboutSlider_.on('click', '.btn', function() {
      t.slideToNextItem_();
    });

    swipeSlider.on('swipeleft', function() {
        t.slideToNextItem_();
    });
  };

  AboutPage.prototype.slideToNextItem_ = function() {
    var t = this;
    var sliderWidth = t.aboutSlider_.outerWidth();
    var currentItem = t.aboutSlider_.find('.quotes__item').eq(0);

    if (t.aboutSliderWrapper_.is('.animating')) {
      return;
    }

    t.aboutSlider_.css('height', currentItem.next().height());
    t.aboutSliderWrapper_.addClass('animating').css('transform', 'translate3d(-' + sliderWidth + 'px,0,0)');

    setTimeout(function() {
      currentItem.remove().appendTo(t.aboutSliderWrapper_);
      t.aboutSliderWrapper_.removeClass('animating').css('transform', 'translate3d(0,0,0)');
    }, 1000);
  };

  return new AboutPage();
});
