/*Structure*/

//#code example 1
 $(function () {
        'use strict';
        $.ajaxSetup({ cache: true });
        $.getScript('/js/rainmaker/debug_helper.js', function(){$.log('debug_helper.js loaded');$.ajaxSetup({ cache: false }); });

        var CCrouter = window.CCrouter || {};
        CCrouter.ProfileViewEdit = {
            init:          function () {
                this.isOnCancel = false;
                this.cacheElements();
                this.bindEvents();
                this.render();
            },
            cacheElements: function () {
                this.$dialog = $('#edit_user_profile_dialog');
                this.$dialogTitle = $('#ui-dialog-title-edit_user_profile_dialog');
                this.$inputs = $('input.input_no_border');
                this.$dpCountryBtn = $('#dp_phone_country');
//                this.$dpCountryList = $('#phone_country_list');
                this.$profilePic = $('#profile_picture').find('img');
                this.$aChangePic = $('#change_pic');

                this.$btnEdit = $('#edit_profile_dialog_button');
                this.$btnCancel = $('#edit_user_profile_cancel');
                this.$btnSave = $('#edit_user_profile_submit');
            },
            bindEvents:    function () {
                //btn edit
                this.$btnEdit.on('click', this.initStatusEdit);
                //btn cancel
                this.$btnCancel.on('click', this.initStatusView );
                //btn save
                this.$btnSave.on('click',this.saveEdit);
                //popup pic upload
                this.$aChangePic.on('click', this.showPicUploadPopup);

            },
            render:        function () {
                this.initStatusView();
            },

            //@View status
            initStatusView:function (e) {
                if(CCrouter.ProfileViewEdit.isOnCancel){//cancel on reset data
                    CCrouter.ProfileViewEdit.$dialog.load('/router/account/get_account_info',function(){
                        CCrouter.ProfileViewEdit.isOnCancel = false;
                    });
                }
                CCrouter.ProfileViewEdit.$dialogTitle.html('View Profile');
                CCrouter.ProfileViewEdit.$inputs.prop('readOnly', true);
            },
            //@Edit status
            initStatusEdit:function (e) {
                var $self = $(this);//btnEdit
                CCrouter.ProfileViewEdit.isOnCancel = true;
                CCrouter.ProfileViewEdit.$dialogTitle.html('Edit Profile');
                CCrouter.ProfileViewEdit.$inputs.removeClass('input_no_border').prop('readOnly', false);
                CCrouter.ProfileViewEdit.initDropdown(CCrouter.ProfileViewEdit.$dpCountryBtn);//dp
                CCrouter.ProfileViewEdit.$aChangePic.removeClass('hidden');//change pic
                $self.addClass('hidden').next().removeClass('hidden');//btn

            },
            //@saveEdit
            saveEdit: function(e){
                (new FormHelper("edit_user_profile_form")).post_form_data(function (data) {
                    if (data.msg) {
                        CCrouter.ProfileViewEdit.render();
                    }
                });
            },
            //@init Dropdown
            initDropdown : function($dpBtn){
                $dpBtn.each(function(){
                   var $this = $(this),//dpBtn
                       relList = $this.attr('rel'),
                       relListId = '#'+ relList,
                       $dpHiddenInput = $dpBtn.find('input[type=hidden]');

                   $dpBtn.addClass('select_class_container').find('.triangle').removeClass('hidden');

                   setToolTipOptions($this,relList);

                   $(relListId).on('click','p', function(){
                       //p value - get selected pv alue, assign to input hidden value assign, change display value
                       var $this = $(this),//p
                           selectedValue = $this.attr('value');
                       $dpHiddenInput.val(selectedValue);
                       $dpBtn.find('.select_class > span').text($this.text());
                       Tipped.hideAll();
                   });
                });
            },

          //@showPicUploadPopup
          showPicUploadPopup: function(e){
              e.preventDefault();
              AjaxHelper.show_ajax_dialog("upload_photo_dialog", "/router/account/upload_profile_pic");
//not a good idea to load css dynamically, it triggers and load several times of the css
//              $("<link/>", {
//                  rel: "stylesheet",
//                  type:"text/css",
//                  href:"/css/rainmaker/fileuploader.css"
//              }).appendTo("head");

              $.ajaxSetup({ cache:true });
              $.getScript('/js/rainmaker/fileuploader.js', function () {
                  $.ajaxSetup({ cache:false });
              });
            }

        };

        CCrouter.ProfileViewEdit.init();
    });


//#Code example 2 with config and Mockjs
$(function () {
        'use strict';
        var CCrouter = window.CCrouter || {};

        CCrouter.ProfilePicUploader = {
            config:        function () {
                this.URL_IMGUPLOAD = '/router/account/upload_profile_img/';
                this.URL_IMGCROP = '/router/account/crop_profile_img/';
                //@TODO: debug + mockjax, remove when hooked with backend
                this.debug = false;
                this.URL_MOCKJAX = "/";
//                this.imgDemoLarge = "/images/rainmaker/profile_pic_large.jpg";
//                this.imgDemoSmall = "/images/rainmaker/profile_pic_small.jpg";
                if (this.debug) {
                    this.URL_MOCKJAX = '/mockjax';
                    $.ajaxSetup({ cache:true });
                   $.getScript('/js/rainmaker/debug_helper.js', function () {
                       $.log('debug_helper.js loaded');
                   });
                    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery-mockjax/1.5.1/jquery.mockjax.js', function () {
                        console.log('remote mockjax.js loaded');
                        $.mockjax({
                            url:         CCrouter.ProfilePicUploader.URL_MOCKJAX,
                            //                            type:        'post',
                            responseTime:1500,
                            responseText:{
                                success:true,
                                text:   'JSON@ Mockjax success!'
                            }
                        });
                    });
                    $.ajaxSetup({ cache:false });
                }
            },
            init:          function () {
                this.config();
                this.cacheElements();
                this.bindEvents();
                this.render();
            },
            cacheElements: function () {
                this.$uploaderBox = $('#pic_uploader');
                this.$loadingOverlay = $('#img_crop_overlay');
                this.$btnSetProfile = $('#set_profile_pic');
                this.$btnCancel = $('#cancel_profile_pic');
                this.$imgCropParam = $('input#img_crop_param');
                this.$imgProfilePic = $('#profile_picture').find('img');
                this.$imgHeaderProfilePic = $('#user_profile_img').find('img');
            },
            bindEvents:    function () {
                this.$btnSetProfile.on('click', function (e) {
                });
                this.$btnCancel.on('click', function (e) {
                    AjaxHelper.close_ajax_dialog('upload_photo_dialog');
                });
            },
            render:        function () {
                this.initUploader();
                this.$btnSetProfile.addClass('button_disabled');
            },

            //@init uploader
            initUploader:  function () {
                var uploader = new qq.FileUploader({
                    //@Todo: debug, action& param
                    //                    debug:true,
                    element:          CCrouter.ProfilePicUploader.$uploaderBox[0],
                    action:           CCrouter.ProfilePicUploader.URL_IMGUPLOAD,
                    template:         CCrouter.ProfilePicUploader.$uploaderBox.html(),
                    //params: {},
                    dragDrop:         true,
                    uploadButtonText: "Select a photo from your computer",
                    multiple:         false,
                    allowedExtensions:['jpeg', 'jpg', 'gif', 'png'],
                    sizeLimit:        1560000, //1500k
                    onSubmit:         function (id, fileName) {
                        //disable btn, show progress spinner
                        //                        console.log('onSubmit');
                        $('.qq-upload-list').addClass('hidden');
                    },
                    onComplete:       function (id, fileName, responseJSON) {
                        //hide progress spinner, enable btn, load pic
                        CCrouter.ProfilePicUploader.$btnSetProfile.removeClass('button_disabled');

                        //test delay 5s
                        CCrouter.ProfilePicUploader.initImgCrop(responseJSON.data.image_path); //initimgCrop
                    },
                    //                    onProgress: function(id, fileName, loaded, total){
                    //                        console.log('onProgress');
                    //                    },
                    //                    onUpload: function(id, fileName, xhr){
                    ////                        console.log('onUpload');
                    //                    },
                    messages:         {
                        typeError: "Upload Error: Invalid file type({file}).\nTry again with {extensions} file type.",
                        sizeError: "Upload Error:{file} is too large, maximum file size is {sizeLimit}.",
                        emptyError:"Upload Error:{file} is empty, please select files again without it."
                    }
                });//uploader
            },

            //@initImgCrop
            initImgCrop:   function (jsonImg) {
                $.ajaxSetup({ cache:true });
                $.getScript('/js/rainmaker/jquery.Jcrop.min.js', function () {
                    //          $.log('jcrop.min.js loaded');
                    $.ajaxSetup({ cache:false });

                    //get json and replace uploader with img, init img crop
                    //@Todo: fake json response & img
                    //                    responseJSON.img = CCrouter.ProfilePicUploader.imgDemoLarge;//fake
                    var $uploadedImg = $('<img id="uploaded_img">');
                    CCrouter.ProfilePicUploader.$uploaderBox.html($uploadedImg);

                    $uploadedImg.attr('src', jsonImg).load(function () {
                        var $thisPic = $(this);
                        //@cropping when img size w or h > 300, oterwise no cropping ( crop_param = '' )

                        if ($thisPic.width() > 300 || $thisPic.height() > 300) {
                            $uploadedImg.Jcrop({
                                aspectRatio:1,
                                boxWidth:   500, //max widith
                                boxHeight:  400, //max height
                                maxSize:    [350, 350],
                                minSize:    [300, 300],
                                //                            trueSize:   [400, 400],
                                bgColor:    '#fff',
                                bgOpacity:  0.4,
                                setSelect:  [ 10, 10, 200, 200 ],
                                allowResize:false,
                                allowSelect:false,
                                // addClass: 'jcrop-dark',
                                onChange:   CCrouter.ProfilePicUploader.applyCoords
                            })
                        }
                    });

                    CCrouter.ProfilePicUploader.$btnSetProfile.on('click', CCrouter.ProfilePicUploader.setProfileCrop);
                });
            },

            //@applyCoords
            applyCoords:   function (c) {
                //@Todo parameter pass to server
                //                var params = "x="+Math.round(c.x) + ", y=" + Math.round(c.y) + ", w=" + Math.round(c.w) + ", h=" + Math.round(c.h);
                var params = Math.round(c.x) + "," + Math.round(c.y) + "," + Math.round(c.w) + "," + Math.round(c.h);
                CCrouter.ProfilePicUploader.$imgCropParam.val(params);
            },

            //@setProfileCrop
            setProfileCrop:function (e) {
                //show loading overlay
                CCrouter.ProfilePicUploader.$loadingOverlay.removeClass('hidden').addClass('content-loading');
                //                 CCrouter.ProfilePicUploader.$imgProfilePic

                //@Todo: post back coords to crop img, display success and apply the new img to profile edit dialog
                $.post(CCrouter.ProfilePicUploader.URL_IMGCROP, {param:CCrouter.ProfilePicUploader.$imgCropParam.val()}, function (json) {
                    if (jQuery.isEmptyObject(json.error)) {
                        //close upload dialog , reload pic in profile edit dialog and in header.
                        AjaxHelper.close_ajax_dialog('upload_photo_dialog');

                        CCrouter.ProfilePicUploader.$imgProfilePic.add(CCrouter.ProfilePicUploader.$imgHeaderProfilePic).hide().attr('src', json.data.small_img).fadeIn('slow');
                        //CCrouter.ProfilePicUploader.$imgProfilePic.parent().addClass('content-loading');
                    }

                });
            }
        };

        CCrouter.ProfilePicUploader.init();
    }); //dom


//SpeedMeasure
var SpeedMeasure = {

    speedoChart:     null,
    status:          '',
    intervalPolling: 0,
//    intervalAnimate:0,

    config:          {
        //TODO: debug inteval time
        timeoutPolling: 20*1000, //20s
        timePolling: 20*1000,  //20s
        timeSpeedo: 1500,   //1.5s
        urlPolling: '',
        urlPost: '',
        msgFailed: 'Previous speed test failed, please try again.',
        msgSuccess: 'Speed test done successfully!',
        msgWait: 'Please wait for about 1 minute...'
    },
    cacheElements: function () {
        this.$btnSpeedo = $('#btn_speed_measure');
        this.$speedoMsg = $('#speed_measure_msg');
        this.$speedoLine = $('#bounce_line');
        this.$upload = $('#speed_measure_up');
        this.$download = $('#speed_measure_down');

//        this.$speedoArrow = $('#speed_measure_arrow');
    },
    bindEvents: function () {
        this.$btnSpeedo.on('click', function(){
            SpeedMeasure.sendSMrequest();
            SpeedMeasure.processSpeedo();
        });
    },
    init: function (config) {
        if (config && typeof(config) === 'object') {
            $.extend(SpeedMeasure.config, config);
        }
        this.cacheElements();
        this.bindEvents();
        this.reset(true);
    },

    reset: function (firstLoad) { //true/false
        firstLoad = (typeof firstLoad !== 'undefined') ? firstLoad: false;

        //common UI reset: btn text. speedo arrow, transfer line,clear msg
        SpeedMeasure.$btnSpeedo.removeClass('button_disabled').text('Start');
//        SpeedMeasure.$speedoArrow.removeClass('hidden').rotate({angle:-62});
        SpeedMeasure.$speedoLine.removeClass('bounce');
        SpeedMeasure.set.message('');

        //TODO: test font style
//        SpeedMeasure.set.download('--');
        SpeedMeasure.set.download('12.3');
        SpeedMeasure.set.upload('--');

        if(firstLoad){  //first load: get status data
            SpeedMeasure.checkSMstatus(function(json){
                if(json.data){

                    if(json.data.is_measuring){ //1 measuring: animate + check status
                        SpeedMeasure.processSpeedo();
                    } else{ //0 measure done: fillin data if success

                        if(json.data.has_his){ //has_history
                            if(json.data.is_success){ //measure success -> set data
                                 SpeedMeasure.set.download(json.data.download);
                                 SpeedMeasure.set.upload(json.data.upload);
                                 SpeedMeasure.set.message(SpeedMeasure.config.msgSuccess,'alert-success');
                            } else { //measure fail
                                 SpeedMeasure.set.message(SpeedMeasure.config.msgFailed, 'alert-error');
                            }
                        }
                    }
                }
            });
        } else { // not-firstload clearinterval
//            clearInterval(SpeedMeasure.intervalAnimate);
            clearInterval(SpeedMeasure.intervalPolling);
        }
    },
    set:  {
        status: function (stage) {
            if(typeof stage !== 'undefined'){
                SpeedMeasure.status = stage;
            }
        },
        download: function (speed){
            if(typeof speed !== 'undefined'){
                SpeedMeasure.$download.html(speed.toString());
            }
        },
        upload: function (speed){
            if(typeof speed !== 'undefined'){
                SpeedMeasure.$upload.html(speed.toString());
            }
        },
        message: function (msg, c){
            if(typeof msg !== 'undefined'){
                SpeedMeasure.$speedoMsg.find('.alert-text').html(msg);
            }
            if(typeof c !== 'undefined'){
                SpeedMeasure.$speedoMsg.addClass(c);
            }
        }
    },
    processSpeedo:function (event) {
        SpeedMeasure.set.status('PROCESSING');
        SpeedMeasure.animateSpeedo();
        SpeedMeasure.intervalPolling = setInterval(SpeedMeasure.checkSMstatus, SpeedMeasure.config.timePolling); //10s
    },
    animateSpeedo: function(){
//        var angleStart = -62;  //0
//        var angleEnd = 240;  //100
//        var animateDuration = 5*1000;
//        var angleTarget = 0;
//        var i = 0;

        SpeedMeasure.set.message(SpeedMeasure.config.msgWait,'alert-info');
        SpeedMeasure.$btnSpeedo.addClass('button_disabled').text('Measuring...');
        SpeedMeasure.$speedoLine.addClass('bounce');

//        SpeedMeasure.intervalAnimate = setInterval(function(){
//            if(i % 2 === 0){
//                angleTarget = angleEnd;
//            } else{
//                angleTarget = angleStart;
//            }
//            setSpeed(angleTarget,animateDuration);
//            i++;
//        }, animateDuration-2000);
//
//        function setSpeed(toAngle, duration){
//            SpeedMeasure.$speedoArrow.rotate({
//                animateTo:toAngle,
//                duration:duration
//            });
//        }
    },
    sendSMrequest: function() {
        $.ajaxSetup({ cache: false });
        $.get(SpeedMeasure.config.urlPost, function(json){});
    },
    checkSMstatus: function (cbSuccess) {
        $.ajax({
            type:       "GET",
            url:       SpeedMeasure.config.urlPolling,
            dataType:   "json",
            timeout:    SpeedMeasure.config.timeoutPolling, //10s
            cache:      false,
            error:      function (jqXHR, textStatus, errorThrown) {
                //TODO: debug
                console.log('error:'+textStatus);
            },
            success: function(json){
                if(typeof cbSuccess!== 'undefined'){
                    cbSuccess(json);
                } else{
                     //default polling status
                    if(json.data.is_measuring === 0){ //0 measure done
                        //0 measure done :check is_success,
                        //success: clear interval, stop animation, show download/upload data, show status

                        //reset UI, stop animation
                        SpeedMeasure.reset();

                        if(json.data.has_his){ //has history before
                            if(json.data.is_success){ //success-> set status, data, clear interval

                                SpeedMeasure.set.status('DONE');
                                SpeedMeasure.set.download(json.data.download);
                                SpeedMeasure.set.upload(json.data.upload);
                                SpeedMeasure.set.message(SpeedMeasure.config.msgSuccess,'alert-success');
                                //last time date

                            } else { //test fail
                                SpeedMeasure.set.status('DONE');
                                SpeedMeasure.set.message(SpeedMeasure.config.msgFailed, 'alert-error');
                            }
                        }
                    }
                }
            }
        });
    }
};  //SpeedMeasure


$(function () {
    var uidValue = $('#hidden_uid').val();
    var urlPolling = '/router/network/' + uidValue + '/get_bw_speed_test_status/';
    var urlPost = '/router/network/'+ uidValue + '/device_actions?cmd=9';
    SpeedMeasure.init({
        'urlPolling':urlPolling,
        'urlPost': urlPost
    });
});