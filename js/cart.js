(function($){
    'use strict';

    if( !$('.cart-page') ){
        return $;
    }

    $(function() {
        var $srcElement;
        var srcIndex, dstIndex;
        var options = {
            makeClone: true,
            sourceHide: true,
            sourceClass: "dragged",
            canDrag: function($src, event) {
                $srcElement = $src;
                srcIndex = $srcElement.index();
                dstIndex = srcIndex;
                return $src;
            },
            canDrop: function($dst) {
                if ($dst.hasClass("calendar-event") || $dst.hasClass("calendar-date")) {
                    $srcElement.insertAfter($dst);

                }
                return true;
            },
            didDrop: function($src, $dst) {

            }
        };

        $(".calendar-event").dragdrop(options);

        $(".calendar-event select,.calendar-event [class*='square-o'],.js-edit,.js-delete,a").on('mousedown touchstart',function(event){
            event.stopPropagation();
        });

        $(".event-icon").on('click','.fa-square-o', function(){
            if( !$(this).hasClass('disabled') ){
                $(this).removeClass('fa-square-o').addClass('fa-check-square-o');
            }
        });

        $(".event-icon").on('click','.fa-check-square-o', function(){
            if( !$(this).hasClass('disabled') ){
                $(this).removeClass('fa-check-square-o').addClass('fa-square-o');
            }
        });

        $('.js-edit').on('click', function(event){
            event.preventDefault();
            if( $(this).data('on-edit') ){
                $(this).data('on-edit',false).text('edit').next().removeClass('disabled').parents('.calendar-event').find('[class*="square-o"], select').addClass('disabled').prop('disabled',true);
                editFinish();

                function editFinish(){

                }
            }
            else{
                $(this).data('on-edit',true).text('save').next().addClass('disabled').parents('.calendar-event').find('[class*="square-o"], select').removeClass('disabled').prop('disabled',false);
            }

        })
        $('.js-delete').on('click', function(event){
            event.preventDefault();
            if( ! $(this).prev().data('on-edit') ){
                $(this).parents('.calendar-event').remove();
            }

        })
    });

})(jQuery);

(function($) {
    var defaultOptions = {
        makeClone: false,
        sourceClass: null,
        sourceHide: false,
        dragClass: null,
        canDropClass: null,
        dropClass: null,
        isActive: true,
        container: null,
        canDrag: function($src, event) {
            return $src;
        },


        canDrop: function($dst) {
            return $dst.hasClass("drop") || $dst.parents(".drop").size()>0;
        },


        didDrop: function($src, $dst) {
            $src.appendTo($dst);
        }
    };


    var $sourceElement = null;
    var $activeElement = null;
    var $destElement = null;
    var dragOffsetX, dragOffsetY;
    var limits;



    function cancelDestElement(options) {
        if ($destElement!=null) {
            if (options.dropClass)
                $destElement.removeClass(options.dropClass);
            $destElement = null;
        }
        if ($activeElement!=null) {
            if (options.canDropClass) {
                $activeElement.removeClass(options.canDropClass);
            }
        }
    }



    var methods = {
        init: function(options) {
            options = $.extend({}, defaultOptions, options);
            this.data("options", options);
            this.bind("mousedown.dragdrop touchstart.dragdrop", methods.onStart);

            return this;
        },

        destroy: function() {
            this.unbind("mousedown.dragdrop touchstart.dragdrop");
            return this;
        },
        on: function() {
            this.data("options").isActive = true;
        },
        off: function() {
            this.data("options").isActive = false;
        },

        onStart: function(event) {
            var $me = $(this);
            var options = $me.data("options");
            if (!options.isActive)
                return;

            var $element = options.canDrag($me, event);
            if ($element) {
                $sourceElement = $element;
                var offset = $sourceElement.offset();
                var width = $sourceElement.width();
                var height = $sourceElement.height();
                if (event.type=="touchstart") {
                    dragOffsetX = event.originalEvent.touches[0].clientX - offset.left;
                    dragOffsetY = event.originalEvent.touches[0].clientY - offset.top;
                }
                else {
                    dragOffsetX = event.pageX - offset.left;
                    dragOffsetY = event.pageY - offset.top;
                }

                if (options.makeClone) {
                    $activeElement = $sourceElement.clone(false);

                    var $selects = $sourceElement.find('select');
                    var $cloneSelects = $activeElement.find('select');
                    for (var i = 0; i < $selects.length; i++) {
                        var $selectedItem = $selects.eq(i).children(':selected');
                        var selectedItemIndex = $selectedItem.index();
                        $cloneSelects.eq(i).children('option').eq(selectedItemIndex).prop('selected','selected');
                    };


                    $activeElement.appendTo($element.parent());
                    if (options.sourceClass)
                        $sourceElement.addClass(options.sourceClass);
                    else if (options.sourceHide)
                        $sourceElement.css("visibility", "hidden");
                }
                else {
                    $activeElement = $sourceElement;
                }

                $activeElement.css({
                    position: "absolute",
                    left: offset.left,
                    top: offset.top,
                    width: width,
                    height: height
                });

                if (options.dragClass)
                    $activeElement.addClass(options.dragClass);

                var $c = options.container;
                if ($c) {
                    var offset = $c.offset();
                    limits = {
                        minX: offset.left,
                        minY: offset.top,
                        maxX: offset.left + $c.outerWidth() - $element.outerWidth(),
                        maxY: offset.top + $c.outerHeight() - $element.outerHeight()
                    };
                }

                $(window)
                    .bind("mousemove.dragdrop touchmove.dragdrop", { source: $me }, methods.onMove)
                    .bind("mouseup.dragdrop touchend.dragdrop", { source: $me }, methods.onEnd);

                event.stopPropagation();
                return false;
            }
        },

        onMove: function(event) {
            if (!$activeElement)
                return;

            var $me = event.data.source;
            var options = $me.data("options");
            var posX, posY;
            if (event.type=="touchmove") {
                posX = event.originalEvent.touches[0].clientX;
                posY = event.originalEvent.touches[0].clientY;
            }
            else {
                posX = event.pageX;
                posY = event.pageY;
            }
            $activeElement.css("display", "none");
            var destElement = document.elementFromPoint(
                posX - document.documentElement.scrollLeft - document.body.scrollLeft,
                posY - document.documentElement.scrollTop - document.body.scrollTop
            );
            $activeElement.css("display", "");
            posX -= dragOffsetX;
            posY -= dragOffsetY;
            if (limits) {
                posX = Math.min(Math.max(posX, limits.minX), limits.maxX);
                posY = Math.min(Math.max(posY, limits.minY), limits.maxY);
            }
            $activeElement.css({ left: posX, top: posY });

            if (destElement) {
                if ($destElement==null || $destElement.get(0)!=destElement) {
                    var $possibleDestElement = $(destElement);
                    if (options.canDrop($possibleDestElement)) {
                        if (options.dropClass) {
                            if ($destElement!=null)
                                $destElement.removeClass(options.dropClass);
                            $possibleDestElement.addClass(options.dropClass);
                        }
                        if (options.canDropClass) {
                            $activeElement.addClass(options.canDropClass);
                        }
                        $destElement = $possibleDestElement;
                    }
                    else if ($destElement!=null) {
                        cancelDestElement(options);
                    }
                }
            }
            else if ($destElement!=null) {
                cancelDestElement(options);
            }

            event.stopPropagation();
            return false;
        },

        onEnd: function(event) {
            if (!$activeElement)
                return;

            var $me = event.data.source;
            var options = $me.data("options");
            if ($destElement) {
                options.didDrop($sourceElement, $destElement);
            }
            cancelDestElement(options);

            if (options.makeClone) {
                $activeElement.remove();
                if (options.sourceClass)
                    $sourceElement.removeClass(options.sourceClass);
                else if (options.sourceHide)
                    $sourceElement.css("visibility", "visible");
            }
            else {
                $activeElement.css("position", "static");
                $activeElement.css("width", "");
                $activeElement.css("height", "");
                if (options.dragClass)
                    $activeElement.removeClass(options.dragClass);
            }

            $(window).unbind("mousemove.dragdrop touchmove.dragdrop");
            $(window).unbind("mouseup.dragdrop touchend.dragdrop");
            $sourceElement = $activeElement = limits = null;
        }
    };

    $.fn.dragdrop = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method '+method+' does not exist on jQuery.dragdrop');
        }
    };
})(jQuery);

