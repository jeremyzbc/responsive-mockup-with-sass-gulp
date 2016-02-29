(function($){
	'use strict';

	if( !$('.faqs-page') ){
		return $;
	}

	if (Modernizr.mq('only screen and (max-width: 787px)')) {
		$('.question a').each(function(){
			var injectEleId = $(this).attr('href');
			$(this).after($(injectEleId));
		})
		$('.question img').each(function(){
			if( $(this).attr('src') == 'images/faq-green.png' ){
				$(this).attr('src','images/faq-up.png');
			}
			else{
				$(this).attr('src','images/faq-down.png');
			}
		})
	}


	$('.question').on('click', function(event){
		if( $(this).hasClass('active') ){


				$('.collapse').on('hide.bs.collapse', function(event){
						event.preventDefault();
				})
		}
		else{
			$(this).addClass('active').siblings('.question').removeClass('active');
			if($(window).width() > 787){
				$(this).find('img').attr('src', 'images/faq-green.png');
				$(this).siblings('.question').find('img').attr('src', 'images/faq-white.png');
			}
			else{
				$(this).find('img').attr('src', 'images/faq-up.png');
				$(this).siblings('.question').find('img').attr('src', 'images/faq-down.png');
			}
			var index = $(this).index() - 1;

			$(this).parents('.tab-pane').find('.collapse').not('.collapse:eq(' + index +')').removeClass('in');
		}

	});

	$(window).on('resize', function(){
		if($(window).width() > 787){
			$('.question img').each(function(){
				if( $(this).attr('src') == 'images/faq-up.png' ){
					$(this).attr('src','images/faq-green.png');
				}
				else{
					$(this).attr('src','images/faq-white.png');
				}
			})
		}
		else{
			$('.question img').each(function(){
				if( $(this).attr('src') == 'images/faq-green.png' ){
					$(this).attr('src','images/faq-up.png');
				}
				else{
					$(this).attr('src','images/faq-down.png');
				}
			})
		}
	})

})(jQuery);
