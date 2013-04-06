var MSP = window.MSP || {};

MSP.UTIL = (function(){
    var u = {};

    //@ get param from URL
    u.getParameterByName= function(name){
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(window.location.search);
      if(results == null){
        return "";
      } else{
          return decodeURIComponent(results[1].replace(/\+/g, " "));
      }
    }

    //@ DD init
    u.initDropdown = function(target, options, callback) {
        var tmplDD = $('#tmpl_dd').html();
        var tmplData = {ddID: target};

        if(options && typeof options === 'object'){
            $.extend(tmplData, options);
        }
//        $.log(tmplData, "initDD");
        var usTmpl = _.template(tmplDD, {usData:tmplData});
        var $target = $('#'+target);
        //TODO: add jquery object check
        $target.html(usTmpl);

        //event handler
        var $ddBtn = $target.find('.list_box');
        var ddListRel = $ddBtn.attr('rel');
        setToolTipOptions($ddBtn, ddListRel);

        $('#'+ddListRel).find('p').on('click', function(){
            //update btn text & hidden input
            var value = $(this).attr('value');
            var text = $(this).html();
            $ddBtn.find('.select_class').html(text);
            $('input#' + target + '_ipt' ).val(value) ;
            Tipped.hideAll();

            if(callback && typeof callback === 'function'){
                callback();
            }
        });
    }

    return u;
})();


/*!
 * jQuery onffswitch plugin
 */
;(function ($, window, document) {

    var pluginName = 'onoffswitch',
        defaults = {
            onClick:function(){}
        };

    function Plugin (element, options) {

        //        var self = this;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        //dom ref
        this.$element = $(element);
        this.$checkbox = this.$element.children('.checkbox');

        //state
        this.state = this.$checkbox.is(':checked');

        //init -setup plugin and event handler
        this.init();
    }

    Plugin.prototype = {

        init:function () {
            //setup default state via ?checked
            this.setState(this.state);

            //event
            this.$element.on('click', $.proxy(function (e) {
                //custom onClick
                if (this.options.onClick) {
                    this.options.onClick(e, !this.state);
                } else{
                    this.setState(!this.state);
                }
            }, this));
        },

        setState:function (state) {
            //html
            this.state = state;
            this.$checkbox.attr('checked', state);

            //on off css
            if (state) { //on
                this.$element.removeClass('off').addClass('on');
            } else {
                this.$element.removeClass('on').addClass('off');
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    }

    //data-api
//    $(function () {
//        $('[data-onoffswitch="onoffswitch"]').each(function () {
//            var $onoffswitch = $(this);
//            $onoffswitch.onoffswitch();
//            //            $onoffswitch[pluginName];
//        })
//    })

})(jQuery, window, document);