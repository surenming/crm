/*-----------------------------------------------------------------------------
* @Description:     客户关怀-活动添加
* @Version:         1.0.0
* @author:          sunwanlin(529116421@qq.com)
* @date             2017.7.26
* ==NOTES:=============================================
* v1.0.0(2017.7.26):
     初始生成
* ---------------------------------------------------------------------------*/
$(function(){
    //初始化提示信息、分页
    showTip();
    //新建活动form验证
    formValidatorForm();
    //检查项添加弹框验证
    formValidatorAddForm();
    //积分项添加弹框验证
    formValidatorAddPointsForm();
    /**
     * 声明模板ID变量和是否被使用变量
     */
    /*var templateId;
    var isTemplateUsed;*/
    /**
     * 隐藏提示
     * @return {[type]} [description]
     */
    function showTip(){
        setTimeout(function(){
            $('.J_tip').hide();
        }, 2000);
    }
    /**
     * 关怀型活动-->显示循环粒度和活动人员
     * 营销型活动-->隐藏循环粒度和活动人员
     * @param  {[type]} ){                     var activitiesType [description]
     * @return {[type]}     [description]
     */
    $(".J_activitiesType").change(function(){
        var activitiesType = $(".J_activitiesType").val();
        if(activitiesType==1){
            $(".J_group").show();
            $(".J_polling").show();
        }else if(activitiesType==2){
            $(".J_group").hide();
            $(".J_polling").hide();
            $("[name='pollingTime']").val(-1);
            $("[name='memberGroupId']").val(-1);
        }
    });
    //两个日期都默认为当天,获取文本id并且传入当前日期
    $('#startDate').val(today());
    $('#end').val(today());
    /**
     * 日期默认为当天,获取文本id并且传入当前日期
     * @return {[type]} [description]
     */
    function today(){
        var today = new Date(),
            y = today.getFullYear(),
            m = today.getMonth()+1,
            d = today.getDate();
        //这里判断日期是否<10,如果是在日期前面加'0'
        m = m<10 ? '0'+m : m;
        d = d<10 ? '0'+d : d;
        return y + '-' + m + '-' + d;
    }
    /**
     * 活动名称input失焦
     */
    $(".J_name").blur(function(){
        sendName();
    });
    /**
     * 保存按钮
     */
    $(".J_save").click(function(){
        var data = $('.J_form').data('bootstrapValidator');
        if (data) {
            data.validate();
            if (!data.isValid()) {
                return false;
            }
            sendTemplateName();
        }
       //不管是否验证成功，都先发送模板名称
    });
    $(".J_submit").click(function(){
        var data = $('.J_form').data('bootstrapValidator');
        if (data) {
            data.validate();
            if (!data.isValid()) {
                return false;
            }
            submitTemplateName();
        }
       //不管是否验证成功，都先发送模板名称
    });
    /**
     * 保存为模板事件-发送添加模板数据
     * 点击保存为模板按钮
     */
     function save(){
        var 
            form = $('.J_form').serializeObject(),
            content = $('.J_content').val(),
            noticeContent = $('.J_noticeContent').val(),
            attenchment = $('.J_file').val();
        var templateId = $(".J_templateId").val();
        var isTemplateUsed = $(".J_isTemplateUsed").val();

        jQuery.extend(form,{
            content: content,
            noticeContent: noticeContent,
            attenchment: attenchment,
            templateId:templateId,
            isTemplateUsed:isTemplateUsed
        });

        var 
            tr = $('.J_tbody').children(),
            trPoints = $('.J_tbodyPoints').children(),
            
            list =[],
            id, checkItemName, checkItemContent,
            idPoints, checkPointsItemName, checkPointsItemContent,
            data;

        tr.each(function(){
            var tdArr = $(this).children(),
                id = $(this).attr('data-id'),
                trList = {}, 
                checkItemName = tdArr.eq(1).text(),
                checkItemContent = tdArr.eq(2).text();
            jQuery.extend(trList, {
                id: id, 
                checkItemName: checkItemName, 
                checkItemContent: checkItemContent
            });
            list.push(trList);
        });
        trPoints.each(function(){
            var tdArr = $(this).children(),
                idPoints = $(this).attr('data-id'),
                trPointsList = {}, 
                checkPointsItemName = tdArr.eq(1).text(),
                checkPointsItemContent = tdArr.eq(2).text();
            jQuery.extend(trPointsList, {
                idPoints: idPoints, 
                checkPointsItemName: checkPointsItemName, 
                checkPointsItemContent: checkPointsItemContent
            });
            list.push(trPointsList);
        });

        jQuery.extend(list, {
                id: id, 
                checkItemName: checkItemName, 
                checkItemContent: checkItemContent,
                idPoints: idPoints, 
                checkPointsItemName: checkPointsItemName, 
                checkPointsItemContent: checkPointsItemContent
        });
        jQuery.extend(form, {
            list:list
        });        

        $.ajax({
                type: "GET",
                url: jQuery.url.ECRBManagement.saveWillData,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: form,     //JSON.stringify
                dataType: "json",
                success: function (rs) {
                    if((rs.templateId!=null)&&(rs.isTemplateUsed!=null)){
                        //alert("终于成功了！");
                        $(".J_templateId").val(rs.templateId);
                        $(".J_isTemplateUsed").val(rs.isTemplateUsed);
                    }
                    else{
                        $('#modalDialog').modal();//活动名称重复对话框
                        console.log("前台验证成功，后台验证失败");
                    }
                },
                error: function (errMsg) {
                    $('#errorDialog').modal();
                }
            });
     }
    /**
     * 是否提交审核
     * 是否点击了提交审核按钮
     * @return {[type]} [description]
     */
    /*function isSubmitForm(templateId,isTemplateUsed){
        $('.J_submit').click(function(){//如果点击提交按钮
            validForm(templateId,isTemplateUsed);
        });
    }*/
    /**
     * 提交审核
     * 点击了提交审核按钮
     * @return {[type]} [description]
     */
    function submitForm(templateId,isTemplateUsed){
        var 
            form = $('.J_form').serializeObject(),
            content = $('.J_content').val(),
            noticeContent = $('.J_noticeContent').val(),
            attenchment = $('.J_file').val();
        var templateId = $(".J_templateId").val();
        var isTemplateUsed = $(".J_isTemplateUsed").val();

        jQuery.extend(form,{
            content: content,
            noticeContent: noticeContent,
            attenchment: attenchment,
            templateId:templateId,
            isTemplateUsed:isTemplateUsed
        });

        var 
            tr = $('.J_tbody').children(),
            trPoints = $('.J_tbodyPoints').children(),
            
            list =[],
            id, checkItemName, checkItemContent,
            idPoints, checkPointsItemName, checkPointsItemContent,
            data;

        tr.each(function(){
            var tdArr = $(this).children(),
                id = $(this).attr('data-id'),
                trList = {}, 
                checkItemName = tdArr.eq(1).text(),
                checkItemContent = tdArr.eq(2).text();
            jQuery.extend(trList, {
                id: id, 
                checkItemName: checkItemName, 
                checkItemContent: checkItemContent
            });
            list.push(trList);
        });
        trPoints.each(function(){
            var tdArr = $(this).children(),
                idPoints = $(this).attr('data-id'),
                trPointsList = {}, 
                checkPointsItemName = tdArr.eq(1).text(),
                checkPointsItemContent = tdArr.eq(2).text();
            jQuery.extend(trPointsList, {
                idPoints: idPoints, 
                checkPointsItemName: checkPointsItemName, 
                checkPointsItemContent: checkPointsItemContent
            });
            list.push(trPointsList);
        });

        jQuery.extend(list, {
                id: id, 
                checkItemName: checkItemName, 
                checkItemContent: checkItemContent,
                idPoints: idPoints, 
                checkPointsItemName: checkPointsItemName, 
                checkPointsItemContent: checkPointsItemContent
        });
        jQuery.extend(form, {
            list:list
        });        

        $.ajax({
                type: "GET",
                url: jQuery.url.ECRBManagement.submitForm,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: form,     //JSON.stringify
                dataType: "json",
                success: function (rs) {
                    if(rs.code==0){
                        $(".J_templateId").val(rs.templateId);
                        $(".J_isTemplateUsed").val(rs.isTemplateUsed);
                    }
                    else{
                        $('#modalDialog').modal();//活动名称重复对话框
                    }
                },
                error: function (errMsg) {
                    $('#errorDialog').modal();
                }
            });
    }
    /**
     * 发送模板活动名称、验唯一性
     * tips：点击保存为模板时，发送活动名称，后台验证是否唯一，若唯一则保存为模板
     * @return {[type]} [description]
     */
    function sendTemplateName(){
        var 
            name=$(".J_name").val()
        $.ajax({
                type: "GET",
                url: jQuery.url.ECRBManagement.sendActiveName,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {
                    nameTemplete: name+"模板"
                },     //JSON.stringify
                dataType: "json",
                success: function (rs) {
                    if(rs.code == 0){
                        save();
                    }else{
                        $('#modalDialog').modal();//活动名称重复对话框！
                    }
                },
                error: function (errMsg) {
                    $('#errorDialog').modal();
                }
            });
    }
    /**
     * 发送模板活动名称、验唯一性
     * tips：点击保存为模板时，发送活动名称，后台验证是否唯一，若唯一则保存为模板
     * @return {[type]} [description]
     */
    function submitTemplateName(){
        var 
            name=$(".J_name").val()
        $.ajax({
                type: "GET",
                url: jQuery.url.ECRBManagement.sendActiveName,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {
                    nameTemplete: name+"模板"
                },     //JSON.stringify
                dataType: "json",
                success: function (rs) {
                    if(rs.code == 0){
                        validForm();
                    }else{
                        $('#modalDialog').modal();//活动名称重复对话框！
                    }
                },
                error: function (errMsg) {
                    $('#errorDialog').modal();
                }
            });
    }
    /**
     * 点击提交审核按钮时验证表单
     * @return {[type]} [description]
     */
    function validForm(templateId,isTemplateUsed){
        var data = $('.J_form').data('bootstrapValidator');
        if (data) {
        // 修复记忆的组件不验证
            data.validate();
            if (!data.isValid()) {
                return false;
            }
        }
        submitForm(templateId,isTemplateUsed);
    }
    /**
     * 提醒时间select框改变事件
     */
    $(".J_remindTime").change(function(){
        remindDate();
    });
    /**
     * 提醒时间select框改变事件-将选择的数据刷到input框中
     */
    function remindDate(){
        var
            remindTime = $('.J_remindTime option:selected').text(),
            remindTimeValue = $('.J_remindTime option:selected').val();

        if(remindTimeValue == -1){
            $('.J_date').val('');
        }else{
            $('.J_date').val(remindTime);
        }
    }
    /**
     * 活动名称失焦事件-发送活动名称
     */
    function sendName(){
        var
            name = $("input[name='name']").val();

        if(name != ''){
            $.ajax({
                type: "GET",
                url: jQuery.url.ECRBManagement.sendActiveName,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                data: {
                    name: name
                },     //JSON.stringify
                dataType: "json",
                success: function (rs) {
                    if(rs.code != 0){
                        $('#modalDialog').modal();
                    }
                },
                error: function (errMsg) {
                    $('#errorDialog').modal();
                }
            });
        }
    }
    //检查项全选事件
    $(".J_selectAll").click(function() {
        $('input[name="subCheck"]').prop("checked", this.checked);
    });
    $('.J_tbody').on('click', "input[name='subCheck']", function() {
        var subCheck = $("input[name='subCheck']");
        $(".J_selectAll").prop("checked", (subCheck.length == $("input[name='subCheck']:checked").length) ? true: false);
    });
    //积分项全选事件
    $(".J_selectAllPoints").click(function() {
        $('input[name="subCheck"]').prop("checked", this.checked);
    });
    $('.J_tbodyPoints').on('click', "input[name='subCheck']", function() {
        var subCheckPoints = $("input[name='subCheck']");
        $(".J_selectAllPoints").prop("checked", subCheckPoints.length == $("input[name='subCheck']:checked").length ? true: false);
    });
/*************************************以下是检查项的函数*******************************************************/    
    //点击check添加对话框确定按钮验证
    $('.J_addDlg').click(function(){
        validItem();
    });
    //点击删除按钮，弹出提示框
    $('.J_del').click(function(){
        openTipDlg();
    })
    //删除用药项
    $('.J_delDlg').click(function(){
        delItem();
    });
    //重置表单
    $('.J_cancel').click(function() {
        resetForm();
    });
/*******************************************以下是积分项的函数******************************************************/
    //点击check添加对话框确定按钮验证
    $('.J_addPointsDlg').click(function(){
        validPointsItem();
    });
    //点击删除按钮，弹出提示框
    $('.J_delPoints').click(function(){
        openTipDlg();
    })
    //删除用药项
    $('.J_delDlg').click(function(){
        delItem();
    });
/*******************************************以下是自定义函数******************************************************/
    /**
     * 新建活动验证
     */
    function formValidatorForm(){
        $('.J_form').bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: '活动名称不能为空'
                        }
                    }
                },
                level: {
                    validators: {
                        notEmpty: {
                            message: ' '
                        },
                        regexp: {
                            regexp: /^[0-9]\d*$/,
                            message: '活动级别不能为空'
                        }
                    }
                },
                startDate: {
                    validators: {
                        notEmpty: {
                            message: '活动时间不能为空'
                        }
                    }
                },
                pollingTime: {
                    validators: {
                        notEmpty: {
                            message: ' '
                        },
                        regexp: {
                            regexp: /^[0-9]\d*$/,
                            message: '循环粒度不能为空'
                        }
                    }
                },
                type: {
                    validators: {
                        notEmpty: {
                            message: ' '
                        },
                        regexp: {
                            regexp: /^[0-9]\d*$/,
                            message: '活动类型不能为空'
                        }
                    }
                },
                endDate: {
                    validators: {
                        notEmpty: {
                            message: '活动时间不能为空'
                        }
                    }
                },
                memberGroupId: {
                    validators: {
                        notEmpty: {
                            message: ' '
                        },
                        regexp: {
                            regexp: /^[0-9]\d*$/,
                            message: '活动人员不能为空'
                        }
                    }
                },
                type: {
                    validators: {
                        notEmpty: {
                            message: ' '
                        },
                        regexp: {
                            regexp: /^[0-9]\d*$/,
                            message: '活动类型不能为空'
                        }
                    }
                },
                remindTime:{
                    validators: {
                        notEmpty: {
                            message: ' '
                        },
                        regexp: {
                            regexp: /^[1-9]\d*$/,
                            message: '提醒时间不能为空'
                        }
                    }
                }
            }
        });
    }
    /**
    * 检查项添加框验证
    * [formValidatorAddForm description]
    * @return {[type]} [description]
    */
    function formValidatorAddForm(){
        $('.J_addForm').bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                checkItemName: {
                    validators: {
                        notEmpty: {
                            message: '名称不能为空'
                        }
                    }
                },
                checkItemContent: {
                    validators: {
                        notEmpty: {
                            message: ' '
                        },
                        regexp: {
                            regexp: /^[1-9]\d*$/,
                            message: '内容不能为空'
                        }
                    }
                }
            }
        });
    }
    /**
    * 积分项添加框验证
    * [formValidatorAddForm description]
    * @return {[type]} [description]
    */
    function formValidatorAddPointsForm(){
        $('.J_addPointsForm').bootstrapValidator({
            message: 'This value is not valid',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                
                checkItemName: {
                    validators: {
                        notEmpty: {
                            message: ' '
                        },
                        regexp: {
                            regexp: /^[1-9]\d*$/,
                            message: '内容不能为空'
                        }
                    }
                },
                checkItemContent: {
                    validators: {
                        notEmpty: {
                            message: '名称不能为空'
                        }
                    }
                }
            }
        });
    }
    /**
     * 验证检查项添加对话框表单内容
     * @return {[type]} [description]
     */
    function validItem(){
         var form = $('.J_addForm'),
             data = form.data('bootstrapValidator');
        if (data) {
        // 修复记忆的组件不验证
            data.validate();
            if (!data.isValid()) {
                return false;
            }else{
                addItem();
                return true;
            }
        }
    }

    /**
     * 验证积分项添加对话框表单内容
     * @return {[type]} [description]
     */
    function validPointsItem(){
         var form = $('.J_addPointsForm'),
             data = form.data('bootstrapValidator');
        if (data) {
        // 修复记忆的组件不验证
            data.validate();
            if (!data.isValid()) {
                return false;
            }else{
                addPointsItem();
                return true;
            }
        }
    }
    /**
     * 自动给关联检查项的名称赋值
     * @param  {[type]} )var itemTr [description]
     * @return {[type]}     [description]
     */
    $(document).on('click','.J_add',function(){
        var itemTr = $(".J_tbody tr:last td:nth-child(2)");
        console.log(itemTr);
        var trText = itemTr.text();//获取最后一条内容的text,string类型
        var nameNum = parseInt(trText.substr(trText.length-1,1));//将最后一条名称的编号赋值给nameNum,string类型
        if(nameNum==0){
            console.log(0);
        }else{
            console.log(nameNum);
            var remove = $("#remove");
            remove.remove();
        }
        $(".J_checkItemName").val('检查项'+ (nameNum+1));
    });
    /**
     * 新增一条检查项名称-内容数据项
     * [addItem description]
     */
    function addItem(){
        var id = $('.J_tbody').children("tr:last-child").attr('data-id'),
            curId = id + 1,
            checkItemName =$('.J_checkItemName').val(),
            checkItemContent = $('.J_checkItemContent').find("option:selected").text();

        $('.J_tbody').append(
            '<tr data-id="' + curId + '"> \
                <td> <input class="J_subCheck"  type="checkbox" name="subCheck" > </td> \
                <td>'+checkItemName+'</td>\
                <td> <span>'+ checkItemContent + '</span> </td> \
            </tr>');
        $('#addDialog').modal('hide');
        /**
         * 清楚验证缓存
         */
        $('#addDialog').on('hidden.bs.modal', function() {
            $('.J_addForm').bootstrapValidator('resetForm', true);

            $('.J_checkItemName').val('');
            $('.J_checkItemContent').val('');
            $(".J_addForm").data('bootstrapValidator').destroy();
            $('.J_addForm').data('bootstrapValidator', null);
            formValidatorAddForm();
        });
    }

    /**
     * 新增一条积分项名称-内容数据项
     * [addItem description]
     */
    function addPointsItem(){
        var id = $('.J_tbodyPoints').children("tr:last-child").attr('data-id'),
            curId = id + 1,
            pointsItemName =$('.J_pointsItemName').find("option:selected").text();
            pointsItemContent = $('.J_pointsItemContent').val();

        $('.J_tbodyPoints').append(
            '<tr data-id="' + curId + '"> \
                <td> <input class="J_subCheckPoints"  type="checkbox" name="subCheck" > </td> \
                <td>' + '积分'+pointsItemName + '</td>\
                <td>'+ pointsItemContent + '</td> \
            </tr>');
        $('#addPointsDialog').modal('hide');
        /**
         * 清楚验证缓存
         */
        $('#addPointsDialog').on('hidden.bs.modal', function() {
            $('.J_addPointsForm').bootstrapValidator('resetForm', true);

            $('.J_pointsItemName').val('');
            $('.J_pointsItemContent').val('');
            $(".J_addPointsForm").data('bootstrapValidator').destroy();
            $('.J_addPointsForm').data('bootstrapValidator', null);
            formValidatorAddPointsForm();
        });
    }
    /**
     * 根据是否有删除项弹出不同的提示框
     * @return {[type]} [description]
     */
    function openTipDlg(){
        var checked = $('input[type=checkbox]:checked').length; 
        if(checked == 0){
            $('#delTipDialog').modal();
        }else{
            $('#delDialog').modal();
        }
    }
    /**
     * 删除所选项
     * [delItem description]
     * @return {[type]} [description]
     */
    function delItem(){
        var checked = $('tbody').find('input[type=checkbox]:checked'),
            tr = checked.parents("tr");
        tr.remove();
        $('#delDialog').modal('hide');
        $(".J_selectAll").prop("checked", subCheck.length == $("input[name='subCheck']:checked").length ? true: false);
    }    
    /**
     * 点击新建活动reset按钮时清空校验、数据
     * @param  {[type]} ) 
     * [description]
     * @return {[type]}   [description]
     */
    function resetForm(){
        $('.J_form').bootstrapValidator('resetForm', true);
        $(".J_form").data('bootstrapValidator').destroy();
        $('.J_form').data('bootstrapValidator', null);
        $('.tip').remove();
    }
});