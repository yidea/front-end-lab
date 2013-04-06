/*-------------------------------------------------------------------------
 jQuery (slider) plugin v1.0
 -------------------------------------------------------------------------*/
;(function ($, window, document, undefined) {
    'use strict';

    var pluginName = 'slider',
        defaults = {
            interval: 3000,
            fnDone:$.noop
        };

    /*-------------------------------------------------------------------------
     PLUGIN PUBLIC CLASS DEFINITION
     -------------------------------------------------------------------------*/
    var Plugin = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    };

    Plugin.prototype = {
        constructor:Plugin,
        init: function () {
            this.cycle();
        },
        cycle: function () {
            /*@L: pda mvc io
             *  */
            this.interval = setInterval($.proxy(this.next, this), this.options.interval);             
        },
        next: function () {
            //next element active
            var $items = this.$element.find('.item'),
                len = $items.length,
                $active = $items.filter('.active'),
                activeIndex = $items.index($active),
                nextIndex = (activeIndex + 1) % len,
                $next = $items.eq(nextIndex);

            $active.removeClass('active');
            $next.addClass('active');
        }
    };

    /*-------------------------------------------------------------------------
     PLUGIN DEFINITION
     -------------------------------------------------------------------------*/
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            //prevent against multiple instantiation
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);



/*-------------------------------------------------------------------------
 @ yi_dropdown widget
 -------------------------------------------------------------------------*/
(function($, window, document){
    /*@L: pda mvc io  */
    //widget
    function Dropdown(element, options) {
        this.$el = $(element); //dropdown-btn
        this.$dropdown = this.$el.closest('.dropdown');
        this.dropdownSelector = '[data-toggle=dropdown]';
        this.init();
    }
    Dropdown.prototype = {
        init:function () {
            this.bindEvents();
//            this.render();
        },
        bindEvents: function () {
            $(document).on('click.dropdown.data-api', $.proxy(this.clearActiveMenu, this)); //clear when outside
            this.$el.on('click.dropdown.data-api', $.proxy(this.handleToggle, this));
        },

        handleToggle: function (e) {
            e.preventDefault();
            e.stopPropagation();
            //if dp closed -> open menu; else close menu
            var isOpen = this.$dropdown.hasClass('open');
            //multi dropdown, hideAll other open Menu before handle this one
            this.clearActiveMenu();

            if(!isOpen){
                this.$dropdown.addClass('open');
            } else {
                this.$dropdown.removeClass('open');
            }
        },
        clearActiveMenu: function () {
            $(this.dropdownSelector).each(function () {
               $(this).closest('.dropdown').removeClass('open');
            });
        }
    };

    //widget.init with jq.plugin
    var pluginName = 'yi_dropdown';
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data(pluginName);
            if(!data){
                $this.data(pluginName, new Dropdown(this, options));
            }
        });
    };
    $.fn[pluginName].Constructor = Dropdown;

    //widget.init with html data-api hook
    $(function () { //not affecting ajax html
        $('[data-toggle=dropdown]')[pluginName]();
    });

    //    $(document).on('click.dropdown.data-api', '[data-toggle=dropdown]', function (e) {
    //        e.preventDefault();
    //        var widget = $(this)[pluginName]();
    //        widget.data(pluginName).handleToggle();
    //    });
}(jQuery, window, document));


/*-------------------------------------------------------------------------
@ yi_tab
pda mvc
-------------------------------------------------------------------------*/
(function($, window, document){
    //widget mvc
    function Tab(element, options) {
        this.$element = $(element); //a data-toggle=tab
        this.$tabs = this.$element.closest('ul');
//        this.options = $.extend(defaults, options);
        this.init();
    }
    Tab.prototype = {
        init: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            this.$element.on('click.tab.data-api', $.proxy(this.handleActive, this));
        },

        handleActive: function (e) {
            //click tab -> if tab is not active, active current tab and content (add .active), remove previous active tab
            e.preventDefault();
            var $previousTab = this.$tabs.find('.active');
            var isActive = this.$element.parent().hasClass('active');
            if(!isActive){
             //clear actived items
                $previousTab.removeClass('active');
                var $previousTabContent = $($previousTab.children().attr('href'));
                $previousTabContent.removeClass('active');

             //active current tab and content
                this.$element.parent().addClass('active');
                var $currentTabContent = $(this.$element.attr('href'));
                $currentTabContent.addClass('active');
            }
        },
        clearActiveTabs: function () {

        }
    };

    //widget init
    var pluginName= 'yi_tab';
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('yi_tab');
            if(!data){
                $this.data(pluginName, new Tab(this, options));
            }
        });
    };

    $(function () {
        $('[data-toggle=tab]').yi_tab();
    });
}(jQuery, window, document));