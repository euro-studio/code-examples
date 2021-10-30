var main = {};

main.pointsAnimation = {
	init: function() {
		this.points = $('#events .point');
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
				that.calculatePointScale(that.cursorPosX, that.cursorPosY,
					this);
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

		var maxAllowedDistance = 700;
		var minScale = 100;
		var maxScale = 250;

		var distanceToPercent = Math.min(
			Math.max(
				Math.round(distance / (maxAllowedDistance) * 100),
				0,
			),
			100,
		);

		var oppositeValue = 100 - distanceToPercent;

		// linear conversion formula: (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin

		var convertedValue = (Math.round(
			oppositeValue * (maxScale - minScale)) / 100 + 100) / 100;

		point.css({
			'-webkit-transform': 'scale(' + convertedValue + ') ',
			'transform': 'scale(' + convertedValue + ') rotate(0.02deg)',
		});
	},
};
