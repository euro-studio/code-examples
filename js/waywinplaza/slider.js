// Слайдер о компании 

		if ($(window).width() >= 980) {
			if (('.slider').length) {
				var bodyW = $('body').width();
				var slides = $('.slider .slides');
				var sLength = $('.slides').length;
				var sActive = $('.slides.active').outerHeight();
				var pano = $('.slider .panorama');
				var slider = $('.slider');

				slides.css('width', bodyW);
				pano.css('width', bodyW * sLength);
				slider.css('height', sActive);

				$('.slider .nav .bullet').on('click', function() {
					var slides = $('.slider .slides');
					var link = $(this).attr('data-slide');

					slides.removeClass('active');
					$('.slider .slide' + link).addClass('active');

					var slider = $('.slider');
					var sActive = $('.slides.active').outerHeight();

					slider.css('height', sActive);

					var bodyW = $('body').width();
					var pano = $('.slider .panorama');
					var trf = bodyW * link - bodyW;

					pano.css({
						transform: 'translateX(-' + trf + 'px)',
					});

					$('body,html').animate({scrollTop: 0}, 2500);

					return false;
				});

				$('.slider a.next').on('click', function() {
					var slides = $('.slider .slides');
					var link = $(this).closest(slides).attr('data-slide');

					slides.removeClass('active');
					$(this).closest(slides).next().addClass('active');

					var slider = $('.slider');
					var sActive = $('.slides.active').outerHeight();

					slider.css('height', sActive);

					var bodyW = $('body').width();
					var pano = $('.slider .panorama');
					var trf = bodyW * link;

					pano.css({
						transform: 'translateX(-' + trf + 'px)',
					});

					$('body,html').animate({scrollTop: 0}, 2500);

					return false;
				});

				$('.slider a.prev').on('click', function() {
					var slides = $('.slider .slides');
					var link = $(this).closest(slides).attr('data-slide') - 2;

					slides.removeClass('active');
					$(this).closest(slides).prev().addClass('active');

					var slider = $('.slider');
					var sActive = $('.slides.active').outerHeight();

					slider.css('height', sActive);

					var bodyW = $('body').width();
					var pano = $('.slider .panorama');
					var trf = bodyW * link;

					pano.css({
						transform: 'translateX(-' + trf + 'px)',
					});

					$('body,html').animate({scrollTop: 0}, 2500);

					return false;
				});
			}

		}

	}

	resizeWindow();

	$(window).resize(function() {
		resizeWindow();
	});
