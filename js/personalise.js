(function($){
	'use strict';

	if( !$('.personalise-page') ){
		return $;
	}

	$('.options .btn').on('click', function(){
		$(this).toggleClass('active').siblings('.btn');
	})

	$('[role="navigation"] .nav li').on('click', function(){
		var bindSection = $(this).data('bind');
		if( bindSection ){
			showSection(bindSection);
		}
	})

	$('.next .btn').on('click', function(){
		var bindSection = $(this).data('bind');
		addBinding(bindSection);
		showSection(bindSection);
	})

	function addBinding(bindSection){
		$('[role="navigation"] .nav li.active').next().attr('data-bind',bindSection);
	}

	function showSection(sectionId){
		$('[id^="js-"]').addClass('hidden-xs');
		$(sectionId).removeClass('hidden-xs');
		$('[role="navigation"] .nav li[data-bind ="' + sectionId + '"]').addClass('active').siblings('li').removeClass('active');
	}

})(jQuery);
