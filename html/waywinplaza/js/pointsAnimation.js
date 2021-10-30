// Динамические круги

	if ($('#index_container').length || $('#eu_container').length) {

		var main = {};

		main.pointsAnimation = {
			init: function() {
				this.points = $('.point');
				this.pointWidth = this.points.first().width();
				this.pointHeight = this.points.first().height();

				this.document_ = $(document);

				this.trackMouse();
				this.playInitial();
				this.attachEvents();
			},

			attachEvents: function() {
				var that = this;

				var timer = 0;

				this.document_.on('mousemove', function(e) {
					that.cursorPosX = e.pageX;
					that.cursorPosY = e.pageY;

					that.points.each(function() {
						that.calculatePointScale(that.cursorPosX,
							that.cursorPosY, this);
					});
				});

				$(window).on('scroll', function() {
					clearTimeout(timer);

					timer = setTimeout(function() {
						var scrollLeft = $(document).scrollLeft();
						var scrollTop = $(document).scrollTop();
						var diffX = that.cursorPosX + scrollLeft - that.winX;
						var diffY = that.cursorPosY + scrollTop - that.winY;
						that.winX = scrollLeft;
						that.winY = scrollTop;

						that.points.each(function() {
							that.calculatePointScale(diffX, diffY, this);
						});
					}, 50);
				});
			},

			trackMouse: function() {
				var that = this;
				this.document_.on('mousemove.track', function(e) {
					that.lastCursorPosX = e.pageX;
					that.lastCursorPosY = e.pageY;
				});
			},

			untrackMouse: function() {
				this.document_.off('mousemove.track');
			},

			calculatePointScale: function(cursorPosX, cursorPosY, pointEl) {
				var point = $(pointEl);

				if (point.parents('.event').hasClass('active')) return;

				var pointPos = point.offset();
				var pointPosX = pointPos.left + this.pointWidth;
				var pointPosY = pointPos.top + this.pointHeight;

				var distance = Math.sqrt(Math.pow((cursorPosX - pointPosX), 2) +
					Math.pow((cursorPosY - pointPosY), 2));

				if ($('#index_container').length) {
					var maxAllowedDistance = 500;
					var minScale = 100;
					var maxScale = 250;
				} else {
					var maxAllowedDistance = 300;
					var minScale = 100;
					var maxScale = 250;
				}

				var distanceToPercent = Math.min(
					Math.max(
						Math.round(distance / (maxAllowedDistance) * 100),
						0,
					),
					100,
				);

				var oppositeValue = 100 - distanceToPercent;

				var convertedValue = (Math.round(
					oppositeValue * (maxScale - minScale)) / 100 + 100) / 100;

				point.css({
					'-webkit-transform': 'scale(' + convertedValue + ') ',
					'transform': 'scale(' + convertedValue +
						') rotate(0.02deg)',
				});
			},

			setInitialPointsSize: function() {
				var that = this;

				this.points.addClass('with_trans');
				this.points.each(function() {
					that.calculatePointScale(that.lastCursorPosX,
						that.lastCursorPosY, this);
				});

				window.setTimeout(function() {
					that.points.removeClass('with_trans');
					that.attachEvents();
				}, 1020);

			},

			playInitial: function() {
				var that = this;

				jQuery('body').addClass('with_trans');

				window.setTimeout(function() {
					that.points.addClass('animated');
				}, 200);

				window.setTimeout(function() {
					if (that.lastCursorPosX) {
						that.untrackMouse();
						that.setInitialPointsSize();
					} else {
						$(document).on('mousemove.initial', function(e) {
							that.lastCursorPosX = e.pageX;
							that.lastCursorPosY = e.pageY;

							that.untrackMouse();
							that.setInitialPointsSize();
							$(document).off('mousemove.initial');
						});
					}
				}, 850);

				setTimeout(function() {
					that.points.removeClass('animated');

					setTimeout(function() {
						jQuery('body').removeClass('with_trans');
					}, 800);
				}, 800);
			},

		};

		main.pointsAnimation.init();

	}
