// Форма обратной связи 

$(function() {
  'use strict';

  var FormActions = function() {
    this.init_();
  };

  FormActions.prototype.init_ = function() {
    this.attachEvent_();
  };

  FormActions.prototype.attachEvent_ = function() {
    function isEmail(emailAddress) {
      var pattern = new RegExp(/^(('[\w-\s]+')|([\w-]+(?:\.[\w-]+)*)|('[\w-\s]+')([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      return pattern.test(emailAddress);
    };

    $(document.body).on('submit', 'form:not(.subscribe-form, .msearch2)', function() {
      var form = $(this);
      var elem = form.find('input, textarea');
      var page = window.location.href;
      var error, foc;

      // Блок для форм с почтой

      if (form.is(':has(input.email)')) { // Выбор форм с электронной почтой
        var email = form.find($('input.email')); // Поле электронной почты
        var emailVal = email.attr('value');

        if (email && !isEmail(email.val())) {
          if (form.is('.form_rs')) {
            email.css({
              color: 'rgba(255,255,255,.35)',
              fontWeight: '500'
            });
          } else {
            email.css({
              color: 'rgba(0,0,0,.35)',
              fontWeight: '500'
            });
          }
          email.val(emailVal);
          error = true;
        }
      }

      // Конец блока почты

      elem.each(function(index){
        if ($(this).hasClass('required') == true) {
          if (!this.value || this.value == this.defaultValue ) {
            $(this).addClass('error');
            $(this).parent('.form__input-wrapper').addClass('error');
            error = true;
          } else {
            $(this).removeClass('error');
            $(this).parent('.form__input-wrapper').removeClass('error');
          }
        }
      });

      if (error) {    
        return false;
      } else {
        form.append('<input name="page" value="' + page + '" type="hidden">');
        if (elem.value == this.defaultValue)
        this.value = '';
      }

      var data = form.serialize();

      $.ajax({
        url: '/send.php',
        type: 'POST',
        dataType: 'json',
        data: data,
        beforeSend: function(data){
          form.find('input[type="submit"]').attr('disabled', 'disabled');
        },
        success: function(data) {
          if (data['error']) {
            alert(data['error']);
          } else {
            form.fadeOut(500);
            if ($('html').is('[lang="en"]')) {
              form.parent().addClass('form__success').delay(500).html('<h3>Thank you for contacting</h3><p>We will contact you shortly.</p>');
            } else {
              form.parent().addClass('form__success').delay(500).html('<h3>Спасибо за Ваше обращение</h3><p>Мы свяжемся с Вами в ближайшее время.</p>');
            }
          } // Текст после успешной отправки письма
        },
        error: function(xhr, ajaxOptions, thrownError) {
          alert(xhr.status);
          alert(thrownError);
        },
        complete: function(data) {
          form.find('input[type="submit"]').prop('disabled', false);
        }                     
      });
      return false;
    });

    $(document.body).on('focus', 'form:not(.form_rs, .msearch2) input[type="text"], form:not(.form_rs, .msearch2) textarea', function() { 
      if (this.value == this.defaultValue) { 
        this.value = ''; 
        $(this).css({
          color: 'rgba(0,0,0,1)',
          fontWeight: '600'
        }); // Вид поля в фокусе
      }
      }).on('blur', 'form:not(.form_rs, .msearch2) input[type="text"], form:not(.form_rs, .msearch2) textarea', function() { 
        if(!this.value.length) {               
          $(this).css({
            color: 'rgba(0,0,0,.35)',
            fontWeight: '500'
          }); // Вид поля без фокуса
          this.value = this.defaultValue; 
      } 
    });

    $(document.body).on('focus', 'form.form_rs input[type="text"], form.form_rs textarea', function() { 
      if (this.value == this.defaultValue) { 
        this.value = ''; 
        $(this).css({
          color: 'rgba(255,255,255,1)',
          fontWeight: '600'
        }); // Вид поля в фокусе
      }
      }).on('blur', 'form.form_rs input[type="text"], form.form_rs textarea', function() { 
        if(!this.value.length) {               
          $(this).css({
            color: 'rgba(255,255,255,.35)',
            fontWeight: '500'
          }); // Вид поля без фокуса
          this.value = this.defaultValue; 
      } 
    });
  };

  return new FormActions();
});
