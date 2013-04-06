/*-------------------------------------------------------------------------
 jQuery (YiProgressbar) plugin v1.0
 -------------------------------------------------------------------------
 Date:1/22/2013
 Licensed under the MIT license
 -------------------------------------------------------------------------*/

;(function ($, window, document, undefined) {
    'use strict';

    //plugin default option
    var pluginName = 'YiProgressbar',
        defaults = {
            status:'start', //stop
            startNum:0,
            endNum:100,
            time:60000,
            speed: 50,
            delay:0,
            step:1,
            update:$.noop,
            done:$.noop
        };

    /*-------------------------------------------------------------------------
     PLUGIN PUBLIC CLASS DEFINITION
     -------------------------------------------------------------------------*/
    //Plugin constructor
    var Plugin = function(element, options) {
        //plugin element ref
        this.$element = $(element); //bar
        this.$progress = this.$element.parent();
        this.$textFront = $('<span>').addClass('bar-front-text').prependTo(this.$element);
        this.$textBack = $('<span>').addClass('bar-back-text').prependTo(this.$progress);

        //plugin options
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        //plugin state
        this.percentage = this.options.startNum;

        //plugin init - setup plugin and event handler
        this.init();

    };

    Plugin.prototype = {
        constructor:Plugin,

        //TODO: pause on checkpoint
        init: function () {
            //@ cache element
            var self = this,
                $bar = self.$element,
                $progress = $bar.parent(),
                options = self.options,
                currentPerc = options.startNum,
                endPerc = options.endNum,
                totalPerc = endPerc - currentPerc,
                currentWidth = currentPerc,
                totalWidth = $progress.width(),
                fnUpdate = options.update,
                fnDone = options.done;

            //@setup element & init data based on options
            self.$textFront.width(totalWidth);
            self.setData(currentWidth,currentPerc);

            if(options.time){
                //TODO: make sure it's not /0
                options.speed = Math.round(options.time / (totalPerc));
            }

            //@ logic
            if(options.status === 'start'){
                var timeoutID = setTimeout(function(){
                    var intervalID = setInterval(function(){

                        if( currentPerc >= endPerc){
                            fnDone();
                            clearInterval(intervalID);
                        } else{
                            currentPerc += options.step;
                            self.percentage = currentPerc;

                            self.setData(currentPerc,currentPerc);
                            fnUpdate(currentPerc);
                        }
                    }, options.speed);
                }, options.delay);
            }
        },

        setData: function(w, p){
            var wPerc = w + '%';
            this.$element.data('percentage', p);
            this.$element.width(wPerc);
            this.$textFront.text(wPerc);
            this.$textBack.text(wPerc);

            //            console.log('p='+p+'  w='+w+'%');
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