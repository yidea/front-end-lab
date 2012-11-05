/* jQuery Console Logger
 * https://github.com/acuppy/jQuery-Console-Logger/blob/master/jquery.log.js
 * TODO: output value & type for jquery obj, obj,number,boolean, function, array
 *exp: $('div.title').show().log('Title displayed'); $.log(timestamp, "timestamp");
 **/
(function() {
  'use strict';

  var $, Logger;
  $ = jQuery;

  Logger = {
    settings: { //config
      active: true,
      backtrace: false,  //stack call order
      group: true,
      collapsed: false,   //Default false
      log_level: 'warn' //default debug
    },
    levels: {
      info:  0,
      debug: 1,
      warn:  2,
      error: 3
    },

    //@Param:options - target object ; obj - context
    log: function(options, log_level, varName, obj) {
      var collection, write_to_console, _l, _s;
      _s = Logger.settings;
      _l = Logger.levels;

      if (!window.console || !_s.active || (_l[log_level] < _l[_s.log_level]) || !window.console[log_level]) {
        return;
      }

      //@param: msg- target object,
      write_to_console = function(msg, level, obj) {
        switch (level) {
          case 'info':
            // return console.info("%s: %o", msg, obj);
            return console.info(msg);
          case 'debug':
            // return console.debug("%s: %o", msg, obj);
            return console.debug(msg);
          case 'warn':
            // return console.warn("%s: %o", msg, obj);
            return console.warn(msg);
          case 'error':
            return console.error("%s: %o", msg, obj);
          case 'log':
            // return console.log("%s: %o", msg, obj);
            return console.log(msg);
        }
      };

      var timestamp = new Date().getTime();
      var typeofObj = (typeof options).toUpperCase();

      if (_s.group) {

        if (!_s.collapsed) {

          //jquery obj / dom / array /obj
          if(options.jquery) {
            typeofObj = "$jQueryObject";
          } else if(options.nodeType){
            typeofObj = "DOMelementObject";
          }
          else{
            //array / obj
            if(options instanceof Array) {
               typeofObj = "Array[" + options.length +"]" ;
            } else if(options instanceof Object) {  //obj
              typeofObj = "Object(" +Object.keys(options).length +")";
            }
          }

          //console.group(varName + ' Type="' + typeofObj + '", Timestamp='+timestamp);
          console.group(varName +', ' + typeofObj + ', '+ timestamp);
        } else {
          console.groupCollapsed(varName +', ' + typeofObj + ', '+ timestamp);
        }
      }

      collection = obj.each(function() {
        switch (typeof options) {
          case 'string':
            return write_to_console(options, log_level, this);

          case 'number':
            return write_to_console(options.toString(), log_level);

          case 'function':
            return write_to_console(options(this, log_level, this));

          case 'object':
            // return $.extend(_s, options);
            return write_to_console(options, log_level, this);

          case 'boolean':
            // return _s.active = options;
            return write_to_console(options.toString(), log_level);
        }
      });

      if (_s.group) console.groupEnd();
      if (_s.backtrace) console.trace();
      return collection;
    }
  };

//@$.log($el) ,exp. $.log(timestamp, "timestamp");
  $.log = function(options, varName) {  //$.log($el)
    var log_level, _s;
    log_level = "warn";

    //varName
    if(!varName){
      varName = "--";  //default
    } else {
      varName = varName;
    }

    try {
      _s = Logger.settings;
      // if (typeof arguments[1] !== 'string') log_level = 'debug';

      switch (typeof options) {
        case 'string':
          return Logger.log(options, log_level, varName, $(document));
        case 'number':
          return Logger.log(options, log_level, varName, $(document));
        case 'function':
          return Logger.log(options(), log_level, varName, $(document));
        case 'object':
          // return $.extend(_s, options);
          return Logger.log(options, log_level, varName, $(document));
        case 'boolean':
          // return _s.active = options;
          return Logger.log(options, log_level, varName, $(document));
        default:
          return Logger.log('Unsupported parameter passed to jquery.log()');
      }
    } catch (err) {
      return $.error('Logger had the following error: ' + err.toString());
    }
  };

//$el.log(), exp.$('div.title').log('Title displayed')
  $.fn.log = function(varName) {
    var log_level = "warn";
    var varName = (typeof varName !== 'undefined') ? varName : '--';

    try {
        return Logger.log(this, log_level, varName, $(document));

      // Logger.log(msg, log_level, scope || this);
    } catch (err) {
      return $.error('Logger had the following error: ' + err.toString());
    }

    // return this;
  };

}).call(this);