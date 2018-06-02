var equipmentAddressModal = {
    merchantArr: [],               //商家列表
    selMerchantToInfo: {},          //选择的商家，用于展示详情
    selMerchantToUpdate: {},        //选择的商家，用于更新数据
    selInsureOrderArr: [],          //选择的保险公司的单号列表
    pageEachNumber: 50,

    tabSelIndex: 0, //tab选中
    tabSelName: ''
};

var equipmentAddressVueMethod = {
    /*选项卡的选择事件*/
    tabSel: function (event) {
        var index = event.pEventAttr.index;
        equipmentAddressModal.tabSelIndex = index;
        tabShow();
        getCurrGridElement().psel(1);
        $("#eqaddressfloat").phide();

        switch (index) {
            case 0:
                equipmentAddressModal.tabSelName = '供应商';
                break;
            case 1:
                equipmentAddressModal.tabSelName = '生产商';
                break;
            case 2:
                equipmentAddressModal.tabSelName = '维修商';
                break;
            case 3:
                equipmentAddressModal.tabSelName = '保险公司';
                break;
        }
    },
    /*表格某一行的单击事件*/
    gridLineSel: function (model, event) {
        selfloatShow();
        equipmentAddressModal.selMerchantToInfo = model;
        equipmentLogic.getMerchantById();
    },
    /*表格翻页事件*/
    gridPageChange: function (event) {
        var currPageIndex = event.pEventAttr.pageIndex;
        equipmentLogic.getMerchantArr(currPageIndex);
    },
    /*保险公司列表--多个保险单号时，点击查看单号详情*/
    gridInsureOrderClick: function (model, event) {
        event.stopPropagation();
        var pageX = event.pageX;
        var pageY = event.pageY;
        equipmentAddressModal.selInsureOrderArr = model.insurer_info;
        $(".insuranceGridPop").css({
            left: pageX - 150,
            top: pageY - 20
        });
        $(".insuranceGridPop").show();
    },
    /*新建厂商--联系电话输入框失去光标时验证输入合法性*/
    phoneTextValid: function (model, event) {
        equipmentLogic.validTel(equipmentAddressModal.selMerchantToUpdate.phone, 'txtMerchPhone');
    },
    /*编辑厂商--联系电话输入框失去光标时验证输入合法性*/
    phoneTextValidEdit: function (model, event) {
        equipmentLogic.validTel(equipmentAddressModal.selMerchantToUpdate.phone, 'txtEditMerchPhone');
    },
    /*新建时--验证品牌的重复性*/
    brandRepeatValid: function (model, event) {
        var jqTarget = $('#divMerchantInfoToNew [txtbrand]').eq(model.index);
        if (!jqTarget.pverifi()) return;
        var currVal = model.name;
        equipmentLogic.brandRepeatValid(currVal, jqTarget);
    },
    /*编辑时--验证品牌的重复性*/
    brandRepeatValidEdit: function (model, event) {
        var jqTarget = $('#divMerchantInfoToEdit [txtbrand]').eq(model.index);
        if (!jqTarget.pverifi()) return;
        var currVal = model.name;
        equipmentLogic.brandRepeatValid(currVal, jqTarget);
    },
    /*新建时--验证保险单号的重复性*/
    insureNumRepeatValid:function (obj,event) {
        var $target=$(event.target);
        if(!$target.pverifi()) return;
        var idNum=$target.parent().attr("id");
        var index=Number(idNum.split("number")[1]);
        var curVal=equipmentAddressModal.selMerchantToUpdate.insurer_info[index].insurer_num;
        equipmentLogic.insureNumRepeatValid(curVal, $target.parent());

    },
    /*编辑时--验证保险单号的重复性*/
    insureNumRepeatValidEdit:function (obj,event) {
        var $target=$(event.target);
        if(!$target.pverifi()) return;
        var idNum=$target.parent().attr("id");
        var index=Number(idNum.split("editnumber")[1]);
        var curVal=equipmentAddressModal.selMerchantToUpdate.insurer_info[index].insurer_num;
        equipmentLogic.insureNumRepeatValid(curVal, $target.parent());
    },
    /*新增---名称失去焦点时验证重复性*/
    nameBlurValidRepeat: function (model, event) {
        var jqTarget = $('#txtMerchantName');
        if (!jqTarget.pverifi()) return;
        equipmentLogic.validNameRepeat(jqTarget);
    },
    /*编辑---名称失去焦点时验证重复性*/
    nameBlurValidRepeatToEdit: function (model, event) {
        var jqTarget = $('#txtMerchantNameEdit');
        if (!jqTarget.pverifi()) return;
        var currVal = model.name;
        equipmentLogic.validNameRepeat(jqTarget);
    }

};


var equipmentLogic = {
    validNameRepeatXhttp: null,
    init: function () {
        new Vue({
            el: '#eqaddressWrap',
            data: equipmentAddressModal,
            methods: equipmentAddressVueMethod
        });
        Vue.nextTick(function () {
            $("#eqaddresstab").psel(0);
        });
    },
    /*验证供应商、生产厂商、维修商、保险公司，名称是否重复*/
    validNameRepeat: function (jqTarget, isShowLoading, call) {
        isShowLoading = isShowLoading || false;
        if (isShowLoading) $('#globalloading').pshow();
        if (equipmentLogic.validNameRepeatXhttp) equipmentLogic.validNameRepeatXhttp.abort();
        var name = equipmentAddressModal.selMerchantToUpdate.company_name;
        var id = equipmentAddressModal.selMerchantToUpdate.company_id;
        var company_type = this.getMerchantType();
        var isRepeat = false;
        equipmentLogic.validNameRepeatXhttp = equipmentAddressController.validMerchantNameRepeat({
            company_name: name,
            company_id: id,
            company_type: company_type
        }, function (result) {  //成功回调
            result = result || {};
            isRepeat = result.can_use === false ? true : false;
            if (isRepeat) {
                if (isShowLoading) $('#globalloading').phide();
                jqTarget.pshowTextTip('名称不可重复');
            }else {
                jqTarget.phideTextTip();
                if (typeof call == 'function') call();
            }
        }, function () {
            isRepeat = true;
        }, function () {   //完成回调

        });
    },
    /*验证品牌的重复性*/
    brandRepeatValid: function (val, jqTarget) {
        var repeatNum = 0;
        if (val) {
            var brandArr = equipmentAddressModal.selMerchantToUpdate.equip_models;
            repeatNum = brandArr.filter(function (curr) {
                return curr.name == val;
            }).length;
        }

        if (repeatNum > 1) jqTarget.pshowTextTip('型号名称不可重复');
        else jqTarget.phideTextTip();
    },
    /**/
    insureNumRepeatValid:function (val,jqTarget) {
        var repeatNum = 0;
        if(val){
            var insureNumAry=equipmentAddressModal.selMerchantToUpdate.insurer_info;
            repeatNum=insureNumAry.filter(function (item) {
                return item.insurer_num==val;
            }).length;
            if(repeatNum>1){
                jqTarget.pshowTextTip('保险单号名称不可重复');
            }else{
                jqTarget.phideTextTip();
            }
        }
    },

    /*判断是否符合电话号或者符合手机号*/
    validTel: function (val, eleId) {
        if (!val || val.pisTel() || val.pisMobile()) return $('#' + eleId).phideTextTip();
        $('#' + eleId).pshowTextTip('请填写正确的电话号码');
    },
    /*获取公司类型 1 供应商、2 生产厂家、3 维修商、4 保险公司*/
    getMerchantType: function () {
        return (equipmentAddressModal.tabSelIndex + 1).toString();
    },
    /*转换brands*/
    changeBrands: function (brandsArr) {
        var newBrands = [], newBrandNames = [];
        for (var j = 0; j < brandsArr.length; j++) {
            var brandName = brandsArr[j] || '';
            brandName = typeof brandName == 'string' ? brandName : '';
            newBrands.push({
                name: brandName, index: j
            });
            brandName ? newBrandNames.push(brandName) : '';
        }
        return { brands: newBrands, brandStr: newBrandNames.join('、') };
    },
    /*构造商家*/
    constructorMerchant: function (arr) {
        arr = arr || [];
        for (var i = 0; i < arr.length; i++) {
            var curr = arr[i];
            var equip_models = curr.equip_models || [];
            var objBrand = equipmentLogic.changeBrands(equip_models);
            curr.equip_models = objBrand.brands;
            curr.brandStr = objBrand.brandStr;
        }
        return arr;
    },
    /*获取商家列表*/
    getMerchantArr: function (pageIndex, call) {
        $('#globalloading').pshow();
        var merchantType = this.getMerchantType();
        equipmentAddressController.getMerchantArr(pageIndex, equipmentAddressModal.pageEachNumber, merchantType, function (data) {
        }, function () {
            console.error('queryEquipCompanyList err');
        }, function (httpResponse) {
            $('#globalloading').phide();
            $(".per-scrollbar").css("max-height", "100%");
            if (typeof call == 'function') call();
            equipmentAddressModal.selMerchantToInfo = {};
            equipmentAddressModal.selMerchantToUpdate = {};
            equipmentAddressModal.merchantArr = [];

            var dataObj = httpResponse.responseJSON || {};
            var newData = dataObj.data || [];
            equipmentAddressModal.merchantArr = equipmentLogic.constructorMerchant(newData);
            var count = Math.ceil(dataObj.count / equipmentAddressModal.pageEachNumber) || 1;
            getCurrGridElement().find(".per-grid-paging").pcount(count);
        });
    },
    /*根据ID获取某一个商家*/
    getMerchantById: function (call) {
        $('#globalloading').pshow();
        equipmentAddressController.getMerchantById(equipmentAddressModal.selMerchantToInfo.company_id,
            function (data) {
                if (data.insurer_info.length == 0) {//保险单信息为空
                    data.insurer_info = [{ insurer_num: "", insurance_file: { name: "", key: "" } }];
                    equipmentAddressModal.selMerchantToInfo.insurer_info = data.insurer_info;
                }
                var merchant = equipmentLogic.constructorMerchant([data])[0] || {};
                equipmentAddressModal.selMerchantToInfo = merchant;
                for (var i = 0; i < equipmentAddressModal.merchantArr.length; i++) {
                    if (equipmentAddressModal.merchantArr[i].company_id == merchant.company_id) {
                        equipmentAddressModal.merchantArr[i] = merchant;
                        break;
                    }
                }

            }, function () {
                console.error('getMerchantById err');
            }, function () {
                $('#globalloading').phide();
                if (typeof call == 'function') call();
            });
    },
    /*添加商家点击事件时调用此方法，以清空缓存信息*/
    newMerchantEvent: function () {
        equipmentLogic.setValForMerchantToUpdate({});
    },
    /*编辑商家信息点点击事件时调用此方法，以清空缓存信息*/
    editMerchantEvent: function () {
        equipmentLogic.setValForMerchantToUpdate(JSON.parse(JSON.stringify(equipmentAddressModal.selMerchantToInfo)));
        if (this.getMerchantType() == 4) {
            equipmentLogic.insurefileInitialization();
        }
    },
    /*关闭浮动层*/
    closeFloat: function () {
        $('#divMerchantInfo').phideTextTip();
        //$('#eqaddressfloat [insurefileedit]').precover();
        //$('#eqaddressfloat [insurefile]').precover();
    },
    setValForMerchantToUpdate: function (objVal) {
        if (!objVal.equip_models || objVal.equip_models.length == 0) objVal.equip_models = [{ name: '', index: 0 }];
        if (!objVal.insurer_info) objVal.insurer_info = [{}];
        equipmentAddressModal.selMerchantToUpdate = objVal;
    },
    /*保存商家---保存新增、编辑
    *infoType 信息点对应的属性名称，用于编辑时，从保存按钮的if属性上获取
    */
    saveMerchant: function (infoType, call,flag) {
        $('#globalloading').pshow();
        //构造保险单号
        var uploadJqTargets, insureNumJqTargets;
        var controllerFn = '';
        var successCall;
        var obj = {};
        merchantType = this.getMerchantType();
      
        if(flag){//编辑名称时验证名称是否重复
            var nameEleId = equipmentAddressModal.selMerchantToUpdate.company_id ? 'txtMerchantNameEdit' : 'txtMerchantName';
            equipmentLogic.validNameRepeat($('#' + nameEleId), true, save);
        }else{
            save();
        }
        function save() {
            
            if (equipmentAddressModal.selMerchantToUpdate.company_id) {
                uploadJqTargets = $('#eqaddressfloat [insurefileedit]');
                insureNumJqTargets = $('#eqaddressfloat [insurenumedit]');
                obj[infoType] = equipmentAddressModal.selMerchantToUpdate[infoType];
                obj.company_id = equipmentAddressModal.selMerchantToUpdate.company_id;


                controllerFn = 'updateMerchant';
                successCall = function () {
                    equipmentLogic.getMerchantById(function () {
                        if (typeof call == 'function') call();
                        $('#globalnotice').pshow({ text: '保存成功', state: 'success' });
                    });
                };
            }else {
                uploadJqTargets = $('#eqaddressfloat [insurefile]');
                insureNumJqTargets = $('#eqaddressfloat [insurenum]');

                obj = JSON.parse(JSON.stringify(equipmentAddressModal.selMerchantToUpdate));

                // 过滤多余字段 保险单号置为空 2017/12/20 leo
                if (obj.insurer_info.length == 1 && !Object.keys(obj.insurer_info[0]).length) obj.insurer_info = [];
                // 过滤品牌为空的品牌
                obj.equip_models = obj.equip_models.filter(function (item) {
                    return item.name;
                });
                //判断保险单号是否重复
                if(obj.insurer_info && obj.insurer_info.length >0){
                    var jsonArr = obj.insurer_info;
                    var cFlag = checkIsRepeat(obj.insurer_info,'insurer_num');
                    if(!cFlag){
                        $("#globalloading").phide();
                        $('#globalnotice').pshow({ text: '保存失败，保险单号重复', state: 'failure' });
                        return;
                    }
                }
                //判断添加新厂家时，所含型号是否重复
                if(obj.equip_models && obj.equip_models.length >0){
                    var cFlag = checkIsRepeat(obj.equip_models,'name');
                    if(!cFlag){
                        $("#globalloading").phide();
                        $('#globalnotice').pshow({ text: '保存失败，所属型号重复', state: 'failure' });
                        return;
                    }
                }
                //判断添加新厂家中的设备型号或者添加保险公司时保险单号是否重复
                //arr 判断的数组 ，mark要判断的字段 
                function checkIsRepeat(arr,mark){
                    var resArr = [];
                    var flag = true;
                    arr.forEach(function(arr){
                        resArr.push(arr[mark]);
                    });
                    var nArr=resArr.sort();

                    for(var i=0;i<nArr.length;i++){

                        if (nArr[i]==nArr[i+1]){
                            flag = false;
                            break;
                        }
                    }
                    return flag;
                };
                controllerFn = 'newMerchant';
                successCall = function () {
                    if (typeof call == 'function') call();
                    getCurrGridElement().psel(1, false);
                    equipmentLogic.getMerchantArr(1, function () {
                        $('#globalnotice').pshow({ text: '保存成功', state: 'success' });
                    });
                };
            }
            obj.company_type = merchantType;

            if (merchantType == 4) {
                if (constructorInsureInfo() === false) return $('#globalloading').phide();
            }
            if (merchantType == 2) {
                // add by liuchang
                obj.equip_models = equipmentAddressModal.selMerchantToUpdate.equip_models;
                var oldBrands = obj.equip_models || [];
                var newBrands = [];
                for (var i = 0; i < oldBrands.length; i++) {
                    if (oldBrands[i].name)
                        newBrands.push(oldBrands[i].name);
                }
                obj.equip_models = newBrands;
            }
            equipmentAddressController[controllerFn](obj, successCall, function () {
                $('#globalloading').phide();
                $('#globalnotice').pshow({ text: '保存失败', state: 'failure' });
            });
        };

        function constructorInsureInfo() {
            var insurer_infoArr = obj.insurer_info || [];
            for (var i = 0; i < insurer_infoArr.length; i++) {
                var currInsureInfo = insurer_infoArr[i];
                var fileInfo = uploadJqTargets.eq(i).pval()[0];
                if (!fileInfo && !currInsureInfo.insurer_num) continue;
                if (fileInfo && !currInsureInfo.insurer_num) {
                    insureNumJqTargets.eq(i).pshowTextTip('请填写保险单号');
                    return false;
                };
                if (fileInfo)
                currInsureInfo.insurance_file = {
                        type: 'file',
                        name: fileInfo.name || '',
                        attachments: {
                            path: fileInfo.url,
                            toPro: 'key',
                            multiFile: false,
                            isNewFile: fileInfo.isNewFile || false,
                            fileType: 2,
                            fileName: fileInfo.name,
                            fileSuffix: fileInfo.suffix
                        }
                    };
            }
        };
    },
    /*删除商家
    */
    removeMerchantById: function (call) {
        $('#globalloading').pshow();
        equipmentAddressController.removeMerchantById(equipmentAddressModal.selMerchantToInfo.company_id,
            function () {
                call();
                getCurrGridElement().psel(1, false);
                equipmentLogic.getMerchantArr(1, function () {
                    $('#globalnotice').pshow({ text: '删除成功', state: 'success' });
                });
            }, function () {
                $('#globalloading').phide();
                $('#globalnotice').pshow({ text: '保存失败', state: 'failure' });
            });
    },
    /*添加品牌或添加保险单号*/
    addBrandOrInsure: function () {
        var merchantType = this.getMerchantType();
        switch (merchantType) {
            case '2':
                var oldBrands = equipmentAddressModal.selMerchantToUpdate.equip_models;
                oldBrands.push({ name: '', index: oldBrands.length });
                break;
            case '4':
                var oldInsureInfoArr = equipmentAddressModal.selMerchantToUpdate.insurer_info;
                oldInsureInfoArr.push({
                    insurer_num: '',
                    insurance_file: { type: '2', name: '', key: '' }
                });
                break;
        }
    },
    /*删除品牌或删除保险单号*/
    removeBrandOrInsure: function (index) {
        var merchantType = this.getMerchantType();
        switch (merchantType) {
            case '2':
                var oldBrands = equipmentAddressModal.selMerchantToUpdate.equip_models;
                oldBrands.splice(index, 1);
                break;
            case '4':
                var oldInsureInfoArr = equipmentAddressModal.selMerchantToUpdate.insurer_info;
                oldInsureInfoArr.splice(index, 1);
                equipmentLogic.insurefileInitialization();
                break;
        }
    },

    insurefileInitialization: function () {
        Vue.nextTick(function () {
            var insureArr = equipmentAddressModal.selMerchantToUpdate.insurer_info || [];
            var uploadJqTargets = $('#eqaddressfloat [insurefileedit]');
            // uploadJqTargets.eq(i).precover();
            for (var i = 0; i < uploadJqTargets.length; i++) {
                var currInsureFile = insureArr[i].insurance_file || {};
                uploadJqTargets.eq(i).precover();
               if (!currInsureFile.key) continue;
                uploadJqTargets.eq(i).pval([{
                    url: currInsureFile.key, name: currInsureFile.name
                }]);
            }

        });
    }
};