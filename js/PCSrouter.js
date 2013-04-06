var PCSrouter = {
    Util: {
        formEditSave: function (options) {
            'use strict';
            var s;
            this.settings = {
                $form: null,
                $editBar: $('<div class="form-editbar"><div class="button_class submit_button">Save</div> <div class="button_class cancel_button">Cancel</div></div>'),
                dialog: false,
                urlLoad: '',
                fnCancel:$.noop,
                fnSubmit:$.noop
            };
            this.init = function(){
                s = $.extend({}, this.settings, options);
                this.setStatus('display');
                this.bindUIActions();
            };
            this.bindUIActions = function () {
                s.$form.on('click', '.edit_button', $.proxy(_handleEdit, this));
                s.$form.on('click', '.cancel_button', $.proxy(_handleCancel, this));
                s.$form.on('click', '.submit_button', $.proxy(_handleSubmit, this));
            };
            this.setStatus = function (status) {
                if(status === 'display'){
                    _setStatusDisplay();
                } else if (status === 'edit') {
                    _setStatusEdit();
                }
            };
            var _setStatusDisplay = function () {
                s.$form.addClass('form-display');
                s.$form.find('.edit_button').after(s.$editBar.addClass('hidden'));
                s.$form.find('.list_box').each(function () {
                    var $this = $(this); //list_box
                    var value = $this.find('input:hidden').val();
                    var listboxmenu = $this.attr('rel');
                    var tmp = ''.concat('p[value=', value, ']');
                    if(listboxmenu){
                        listboxmenu = '#' + listboxmenu;
                        var key = $(listboxmenu).find(tmp).html();
                        $this.find('.select_class').html(key);
                    }
                });
            };
            var _setStatusEdit = function () {
                s.$form.removeClass('form-display').addClass('form-edit');
                s.$form.find('.form-editbar').removeClass('hidden');
                s.$form.find('.radio_iphone_style').on('click', function (e) {
                    checkRadioIphone($(this));
                });
                s.$form.find('.radio_outer').on('click', function (e) {
                    radioBoxProcessing($(this));
                })
                s.$form.find('.list_box').each(function () {
                    var $this = $(this);
                    var relobj =  $this.attr('rel');
                    setToolTipOptions($this, relobj);
                    var listboxmenu = $this.attr('rel');
                    if(listboxmenu){
                        listboxmenu = '#' + listboxmenu;
                        $(listboxmenu).on('click', 'p', $.proxy(function (e) {
                            var $this = $(this);
                            var $el = $(e.target);
                            $this.find('.select_class').html($el.html());
                            $this.find('input:hidden').val($el.attr('value'));
                            Tipped.hideAll();
                        } , this));
                    }
                });
            };
            var _handleEdit = function (e) {
                var $el = $(e.target);
                $el.addClass('hidden');
                this.setStatus('edit');
            };
            var _handleCancel = function (e) {
                if(! s.dialog){
                    if(s.urlLoad){
                        $('#list_view_container').load(s.urlLoad);
                    }
                }
                s.fnCancel();
            };
            var _handleSubmit = function (e) {
                (new FormHelper(s.$form)).post_form_data(function(data){
                    if(data.msg){
                        _handleCancel();
                        s.fnSubmit();
                    }
                });
            };
        }
    },
    Network:{
        formEditSaveHelper: function ($form, urlLoad, dialogID) { //radio & switchports
            if($form.length === 2){ //duplicate dialog
                new PCSrouter.Util.formEditSave({
                    $form: $form.eq(1),
                    dialog: true,
                    urlLoad: urlLoad,
                    fnCancel: function () {
                        AjaxHelper.close_ajax_dialog(dialogID);
                    },
                    fnSubmit: function () {
                        $('#list_view_container').load(urlLoad);
                    }
                }).init();
            } else {
                if($form.closest('.modal_dialog').length){ //single dialog
                    new PCSrouter.Util.formEditSave({
                        $form: $form,
                        dialog: true,
                        urlLoad: urlLoad,
                        fnCancel:function () {
                            AjaxHelper.close_ajax_dialog(dialogID);
                        }
                    }).init();
                } else { //not dialog
                    new PCSrouter.Util.formEditSave({
                        $form: $form,
                        dialog: false,
                        urlLoad: urlLoad
                    }).init();
                }
            }
        }
    },
    Login:{}

};