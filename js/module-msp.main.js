var MSP = window.MSP || {};

MSP.Main = (function () {
    var m = {},
        oTable,
        mspUID = MSP.MSP_UID,
        TABLE_OPTION = {'aoColumnDefs':[{ "bSortable":false, "aTargets":[0, 9] },{"iDataSort":8, "aTargets":[7]}], 'aaSorting':[[1, 'asc']], "bInfo":true, "bFilter":true, "bPaginate":true, "bLengthChange":true};

    m.TIME_PROCESS = 500;
    m.URL_MSP_ROOT = '/router/msp/' + mspUID;
    m.URL_AJAX_DT = m.URL_MSP_ROOT + '/msp_networks/';
    m.URL_AJAX_DT_DETAIL = m.URL_MSP_ROOT + '/network_details';
    m.URL_AJAX_ADDZONE = m.URL_MSP_ROOT + '/get_avaible_mspzones_for_network';
    m.URL_AJAX_STOP_MANAGE = m.URL_MSP_ROOT + '/delete_network_from_msp?network_uid=';
    m.URL_AJAX_TURNOFF_ZONE = m.URL_MSP_ROOT + '/set_is_syn_networkzone/';
    m.URL_AJAX_DD = '/router/network/';

    //@ Dtable network detail
    function _getTmplNetworkDetail(json){
        var tmplNetworkDetail = $('#tmpl_network_detail').html();
        var dataNetworkDetail = json.data;
        var usTmpl = _.template(tmplNetworkDetail, {usData:dataNetworkDetail});
        return usTmpl;
    }



    //@ Load Datatable
    m.loadDatatable = function ($container, url) {
        var filterbyID = parseInt($('#dd_filterby_ipt').val()),
            groupbyID = parseInt($('#dd_groupby_ipt').val());
        url = (typeof url !== 'undefined') ? url : m.URL_AJAX_DT + '?filterby=' + filterbyID + '&groupby=' + groupbyID;

        //inProgress
        var msgProgress = 'Loading...';
        $("#processing_outer").addClass('inprogess');
        $("#processing").html(msgProgress);

        $container.load(url, function (table) {
            //progress done
            window.setTimeout(clearProgressBar, m.TIME_PROCESS);

            var $table = $container.find('table');

            if(groupbyID > 0){ //dt grouping
                oTable = datatable_helper($table, true, TABLE_OPTION);
                $('.dataTable').addClass('dataTable-grouping');
                oTable.rowGrouping({iGroupingColumnIndex:groupbyID, sGroupingColumnSortDirection:"asc", iGroupingOrderByColumnIndex:groupbyID, bExpandableGrouping:true });
            } else {
                oTable = datatable_helper($table, false, TABLE_OPTION);
            }

            $table.find('tbody>tr').each(function () {
                var networkUID = $(this).data('uid');
                var ajaxurlDD = m.URL_AJAX_DD + networkUID;
                var ddType = '';

                //td row detail
                $(this).find('td.view_more_details_rec').on('click', function() {
                    var tr = $(this).parent('tr')[0];
                    var $tr = $(tr);
//                    var networkUID = $tr.data('uid');
                    var $detailIcon = $(this).find('.more_info_arrow_adv');
                    var $detailArrow = $detailIcon.next('.triangle');

                    if (oTable.fnIsOpen(tr)) {
                        $detailIcon.removeClass('less_info_rec_device');
                        $detailArrow.removeClass('inv_triangle');
                        oTable.fnClose(tr);
                    } else {
                        $detailIcon.addClass('less_info_rec_device');
                        $detailArrow.addClass('inv_triangle');

                        $.get(m.URL_AJAX_DT_DETAIL + '?network_uid=' + networkUID, function (json) {
                            oTable.fnOpen(tr, _getTmplNetworkDetail(json), 'msp-dtable-details');
                        })
                    }
                });

                //dd- router, alert
                $(this).find('.msp-dtable-dd').each(function() {

                    if ($(this).hasClass('dd-alert')) {
                        ddType = '/notifications/';
                    } else if ($(this).hasClass('dd-router')) {
                        ddType += '/get_device_last_call_home/';
                    }

                    Tipped.create(this, ajaxurlDD + ddType, { ajax:{cache:false}, skin:'cloud', stem:true, closeButton:false, width:570, hook:'bottommiddle', offset:{x:0, y:-2}, hideOnClickOutside:true, hideOthers:true, hideOn:[{element:'self', event:'click'}], showOn:'click', maxWidth:570, background:'#f0f0f0', border:{size:1, color:'#bebebe', opacity:1}, radius:0, shadow:{blur:3, color:'#333', offset:{x:0, y:1}}, onShow:function (content, element) {onShow(content,element);}, onHide:function (content, element) {onHide(content,element);} });
                });

                //tooltip title setup
                $(this).find('.tooltip-title').each(function(){
                    var options = {offset : { x: 0, y: 0 }};
                    setTitleToolTips($(this),options);
                });

                //onff switch
                $('.switch-onff').each(function() {
                    var $onoffswitch = $(this);

                    $onoffswitch.onoffswitch({
                        onClick: function(e, status){
                            status = status ? 1: 0; //true/false -> 1/0
                            var $switch = $(e.target),
                                zoneindex = $switch.parent('td').data('zoneindex'),
                                url = m.URL_AJAX_TURNOFF_ZONE,
                                nwUID = $switch.closest('tr').data('uid'),
                                options;


                            if(status) {
                                options = {'title':"Confirm Start Synchronize Zone", 'msg':"Are you sure you want to start synchronize this zone with MSP zone?"};
                            } else {
                                options = {'title':"Confirm Stop Synchronize Zone", 'msg':"Are you sure you want to stop synchronize this zone with MSP zone?"};
                            }

                            custom_confirm(options, function () {
                                var msgProgress = 'Stop managing network in progress...',
                                    msgSuccess = 'Successfully stop managing this network';
                                var postData = {
                                    network_uid:nwUID,
                                    zone_index:zoneindex,
                                    is_syn: status
                                };

                                $("#processing_outer").addClass('inprogess');
                                $("#processing").html(msgProgress);

                                $.post(url, postData, function (response) {
                                    if (response.msg) {
                                        $("#processing").html(msgSuccess);
                                        window.setTimeout(clearProgressBar, m.TIME_PROCESS);

                                        //reload dtable
                                        MSP.Main.loadDatatable($('#list_view'));
                                    }
                                });
                            });
                        }
                    });
                })


                //Add to zone dialog
                $(this).find('.add-to-zone').each(function(){
                    $(this).on('click', function(){
                        var zoneindex = $(this).parent().data('zoneindex');

                        AjaxHelper.show_ajax_dialog("add_to_zone_dialog", m.URL_AJAX_ADDZONE + '?network_uid=' + networkUID,{},function(){
                            $('input[name=networkzone_index]').val(zoneindex);
                        });
                        return false;
                    });
                })

                //manage stop
                $(this).find('.icon-stop').on('click', function(){
                    var options = {'title':"Confirm Stop Managing Network", 'msg':"Are you sure you want to stop managing this network?"};
                    var url = m.URL_AJAX_STOP_MANAGE + networkUID;
                    custom_confirm(options,function(){
                        var msgProgress = 'Stop managing network in progress...',
                            msgSuccess = 'Successfully stop managing this network';
                        $("#processing_outer").addClass('inprogess');
                        $("#processing").html(msgProgress);
                        $.post(url,function(response)
                        {
                            if(response.msg)
                            {
                                $("#processing").html(msgSuccess);
                                window.setTimeout(clearProgressBar, m.TIME_PROCESS);

                                //reload dtable
                                MSP.Main.loadDatatable($('#list_view'));
                            }
                        });
                    });

                    return false;
                });

            });  //.each
        }); //.load
    }  //loadDatatable

    return m;
})();


$(document).ready(function() {
    var urlParamNetworkUID = MSP.UTIL.getParameterByName('search_by');

    //@dd fitler
    var ddOptionFilterby = {
        ddBtnDefaultText: 'All',
        ddBtnDefaultValue: '0',
        ddOptions: [
            {value: '0', text:'All'},
            {value: '1', text:'Active'},
            {value: '2', text:'Inactive'}
        ]
    };
    var ddOptionGroupby = {
        ddBtnDefaultText: 'Ungroup',
        ddBtnDefaultValue: '0',
        ddOptions: [
            {value: '0', text:'Ungroup'},
            {value: '1', text:'Service Zone'},
            {value: '2', text:'Router Model'}
        ]
    };
    MSP.UTIL.initDropdown('dd_filterby', ddOptionFilterby, function(){
        MSP.Main.loadDatatable($('#list_view'));
    });
    MSP.UTIL.initDropdown('dd_groupby', ddOptionGroupby, function(){
        MSP.Main.loadDatatable($('#list_view'));
    });

    //TODO: show hide filter when specific network management
    if(urlParamNetworkUID !== ''){ //load unique network_uid
        var url = MSP.Main.URL_AJAX_DT + '?search_by=' + urlParamNetworkUID;
        MSP.Main.loadDatatable($('#list_view'), url);
    } else {
        MSP.Main.loadDatatable($('#list_view'));
    }

    //@header nav position
    $('#arrow-icon').css({'top':'92px'});
    $("#menu_network .submenu_img").addClass('selected_submenu_img');
    $("#menu_network .submenu_text").addClass('selected_submenu_text');

    //@header toolbar
    $('#add_network').on('click', function(e){
        window.open('/router/network/setup/');
    });

    $('#refresh_btn').on('click', function(e){
        MSP.Main.loadDatatable($('#list_view'));
    });

});