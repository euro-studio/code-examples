// Проверка форм

	function isEmail(emailAddress) {
		var pattern = new RegExp(
			/^(('[\w-\s]+')|([\w-]+(?:\.[\w-]+)*)|('[\w-\s]+')([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		return pattern.test(emailAddress);
	};

	$('body').on('submit', 'form', function() {

		var form = $(this);
		var elem = form.find('input, textarea');
		var error, foc;

		if (form.is('#contacts_form')) {
			var email = $('input#contacts_email');
			if (email && !isEmail(email.val())) {
				email.focus();
				email.val('');
				error = true;
			}
		}

		elem.each(function(index) {
			if ($(this).hasClass('required') == true) {
				if (!this.value || this.value == this.defaultValue) {
					$(this).addClass('error');
					error = true;
					if (!foc) foc = $(this).attr('id');
				} else {
					$(this).removeClass('error');
				}
			}
		});

		if (error) {
			if (foc) $('#' + foc).css('color', 'rgba(0,0,0,0.25)').focus();
			return false;
		} else {
			if (elem.value == this.defaultValue)
				this.value = '';
		}

		var data = form.serialize();

		if (form.is('#contacts_form')) {
			var sendFile = '/send-contacts.php';
		}
		if (form.is('#request_call_form')) {
			var sendFile = '/send-call-request.php';
		}
		if (form.is('#request_viewing_form')) {
			var sendFile = '/send-viewing-request.php';
		}

		$.ajax({
			url: sendFile,
			type: 'POST',
			dataType: 'json',
			data: data,
			beforeSend: function(data) {
				form.find('input[type="submit"]').attr('disabled', 'disabled');
			},
			success: function(data) {
				if (data['error']) {
					alert(data['error']);
				} else {
					form.fadeOut(500);
					if (form.is('#contacts_form')) {
						if ($('body').hasClass('en')) {
							form.parent().
								addClass('form_suc_message').
								delay(500).
								html(
									'<h3>Ваше обращение успешно отправлено</h3><p class="ctr">Мы свяжемся с Вами в ближайшее время.</p>');
						} else {
							form.parent().
								addClass('form_suc_message').
								delay(500).
								html(
									'<h3>Ваше обращение успешно отправлено</h3><p class="ctr">Мы свяжемся с Вами в ближайшее время.</p>');
						}
					} else {
						if ($('body').hasClass('en')) {
							form.parent().
								addClass('form_suc_message').
								delay(500).
								html(
									'<h3>Ваш запрос успешно отправлен</h3><p>Мы свяжемся с Вами в ближайшее время.</p>');
						} else {
							form.parent().
								addClass('form_suc_message').
								delay(500).
								html(
									'<h3>Ваш запрос успешно отправлен</h3><p>Мы свяжемся с Вами в ближайшее время.</p>');
						}
					}
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(xhr.status);
				alert(thrownError);
			},
			complete: function(data) {
				form.find('input[type="submit"]').prop('disabled', false);
			},
		});

		return false;

	});

//Remove Default Text On Focus

	$('body').on('focus', 'form input[type="text"], form textarea', function() {
		if (this.value == this.defaultValue) {
			this.value = '';
			$(this).css('color', 'rgb(0,0,0)');
		}
	}).on('blur', 'form input[type="text"], form textarea', function() {
		if (!this.value.length) {
			$(this).css('color', 'rgba(0,0,0,0.25)');
			this.value = this.defaultValue;
		}
	});
