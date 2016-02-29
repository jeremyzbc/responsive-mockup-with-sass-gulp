(function($){
	'use strict';

	if( !$('.life-page') ){
		return $;
	}

	if (Modernizr.mq('only screen and (max-width: 787px)')) {
		$('#fw-carousel').carousel({interval: false});
		$('.gray-panel ~ .white-panel').prepend($('.profile-text'));
		$('.profile-img-wrap').after( $('.white-panel:eq(0)'));
	}

	$('.fa-plus').on('click', function(){
		$(this).parents('.media-body').find('.fold-box').addClass('active');
		var triangle = $(this).prev();
		$(this).add(triangle).hide();
	})
	$('.fold-box').on('mouseleave', function(){
		$(this).removeClass('active');
		$(this).parents('.media-body').find('.fa-plus,.triangle').show();
	})

	$('[id^="comment-box-carousel"]').carousel({interval: false});

})(jQuery);