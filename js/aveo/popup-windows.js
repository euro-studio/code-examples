// Работаем со всплывающими окнами 

$(function() {
  'use strict';

  var TogglePopupWindow = function() {
    this.layout_ = $('#layout');
    this.attachEvents_();
  };

  TogglePopupWindow.CLASS_ACTIVE = 'active';
  TogglePopupWindow.CLASS_FIXED = 'fixed';
  TogglePopupWindow.CLASS_SITEMAP = 'sitemap';
  TogglePopupWindow.CLASS_POPUP = 'popup';

  TogglePopupWindow.prototype.attachEvents_ = function() {
    this.urlEvents_();
    this.sitemapIconsClick_();
    this.popupLinksClick_();
    this.layoutCloseIconClick_();
  };

  TogglePopupWindow.prototype.urlEvents_ = function() {
    var t = this;

    if ($(window).width() < 980) {
      window.addEventListener('popstate', function(e) {
        if (t.layout_.is('.active')) {
          t.layoutCloser_();
        }
      });
    }
  };

  TogglePopupWindow.prototype.sitemapIconsClick_ = function() {
    var t = this,
        sitemapIcons = '.sitemap-nav:not(.layout__sitemap-icon)';

    $(document.body)
      .on('click', sitemapIcons, function() {
        var posY = $(this).offset().top - $(window).scrollTop();

        if ($(window).width() < 980) {
          var posX = parseInt($(this).css('left'));
        } else {
          var posX = parseInt($(this).css('right'));
        }

        $(this).addClass(TogglePopupWindow.CLASS_ACTIVE);
        t.popupSitemapActive_(posX, posY);
      })
    ;
  };

  TogglePopupWindow.prototype.popupSitemapActive_ = function(posX, posY) {
    var t = this,
        newPosY = posY,
        newPosX = posX,
        scrollPos = $(window).scrollTop(),
        layoutContent = t.layout_.find('.layout__content'),
        layoutSitemapIcon = t.layout_.find('.sitemap-nav'),
        layoutSitemapClass = t.layout_.find('.layout__content_sitemap');

    layoutSitemapIcon.css('top', newPosY + 'px');

    if ($(window).width() < 980) {
      layoutSitemapIcon.css('left', newPosX + 'px');
    } else {
      layoutSitemapIcon.css('right', newPosX + 'px');
    }

    t.layout_.addClass(TogglePopupWindow.CLASS_ACTIVE).addClass(TogglePopupWindow.CLASS_SITEMAP);
    layoutContent.animate({scrollTop: 0}, 0);
    layoutSitemapIcon.addClass(TogglePopupWindow.CLASS_ACTIVE);
    layoutSitemapClass.addClass(TogglePopupWindow.CLASS_ACTIVE);

    if ($(window).width() < 980) {
      $('body').css('top', '-' + scrollPos + 'px').addClass(TogglePopupWindow.CLASS_FIXED);
    } else {
      t.preventScroll_();
    }
  };

  TogglePopupWindow.prototype.popupLinksClick_ = function() {
    var t = this;

    $(document.body)
      .on('click', '.popup-link', function() {
        var toLoad = $(this).attr('href'),
            historyHref = toLoad.replace(/\-/g, '_').replace(/\//g, '__'),
            popUpBlock = $('.layout__content_page');

        if (window.location.href.indexOf('win_popup=1') === -1) {
          if ($(window).width() < 980 && window.location.href.indexOf('?') > -1) {
            history.pushState(null, null, window.location.href + '&win_popup=1');
          } else if ($(window).width() < 980) {
            history.pushState(null, null, window.location.href + '?win_popup=1');
          }
        }

        popUpBlock.hide(0, loadContent);

        function loadContent() {
          popUpBlock.load(toLoad, '', showNewContent());
        }

        function showNewContent() {
          popUpBlock.show(0);
        }

        t.popupPageActive_();
        return false;
      })
    ;
  };

  TogglePopupWindow.prototype.popupPageActive_ = function() {
    var t = this,
        scrollPos = $(window).scrollTop(),
        layoutSitemapClass = $('#layout.sitemap'),
        layoutContent = $('.layout__content'),
        layoutContentSitemapClass = $('.layout__content_sitemap'),
        layoutContentPageClass = $('.layout__content_page'),
        layoutSitemapIcon = $('.sitemap-nav.' + TogglePopupWindow.CLASS_ACTIVE);

    layoutContent.animate({
        scrollTop: 0
    }, 0);

    if (layoutSitemapClass.length === 0) {
      t.layout_.addClass(TogglePopupWindow.CLASS_ACTIVE).addClass(TogglePopupWindow.CLASS_POPUP);
      layoutContentPageClass.addClass(TogglePopupWindow.CLASS_ACTIVE);
    } else {
      t.layout_.removeClass(TogglePopupWindow.CLASS_SITEMAP);
      layoutContentSitemapClass.removeClass(TogglePopupWindow.CLASS_ACTIVE);
      layoutSitemapIcon.removeClass(TogglePopupWindow.CLASS_ACTIVE);

      setTimeout(function() {
        t.layout_.addClass(TogglePopupWindow.CLASS_POPUP);
        layoutContentPageClass.addClass(TogglePopupWindow.CLASS_ACTIVE);
      }, 400);
    }

    if ($(window).width() < 980) {
      $('body').css('top', '-' + scrollPos + 'px').addClass(TogglePopupWindow.CLASS_FIXED);
    } else {
      t.preventScroll_();
    }
  };

  TogglePopupWindow.prototype.layoutCloseIconClick_ = function() {
    var t = this,
        layoutContent = $('.layout__content');

    t.layout_
      .on('click', function(e) {
        if (!layoutContent.is(e.target) && layoutContent.has(e.target).length === 0) {
          var activeSitemapIcons = $('.sitemap-nav.' + TogglePopupWindow.CLASS_ACTIVE);

          activeSitemapIcons.removeClass(TogglePopupWindow.CLASS_ACTIVE);
          t.layoutCloser_();
        }
      });
    ;
  };

  TogglePopupWindow.prototype.layoutCloser_ = function() {
    var t = this,
        layoutContent = $('.layout__content');

    if ($(window).width() < 980 && window.location.href.indexOf('win_popup=1') > -1) {
      history.go(-1);
    } 

    t.layout_.attr('class', 'layout');
    layoutContent.removeClass(TogglePopupWindow.CLASS_ACTIVE);

    if ($(window).width() < 980) {
      var scrollTop = parseInt($('body').css('top'));

      $('body').removeClass('fixed').removeAttr('style');
      $('body, html').animate({scrollTop: Math.abs(scrollTop) + 'px'}, 0);
    } else {
      $(document).off("mousewheel DOMMouseScroll keydown");
    }    
  };

  TogglePopupWindow.prototype.preventScroll_ = function() {
    var scrollKeys = [33,34,35,36,38,40];
    var popUpClass = '.layout__content.' + TogglePopupWindow.CLASS_ACTIVE;

    $(document).on('mousewheel DOMMouseScroll', 'body', function(e) {
      var np = $(popUpClass)[0];
      var st = np.scrollTop;

      if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
        if ($(e.target).closest(popUpClass).length && 
          st > 0) return;
      } else {
        if ($(e.target).closest(popUpClass).length && 
        st + np.offsetHeight < np.scrollHeight) return;
      }

      e.preventDefault();
      e.stopPropagation();
    });

    $(document).on('keydown', function(e) {
      if (scrollKeys.indexOf(e.which) > -1) {
        e.preventDefault();
      }
    });
  };

  return new TogglePopupWindow();  
});
