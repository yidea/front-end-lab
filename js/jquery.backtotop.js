 /*
 * jQuery BacktoTop plugin v1.0
 * Yi Cao
 * 2012-9-20
 */
 // TODO: option for calculate footer height
;(function ( $, window, document, undefined ) {
   'use strict';

    // defaults
    var pluginName = 'BacktoTop',
        defaults = {
            propertyName: "value"
        };

    // Plugin constructor
    function BacktoTop( element, options ) {
        this.$element = $(element);
        this.$window = $(window);
        this.$document = $(document);
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;

        this._scrollTimer = 0;
        this.$backtotopNav = $('<div id="backtotop" class="hidden"> <a><span class="backtotop-img"></span>Back to top</a> </div>');
        this.scrollTargetBottom = this.$element.offset().top + this.$element.outerHeight();

        // this.lastscreenTop = this.$document.height() - this.$window.height();
        this.lastscreenTop = this.$document.height();

        //event logic
        this.init();
        this.$window.on( 'scroll.backtotop', $.proxy(this.checkScroll,this) );

    }

    //plugin methodm, logic
    BacktoTop.prototype = {
      // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element, this.options

        init: function(){
          //predp dom elem
          this.$backtotopNav.find('a').attr('href', '#');
          this.$backtotopNav.insertAfter(this.$element);
        },

        checkScroll: function(){
            window.clearTimeout(this._scrollTimer);
            this._scrollTimer = window.setTimeout( $.proxy(this.checkPosition,this),100);
        },

        checkPosition: function(){
            var scrollbarTop = this.$window.scrollTop();

            if(scrollbarTop > this.scrollTargetBottom){
                this.$backtotopNav.removeClass('hidden');

                if(scrollbarTop < this.lastscreenTop) {
                    this.$backtotopNav.removeClass('fixed');
                } else{
                    this.$backtotopNav.addClass('fixed');
                }
            } else{
                this.$backtotopNav.addClass('hidden');
            }
        }
    };


    //$.fn.plugin() -
    $.fn.backtoTop = function ( options ) {
        return this.each(function () {

          //preventing against multiple instantiations
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new BacktoTop( this, options ));
            }
        });
    };

    //data-api
    $(function(){
        $('[data-spy="backtotop"]').each(function() {
            var $spy = $(this);
            $spy.backtoTop($spy.data());
        })
    })

})( jQuery, window, document );
