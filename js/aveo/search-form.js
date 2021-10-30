// Поиск недвижимости 

$(function() {
  'use strict';

  var PropertiesFilter = function() {
    this.attachEvents_();
  };
  
  PropertiesFilter.CLASS_ACTIVE = 'active';
  PropertiesFilter.CLASS_OPEN = 'open';

  PropertiesFilter.prototype.attachEvents_ = function() {
    this.togglerOptions_();
    this.getValue_();
    this.buttonClick_();
  };

  PropertiesFilter.prototype.togglerOptions_ = function() {
    $(document.body).on('click', '.properties-filter div.selected', function() {
      $(this).parent().toggleClass(PropertiesFilter.CLASS_OPEN);
    });

    $(document.body).on('mouseup', function(e) {
      var field = $('.properties-filter .field.' + PropertiesFilter.CLASS_OPEN);

      if (!field.is(e.target) && field.has(e.target).length === 0) {
        field.removeClass(PropertiesFilter.CLASS_OPEN);
      }
    });
  };

  PropertiesFilter.prototype.getValue_ = function() {
    $(document.body).on('click', '.properties-filter .options li', function() {
      var that = $(this),
          value = that.data('value'),
          text = that.text(),
          field = $('.properties-filter .field.' + PropertiesFilter.CLASS_OPEN);

      if ($('html').is('[lang="ru"]')) {
        var bedroomsDefaultValue = 'Спальни',
            bedroomsCustomValue = ' спальн.';
      } else {
        var bedroomsDefaultValue = 'Bedrooms',
            bedroomsCustomValue = ' bed.';
      }

      if (that.parent().is('.multiple')) {
        that.toggleClass(PropertiesFilter.CLASS_ACTIVE);

        var activeValues = that.parent().find('.active').map(function() {return $(this).data('value');}).get();

        if (!that.is('.' + PropertiesFilter.CLASS_ACTIVE) && that.siblings('.' + PropertiesFilter.CLASS_ACTIVE).length === 0) {
          that.closest('.field').find('.selected').attr('data-value', '').text(bedroomsDefaultValue);
        } else {
          that.closest('.field').find('.selected').attr('data-value', activeValues).text(activeValues.join(', ') + bedroomsCustomValue);
        }
      } else {
        that.addClass(PropertiesFilter.CLASS_ACTIVE).siblings().removeClass(PropertiesFilter.CLASS_ACTIVE);
        that.closest('.field').removeClass(PropertiesFilter.CLASS_OPEN).children('.selected').attr('data-value', value).text(text);

        if (value === 'commercial' || value === 'studio' || value === 'land' ) {
          var bedroomsField = that.closest('.fields').children('.bedrooms');

          bedroomsField.hide();
          bedroomsField.find('.selected').attr('data-value', '').text(bedroomsDefaultValue);
          bedroomsField.find('li.' + PropertiesFilter.CLASS_ACTIVE).removeClass(PropertiesFilter.CLASS_ACTIVE);
        } else {
          that.closest('.fields').children('.bedrooms').show();
        }
      }
    });

    $(document.body).on('focus', '.properties-filter input', function() {
      $(this).val($(this).val().replace(/\s/g, ''));
    });

    $(document.body).on('change, blur', '.properties-filter input', function() {
      if (!$(this).val()) {
        if ($(this).attr('data-field') === 'price_min') {
          $(this).attr('data-value', '0');
        } else if ($(this).attr('data-field') === 'price_max') {
          $(this).attr('data-value', '999999999');
        } else {
          $(this).attr('data-value', $(this).val());
        }
      } else {
        $(this).attr('data-value', $(this).val());
      }

      $(this).val($(this).val().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    });
  };

  PropertiesFilter.prototype.buttonClick_ = function() {
    $(document.body).on('click', '.properties-filter button', function() {
      var selectedFields = $(this).closest('.properties-filter').find('.selected[data-value!=""]'),
          params = selectedFields.map(function() {return $(this).data('field') + '=' + $(this).data('value');}).get().join('&'),
          priceStr = 'price_min=0&price_max=999999999';

      if (params && params !== priceStr) {
        params = params.replace('&' + priceStr, '').replace(priceStr + '&', '');
        params = params.replace('price_min', 'price');
        params = params.replace('&price_max=', ',');
        params = '?' + params;
      } else {
        params = '';
      }

      if ($('html').is('[lang="ru"]')) {
        window.location.href = '/property/' + params;
      } else {
        window.location.href = '/en/property/' + params;
      }
    });
  };

  return new PropertiesFilter();
});
