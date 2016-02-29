(function($){
	'use strict';

	if( !$('.perfect-details-page') ){
		return $;
	}

	if (Modernizr.mq('only screen and (max-width: 787px)')) {
		$('.text-overlay img+div').prepend( $('.text-overlay .hero') );
		$('.article-bottom .content').prepend( $('.article-top p') );
		$('.section-fifth .row').append( $('.section-fifth article') );
	}

	$(function(){
		var liNumber = $('.schedule').children('li').length,
			liWidth = $('.schedule').children('li:eq(0)').outerWidth(),
			scheduleWidth = liNumber * liWidth,
			minLeft = $('.schedule').parent().width() - scheduleWidth - $('.carousel-control.right').width(),
			maxLeft = $('.carousel-control.left').width(),
			left,
			currentLeft;

		$('.schedule').css('width', scheduleWidth + 'px').find('li').on('click', function(){
			$(this).addClass('active').siblings('li').removeClass('active');
		});

		$(window).on('resize', function(){
			minLeft = $('.schedule').parent().width() - scheduleWidth - $('.carousel-control.right').width();
			currentLeft = $('.schedule').position() ? $('.schedule').position().left : 0;
			if(currentLeft < minLeft){
				$('.schedule').css('left',minLeft);
			}
		})

		$('.carousel-control.right').on('click', function(){
			currentLeft = $('.schedule').position() ? $('.schedule').position().left : 0;
			left = ( currentLeft - liWidth > minLeft )? currentLeft - liWidth : minLeft;

			$('.schedule').finish().animate({left: left + 'px'}, 300);
		})

		$('.carousel-control.left').on('click', function(){
			currentLeft = $('.schedule').position() ? $('.schedule').position().left : 0;
			left = ( currentLeft + liWidth < maxLeft )? currentLeft + liWidth : maxLeft;
			$('.schedule').finish().animate({left: left + 'px'}, 300);
		})
	})



})(jQuery);