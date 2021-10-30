// Стрелка вверх 

if ($(window).width() >= 980) {
	var arrowBlock = $('div#top_arrow'); // Задаем имя стрелки
	$(window).scroll(function() {
		if ($(window).scrollTop() > $(window).height() / 2) {
			arrowBlock.fadeIn(300);
		} else {
			arrowBlock.fadeOut(300);
		}
	});
	arrowBlock.click(function() {
		$('body,html').animate({scrollTop: 0}, 2000);
		return false;
	});  // Задаем высоту появления и скорость анимации
}

// Плавный скроллинг

$('#floors_nav a.anchor').click(function() { // Задаем классы ссылок
	var elementClick = $(this).
		attr('href').
		substring($(this).attr('href').indexOf('#'));
	var destination = $(elementClick).offset().top;
	var HalfWinH = $(window).height() / 2;
	var HalfElH = $(elementClick).height() / 2;
	$('html, body').
		animate({scrollTop: destination + HalfElH - HalfWinH}, 1500); // Отступ от верха и скорость анимации
	return false;
});

// Менюшка адаптивность

if ($(window).width() < 980) {
	if ($('body').hasClass('ru')) {
		$('#fix_menu > ul').
			wrap('<ul class="fix_menu"><li>').
			before('<a class="pseudo" href="#">Меню</a>');
	} else {
		$('#fix_menu > ul').
			wrap('<ul class="fix_menu"><li>').
			before('<a class="pseudo" href="#">Menu</a>');
	}
	$('.fix_menu > li > a').click(function() {
		$(this).next('ul').slideToggle(100);
		return false;
	});
	$('#content').click(function() {
		if ($('.fix_menu ul').is(':visible')) {
			$('#content').click(function() {
				$('.fix_menu ul').slideUp(100);
			});
		}
	});
}

// Ajax ссылки

if ($(window).width() >= 980) {
	$('body').on('click', 'a.popup', function() {

		var toLoad = $(this).attr('href') + ' #content > *';
		var popUpBlock = $('#popup_content');

		popUpBlock.hide(0, loadContent);

		function loadContent() {
			popUpBlock.load(toLoad, '', showNewContent());
		}

		function showNewContent() {
			popUpBlock.show(0);
		}

		setTimeout(function() {
			var scrollW = $(window).outerWidth() - $('body').outerWidth();
			$('#layout').fadeTo(100, 0.3);
			$('#main_container').addClass('blur');
			$('#popup_page').addClass('active');
			$('#popup_content').animate({scrollTop: 0}, 10);
			$('body').
				css('overflow-y', 'hidden').
				css('padding-right', scrollW);
			$('.pictures').fadeOut(1);
			setTimeout(function() {
				$('.pictures').fadeIn(700);
				$('.pictures').gpGallery('img');
			}, 1000);
		}, 150);

		// history.pushState(null, null, $(this).attr('href')); // Вставка адреса страницы

		return false;

	});

	$('body').on('click', '#layout, #popup_page .close', function() {
		// history.go(-1); // Возвращения адреса страницы
		$('#popup_page').removeClass('active');
		$('body').css('overflow-y', 'auto').css('padding-right', '0px');
		setTimeout(function() {
			$('#main_container').removeClass('blur');
			$('#layout').fadeOut(100);
		}, 500);
		return false;
	});

}

// Блокировка скроллинга

var scrollKeys = [33, 34, 35, 36, 38, 40];
var popUpClass = '#popup_content';

function preventScroll() {
	$(document).on('mousewheel DOMMouseScroll', 'body', function(e) {
		var $np = $(popUpClass)[0];
		var st = $np.scrollTop;
		if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
			if ($(e.target).closest(popUpClass).length &&
				st > 0) return;
		} else {
			if ($(e.target).closest(popUpClass).length &&
				st + $np.offsetHeight < $np.scrollHeight) return;
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

function returnScroll() {
	$(document).off('mousewheel DOMMouseScroll keydown');
};

if ($(window).width() >= 980) {
	$(popUpClass).hover(function() {
		preventScroll();
	}, function() {
		returnScroll();
	});

}

// Скрываем этажи

$('#floors_container').css('opacity', '0');

function resizeWindow() {

	var WidthW = $(window).width();

	$('#index_container .layer3 img.clouds1').css({top: WidthW * 0.1915});

	// Работа с формой

	$('form#contacts_form textarea').css({
		height: $('form#contacts_form .inputs_block').height(),
	});

}

resizeWindow();

$(window).resize(function() {
	resizeWindow();
});

// Фикс легенда

var page_nav = $('#floors_legend'); // Имя меню
var info_nav = $('#floors_info'); // Имя меню
var legend_bg = $('#floors_legend > div.bg'); // Имя меню
var prev_scroll_value = 0;

function legeng_scroll() {
	var new_scroll_value = $(window).scrollTop() >= 0 ?
		$(window).scrollTop() :
		0;
	var local_diff = new_scroll_value - prev_scroll_value;
	var current = parseInt(page_nav.css('top'));
	if (new_scroll_value >= 0) {
		if (new_scroll_value >= prev_scroll_value) {
			if ($(window).width() >= 980) {
				page_nav.css('top',
					(current - local_diff >= 0 ? current - local_diff : 0)); // Задаем видимый кусок скрытого меню
				info_nav.css('top', (current - local_diff >= 80 ?
					current - local_diff :
					80) + 'px'); // Задаем видимый кусок скрытого меню
				legend_bg.css('opacity',
					(local_diff >= 0 ? (new_scroll_value - 150) / 100 : 1));
			} else {
				info_nav.css('top',
					(current - local_diff >= 0 ? current - local_diff : 0)); // Задаем видимый кусок скрытого меню
				info_nav.css('background', 'rgba(255,255,255,.9)');
			}
		} else {
			if (new_scroll_value <= 150) {
				if ($(window).width() >= 980) {
					page_nav.css('top', (current - local_diff <= 150 ?
						current - local_diff :
						150) + 'px');
					info_nav.css('top', (current - local_diff <= 160 ?
						current - local_diff :
						160) + 'px');
				} else if ($(window).width() >= 600) {
					info_nav.css('top', (current - local_diff <= 110 ?
						current - local_diff :
						110) + 'px');
					info_nav.css('background', 'rgba(255,255,255,0)');
				} else {
					info_nav.css('top', (current - local_diff <= 90 ?
						current - local_diff :
						90) + 'px');
					info_nav.css('background', 'rgba(255,255,255,0)');
				}
			}
			if (new_scroll_value <= 300) {
				if ($(window).width() >= 980) {
					legend_bg.css('opacity', (local_diff <= 0 ?
						(new_scroll_value - 150) / 100 :
						0));
				}
			}
		}
	}
	prev_scroll_value = new_scroll_value;
}

$(window).scroll(legeng_scroll);

// Показываем этажи

setTimeout(function() {
	$('#floors_container').css('opacity', '1').addClass('anim');
}, 300);

function resizeWindow() {

	var WidthW = $(window).width();
	var HeightW = $(window).height();
	var BCImgHeight = $('#index_container .layer4 img.bg').height();
	var BCEUImgHeight = $('#eu_container .layer5 img.bg').height();

	$('#fix_menu li').css({
		paddingLeft: (WidthW - 120 - FixMenuWidth) / (FixMenuEl * 2),
		paddingRight: (WidthW - 120 - FixMenuWidth) / (FixMenuEl * 2),
	});

	$('#index_container .layer4').css({
		paddingTop: BCImgHeight * 0.4,
	});

	if ($('#index_container .layer4').outerHeight() < HeightW) {
		$('#index_container .layer4').css({
			paddingTop: HeightW - BCImgHeight,
		});
	} else {
		$('#index_container .layer4').css({
			paddingTop: BCImgHeight * 0.4,
		});
	}

	$('#index_container .layer1 img').css({
		height: $('#index_container').height() - BCImgHeight * 0.55,
	});

	if (WidthW < HeightW) {
		$('#eu_container .layer1').css({
			paddingTop: '50%',
		});
	} else {
		$('#eu_container .layer1').css({
			paddingTop: '0px',
		});
	}

	if ($('#eu_container .layer5').outerHeight() < HeightW) {
		$('#eu_container .layer5 img.bg').css({
			paddingTop: HeightW - BCEUImgHeight,
		});
	} else {
		$('#eu_container .layer5 img.bg').css({
			paddingTop: '400px',
		});
	}

	$('#eu_container .layer1, #eu_container .layer4-1, #eu_container .layer4-2, #eu_container .layer4-3').
		css({
			height: $('#eu_container').height(),
		});

	var BCEUImgPT = parseInt(
		$('#eu_container .layer5 img.bg').css('padding-top'));

	$('#eu_container .layer5 .tags').css({
		top: (BCEUImgPT / 2) - 45,
	});

	// Комплекс

	var imgH = $('#complex_img img').height();
	$('#complex_bg > div').css({
		marginBottom: -imgH / 2,
		paddingBottom: (imgH / 2) / 1.5,
	});

	// Слайдер этажей

	function floorsSlider() {

		var imgLength = $('#floors_container .floor_block').length;
		if ($(window).width() >= 980) {
			if ($('body').hasClass('safari') ||
				$('body').hasClass('msie')) {
				var imgRatio = 1;
				var fContW = $(window).width() - 550;
			} else {
				var imgRatio = 0.75;
				var fContW = $(window).width() - 420;
			}
		} else {
			var imgRatio = 1;
			var fContW = $(window).width();
		}
		var fContH = imgLength * fContW * imgRatio;
		var floorW = $('#floor0 img').width();
		var groundSize = 2628 * (floorW * 100 / 1890) / 100;

		if ($(window).width() >= 1400) {
			$('#floors_container').css({
				//height: fContH
				height: fContH * 1.115,
			});
		} else if ($(window).width() >= 1200) {
			$('#floors_container').css({
				//height: fContH
				height: fContH * 1.12,
			});
		} else if ($(window).width() >= 980) {
			$('#floors_container').css({
				//height: fContH
				height: fContH * 1.17,
			});
		} else {
			$('#floors_container').css({
				//height: fContH
				height: fContH * 1.115,
			});
		}

		$('#ground_floor img').css({
			width: groundSize,
		});

		if ($(window).width() >= 980) {
			$('div.floor').css({
				//top: -fContW*0.38
				top: -fContW * 0.55,
			});
		}

		var scrollPos = $(window).scrollTop();
		var fContOfTop = $('#floors_container').offset().top;
		var fContH = $('#floors_container').innerHeight();
		var navControl = $('#floors_nav .control');
		var whitePos = $('#floors_nav .slider .white');
		var floorsScroll = $('#floors_nav .slider .white .floors_scroll');
		var navSliderH = $('#floors_nav .slider').height();
		var HalfWinH = $(window).height() / 2;
		var floorPrecPos = (scrollPos - fContOfTop + HalfWinH) * 100 /
			fContH +
			1.12;
		var navControlPos = (navSliderH * floorPrecPos / 100 - 25);

		var minScale = 0;
		var maxScale = navSliderH - 50;

		if (navControlPos <= minScale) {
			navControl.css({
				top: minScale,
			});
			whitePos.css({
				top: minScale,
			});
			floorsScroll.css({
				marginTop: minScale,
			});
		} else if (navControlPos >= maxScale) {
			navControl.css({
				top: maxScale,
			});
			whitePos.css({
				top: maxScale,
			});
			floorsScroll.css({
				marginTop: -maxScale,
			});
		} else {
			navControl.css({
				top: navControlPos,
			});
			whitePos.css({
				top: navControlPos,
			});
			floorsScroll.css({
				marginTop: -navControlPos,
			});
		}
	}

	function ScrollFloorsInfo() {
		var scrollPos = $(window).scrollTop();
		var HalfWinH = $(window).height() / 2;
		var fContOfTop = $('#floors_container').offset().top;
		var fContH = $('#floors_container').innerHeight();
		var infoID = $(this).attr('data-info');
		var infoBlock = $('#floors_info .info_block > div');
		infoBlock.removeClass('active');
		if (scrollPos - fContOfTop + HalfWinH <= fContH * 0.125) {
			$('div#4floor0').addClass('active');
		} else if (scrollPos - fContOfTop + HalfWinH <= fContH * 0.25) {
			$('div#3floor0').addClass('active');
		} else if (scrollPos - fContOfTop + HalfWinH <= fContH * 0.375) {
			$('div#2floor0').addClass('active');
		} else if (scrollPos - fContOfTop + HalfWinH <= fContH * 0.5) {
			$('div#1floor0').addClass('active');
		} else if (scrollPos - fContOfTop + HalfWinH <= fContH * 0.625) {
			$('div#mfloor0').addClass('active');
		} else if (scrollPos - fContOfTop + HalfWinH <= fContH * 0.75) {
			$('div#0floor0').addClass('active');
		} else if (scrollPos - fContOfTop + HalfWinH <= fContH * 0.875) {
			$('div#m1floor0').addClass('active');
		} else {
			$('div#m2floor0').addClass('active');
		}
	}

	if ($('#floors_container').length) {
		floorsSlider();
		var element = $('#floors_container');
		var destination = element.offset().top + element.innerHeight();
		var HalfWinH = $(window).height() / 2;
		var HalfElH = $('#floor2').height();
		$('html, body').animate({scrollTop: 0}, 50);
		$(window).resize(floorsSlider);
		$(window).scroll(floorsSlider);
		$(window).on('load', floorsSlider);

		$(window).scroll(ScrollFloorsInfo);

		$('div.floor svg > a > *').hover(function() {
			var infoID = $(this).attr('data-info');
			var infoBlock = $('#floors_info .info_block > div');
			infoBlock.removeClass('active');
			$('div#' + infoID).addClass('active');
		}, function() {
			ScrollFloorsInfo();
		});

	}

}
