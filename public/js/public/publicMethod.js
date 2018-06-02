var publicMethod = {
    clickAdditem: function (item) { //弹出框添加选中

        var id = item.id;

        var personPositionList = JSON.parse(JSON.stringify(orderDetail_data.pub_model.personPositionList));

        personPositionList.forEach(function (item) {

            if (item.id == id) {

                item.isSelected = !item.isSelected;

                // 当父级被选中的时候子级跟随变化
                if (item.type == 2) {
                    item.persons.map(function (t) {

                        t.isSelected = item.isSelected;
                        return t;
                    })
                }
            } else if (item.type == 2) {
                item.isSelected = item.persons.reduce(function (con, info) {
                    info.isSelected = info.id == id ? !info.isSelected : info.isSelected;
                    if (!con) return con;
                    return info.isSelected;
                }, true);
            }
        })

        orderDetail_data.pub_model.personPositionList = personPositionList;

        // Vue.set(this, 'personPositionList', personPositionList);

    },
    createAssignSetYes: function () { //指派设置确定
        var valArr = [];
        var arr = JSON.parse(JSON.stringify(orderDetail_data.pub_model.personPositionList));
        arr.forEach(function (ele) {
            if (ele.isSelected) {
                if (ele.type == 2) {
                    valArr.push({"name": ele.name, "type": ele.type})
                } else if (ele.type == 3) {
                    valArr.push({"name": ele.name, "type": ele.type, "person_id": ele.person_id})

                }
            }
            if (ele.type == "2" && !ele.isSelected) {
                ele.persons.forEach(function (p) {
                    if (p.isSelected) {
                        valArr.push({"name": p.name, "type": "3", "person_id": p.person_id})

                    }
                })
            }
        });
        // console.log(JSON.stringify(valArr));
        orderDetail_data.userInfo;
        var nextRoute = valArr;
        var operatorName = orderDetail_data.userInfo.user.name;
        var operatorId = orderDetail_data.userInfo.user.person_id;
        // console.log(operatorName)
        var _data = {
            "order_id": orderDetail_data.order_id,
            "operator_id": operatorId,
            "operator_name": operatorName,
            "next_route": nextRoute
        };
        if (nextRoute.length > 0) {
            orderDetail_pub.assignOrderSet(_data);
            $("#createAssignSet").hide();
        } else {
            $("#publishNotice").pshow({text: '请选择指派的岗位或人员范围', state: "failure"});
        }
    },
    stopOrderSetYes: function () {//中止工单确定
        var operatorName = orderDetail_data.userInfo.user.name;
        var operatorId = orderDetail_data.userInfo.user.person_id;
        var option = orderDetail_data.pub_model.stop_order_content;
        var _data = {
            "order_id": orderDetail_data.order_id,
            "operator_id": operatorId,
            "operator_name": operatorName,
            "opinion": option
        };
        if (option != '') {
            orderDetail_pub.stopOrderSet(_data);
        } else {
            $("#stopTishi").show();
            return;
        }
    },

    // 设置光标位置
    setCaretPosition: function (ctrl, pos) {
        if (ctrl.setSelectionRange) {
            ctrl.focus();
            ctrl.setSelectionRange(pos, pos);
        }
        else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    },

    //事项内容keyup事件
    //params:
    //  flag 2为结构化输入'我要对'文本框 3为结构化输入'进行'文本框
    changeMatterContent: function (model, index, event, jqTextarea, addSpecialCharFocusIndex, addSpecialCharAddedStr, flag) {
        commonData.publicModel.inputToCustomizeNameRepeat = false;
        //更新对象、SOP数据
        setTimeout(function () {
            var start = flag == 3 ? 1 : 0;
            var end = flag == 2 ? 1 : 2;
            for (var j = start; j < end; j++) {
                var type = commonData.types[j];
                var type1 = type == commonData.types[1] ? type : commonData.types[0];
                publicMethod.updateObjs(null, null, type, type1, null, index);
            }
        }, 100);


        //commonData.inputMode = flag;
        commonData.textAttrName = flag == 2 ? 'desc_forepart' : flag == 3 ? 'desc_aftpart' : 'description';
        commonData.curMatterIndex = index;
        commonData.curMatterContent = JSON.parse(JSON.stringify(model));

        var code = addSpecialCharAddedStr == '@' ? 50 : addSpecialCharAddedStr == '#' ? 51 : event.keyCode;
        var jqTarget = jqTextarea ? jqTextarea : $(event.currentTarget);
        var textwrap = jqTarget[0];
        commonData.jqMatterTextwrap = jqTarget;
        commonData.editingJqTextwrap = jqTarget;

        var focusIndex = addSpecialCharFocusIndex ? addSpecialCharFocusIndex : textwrap.selectionStart;
        var text = model[commonData.textAttrName] || '';
        var len = text.length;
        if (!addSpecialCharAddedStr && len == commonData.beforeLen) return;        //过滤：1、中文输入法输入的拼音字符 2、对文本框操作无效的按键
        var text1 = text.slice(0, focusIndex);
        var text2 = text.slice(focusIndex);
        commonData.text1 = text1;
        commonData.text2 = text2;
        var noLastCharText1 = text1.slice(0, focusIndex - 1);
        var len1 = text1.length;
        var text1Char = text1 + commonData.deletedChar;
        var searchedText;
        var addedLen = len - commonData.beforeLen;
        var addedStr = addSpecialCharAddedStr ? addSpecialCharAddedStr : (addedLen < 0 || commonData.selectionStart === commonData.selectionEnd && addedLen > 1) ? text.slice(focusIndex - 1, focusIndex) : text.slice(focusIndex - addedLen, focusIndex);
        var bubbleIndex;
        if (/*code == 8*/commonData.isBackspace) {        //退格键删除操作
            if (commonData.selectionStart !== commonData.selectionEnd) {        //光标选区长度大于1     //TODO
                if (!text1) {
                    $(".aite-bubble").hide();
                    $(".hashtag-bubble").hide();
                    commonData.showWhichPop = 0;
                    commonData.publicModel.allMatters[commonData.curMatterIndex].disableObjBtn = false;
                    commonData.publicModel.allMatters[commonData.curMatterIndex].disableSopBtn = false;
                } else if (text1[text1.length - 1] == '@') {
                    publicMethod.setCurPop(4, commonData.types[0]);
                } else if (text1[text1.length - 1] == '#') {
                    searchedText = text2.slice(0, text2.indexOf(' '));
                    console.log('删除SOP中的普通字符，发起一次搜索，搜索的字符串为：' + searchedText);
                    // if (searchedText) {
                    publicMethod.toQuerySopListForSel(true, searchedText);
                    // } else {//TODO:
                    //     myWorkOrderController.queryRecommendSop();

                    // }
                }
            }
            if (!text1.length && !commonData.deletedChar) {       //删除到最末尾字符
                commonData.showWhichPop = 0;
                return;
            } else if (commonData.deletedChar == ' ') {      //在空格后
                //只有对象或SOP后面允许输入空格的情况下此处加强判断可以去掉，目前没有限制空格在普通文本中的输入
                if (text1.lastIndexOf(' ') < text1.lastIndexOf('@') || text1.lastIndexOf(' ') < text1.lastIndexOf('#')) {        //在对象/SOP结束空格后      //此处不能发起一次搜索，此时可能的情况：@地源热泵设备类@建筑4
                    text1 = text1.slice(0, text1.length - 1);
                    commonData.text1 = text1;
                    if (text2.length && text2[0] !== ' ') {
                        text2 = ' ' + text2;
                        commonData.text2 = text2;
                    }
                    model[commonData.textAttrName] = text1 + text2;
                    //发起搜索
                    if (text1.lastIndexOf(' ') < text1.lastIndexOf('@')) {      //在对象结束空格后
                        searchedText = text1.slice(text1.lastIndexOf('@') + 1);
                        console.log('删除了标识对象结束的空格，这是不允许的，将转换为删除空格前对象名称的最后一个字符，发起一次搜索，搜索的字符串为：' + searchedText);
                        if (searchedText.length) {
                            myWorkOrderController.searchObject(searchedText, null, true);
                        } else {
                            publicMethod.setCurPop(4);
                            setTimeout(function () {
                                publicMethod.setCaretPosition(commonData.editingJqTextwrap[0], commonData.text1.length);
                            }, 0);
                        }
                    } else {        //在SOP结束空格后
                        searchedText = text1.slice(text1.lastIndexOf('#') + 1);
                        console.log('删除了标识SOP结束的空格，这是不允许的，将转换为删除空格前对象名称的最后一个字符，发起一次搜索，搜索的字符串为：' + searchedText);
                        if (searchedText.length) {
                            publicMethod.toQuerySopListForSel(true, searchedText, null, true);
                        } else {
                            myWorkOrderController.queryRecommendSop(model, addSpecialCharFocusIndex);
                            setTimeout(function () {
                                publicMethod.setCaretPosition(commonData.editingJqTextwrap[0], commonData.text1.length);
                            }, 0);
                        }
                    }
                }
            } else if (text1Char.lastIndexOf(' ') < text1Char.lastIndexOf('@')) {        //在对象@或普通字符后
                if (commonData.deletedChar == '@') {     //在对象@后        //To Delete
                    console.log('删除对象 @符');
                    bubbleIndex = !commonData.publicModel.regular ? commonData.curMatterIndex : commonData.curMatterIndex + 1;
                    if ($($(".aite-bubble")[bubbleIndex]).is(':visible') || commonData.publicModel.regular && $($(".aite-bubble")[bubbleIndex + 1]).is(':visible')) {
                        $(".aite-bubble").hide();
                        // commonData.notShowPop = true;
                        commonData.showWhichPop = 0;
                    }
                    commonData.publicModel.allMatters[commonData.curMatterIndex].disableObjBtn = false;
                } else {        //在对象@或普通字符后
                    if (text1.length && text1[text1.length - 1] == '@' && (text2 == '' || text2[0] == ' ')) {       //在普通字符后，例如：'@建 123' —> '@ 123' 显示大类弹框
                        publicMethod.setCurPop(4, commonData.types[0]);
                    } else {    //在普通字符后，例如：'@建筑2' —> '@建2' 发起一次搜索
                        var endIndex = text2.indexOf(' ') == '-1' ? text2.length : text2.indexOf(' ');
                        searchedText = text1.slice(text1.lastIndexOf('@') + 1) + text2.slice(0, endIndex);
                        console.log('删除对象中的普通字符，发起一次搜索，搜索的字符串为：' + searchedText);
                        if (searchedText.length) {
                            myWorkOrderController.searchObject(searchedText);
                        } else {        //To Delete: 20180109
                            if (text2.indexOf(' ') !== -1) {        //在对象@或普通字符后且在空格前
                                publicMethod.setCurPop(4, 'obj');
                            }
                        }
                    }
                }
            } else if (text1Char.lastIndexOf(' ') < text1Char.lastIndexOf('#')) {        //在SOP#或普通字符后[且在空格前 && text2.indexOf(' ') !== -1]
                if (commonData.deletedChar == '#') {     //在SOP #后
                    console.log('删除SOP #符');
                    bubbleIndex = !commonData.publicModel.regular ? commonData.curMatterIndex : commonData.curMatterIndex + 1;
                    // commonData.notShowSopPop = true;
                    // commonData.notShowSopPop2 = true;
                    commonData.showWhichPop = 0;
                    if ($($(".hashtag-bubble")[bubbleIndex]).is(':visible') || commonData.publicModel.regular && $($(".hashtag-bubble")[bubbleIndex + 1]).is(':visible')) {
                        $(".hashtag-bubble").hide();
                    }
                    commonData.publicModel.allMatters[commonData.curMatterIndex].disableSopBtn = false;
                } else {     //在普通字符后，例如：'#SOP名称1' —> '#SOP名1' 发起一次搜索
                    if (text1.length && text1[text1.length - 1] == '#' && (text2 == '' || text2[0] == ' ')) {       //在普通字符后，例如：'#S 123' —> '# 123' 推荐SOP
                        myWorkOrderController.queryRecommendSop(model, addSpecialCharFocusIndex);
                    } else {
                        var endIndex = text2.indexOf(' ') == '-1' ? text2.length : text2.indexOf(' ');
                        searchedText = text1.slice(text1.lastIndexOf('#') + 1) + text2.slice(0, endIndex);
                        //searchedText = text1.slice(text1.lastIndexOf('#') + 1) + text2.slice(0, text2.indexOf(' '));
                        console.log('删除SOP中的普通字符，发起一次搜索，搜索的字符串为：' + searchedText);
                        publicMethod.toQuerySopListForSel(true, searchedText);
                    }
                }
            }
            commonData.notReplaceObj = false;
        } else if (/*code == 32*/addedStr == ' ' && text1[text1.length - 1] == ' ') {        //输入空格键，排除非单个字符输入状态下输入空格
            //在@或#后输入了一个空格
            if (noLastCharText1.lastIndexOf(' ') < noLastCharText1.lastIndexOf('@') && noLastCharText1.lastIndexOf('@') == text1.length - 2 || noLastCharText1.lastIndexOf(' ') < noLastCharText1.lastIndexOf('#') && noLastCharText1.lastIndexOf('#') == text1.length - 2) {
                console.log('在@或#后输入了一个空格，这是不允许的');
                commonData.text1 = noLastCharText1;
                model[commonData.textAttrName] = noLastCharText1 + text2;
                setTimeout(function () {
                    publicMethod.setCaretPosition(commonData.editingJqTextwrap[0], commonData.text1.length);
                }, 0);
                return;
            }
            //不在对象和SOP中间，普通文本中间允许输入空格
            if ((noLastCharText1.lastIndexOf('@') == -1 || noLastCharText1.lastIndexOf('@') < noLastCharText1.lastIndexOf(' ')) && (noLastCharText1.lastIndexOf('#') == -1 || noLastCharText1.lastIndexOf('#') < noLastCharText1.lastIndexOf(' '))) {
                return;
            }

            if (noLastCharText1.lastIndexOf('@') != -1 && noLastCharText1.lastIndexOf('@') > noLastCharText1.lastIndexOf(' ') && noLastCharText1.lastIndexOf('@') > noLastCharText1.lastIndexOf('#')) {      //在对象中间 [获取搜索结果后判断是否已发起搜索]

                //var endIndex = text2.indexOf(' ') == '-1' ? text2.length : text2.indexOf(' ');
                //var objName = text1.slice(text1.lastIndexOf('@') + 1) + text2.slice(0, endIndex);
                var objName = text1.slice(text1.lastIndexOf('@') + 1, text1.lastIndexOf(' '));
                console.log("搜索对象：" + objName);
                commonData.publicModel.inputToCustomize = true;
                myWorkOrderController.searchObject(objName, true);
            } else if (noLastCharText1.lastIndexOf('#') != -1 && noLastCharText1.lastIndexOf('#') > noLastCharText1.lastIndexOf(' ') && noLastCharText1.lastIndexOf('#') > noLastCharText1.lastIndexOf('@')) {      //在SOP中间
                var sopName = text1.slice(text1.lastIndexOf('#') + 1, text1.lastIndexOf(' '));
                console.log("搜索SOP：" + sopName);
                myWorkOrderController.querySopListForSel({sop_name: sopName}, null, null, null, true);
                $(".hashtag-bubble").hide();
            }

        } else {        //输入字符或字符串的情况
            if (addedStr == '@') {      //输入@符
                if (!addSpecialCharAddedStr) publicMethod.initBpDatas();
                //对象中间不允许输入@ 或者 #后面不允许输入@
                if (noLastCharText1.lastIndexOf(' ') < noLastCharText1.lastIndexOf('@') || text1.length && text1.length > 1 && text1[text1.length - 2] == '#') {
                    model[commonData.textAttrName] = text.slice(0, focusIndex - 1) + text.slice(focusIndex, len);
                    console.log('对象中间不允许输入@ 或者 #后面不允许输入@');
                    setTimeout(function () {
                        publicMethod.setCaretPosition(textwrap, focusIndex - 1);
                    }, 0);
                    return;
                }
                //在如'@工具1'前输入@, '@工具1'前添加上空格
                //20171124: 保持'科技大厅'——>'@科技大厅' 弹出选择对象大类面板
                if (commonData.text2.length && commonData.text2[0] == '@') {        //方案一：@后，如果text2没有空格则追加一个
                    commonData.text2 = ' ' + commonData.text2;

                }
                commonData.notReplaceObj = true;
                publicMethod.setCurPop(4, commonData.types[0], addSpecialCharFocusIndex);
                if (text2 && text2[0] !== ' ') {        //方案二：在'12'前输入@，发起搜索

                }
            } else if (addedStr == '#') {      //输入#符
                if (!addSpecialCharAddedStr) publicMethod.initBpDatas();
                //SOP中间不允许输入# 或者 @后面不允许输入#
                if (noLastCharText1.lastIndexOf(' ') < noLastCharText1.lastIndexOf('#') || text1.length && text1.length > 1 && text1[text1.length - 2] == '@') {
                    model[commonData.textAttrName] = text.slice(0, focusIndex - 1) + text.slice(focusIndex, len);
                    console.log('sop中间不允许输入# 或者 @后面不允许输入#');
                    setTimeout(function () {
                        publicMethod.setCaretPosition(textwrap, focusIndex - 1);
                    }, 0);
                    return;
                }
                //在如'#SOP1'前输入#, '#SOP1'前添加上空格
                if (commonData.text2.length && commonData.text2[0] == '#') {
                    commonData.text2 = ' ' + commonData.text2;
                }
                commonData.notReplaceObj = true;
                // publicMethod.toQuerySopListForSel(true);
                myWorkOrderController.queryRecommendSop(model, addSpecialCharFocusIndex);

                //myWorkOrderMethod.selAllTags();
                //yn_method.upDownSelect();
            } else {        //输入普通字符
                if (text1.lastIndexOf('@') > text1.lastIndexOf('#')) {
                    if (text1.lastIndexOf(' ') < text1.lastIndexOf('@') && text2 == '') {
                        commonData.input_text = '1';
                        searchedText = text1.slice(text1.lastIndexOf('@') + 1);
                        console.log('在@后输入普通字符，发起一次搜索，搜索的字符串为：' + searchedText);
                        if (!commonData.composing) {
                            myWorkOrderController.searchObject(searchedText);
                        }
                    }

                    if (text1.lastIndexOf(' ') < text1.lastIndexOf('@')) {
                        commonData.input_text = '1';
                        var endIndex = text2.indexOf(' ') == '-1' ? text2.length : text2.indexOf(' ');
                        searchedText = text1.slice(text1.lastIndexOf('@') + 1) + text2.slice(0, endIndex);
                        //searchedText = text1.slice(text1.lastIndexOf('@') + 1) + text2.slice(0, text2.indexOf(' '));
                        console.log('在对象中输入普通字符，发起一次搜索，搜索的字符串为：' + searchedText);
                        if (!commonData.composing) {
                            myWorkOrderController.searchObject(searchedText);
                        }
                    }
                } else {
                    if (text1.lastIndexOf(' ') < text1.lastIndexOf('#') && text2 == '') {
                        commonData.input_text = '1';
                        searchedText = text1.slice(text1.lastIndexOf('#') + 1);
                        console.log('在#后输入普通字符，发起一次搜索，搜索的字符串为：' + searchedText);
                        if (!commonData.composing) {
                            publicMethod.toQuerySopListForSel(true, searchedText, null);
                        }
                    }

                    if (text1.lastIndexOf(' ') < text1.lastIndexOf('#')) {
                        commonData.input_text = '1';
                        var endIndex = text2.indexOf(' ') == '-1' ? text2.length : text2.indexOf(' ');
                        searchedText = text1.slice(text1.lastIndexOf('#') + 1) + text2.slice(0, endIndex);
                        //searchedText = text1.slice(text1.lastIndexOf('#') + 1) + text2.slice(0, text2.indexOf(' '));
                        console.log('在SOP中输入普通字符，发起一次搜索，搜索的字符串为：' + searchedText);
                        if (!commonData.composing) {
                            publicMethod.toQuerySopListForSel(true, searchedText, null);
                        }
                    }
                }
                commonData.notReplaceObj = false;
            }
        }
    },

    //事项内容keydown事件
    //params:
    //  flag 2为结构化输入'我要对'文本框 3为结构化输入'进行'文本框
    keydownMatterContent: function (model, index, event, flag) {
        var code = event.keyCode;
        var jqTarget = $(event.currentTarget);
        var textwrap = jqTarget[0];
        var focusIndex = textwrap.selectionStart;
        console.log("Start: " + textwrap.selectionStart);
        console.log("End: " + textwrap.selectionEnd);
        commonData.selectionStart = textwrap.selectionStart;
        commonData.selectionEnd = textwrap.selectionEnd;
        var text = flag == 2 ? (model.desc_forepart || '') : flag == 3 ? (model.desc_aftpart || '') : (model[commonData.textAttrName] || '');
        commonData.beforeLen = text.length;
        if (code == 8) {        //删除操作
            commonData.isBackspace = true;
            var deletedType;
            //判断是否在对象中
            var text1 = text.slice(0, focusIndex);
            var text2 = text.slice(focusIndex);
            var len1 = text1.length;
            var toDeletedChar = text1[len1 - 1];
            commonData.deletedChar = text1[len1 - 1];
        } else {
            commonData.isBackspace = false;
        }
    },

    //复选框选择或取消选择对象
    checkObject: function (model, index, type, event) {
        if (event) event.stopPropagation();
        type = commonData.publicModel.addContentWindow ? commonData.types[3] : type ? type : 'obj'
        var type1 = type == commonData.types[1] ? type : commonData.types[0];
        model.checked = !model.checked;
        commonData.publicModel.curLevelList = JSON.parse(JSON.stringify(commonData.publicModel.curLevelList));
        var contentData = publicMethod.getContentData(type);
        var content_objs = contentData.content_objs;
        if (model.checked) {
            commonData.checkedObjs.push(model);
            //判断是否为maybeDeletedObjs中已选对象，将其从maybeDeletedObjs中删除
            for (var i = 0; i < commonData.maybeDeletedObjs.length; i++) {
                if (commonData.maybeDeletedObjs[i][type1 + '_id'] == model[type1 + '_id']) {
                    commonData.maybeDeletedObjs.splice(i, 1);
                }
            }


        } else {

            for (var i = 0; i < commonData.checkedObjs.length; i++) {
                if (commonData.checkedObjs[i][type1 + '_id'] == model[type1 + '_id']) {
                    commonData.checkedObjs.splice(i, 1);
                    break;
                }
            }
            //判断是否为content中已选对象，将其推入maybeDeletedObjs
            for (var i = 0; i < content_objs.length; i++) {
                if (content_objs[i][type1 + '_id'] == model[type1 + '_id']) {
                    commonData.maybeDeletedObjs.push(JSON.parse(JSON.stringify(content_objs[i])));
                    break;
                }
            }

        }
    },
    //删除事项弹窗
    deleteMatterWindow: function (index, event) {
        event.stopPropagation();
        publicMethod.clickSpaceHidePop();
        commonData.publicModel.del_matter_index = index;
        $("#delete-matter-confirm").pshow({title: '确定要删除该事项吗？', subtitle: '删除后的事项无法恢复'})
    },
    //删除事项
    deleteMatter: function () {
        commonData.publicModel.allMatters.splice(commonData.publicModel.del_matter_index, 1);
        $("#delete-matter-confirm").phide();
    },
    //删除事项报错提示
    deleteErrorTip: function (index0, errIndex, name, flag, errArr) {
        var allMatters = commonData.publicModel.allMatters;
        var matter = allMatters[index0];
        if (flag == 2 || flag == '2a') {
            var symbol = flag == 2 ? '#' : '@'
            if (commonData.publicModel.regular) {
                allMatters[index0].desc_forepart = matter.desc_forepart.replace(symbol + name, name);
                allMatters[index0].desc_aftpart = matter.desc_aftpart.replace(symbol + name, name);
            } else {
                allMatters[index0].description = matter.description.replace(symbol + name, name);
            }
        }
        if (flag != '2a') {
            if (!matter.ignoredErrArr) matter.ignoredErrArr = [];
            errArr[errIndex].flag = flag;
            matter.ignoredErrArr.push(errArr[errIndex]);
        } else {
            var desc_objs = allMatters[index0].desc_objs;
            for (var i = 0; i < desc_objs.length; i++) {
                if (desc_objs[i].obj_id == allMatters[index0].invalidObjList[errIndex].obj_id) {
                    desc_objs.splice(i, 1);
                    break;
                }
            }
        }
        errArr.splice(errIndex, 1);
        commonData.publicModel.allMatters = JSON.parse(JSON.stringify(commonData.publicModel.allMatters));
    },
    //专业要求匹配
    filterProfessionalDemand: function (arr, arrObj) {
        var arrResult = arrResult || [];
        var arr = arr || [];
        var arrObj = arrObj || [];
        arr.forEach(function (item1, index1) {
            arrObj.forEach(function (item2, index2) {
                if (item1 == item2.code) {
                    arrResult.push(item2.name)

                }
            });
        });
        return (arrResult.length > 1) ? arrResult.join(' 、') : arrResult.toString()
    },
    //所需工具过滤
    filterUseTool: function (arr) {
        arr = arr || [];
        var newArr = [];
        arr.forEach(function (item, index) {
            // if (item.from_step) {
            //     newArr.push(item.tool)
            // }
            // if (item.from_step) {
            newArr.push(item.tool)
            // }
        });
        return (newArr.length > 1) ? newArr.join(' 、') : newArr.toString();
    },
    filterProfessionalTrans: function (str) {//专业要求键值转换
        var obj = commonData.publicModel.professionalObj;
        return obj[str];
    },
    //适用对象过滤
    filterUseObject: function (arr) {
        arr = arr || [];
        var newArr = [];
        arr.forEach(function (item, index) {
            // if (item.is_revise) {
            newArr.push(item.obj_name)
            // }
        });
        return (newArr.length > 1) ? newArr.join(' 、') : newArr.toString();
    },
    //品牌过滤
    filterbrandsAndLabelsArr: function (arr) {
        arr = arr || [];
        return (arr.length > 1) ? arr.join(' 、') : arr.toString();
    },
    initDatas: function () {
        $('#sopName').pval('');
        commonData.publicModel.allSteps = [];
        commonData.publicModel.isNextStepPage = false;
        commonData.publicModel.curStepIndex = 0;
        commonData.publicModel.curStep = {step_content: []};        //页面显示的当前sop步骤内容
        commonData.publicModel.sopCriteria = {};        //sop列表筛选条件
        commonData.publicModel.sopList = [];      //sop列表;复制、引用sop时用
        //commonData.publicModel.copyOrQuote = null;      //1复制，2引用
        commonData.publicModel.editContent = false;     //是否为编辑内容状态
        commonData.publicModel.notMultiSopSteps = [];     //不是引用的多步骤的SOP的步骤列表

        commonData.publicModel.curObjType = 'init';     //标准作业操作内容-当前对象类型
        commonData.publicModel.curObjType2 = 'init';        //需确认的操作结果-当前对象类型

        commonData.publicModel.curLevelList = [];       //当前有级别列表
        commonData.publicModel.leftLevel = [];      //左侧级别列表

        //commonData.publicModel.domainList = [];     //专业列表
        commonData.publicModel.systemList = [];     //系统列表
        commonData.publicModel.checkedObjs = [];        //弹框页面check的对象

        commonData.publicModel.curSelectedDomain = {};      //当前选择的专业
        commonData.publicModel.curSelectedSystem = {};      //当前选择的系统

        commonData.publicModel.searchedObjectList = [];     //搜索的对象结果列表
        commonData.publicModel.selectedObjType = null;      //选择的对象类别

        commonData.publicModel.optionList = [];     //选项列表

        commonData.publicModel.customs = [];        //自定义项列表
        commonData.publicModel.customItem = {items: []};     //自定义项
        commonData.publicModel.isCustomizeBtnAble = false;        //自定义按钮是否able

        commonData.publicModel.sameDomain = false;      //是否所有步骤中的所有工作内容都为相同的专业
        commonData.publicModel.settedDomain = true;        //是否所有步骤中的所有工作内容未设置专业

        commonData.publicModel.selectedTools1 = [];     //新建/编辑SOP step1中所选的工具列表
        commonData.publicModel.selectedTools2 = [];     //新建/编辑SOP 下一步页面中所选的工具列表
        //commonData.publicModel.toolList = [];       //弹框工具列表

        //commonData.publicModel.orderTypeList = [];      //工单类型列表
        commonData.publicModel.brandList = [];      //品牌列表
        commonData.publicModel.labelList = [];      //标签列表

        commonData.publicModel.sop = {
            order_type: [],     //工单类型
            fit_objs: []       //适用对象
        };

        commonData.publicModel.selectedObj = {};        //选择信息点 对象列表已选择的对象

        commonData.publicModel.fitRangeList = [];       //适用范围列表
        commonData.publicModel.fitRangeListCopy = [];       //适用范围列表副本
        commonData.publicModel.linkDataList = [];       //链接资料列表
    },

    //编辑的工作内容某项失焦
    blurContentItem: function (event) {
        event.stopPropagation();
        var num = event.srcElement.value.length;
        var prebody = $(event.srcElement).parents(".prev-body");
        if (num == 0) {
            $(prebody).slideUp();
            $(event.srcElement).parents(".content-prev").find(".edit-div").show().next().hide();
        }
        // if(
    },
    //标准操作内容编辑时失焦问题
    blurContentItemOpe: function (model, event) {
        event.stopPropagation();
        setTimeout(function () {
            var num = event.srcElement.value.length;
            // var num = event.srcElement.value.length;
            var prebody = $(event.srcElement).parents(".prev-body");
            commonData.publicModel.textareaOperate = false;
            // if (commonData.publicModel.blurClose && !commonData.publicModel.textareaOperate) {
            if (num == 0) {
                $(prebody).slideUp();
                $(prebody).prev().find(".clear-div").next().phide();
                $(event.srcElement).parents(".content-prev").find(".edit-div").show().next().hide();
                commonData.publicModel.textareaOperate = false;
            }
            // }
        }, 1000);
    },
    contentTextAreafocus: function (event) {
        event.stopPropagation();
        commonData.publicModel.textareaOperate = true;
        var prebody = $(event.srcElement).parents(".prev-body");
        $(prebody).slideDown();
    },
    operatePrevBodyShow: function (dom, event) {

        event.stopPropagation();
    },
    /*点击sop名称*/
    detailSop: function (sop, event) {
        commonData.click_sop_name = '1';
        event.stopPropagation();
        commonData.publicModel.postNum = commonData.publicModel.postNum + 1;
        if (commonData.publicModel.postNum == 1) {
            myWorkOrderController.queryGeneralDictByKey();//查询专业
            /*var workObj = {
             dataObj: {
             dict_type: "work_order_type"      //工单类型，必须
             },
             noticeFailureObj: {text: '获取工单类型失败', state: "failure"}

             };
             myWorkOrderController.getOrderTypeList(workObj);//查询工单类型*/
        }

        commonData.publicModel.sopCheckArr = [];//置空
        commonData.publicModel.detailSopShow = true;
        $(".detail-alert").show();
        var postObj = {
            sop_id: sop.sop_id,
            version: sop.version	      //返回结果是否需要带筛选条
        }
        myWorkOrderController.querySopDetailById(sop, postObj);
        commonData.publicModel.initSopData = commonData.publicModel.detailSopData;
        // commonData.publicModel.sopCheckArr.push(commonData.publicModel.detailSopData);//初始的sop数据
    },
    //查看引用sop详细内容-在里层的
    quoteSopDetail: function (model, event) {
        event.stopPropagation();
        var postObj = {
            sop_id: model.sop_id,
            version: model.version	      //返回结果是否需要带筛选条
        }
        commonData.publicModel.changeSopData = commonData.publicModel.detailSopData;//上次的
        commonData.publicModel.sopCheckArr.push(commonData.publicModel.detailSopData);//只记录到上一级，点击到第4个，只记录3次，1-3
        myWorkOrderController.querySopDetailById(model, postObj);
        // commonData.publicModel.sopCheckArr.push(commonData.publicModel.detailSopData)
    },
    //查看引用sop详细内容-在外层的
    quoteOuterSopDetail: function (model, event) {
        event.stopPropagation();
        var postObj = {
            sop_id: model.sop_id,
            version: model.version	      //返回结果是否需要带筛选条
        }
        commonData.publicModel.sopCheckArr.push(commonData.publicModel.detailSopData);
        myWorkOrderController.querySopDetailById(model, postObj);
    },
    //返回上一级
    backToUpperLevel: function () {
        commonData.publicModel.detailSopData = commonData.publicModel.sopCheckArr[commonData.publicModel.sopCheckArr.length - 1];
        commonData.publicModel.sopCheckArr.splice(commonData.publicModel.sopCheckArr.length - 1, 1);

    },
    closeDetailSop: function () {
        commonData.publicModel.detailSopShow = false;
        $(".detail-alert").hide();

    },
    preventBubble: function (event) {
        event.stopPropagation();
    },

    //选择品牌
    selBrand: function (item, event) {
        event.stopPropagation();
        publicMethod.toggleOneCriteria(item, 'brands', 'selectedBrands');
    },

    //选择工单类型
    selOrderType: function (item, event) {
        event.stopPropagation();
        publicMethod.toggleOneCriteria(item, 'order_type', 'selectedOrder_type', 'code');
    },

    //选择适用对象
    selFitObj: function (item, event) {
        event.stopPropagation();
        publicMethod.toggleOneCriteria(item, 'fit_objs', 'selectedFit_objs', 'obj_id');
    },

    //选择自定义标签
    selLabel: function (item, event) {
        event.stopPropagation();
        publicMethod.toggleOneCriteria(item, 'labels', 'selectedLabels');
    },

    //设置SOP筛选条件参数选中状态
    setCriteriaStatus: function (attrName1, attrName2, isObj, subAttrName) {
        var arr1 = commonData.publicModel.sopCriteria[attrName1] || [], arr2 = [];
        for (var i = 0; i < arr1.length; i++) {
            var item1 = arr1[i];
            var name = subAttrName ? item1[subAttrName] : item1;
            var selectedArr = commonData[attrName2];
            var selected = selectedArr.indexOf(name) == -1 ? false : true;
            if (isObj) {
                item1.selected = selected;
            } else {
                arr2.push({name: name, selected: selected});
            }
        }
        if (!isObj) commonData.publicModel.sopCriteria[attrName1 + 'Arr'] = arr2;
    },

    //切换某个筛选条件参数选中状态
    toggleOneCriteria: function (item, attrName1, attrName2, subAttrName) {
        var selectedArr = commonData[attrName2];
        var value = subAttrName ? item[subAttrName] : item.name;
        if (selectedArr.indexOf(value) == -1) {
            item.selected = true;
            selectedArr.push(value);
        } else {
            item.selected = false;
            selectedArr.splice(selectedArr.indexOf(value), 1);
        }
        commonData.publicModel.sopCriteria = JSON.parse(JSON.stringify(commonData.publicModel.sopCriteria));
        var id = '.all_' + attrName1;
        if (selectedArr.length > 0) {
            $(id).removeClass('sel-span');
        } else {
            $(id).addClass('sel-span');
        }
        //if (commonData.publicModel.sopCriteria[attrName1].length > selectedArr.length) {
        // $(id).removeClass('sel-span');
        //} else {
        //    $(id).addClass('selection-on');
        //}
    },

    //点击"全部"标签
    toggleAllTag: function (event, flag) {
        event.stopPropagation();
        var selected = !($(event.target).hasClass('sel-span'));
        if (!selected) return;
        $(event.target).addClass('sel-span');
        switch (flag) {
            case 1:
                publicMethod.toggleSameClassCriterias(commonData.publicModel.sopCriteria.brandsArr, 'selectedBrands', !selected);
                break;
            case 2:
                publicMethod.toggleSameClassCriterias(commonData.publicModel.sopCriteria.order_type, 'selectedOrder_type', !selected, 'code');
                break;
            case 3:
                publicMethod.toggleSameClassCriterias(commonData.publicModel.sopCriteria.fit_objs, 'selectedFit_objs', !selected, 'obj_id');
                break;
            case 4:
                publicMethod.toggleSameClassCriterias(commonData.publicModel.sopCriteria.labelsArr, 'selectedLabels', !selected);
                break;
            default:
                break;
        }
        commonData.publicModel.sopCriteria = JSON.parse(JSON.stringify(commonData.publicModel.sopCriteria));
    },

    //选中/取消选中某类筛选条件参数
    toggleSameClassCriterias: function (arr, attrName, selected, subAttrName) {
        commonData[attrName] = [];
        for (var i = 0; i < (arr || []).length; i++) {
            var item = arr[i];
            item.selected = selected;
            var value = subAttrName ? item[subAttrName] : item.name;
            if (selected) commonData[attrName].push(value);
        }
        var arrAttrName = attrName == 'selectedBrands' ? 'brandsArr' : attrName == 'selectedOrder_type' ? 'order_type' : attrName == 'selectedFit_objs' ? 'fit_objs' : 'labelsArr';
        if (commonData.publicModel.sopCriteria[arrAttrName]) {
            commonData.publicModel.sopCriteria[arrAttrName] = JSON.parse(JSON.stringify(commonData.publicModel.sopCriteria[arrAttrName]));
        }
    },

    //查询信息点
    getInfoPointForObject: function (obj, index1, event, contentIndex) {
        event.stopPropagation();
        // $(event.target).parents(".aite-list").addClass("selectionOn").siblings().removeClass("selectionOn");
        $(event.currentTarget).addClass("selectionOn").siblings().removeClass("selectionOn");
        commonData.contentIndex = contentIndex;
        commonData.infoPoint_obj = obj;      //此处可能为新添加的对象、也可能为已选的对象
        commonData.publicModel.selectedObj = obj;
        var content = publicMethod.confirmResult();
        var belongChoosedObj = false;
        for (var i = 0; i < content.confirm_result.length; i++) {
            if (obj.obj_id == content.confirm_result[i].obj_id) {
                commonData.infoPoint_obj = JSON.parse(JSON.stringify(content.confirm_result[i]));
                commonData.confirmResultIndex = i;
                belongChoosedObj = true;
                break;
            }
        }
        if (!belongChoosedObj) {
            commonData.infoPoint_obj = JSON.parse(JSON.stringify(obj));
            commonData.confirmResultIndex = content.confirm_result.length;
        }

        commonData.belongChoosedObj = belongChoosedObj;
        commonData.publicModel.curObjType2 = 'infoPoint';
        myWorkOrderController.queryInfoPointForObject(commonData.infoPoint_obj, null, '');
    },

    //选择信息点-复选框选择或取消选择信息点
    checkInfoPoint: function (model, index, contentIndex) {
        // event.stopPropagation();
        commonData.contentIndex = contentIndex;
        model.checked = !model.checked;
        commonData.publicModel.infoArray = JSON.parse(JSON.stringify(commonData.publicModel.infoArray));
    },

    //编辑的工作内容某项keydown事件
    keydownContent: function (index, content, event, contentIndex) {
        var code = event.keyCode;
        var attrName = commonData.contentItemAttrNames[index];
        // var text = content.content;
        var text = commonData.publicModel.workContent.content;
        var textCopy = text;
        var jqTarget = $(event.currentTarget);
        var textwrap = jqTarget[0];
        var textdiv = jqTarget.next()[0];
        var textareapop = jqTarget.next().next();
        var focusIndex = textwrap.selectionStart;
        console.log("Start: " + textwrap.selectionStart);
        console.log("End: " + textwrap.selectionEnd);
        commonData.selectionStart = textwrap.selectionStart;
        commonData.selectionEnd = textwrap.selectionEnd;
        commonData.beforeLen = text.length;

        if (code == 8) {        //删除操作
            commonData.isBackspace = true;
            var deletedType;
            //判断是否在对象中
            var text1 = text.slice(0, focusIndex);
            var text2 = text.slice(focusIndex);
            var len1 = text1.length;
            var toDeletedChar = text1[len1 - 1];
            commonData.deletedChar = text1[len1 - 1];
        } else {
            commonData.isBackspace = false;
        }

    },

    //工作内容keyup事件
    changeContent: function (/*model, index, */event, jqTextarea, addSpecialCharFocusIndex, addSpecialCharAddedStr) {
        commonData.publicModel.inputToCustomizeNameRepeat = false;
        //面板关闭
        //publicMethod.panelClose();
        var code = event.keyCode;
        var jqTarget = jqTextarea ? jqTextarea : $(event.currentTarget);
        var textwrap = jqTarget[0];
        var textdiv = jqTarget.next().next()[0];
        var textareapop = jqTarget.next().next().next();

        commonData.jqTarget = jqTarget;
        commonData.textwrap = textwrap;
        commonData.textdiv = textdiv;
        commonData.textareapop = textareapop;

        var content = commonData.publicModel.workContent;
        commonData.editingContentObjs = content.content_objs;
        commonData.editingJqTextwrap = jqTarget;

        var text = commonData.publicModel.workContent.content || '';
        if (text.length >= 200) {
            commonData.publicModel.workContent.content = text.slice(0, 200);
            return;
        }
        commonData.text = text;
        var len = text.length;

        if (!addSpecialCharAddedStr && len == commonData.beforeLen) return;        //过滤：1、中文输入法输入的拼音字符 2、对文本框操作无效的按键

        var focusIndex = addSpecialCharFocusIndex ? addSpecialCharFocusIndex : textwrap.selectionStart;

        var text1 = text.slice(0, focusIndex);
        var text2 = text.slice(focusIndex);
        var noLastCharText1 = text1.slice(0, focusIndex - 1);
        commonData.text1 = text1;
        commonData.text2 = text2;
        var len1 = text1.length;
        var text1Char = text1 + commonData.deletedChar;
        var searchedText;
        var addedLen = len - commonData.beforeLen;
        var addedStr = addSpecialCharAddedStr ? addSpecialCharAddedStr : (addedLen < 0 || commonData.selectionStart === commonData.selectionEnd && addedLen > 1) ? text.slice(focusIndex - 1, focusIndex) : text.slice(focusIndex - addedLen, focusIndex);
        if (commonData.publicModel.addContentWindow) {
            $(jqTarget[0]).parents(".textarea-div").find(".counter b").text(len);
        }
        if (code == 51) {       //'#'

        } else if (/*code == 8*/commonData.isBackspace) {        //退格键删除操作
            if (commonData.selectionStart !== commonData.selectionEnd) {
                if (!text1) {
                    $(".aite-bubble").hide();
                    commonData.publicModel.workContent.disableObjBtn = false;
                    commonData.publicModel.workContent = JSON.parse(JSON.stringify(commonData.publicModel.workContent));
                } else if (text1[text1.length - 1] == '@') {
                    publicMethod.setCurPop(4, commonData.types[3]);
                }
            } else if (!text1.length && !commonData.deletedChar) {
                return;
            } else if (commonData.deletedChar == ' ') {      //在空格后
                //只有对象或SOP后面允许输入空格的情况下此处加强判断可以去掉，目前没有限制空格在普通文本中的输入
                if (text1.lastIndexOf(' ') < text1.lastIndexOf('@')) {        //在对象/SOP结束空格后      //此处不能发起一次搜索，此时可能的情况：@地源热泵设备类@建筑4
                    text1 = text1.slice(0, text1.length - 1);
                    commonData.text1 = text1;
                    if (text2.length && text2[0] !== ' ') {
                        text2 = ' ' + text2;
                        commonData.text2 = text2;
                    }
                    content.content = text1 + text2;
                    //发起搜索
                    searchedText = text1.slice(text1.lastIndexOf('@') + 1);
                    console.log('删除了标识对象结束的空格，这是不允许的，将转换为删除空格前对象名称的最后一个字符，发起一次搜索，搜索的字符串为：' + searchedText);
                    if (searchedText.length) {
                        myWorkOrderController.searchObject(searchedText, null, true);
                    }
                }
            } else if (text1Char.lastIndexOf(' ') < text1Char.lastIndexOf('@')/* && text2.indexOf(' ') !== -1*/) {        //在对象@或普通字符后[且在空格前]
                if (commonData.deletedChar == '@') {     //在对象@后
                    console.log('删除对象@符');
                    $(".aite-bubble").hide();
                    // commonData.notShowPop = true;
                    commonData.showWhichPop = 0;
                    commonData.publicModel.workContent.disableObjBtn = false;
                    commonData.publicModel.workContent = JSON.parse(JSON.stringify(commonData.publicModel.workContent));
                } else {
                    if (text1.length && text1[text1.length - 1] == '@' && (text2 == '' || text2[0] == ' ')) {       //在普通字符后，例如：'@建 123' —> '@ 123' 显示大类弹框
                        publicMethod.setCurPop(4, commonData.types[3]);
                    } else {    //在普通字符后，例如：'@建筑2' —> '@建2' 发起一次搜索
                        var endIndex = text2.indexOf(' ') == '-1' ? text2.length : text2.indexOf(' ');
                        searchedText = text1.slice(text1.lastIndexOf('@') + 1) + text2.slice(0, endIndex);
                        console.log('删除对象中的普通字符，发起一次搜索，搜索的字符串为：' + searchedText);
                        if (searchedText.length) {
                            myWorkOrderController.searchObject(searchedText);
                        } else {
                            if (text2.indexOf(' ') !== -1) {        //在对象@或普通字符后且在空格前
                                publicMethod.setCurPop(4, commonData.types[3]);
                            }
                        }
                    }
                }
            }
        } else if (/*code == 32*/addedStr == ' ' && text1[text1.length - 1] == ' ') {        //输入空格键，排除非单个字符输入状态下输入空格
            //普通文本中间允许输入空格
            //在@后输入了一个空格
            if (noLastCharText1.lastIndexOf(' ') < noLastCharText1.lastIndexOf('@') && noLastCharText1.lastIndexOf('@') == text1.length - 2) {
                console.log('在@后输入了一个空格，这是不允许的');
                commonData.text1 = noLastCharText1;
                content.content = noLastCharText1 + text2;
                setTimeout(function () {
                    publicMethod.setCaretPosition(commonData.editingJqTextwrap[0], commonData.text1.length);
                }, 0);
                return;
            }
            if (noLastCharText1.lastIndexOf('@') == -1 || noLastCharText1.lastIndexOf('@') < noLastCharText1.lastIndexOf(' ')) {     //不在对象中间
                return;
            } else {      //获取搜索结果后判断是否已发起搜索
                var objName = text1.slice(text1.lastIndexOf('@') + 1, text1.lastIndexOf(' '));
                console.log("搜索对象：" + objName);
                commonData.publicModel.inputToCustomize = true;
                myWorkOrderController.searchObject(objName, true);
            }
        } else {        //输入字符或字符串的情况
            if (addedStr == '@') {      //输入@符
                if (!addSpecialCharAddedStr) publicMethod.initBpDatas();
                //对象中间不允许输入@
                if (noLastCharText1.lastIndexOf(' ') < noLastCharText1.lastIndexOf('@')) {
                    content.content = text.slice(0, focusIndex - 1) + text.slice(focusIndex, len);
                    console.log('对象中间不允许输入@');
                    return;
                }
                //在如'@工具1'前输入@, '@工具1'前添加上空格
                if (commonData.text2.length && commonData.text2[0] == '@') {
                    commonData.text2 = ' ' + commonData.text2;
                }
                commonData.notReplaceObj = true;
                publicMethod.setCurPop(4, commonData.types[3], addSpecialCharFocusIndex);
                //publicMethod.locationPop(null, commonData.types[3], addSpecialCharFocusIndex);     //定位
            } else {        //输入普通字符
                if (text1.lastIndexOf(' ') < text1.lastIndexOf('@') && text2 == '') {
                    commonData.input_text = '1';
                    searchedText = text1.slice(text1.lastIndexOf('@') + 1);
                    console.log('在@后输入普通字符，发起一次搜索，搜索的字符串为：' + searchedText);
                    if (!commonData.composing) {
                        myWorkOrderController.searchObject(searchedText);
                    }
                }

                if (text1.lastIndexOf(' ') < text1.lastIndexOf('@')) {
                    commonData.input_text = '1';
                    var endIndex = text2.indexOf(' ') == '-1' ? text2.length : text2.indexOf(' ');
                    searchedText = text1.slice(text1.lastIndexOf('@') + 1) + text2.slice(0, endIndex);
                    //searchedText = text1.slice(text1.lastIndexOf('@') + 1) + text2.slice(0, text2.indexOf(' '));
                    console.log('在对象中输入普通字符，发起一次搜索，搜索的字符串为：' + searchedText);
                    if (!commonData.composing) {
                        myWorkOrderController.searchObject(searchedText);
                    }
                }
                commonData.notReplaceObj = false;
            }
        }
        /*
         if (commonData.publicModel.addContentWindow) {
         if (len == 0) {
         commonData.publicModel.workContent.content = "";
         commonData.publicModel.workContent.content_objs = [];
         }
         }
         */

    },

    //添加特殊字符@
    addSpecialChar: function (event, index, symbol, type, flag) {
        event.stopPropagation();
        publicMethod.initBpDatas();
        commonData.click_at_button = '1';
        commonData.isBackspace = false;
        //面板关闭
        publicMethod.panelClose();
        publicMethod.clickSpaceHidePop();
        var dom = event.currentTarget;
        if (commonData.publicModel.regular) {
            var oldTextareaFlag = commonData.textAttrName == 'desc_forepart' ? 2 : 3;
        }
        commonData.textAttrName = flag == 2 ? 'desc_forepart' : flag == 3 ? 'desc_aftpart' : 'description';
        var contentData = publicMethod.getContentData(type);
        var attrName1 = contentData.attrName1;
        if (!commonData.publicModel.addContentWindow) {
            commonData.curMatterIndex = index;
            var text = commonData.publicModel.allMatters[commonData.curMatterIndex][attrName1] || '';
            if (text && text.length && (text[text.length - 1] == '@' && symbol == '#' || text[text.length - 1] == '#' && symbol == '@')) {      //同一个文本框：点击或输入@弹框后点击#/点击或输入#弹框后点击@
                symbol == '#' ? contentData.content.disableObjBtn = false : contentData.content.disableSopBtn = false;
                text = text.slice(0, text.length - 1);
                commonData.publicModel.allMatters[commonData.curMatterIndex][attrName1] = text;
                commonData.publicModel.allMatters = JSON.parse(JSON.stringify(commonData.publicModel.allMatters));
            } else if (commonData.publicModel.regular) {        //结构化输入不同文本框：点击或输入@弹框后点击#/点击或输入#弹框后点击@
                var text1 = commonData.text1;
                symbol == '#' ? contentData.content.disableObjBtn = false : contentData.content.disableSopBtn = false;
                if (oldTextareaFlag == 2 && flag == 3 && text1 && text1.length && text1[text1.length - 1] == '@' && symbol == '#') {     ///结构化输入不同文本框：点击或输入@弹框后点击#
                    commonData.publicModel.allMatters[commonData.curMatterIndex]['desc_forepart'] = text1.slice(0, text1.length - 1);
                    $('.aite-bubble').hide();
                }
                if (oldTextareaFlag == 3 && flag == 2 && text1 && text1.length && text1[text1.length - 1] == '#' && symbol == '@') {     ///结构化输入不同文本框：点击或输入#弹框后点击@
                    commonData.publicModel.allMatters[commonData.curMatterIndex]['desc_aftpart'] = text1.slice(0, text1.length - 1);
                    $('.hashtag-bubble').hide();
                }
            }
            commonData.beforeLen = text ? text.length : 0;
            var spaceOrNoSpaceChar = !text || text[text.length - 1] == ' ' ? '' : ' ';
            commonData.publicModel.allMatters[commonData.curMatterIndex][attrName1] = text + spaceOrNoSpaceChar + symbol;

            var jqTextarea = flag == 1 ? $(dom).parents('.textarea-div').find('textarea') : $(dom).parents('.add-obj-sop-content').prev().find('textarea');
            jqTextarea.focus();
            var focusIndex = commonData.publicModel.allMatters[commonData.curMatterIndex][attrName1].length;
            var addedStr = symbol;
            publicMethod.changeMatterContent(commonData.publicModel.allMatters[commonData.curMatterIndex], index, event, jqTextarea, focusIndex, addedStr, flag);
        } else {

            var text = commonData.publicModel.workContent.content;
            commonData.beforeLen = text ? text.length : 0;
            var spaceOrNoSpaceChar = !text || text[text.length - 1] == ' ' ? '' : ' ';
            commonData.publicModel.workContent.content = text + spaceOrNoSpaceChar + symbol;

            var jqTextarea = $(dom).parents('.textarea-div').children().eq(0);
            jqTextarea.focus();
            var focusIndex = commonData.publicModel.workContent.content.length;
            var addedStr = symbol;
            publicMethod.changeContent(event, jqTextarea, focusIndex, addedStr);
        }
    },

    //点击空白处收起弹框时数据处理
    setHidePopDatas: function (type) {
        commonData.showWhichPop = 0;
        var symbol = type == commonData.types[1] ? '#' : '@';
        var contentData;
        contentData = publicMethod.getContentData(type);
        var content = contentData.content;
        var attrName1 = contentData.attrName1;
        var text1 = commonData.text1.slice(0, commonData.text1.lastIndexOf(symbol));
        if (text1 == ' ') text1 = '';
        var text2 = commonData.text2.indexOf(' ') == '-1' ? '' : commonData.text2.slice(commonData.text2.indexOf(' '));
        if (text2 == ' ') text2 = '';
        content[attrName1] = text1 + text2;

        //标准作业操作内容
        commonData.selectedObjs = JSON.parse(JSON.stringify(commonData.initialSelectedObjs));
        commonData.checkedObjs = JSON.parse(JSON.stringify(commonData.initialCheckedObjs));
        commonData.publicModel.curObjType = null;

        //左侧有级别树时恢复初始
        $('#leftLevelTree' + commonData.contentIndex).precover();

        commonData.publicModel.workContent.disableObjBtn = false;
        content.disableObjBtn = false;
        content.disableSopBtn = false;
        publicMethod.saveObjOrSopSel(symbol);
    },

    //设置编辑的工单草稿
    setEditedMatterDatas: function (result) {
        commonData.ignoredErrorList = [];
        commonData.publicModel.workOrderDraft = result;
        commonData.publicModel.allMatters = result.matters;
    },

    //初始化埋点数据
    initBpDatas: function () {
        commonData.click_at_button = '0';     //点击@按钮，1-是，0-否
        commonData.click_class_option = '0';      //点击入口选项，1-是，0-否
        commonData.class_option_name = '';     //选择入口选项，点击的入口项具体的文字，包括通用设备、通用系统、建筑、楼层、空间等
        commonData.input_text = '0';            //直接输入文字，1-是，0-否，必须，@之后若输入过文字，则记录为1
        commonData.click_custom_button = '0';   //点击自定义按钮，1-是，0-否，必须，
        commonData.custom_result = '';         //自定义结果
        commonData.click_domain_button = '0';   //点击专业按钮，1-是，0-否，必须
        commonData.click_system_button = '0';   //点击系统按钮，1-是，0-否，必须
        commonData.final_result = '';           //最终结果

        commonData.custom_sop_name = '';       //自定义的SOP，输入#之后直接输入的文字，且该文字对应不到数据库中的SOP上时，这里把输入的文字记录下来
        commonData.click_sop_name = '0';        //点击列表中SOP名称，1-是，0-否，必须
        commonData.click_sop_screen_button = '0';//点击SOP的筛选按钮，1-是，0-否，必须

        commonData.click_add_info_point = '0';  //点击添加信息点按钮，1-是，0-否，必须
        commonData.click_search_button = '0';     //点击搜索按钮，1-是，0-否，必须
        commonData.search_use_enter_key = '0';      //搜索时使用回车键触发，1-是，0-否，必须
        commonData.keyword_num = '0';     //输入关键词数量

        commonData.new_tool_num = '0';
    },

    //自定义信息点 列表状态-添加选项
    addOption2: function (custom, event, contentIndex) {
        event.stopPropagation();
        commonData.contentIndex = contentIndex;
        if (custom.type == 2 || custom.type == 3) {
            if (custom.items.length) {//判断选项是否有重复
                var hash = {};
                var objlen = custom.items.length;
                for (var k = 0; k < objlen; k++) {
                    if (!hash[custom.items[k]]) {
                        hash[custom.items[k]] = true;
                    } else {
                        $('#globalnotice').pshow({text: '选项不可重复！', state: 'failure'});
                        return false;
                    }
                }
                var name = custom.items[custom.items.length - 1];
                var name1 = name.replace(/\s+/g, '');
                if (name1 != '' && name.length < 100) {
                    custom.items.push('');
                } else {
                    $("#globalnotice").pshow({text: "请完善选项！", state: "failure"})
                    return false;
                }
            } else {
                custom.items.push('');
            }


        }
        // commonData.publicModel.curStep = JSON.parse(JSON.stringify(commonData.publicModel.curStep));
    },
    //输入单位
    recordUnit: function (unit, custom, index, event) {
        event.stopPropagation();
        // unit = unit.replace(/\s+/g, '')
        // unit=publicMethod.limitString(unit);
        // $(event.target).val(unit)
        custom.unit = unit;
    },
    //输入选项
    recordItem: function (item, custom, index, event) {
        event.stopPropagation();
        // item = item.replace(/\s+/g, '')
        // item=publicMethod.limitString(item);
        // $(event.target).val(item)
        custom.items[index] = item;
        console.log(custom.items)
    },
    setCurPopInfo: function (index) {
        if (index == 0) {
            $(".keyinput").val("");
            commonData.publicModel.curObjType2 = "infoPoint";
        } else if (index == 1) {
            $($($(commonData.jqPopDataDivsInfo)[1]).children()[0]).children("div").pval('');
            $($($(commonData.jqPopDataDivsInfo)[1]).children()[0]).children("div").precover();
            $($($(commonData.jqPopDataDivsInfo)[1]).children()[1]).children("div").precover('请选择');
            $($($(commonData.jqPopDataDivsInfo)[1]).children()[2]).find(".unit-div>div").pval('');
            // $('#sel-controller').precover('请选择');
            commonData.publicModel.seltype = null;
            commonData.publicModel.searchResultLength = null;
            commonData.publicModel.isCustomizeBtnAble = false;
            commonData.publicModel.curObjType2 = "custom";
        } else {
            commonData.publicModel.curObjType2 = "infoPoint";
        }
        var jqPopDataDivs = commonData.jqPopDataDivsInfo;
        jqPopDataDivs.hide();
        $(jqPopDataDivs[index]).show();

    },
    //添加信息点
    addInfoPoint: function (confirmObj, index1, event, contentIndex) {
        event.stopPropagation();
        publicMethod.initBpDatas();
        commonData.click_add_info_point = '1';
        // $(".aite-bubble").hide();
        // $(event.currentTarget).parents(".import-box").find(".textarea-prop").hide();
        publicMethod.panelClose();
        $(event.currentTarget).next().show();
        commonData.jqPopDataDivsInfo = $(event.currentTarget).next().find(".list-body").children();
        commonData.publicModel.searchResultLength = null;
        // commonData.publicModel.domElement = null;
        // commonData.publicModel.objAddInfo = 1;
        // commonData.publicModel.curObjType2 = "infoPoint";
        // $(event.currentTarget).next().find(".customize div:first-of-type div").pval("");
        // $(".keyinput").val("");
        // $(event.currentTarget).parents(".import-box").find(".textarea-div .aite-btn").next(".aite-bubble").hide();
        // $(event.currentTarget).parents(".import-box").find(".obj-info-btn .aite-bubble").hide();
        // $($(event.currentTarget).next().find(".list-body").children()[0]).show().siblings().hide();
        publicMethod.setCurPopInfo(0);
        commonData.contentIndex = contentIndex;
        commonData.infoPoint_obj = JSON.parse(JSON.stringify(confirmObj));
        commonData.confirmResultIndex = index1;
        // var jqInfoPointPop = $(event.currentTarget).next();
        // commonData.jqInfoPointPop = jqInfoPointPop;
        commonData.belongChoosedObj = true;
        myWorkOrderController.queryInfoPointForObject(confirmObj, null);
    },
    //清除信息点搜索关键字
    //  params:
    //      flag: 1为添加对象和信息时，搜索物理世界的信息点，不挂载在对象下面
    clearInfoPointKeyword: function (dom, flag) {
        if (flag == 1) {
            $(dom).parents('.info-search-box').find('input').val('');
        } else {
            commonData.jqInfoPointPop.find('.keyinput').val('');
        }
        $(dom).hide();
    },
    // //信息点关键字输入改变事件
    // changeInfoPointKeyword: function (dom) {
    //     var jqDeleteTag = $(dom).next().children(':first');
    //     if ($(dom).val()) {
    //         jqDeleteTag.show();
    //     } else {
    //         jqDeleteTag.hide();
    //     }
    // },
    //关键字输入改变事件
    changeKeyword: function (dom) {
        var jqDeleteTag = $(dom).next().children(':first');
        if ($(dom).val()) {
            jqDeleteTag.show();
        } else {
            jqDeleteTag.hide();
        }
    },
    //判断是否是已选信息点
    isSelectedInfoPoint: function () {
        var content = publicMethod.confirmResult();
        for (var i = 0; i < commonData.publicModel.curLevelList.length; i++) {
            var item = commonData.publicModel.curLevelList[i];
            var len = content.confirm_result.length;
            for (var j = 0; j < len; j++) {
                var confirm_resultObj = content.confirm_result[j];
                if (item.obj_id == confirm_resultObj.obj_id) {      //属于同一个对象
                    if (!confirm_resultObj.info_points) continue;
                    for (var k = 0; k < confirm_resultObj.info_points.length; k++) {
                        var info_point = confirm_resultObj.info_points[k];
                        if (info_point.id == item.info_point.id) {
                            item.checked = true;
                            j = len;
                            break;
                        }
                    }
                }
            }
        }
    },
    //搜索筛选获取对象下信息点
    filterGetInfoPointForObject: function (dom) {
        commonData.click_search_button = '1';
        var keyword = $(dom).parents('.info-search-box').find('input').val();
        // commonData.publicModel.curObjType = 'search';
        var domElement = dom;
        commonData.publicModel.addContent_addInfoBtn = true;
        commonData.publicModel.domElement = dom;
        // publicMethod.setCurPopInfo(0)
        // $(dom).parents(".aite-bubble").find(".list-body").show().siblings().hide();
        myWorkOrderController.queryInfoPointForObject(commonData.infoPoint_obj, null, keyword);
        // if(commonData.publicModel.addContentWindow && domElement){
        // if(!commonData.publicModel.searchResultLength){
        //     $(dom).parents(".list-search").next().find(".list-body").hide().siblings().show();
        // }
        // }
    },
    //将字符串转换成带标记的数组，用于匹配搜索关键字标红显示
    strToMarkedArr: function (str, substr, modifiedArr) {
        var markedArr = [];
        if (!substr) {
            for (var i = 0; i < str.length; i++) {
                var markValue = false;
                if (modifiedArr && modifiedArr[i] && modifiedArr[i].mark) markValue = true;
                markedArr.push({char: str[i], mark: markValue});
            }
            return markedArr;
        }
        var x = 0;
        for (var i = 0; i < str.length; i = x + substr.length) {
            x = str.indexOf(substr, i);
            if (x == -1) {
                for (var j = i; j < str.length; j++) {
                    var markValue = false;
                    if (modifiedArr && modifiedArr[j] && modifiedArr[j].mark) markValue = true;
                    markedArr.push({char: str[j], mark: markValue});
                }
                return markedArr;
            } else {
                for (var j = i; j < x; j++) {
                    var markValue = false;
                    if (modifiedArr && modifiedArr[j] && modifiedArr[j].mark) markValue = true;
                    markedArr.push({char: str[j], mark: markValue});
                }
                for (var j = x; j < x + substr.length; j++) {
                    markedArr.push({char: str[j], mark: true});
                }
            }
        }
        return markedArr;
    },
    //信息点-设置当前弹框显示对应的内容  /*修改进行中*/
    setCurPop2: function (index, notInitData, isSelectedBuild) {
        if (!notInitData) {
            commonData.publicModel.curLevelList = [];
            commonData.publicModel.infoArray = [];
        }
        if (index == 0) {       //大类，此处注意与setCurPop(4)作区分
            commonData.publicModel.curObjType2 = 'init';
            commonData.publicModel.isCustomizeBtnAble = false;
        } else if (index == 2) {//搜索
            commonData.publicModel.curObjType2 = 'search';
            commonData.publicModel.isCustomizeBtnAble = false;
        } else if (index == 3) {//自定义
            //恢复自定义信息点弹窗默认设置
            // commonData.publicModel.repeatTips = ""
            $($($(commonData.jqPopDataDivs2)[3]).children()[0]).children("div").precover();
            $($($(commonData.jqPopDataDivs2)[3]).children()[2]).find(".unit-div>div").precover();
            $('#controlSel').precover('请选择');
            commonData.publicModel.seltype = null;
            commonData.publicModel.searchResultLength = null;
            commonData.publicModel.customItem = {"name": "", "type": "", "items": [], "unit": ""};
            commonData.publicModel.curObjType2 = 'custom';
            commonData.publicModel.isCustomizeBtnAble = false;
        } else if (index == 1) {//树结构界面-1
            commonData.publicModel.curObjType2 = 'infoPoint';
        } else if (index == 4) {//无数据界面-4
            commonData.publicModel.curObjType2 = 'search';

        }
        var jqPopDataDivs = commonData.jqPopDataDivs2;
        var curJqPopDataDiv = $(jqPopDataDivs[index]);
        jqPopDataDivs.hide();
        curJqPopDataDiv.show();
        if (index == 1) commonData.publicModel.isSelectedBuild = isSelectedBuild ? true : false;
        // curJqPopDataDiv.siblings().hide();
    },
    //清空工作内容
    clearWorkContentPanel: function () {
        //清空工作内容 start
        commonData.publicModel.workContent.work_name = "";
        commonData.publicModel.workContent.pre_conform = "";
        commonData.publicModel.workContent.content = "";
        commonData.publicModel.workContent.content_obj = [];
        commonData.publicModel.workContent.notice = "";
        commonData.publicModel.workContent.confirm_result = [];
        commonData.publicModel.workContent.confirm_result_copy = [];
        commonData.publicModel.workContent.domain = "";
        commonData.publicModel.workContent.domain_name = "";
        commonData.infoPoint_obj = {};
        commonData.publicModel.workContent.customs = [];
        commonData.publicModel.customItem.items = [];
        $("#add-major").precover("选择专业");
        $(".workcontent-alert .matter-title-div .counter>b").text("0");
        $(".import-box .counterNum").text("0");
        $(".import-box .edit-div").show().next().hide();
        publicMethod.panelClose();
        $(".import-box .prev-body").hide();
        commonData.checkedObjs = [];
        //清空工作内容 end
    },
    /*添加工作内容*/
    addContent: function (model, open, event, index0) {
        if (event) event.stopPropagation();
        publicMethod.dealMattersParam();
        publicMethod.clearWorkContentPanel();
        if (open) {
            commonData.publicModel.addContentWindow = true;
            $(".workcontent-alert").show();
            commonData.curMatterIndex = index0;
            myWorkOrderController.queryGeneralDictByKey();
            commonData.publicModel.work_c = true;
            if (commonData.publicModel.workContent && commonData.publicModel.workContent.content_objs) commonData.publicModel.workContent.content_objs = [];

        } else {        //关闭弹窗      //To Delete
            publicMethod.panelClose();
            myWorkOrderController.saveAddWork(false);
            commonData.publicModel.addContentWindow = false;
            $(".workcontent-alert").hide();
            commonData.publicModel.work_c = false;
        }
        commonData.publicModel.mattersVip = model || {};
    },
    limitString: function (str) {
        var strArr = str.split("");
        for (var i = 0; i < strArr.length; i++) {
            var space = strArr[i].pisSpace();
            var ch = strArr[i].pisChinese();
            var enN = strArr[i].pisNumberAlph();
            if (space || !ch && !enN) {
                strArr.splice(i, 1);
                i = i - 1;
            }
        }
        var newVal = strArr.join("");
        str = newVal;
        return str;
    },
    /*事项名称计数*/
    matterNameCounter: function (model, event, index0) {
        var mattername = $(event.target).val() || '';
        // model.matter_name = $(event.target).val() || '';
        // model.matter_name = mattername.replace(/\s+/g, '');
        // model.matter_name = publicMethod.limitString(mattername);
        commonData.publicModel.allMatters[index0].matter_name = publicMethod.limitString(mattername);
        // $(event.target).val(publicMethod.limitString(mattername));
        // commonData.publicModel.allMatters[index0].matter_name = publicMethod.limitString(model.matter_name);
        // model.matter_name=commonData.publicModel.allMatters[index0].matter_name
        commonData.publicModel.allMatters = JSON.parse(JSON.stringify(commonData.publicModel.allMatters));
        /* model.matter_name = $(event.target).val() || '';
         model.matter_name = model.matter_name.replace(/\s+/g, '');
         model.matter_name = publicMethod.limitString(model.matter_name);
         var len = model.matter_name ? model.matter_name.length : 0;
         $(event.target).next(".counter").find("b").text(len);
         commonData.publicModel.allMatters = JSON.parse(JSON.stringify(commonData.publicModel.allMatters));*/
    },
    //确认勾选的信息点
    confirmCheckedInfoPoints: function () {
        var content1 = publicMethod.confirmResult();
        var arr = [];
        var initial_info_points = content1.confirm_result[commonData.confirmResultIndex].info_points || [];
        for (var i = 0; i < commonData.publicModel.infoArray.length; i++) {
            var item = commonData.publicModel.infoArray[i];
            var belong = false;
            for (var j = 0; j < initial_info_points.length; j++) {
                if (initial_info_points[j].id == item.id) {
                    belong = true;
                    break;
                }
            }
            if (item.checked) {
                arr.push(JSON.parse(JSON.stringify(item)));
            }
            if (item.checked && !belong) {
                initial_info_points.push(JSON.parse(JSON.stringify(item)));
            } else if (!item.checked && belong) {
                initial_info_points.splice(j, 1);
            }
        }
        content1.confirm_result[commonData.confirmResultIndex].info_points = initial_info_points;
        commonData.publicModel.workContent = JSON.parse(JSON.stringify(commonData.publicModel.workContent));
        $(".add-info-btn .aite-bubble").hide();
        commonData.final_result = '';
        for (var i = 0; i < arr.length; i++) {
            commonData.final_result += arr[i].name + (i == arr.length - 1 ? '' : ',');
        }
        myWorkOrderController.saveInfoPointSel();
        // content1.confirm_result[commonData.confirmResultIndex].info_points = JSON.parse(JSON.stringify(arr));
        //content2.confirm_result[commonData.confirmResultIndex].info_points = JSON.parse(JSON.stringify(arr));
        // commonData.jqInfoPointPop.hide();
    },
    //添加对象和信息点
    //选择大类-确认勾选的信息点
    confirmCheckedInfoPoints2: function () {
        if (commonData.publicModel.curObjType == 'search') {        //搜索确认勾选的结果// && commonData.publicModel.objAddInfo!==1 不是添加信息點中的彈窗
            var content = publicMethod.confirmResult();
            commonData.final_result = '';
            for (var i = 0; i < commonData.publicModel.curLevelList.length; i++) {
                var item = commonData.publicModel.curLevelList[i];
                //判断是否是已选对象中已选的信息点
                var len = content.confirm_result.length;
                var belongSelectedObj = false;
                for (var j = 0; j < len; j++) {
                    var confirm_resultObj = content.confirm_result[j];
                    if (item.obj_id == confirm_resultObj.obj_id) {      //属于已选的对象
                        belongSelectedObj = true;
                        var belongSelected = false;     //是否属于已选的信息点
                        if (!confirm_resultObj.info_points) continue;
                        for (var k = 0; k < confirm_resultObj.info_points.length; k++) {
                            var info_point = confirm_resultObj.info_points[k];
                            if (info_point.id == item.info_point.id) {      //属于已选的信息点
                                if (!item.checked) {        //取消勾选
                                    confirm_resultObj.info_points.splice(k, 1);
                                }
                                belongSelected = true;
                                j = len;
                                break;
                            }
                        }
                        if (!belongSelected && item.checked) {      //不属于已选的信息点，属于该对象，且在搜索结果中勾选上了
                            confirm_resultObj.info_points.push(item.info_point);
                            commonData.final_result += item.info_point.name + ',';
                        }
                        break;
                    }
                }
                if (!belongSelectedObj) {        //不属于已选的对象
                    if (item.checked) {
                        var obj = {
                            obj_id: item.obj_id,
                            obj_name: item.obj_name,
                            obj_type: item.obj_type,
                            parents: item.parents,
                            info_points: [item.info_point],
                            customs: []
                        }
                        content.confirm_result.push(obj);
                        commonData.final_result += item.info_point.name + ',';
                        len = content.confirm_result.length;
                    }
                }
            }
            var fr = commonData.final_result;
            if (fr.length && fr[fr.length - 1] == ',') commonData.final_result = fr.slice(0, fr.length - 1);
        } else {
            var content1 = publicMethod.confirmResult();
            // var content2 = commonMethod.getCurStepContent();
            var arr = [];
            for (var i = 0; i < commonData.publicModel.infoArray.length; i++) {
                var item = commonData.publicModel.infoArray[i];
                if (item.checked) {
                    arr.push(JSON.parse(JSON.stringify(item)));
                }
            }
            if (commonData.belongChoosedObj) {
                content1.confirm_result[commonData.confirmResultIndex].info_points = arr;
                // content2.confirm_result[commonData.confirmResultIndex].info_points = arr;
            } else {
                commonData.infoPoint_obj.obj_type = commonData.publicModel.curObjType;
                commonData.infoPoint_obj.info_points = arr;
                content1.confirm_result.push(JSON.parse(JSON.stringify(commonData.infoPoint_obj)));
            }
            for (var i = 0; i < arr.length; i++) {
                commonData.final_result += arr[i].name + (i == arr.length - 1 ? '' : ',');
            }
        }
        publicMethod.hideCurPop2();
        $(".add-info-btn .aite-bubble").hide();
        $(".obj-info-btn .aite-bubble").hide();
        commonData.publicModel.searchResultLength = null;
    },

    //确认自定义信息点
    confirmCustomizeInfoPoint: function (event) {
        //TODO: 验证
        // commonData.publicModel.customItem.name = $($(commonData.jqPopDataDivs2[4]).children()[0]).find('input').val();
        var customChildrenDom = $(event.target).parents(".aite-bubble").find(".customize").children();
        var name = $(customChildrenDom[0]).children("div").pval();
        name = publicMethod.limitString(name);
        $(customChildrenDom[0]).children("div").pval(name);
        $(customChildrenDom[0]).children("div").pverifi();
        commonData.publicModel.customItem.name = $(customChildrenDom[0]).children("div").pval();
        // var units=$(event.target).parents(".aite-bubble").find(".customize .unit-div").children("div").pval();
        // units=publicMethod.limitString(units);
        // $(event.target).parents(".aite-bubble").find(".customize .unit-div").children("div").pval(units);
        commonData.publicModel.customItem.unit = $(event.target).parents(".aite-bubble").find(".customize .unit-div").children("div").pval();
        if (commonData.publicModel.customItem.name == "" || commonData.publicModel.customItem.name.length > 40) return;
        if (commonData.publicModel.seltype == 5 && commonData.publicModel.customItem.unit == "") {
            $(event.target).parents(".aite-bubble").find(".customize .unit-div").children("div").pverifi();
            return;
        }
        if (!commonData.publicModel.seltype) {
            $('#globalnotice').pshow({text: '请选择控件！', state: 'failure'});
            return;
        }
        var obj = {
            name: commonData.publicModel.customItem.name,
            type: commonData.publicModel.customItem.type,
            unit: commonData.publicModel.customItem.unit
        };

        if (commonData.controlName == '单选' || commonData.controlName == '多选') {
            var items = JSON.parse(JSON.stringify(commonData.publicModel.customItem.items));
            var arr = [];
            for (var i = 0; i < items.length; i++) {
                items[i].name = items[i].name.replace(/\s+/g, '');
                if (items[i].name != '' && items[i].name.length <= 100) {
                    arr.push(items[i].name);
                }
            }
            obj.items = arr;
        }
        if (obj.type == 2) {
            if (obj.items.length < 1) {
                $('#globalnotice').pshow({text: '单选至少一个不为空选项且字符小于100！', state: 'failure'});
                return false;
            }
        } else if (obj.type == 3) {
            if (obj.items.length < 2) {
                $('#globalnotice').pshow({text: '多选至少两个不为空选项且字符小于100！', state: 'failure'});
                return false;
            }
        }
        if (obj.items && obj.items.length) {//判断选项是否有重复
            var hash = {};
            var objlen = obj.items.length;
            for (var k = 0; k < objlen; k++) {
                if (!hash[obj.items[k]]) {
                    hash[obj.items[k]] = true;
                } else {
                    $('#globalnotice').pshow({text: '选项不可重复！', state: 'failure'});
                    return false;
                }
            }
        }
        if (!publicMethod.confirmResult().confirm_result[commonData.confirmResultIndex]) {
            publicMethod.confirmResult().confirm_result[commonData.confirmResultIndex] = {customs: []};
        }
        commonData.infoPoint_obj.obj_type = commonData.publicModel.selectedObj.obj_type || commonData.publicModel.curObjType;
        publicMethod.confirmResult().confirm_result[commonData.confirmResultIndex] = commonData.infoPoint_obj;
        var confirm_result_obj = publicMethod.confirmResult().confirm_result[commonData.confirmResultIndex];//当前需确认操作记录的操作的对象
        if (!confirm_result_obj.customs) confirm_result_obj.customs = [];
        /*
         for (var i = 0; i < commonData.publicModel.infoArray.length; i++) {//判断是否和此对象下固有信息点重名
         var alreadyInfo = commonData.publicModel.infoArray[i];
         if (commonData.publicModel.customItem.name == alreadyInfo.name) {
         $('#globalnotice').pshow({text: '信息点名称已存在！', state: 'failure'});
         return false;
         }
         commonData.publicModel.repeatTips = ""
         }
         for (var j = 0; j < confirm_result_obj.customs.length; j++) {//判断是否和已有自定义信息点重名
         var customInfo = confirm_result_obj.customs[j];
         if (commonData.publicModel.customItem.name == customInfo.name) {
         $('#globalnotice').pshow({text: '信息点名称已存在！', state: 'failure'});
         return false;
         }
         }
         */
        confirm_result_obj.customs.push(obj);
        commonData.publicModel.workContent = JSON.parse(JSON.stringify(commonData.publicModel.workContent));
        $(event.target).parents(".aite-bubble").hide();
        setTimeout(function () {
            //选中对应的控件
            var customs = confirm_result_obj.customs;
            for (var j = 0; j < customs.length; j++) {
                var controlIndex = parseInt(customs[j].type) - 1;
                $('#custom-sel' + commonData.confirmResultIndex + 'sep' + j).psel(controlIndex, false);
            }
        }, 0);
        commonData.custom_result = commonData.publicModel.customItem.name;
        commonData.final_result = commonData.publicModel.customItem.name;
        publicMethod.hideCurPop2();
    },
    confirmCustomizeInfoPoint2: function (model, event) {
        // commonData.publicModel.customItem.name = $($(commonData.jqPopDataDivs2[4]).children()[0]).find('input').val();
        var smallCustomChildrenDom = $(event.target).parents(".aite-bubble").find(".customize").children();
        var name = $(smallCustomChildrenDom[0]).children("div").pval();
        name = publicMethod.limitString(name);
        $(smallCustomChildrenDom[0]).children("div").pval(name);
        $(smallCustomChildrenDom[0]).children("div").pverifi();
        commonData.publicModel.customItem.name = $(smallCustomChildrenDom[0]).children("div").pval();
        // var units=$(event.target).parents(".aite-bubble").find(".customize .unit-div").children("div").pval();
        // units=publicMethod.limitString(units);
        // $(event.target).parents(".aite-bubble").find(".customize .unit-div").children("div").pval(units);
        commonData.publicModel.customItem.unit = $(event.target).parents(".aite-bubble").find(".customize .unit-div").children("div").pval();
        if (commonData.publicModel.customItem.name == "" || commonData.publicModel.customItem.name.length > 40) return;
        if (commonData.publicModel.seltype == 5 && commonData.publicModel.customItem.unit == "") {
            $(event.target).parents(".aite-bubble").find(".customize .unit-div").children("div").pverifi();
            return;
        }
        if (!commonData.publicModel.seltype) {
            $('#globalnotice').pshow({text: '请选择控件！', state: 'failure'});
            return;
        }
        var obj = {
            name: commonData.publicModel.customItem.name,
            type: commonData.publicModel.customItem.type,
            unit: commonData.publicModel.customItem.unit
        };

        if (commonData.controlName == '单选' || commonData.controlName == '多选') {
            var items = JSON.parse(JSON.stringify(commonData.publicModel.customItem.items));
            var arr = [];
            for (var i = 0; i < items.length; i++) {
                items[i].name = items[i].name.replace(/\s+/g, '');
                if (items[i].name && items[i].name.length <= 100) {
                    arr.push(items[i].name);
                }
            }
            obj.items = arr;
        }
        if (obj.type == 2) {
            if (obj.items.length < 1) {
                $('#globalnotice').pshow({text: '单选至少一个不为空选项且字符小于100！', state: 'failure'});
                return false;
            }
        } else if (obj.type == 3) {
            if (obj.items.length < 2) {
                $('#globalnotice').pshow({text: '多选至少两个不为空选项且字符小于100！', state: 'failure'});
                return false;
            }
        }
        if (obj.items && obj.items.length) {//判断选项是否有重复
            var hash = {};
            var objlen = obj.items.length;
            for (var k = 0; k < objlen; k++) {
                if (!hash[obj.items[k]]) {
                    hash[obj.items[k]] = true;
                } else {
                    $('#globalnotice').pshow({text: '选项不可重复！', state: 'failure'});
                    return false;
                }
            }
        }
        if (!publicMethod.confirmResult().confirm_result[commonData.confirmResultIndex]) {
            publicMethod.confirmResult().confirm_result[commonData.confirmResultIndex] = {customs: []};
        }
        commonData.infoPoint_obj.obj_type = model.obj_type || commonData.publicModel.selectedObj.obj_type || commonData.publicModel.curObjType;
        publicMethod.confirmResult().confirm_result[commonData.confirmResultIndex] = commonData.infoPoint_obj;
        var confirm_result_obj = publicMethod.confirmResult().confirm_result[commonData.confirmResultIndex];
        if (!confirm_result_obj.customs) confirm_result_obj.customs = [];
        /*
         for (var i = 0; i < commonData.publicModel.infoArray.length; i++) {//判断是否和此对象下固有信息点重名
         var alreadyInfo = commonData.publicModel.infoArray[i];
         if (commonData.publicModel.customItem.name == alreadyInfo.name) {
         $('#globalnotice').pshow({text: '信息点名称已存在！', state: 'failure'});
         return false;
         }
         commonData.publicModel.repeatTips = ""
         }
         for (var j = 0; j < confirm_result_obj.customs.length; j++) {//判断是否和已有自定义信息点重名
         var customInfo = confirm_result_obj.customs[j];
         if (commonData.publicModel.customItem.name == customInfo.name) {
         $('#globalnotice').pshow({text: '信息点名称已存在！', state: 'failure'});
         return false;
         }
         }
         */
        confirm_result_obj.customs.push(obj);
        commonData.publicModel.workContent = JSON.parse(JSON.stringify(commonData.publicModel.workContent));
        $(event.target).parents(".aite-bubble").hide();
        setTimeout(function () {
            //选中对应的控件
            var customs = confirm_result_obj.customs;
            for (var j = 0; j < customs.length; j++) {
                var controlIndex = parseInt(customs[j].type) - 1;
                $('#custom-sel' + commonData.confirmResultIndex + 'sep' + j).psel(controlIndex, false);
            }
        }, 0);
        commonData.custom_result = commonData.publicModel.customItem.name;
        commonData.final_result = commonData.publicModel.customItem.name;
        publicMethod.hideCurPop2();
    },

    //自定义信息点
    customizeInfoPoint: function (event) {
        commonData.click_custom_button = '1';
        //commonData.customizeInfoPoint_obj =
        // commonData.publicModel.curObjType = 'custom';
        // var editingDom = $(event.currentTarget).parents(".aite-bubble").find(".aite-body").children();//aite-body下子div
        // editingDom.children(".list-body").show().siblings().hide();
        // $(editingDom.children(".list-body").find('.customize').children()[0]).children("div").pval('');
        // $(editingDom.children(".list-body").find('.customize').children()[2]).find(".unit-div").children().pval('');
        // commonData.publicModel.customItem = {"name": "", "type": "", "items": [], "unit": ""};
        publicMethod.setCurPop2(3, true);
    },

    //自定义信息点 弹框-添加选项
    addOption: function (event, contentIndex) {
        event.stopPropagation();
        commonData.contentIndex = contentIndex;
        if (commonData.publicModel.customItem.items.length) {
            var text = commonData.publicModel.customItem.items[commonData.publicModel.customItem.items.length - 1].name;
            if (commonData.publicModel.customItem.items.length) {//判断选项是否有重复
                var hash = {};
                var objlen = commonData.publicModel.customItem.items.length;
                for (var k = 0; k < objlen; k++) {
                    if (!hash[commonData.publicModel.customItem.items[k].name]) {
                        hash[commonData.publicModel.customItem.items[k].name] = true;
                    } else {
                        if (commonData.publicModel.customItem.items[k].name.replace(/\s+/g, '') == "") {
                            $('#globalnotice').pshow({text: '多选至少两个选项不为空！', state: 'failure'});
                        } else {
                            $('#globalnotice').pshow({text: '选项不可重复！', state: 'failure'});
                        }
                        return false;
                    }
                }
            }
            /* for(var i=0;i<commonData.publicModel.customItem.items.length;i++){
             if(text==commonData.publicModel.customItem.items[i]){
             $("#globalnotice").pshow({text: "选项不可重复！", state: "failure"});
             return false;
             }
             }*/
            var text1 = text.replace(/\s+/g, '');
            if (text1 && text.length <= 100) {
                commonData.publicModel.customItem.items.push({name: ''});
            } else {
                $("#globalnotice").pshow({text: "请完善选项！", state: "failure"})
            }
        } else {
            commonData.publicModel.customItem.items.push({name: ''});
        }
        // commonData.publicModel.customItem.items.push({name: ''});
    },

    //将字符串转换成带标记的数组，用于匹配搜索关键字标红显示
    strToMarkedArr: function (str, substr) {
        var markedArr = [];
        if (!substr) {
            for (var i = 0; i < str.length; i++) {
                markedArr.push({char: str[i], mark: false});
            }
            return markedArr;
        }
        var x = 0;
        for (var i = 0; i < str.length; i = x + substr.length) {
            x = str.indexOf(substr, i);
            if (x == -1) {
                for (var j = i; j < str.length; j++) {
                    markedArr.push({char: str[j], mark: false});
                }
                return markedArr;
            } else {
                for (var j = i; j < x; j++) {
                    markedArr.push({char: str[j], mark: false});
                }
                for (var j = x; j < x + substr.length; j++) {
                    markedArr.push({char: str[j], mark: true});
                }
            }
        }
        return markedArr;
    },

    //处理搜索的对象结果集
    dealSearchedObjects: function (data, modelName, value) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.obj_name) item.obj_name_arr = this.strToMarkedArr(item.obj_name, value);
            if (item.parents) {
                for (var j = 0; j < item.parents.length; j++) {
                    var item1 = item.parents[j];

                    item1.linked_names = item1.parent_names.join('>');
                    if (item1.linked_names) item1.linked_names_arr = this.strToMarkedArr(item1.linked_names, value);
                }
            }
        }
        modelName.curLevelList = data;
        modelName.curObjType = 'search';
    },

    //设置当前弹窗
    setCurPop: function (index, popType, addSpecialCharFocusIndex, moveToBeforeSpace) {
        $('.aite-bubble').hide();
        $('.hashtag-bubble').hide();

        commonData.checkedObjs = [];
        commonData.maybeDeletedObjs = [];

        //右侧对象数据列表置空
        if (popType != commonData.types[1] && commonData.publicModel.curObjType !== 'build' && commonData.publicModel.curObjType !== 'component' && commonData.publicModel.curObjType !== 'tool' && commonData.publicModel.curObjType !== 'search') {
            //commonData.publicModel.lastLevel = [];        //MARK
            commonData.publicModel.curLevelList = [];
        }

        var type1 = popType == commonData.types[1] ? popType : commonData.types[0];
        publicMethod.updateObjs(index, null, popType, type1);

        if (index == 4) {
            commonData.showWhichPop = 0;
            commonData.publicModel.curObjType = 'init';
        } else if (index == 0) {
            commonData.publicModel.curObjType = 'search';
        } else if (index == 3) {
            commonData.publicModel.curObjType = 'custom';
            commonData.publicModel.selectedObjType = null;      //选择的对象类型
            commonData.publicModel.aiteTips = "";      //?
        }
        //if (commonData.publicModel.addContentWindow && commonData.publicModel.noPop || commonData.publicModel.addContentWindow && !commonData.editingJqTextwrap) {
        //    commonData.editingJqTextwrap = $(".import-box .obj-fragment-div")
        //}
        var jqTextareaDiv = commonData.editingJqTextwrap.parents(".textarea-div");
        var jqPopDataDivs = jqTextareaDiv.find(".free-aite-pops").children();
        var curJqPopDataDiv;
        jqPopDataDivs.hide();
        var hashtagDiv = jqTextareaDiv.find(".hashtag-bubble");
        if (commonData.publicModel.addContentWindow) {
            commonData.publicModel.workContent.disableObjBtn = true;
            jqTextareaDiv.find(".textarea-prop").show();
            curJqPopDataDiv = $(jqPopDataDivs[index]);
            jqTextareaDiv.find('.aite-bubble').show();
            curJqPopDataDiv.show();
            commonData.curJqPop = curJqPopDataDiv;
            publicMethod.locationPop(commonData.publicModel.workContent, popType, addSpecialCharFocusIndex);
            /*
             if (index != 3 && !commonData.publicModel.noPop) {
             jqTextareaDiv.find(".textarea-prop").show();
             }
             if (popType == 'content' && index == 4 && !commonData.publicModel.noPop) {
             curJqPopDataDiv = $(jqPopDataDivs[index + 5]);
             } else if (popType == 'content' && index == 1 && !commonData.publicModel.noPop) {
             curJqPopDataDiv = $(jqPopDataDivs[index + 5]);
             } else if (popType == 'content' && index == 1 && commonData.publicModel.noPop) {
             curJqPopDataDiv = $(jqPopDataDivs[index]);
             }
             if (popType == 'obj' && index == 3 && !commonData.publicModel.noPop) {
             curJqPopDataDiv = $(jqPopDataDivs[index + 5]);
             }
             if (popType == 'obj' && index == 3 && commonData.publicModel.noPop) {//添加工作内容中的obj自定义弹窗
             curJqPopDataDiv = $(jqPopDataDivs[index]);
             }
             if (popType == 'obj') {//添加工作内容中的obj自定义弹窗
             curJqPopDataDiv.show();
             }

             if (popType == 'content' && index == 4 && commonData.publicModel.noPop) {//添加工作内容中obj点击弹窗
             curJqPopDataDiv = $(jqPopDataDivs[index]);
             }
             if (popType == 'content') {     //@对象弹框
             $(".hashtag-bubble").hide();
             curJqPopDataDiv.show();
             if (commonData.publicModel.noPop || !commonData.editingJqTextwrap) {
             jqTextareaDiv.find(".aite-bubble").show();
             }
             if (commonData.publicModel.work_c) {
             $(jqTextareaDiv.find('.aite-bubble')[1]).show();
             } else {
             jqTextareaDiv.find('.aite-bubble').show();
             }
             $(jqPopDataDivs[index]).show();
             if (popType == 'content') {     //?
             publicMethod.locationPop(commonData.publicModel.workContent, commonData.types[3], addSpecialCharFocusIndex);
             } else {
             publicMethod.locationPop(commonData.curMatterContent, commonData.types[0], addSpecialCharFocusIndex);
             }
             }
             */
        } else {        //工单事项弹框
            var matter = commonData.publicModel.allMatters[commonData.curMatterIndex];
            popType == commonData.types[0] ? matter.disableObjBtn = true : matter.disableSopBtn = true;
            jqTextareaDiv.find(".textarea-prop").show();
            curJqPopDataDiv = $(jqPopDataDivs[index]);

            if (popType == commonData.types[0]) {     //@对象弹框
                $(".hashtag-bubble").hide();
                jqTextareaDiv.find('.aite-bubble').show();
                curJqPopDataDiv.show();
                commonData.curJqPop = curJqPopDataDiv;
            } else {        //#SOP弹框
                jqTextareaDiv.find('.aite-bubble').hide();
                hashtagDiv.show();
            }
            publicMethod.locationPop(commonData.curMatterContent, /*type1*/popType, addSpecialCharFocusIndex);
        }
        if (index == 3) {
            curJqPopDataDiv.find('.customText').children().eq(1).precover();
        }
        if (moveToBeforeSpace) {        //删除结束对象/SOP空格，发起搜索/自定义后，光标定位到空格前一个字符
            setTimeout(function () {
                publicMethod.setCaretPosition(commonData.editingJqTextwrap[0], commonData.text1.length);
            }, 0);
        }
    },

    //点击空白处关闭并设置当前弹框数据
    clickSpaceHidePop: function () {
        var jqProp;
        if (!commonData.publicModel.addContentWindow) {
            var index0 = commonData.textAttrName == 'description' ? 0 : commonData.textAttrName == 'desc_forepart' ? 1 : 2;
            jqProp = $(".aite-bubble").eq(commonData.curMatterIndex * 3 + index0);
            if (jqProp.is(':visible')) {
                publicMethod.setHidePopDatas(commonData.types[0]);
                $(".aite-bubble").hide();
            }
            jqProp = $(".hashtag-bubble").eq(commonData.curMatterIndex * 3 + index0);
            if (jqProp.is(':visible')) {
                publicMethod.setHidePopDatas(commonData.types[1]);
                $(".hashtag-bubble").hide();
                publicMethod.initSopModal();
            }
        } else {
            jqProp = $(".aite-bubble").eq(commonData.publicModel.allMatters.length * 3);
            if (jqProp.is(':visible')) {
                publicMethod.setHidePopDatas(commonData.types[3]);
                $(".aite-bubble").hide();
            }
        }
    },

    isCurMatterPopShow: function (index0, type, flag) {       //flag: 1自由输入，2结构化输入，3添加工作内容
        var matter = commonData.publicModel.allMatters[index0];
        //var jqTextareaDiv = flag == 2 ? $(dom).parents('.regular-text-div').find('.textarea-div') : $(event.currentTarget).parents('.textarea-div');
        //var className = type == commonData.types[1] ? '.hashtag-bubble' : '.aite-bubble';
        //if (jqTextareaDiv.find(className).is(':visible')) return true;
        return type == commonData.types[0] ? matter.disableObjBtn : matter.disableSopBtn;
    },

    //自定义对象
    customizeObj: function (event) {
        commonData.click_custom_button = '1';
        $(event.currentTarget).parents(".aite-bubble").find(".customText>div").pval("");
        commonData.publicModel.inputToCustomize = false;
        var type = commonData.publicModel.addContentWindow ? commonData.types[3] : commonData.types[0];
        publicMethod.setCurPop(3, type);
    },

    //设置当前弹窗位置
    locationPop: function (model, type, addSpecialCharFocusIndex) {
        var textwrap = commonData.editingJqTextwrap;
        var textpdiv = commonData.editingJqTextwrap.parents(".textarea-div")
        var textdiv = $(textwrap).siblings(".textareadiv");
        var textareapop = $(textwrap).siblings(".textarea-prop");

        //var value = model[commonData.textAttrName] ? model[commonData.textAttrName] : commonData.publicModel.workContent.content;     //取值方法统一如下

        var contentData = publicMethod.getContentData(type);
        var attrName1 = contentData.attrName1;
        //if (model && model.content) {       //To Confirm
        //    var value = model[attrName1];
        //} else {
        var value = contentData.content[attrName1];
        //}
        if (commonData.publicModel.noPop) return;
        var focusIndex = addSpecialCharFocusIndex ? addSpecialCharFocusIndex : textwrap[0].selectionStart;
        var firstPartStr = value.substring(0, focusIndex);
        var secondPartStr = value.substring(focusIndex);
        var lastQuanIndex = firstPartStr.lastIndexOf('@');
        var lastJingIndex = firstPartStr.lastIndexOf('#');
        var lastQuanjingIndex = Math.max(lastQuanIndex, lastJingIndex);
        var lastSpaceIndex = firstPartStr.lastIndexOf(' ');
        if (lastQuanjingIndex != -1) {
            var h1 = '<span>' + firstPartStr.substring(0, lastQuanjingIndex) + '</span>';
            var h2 = '<span>' + firstPartStr.substr(lastQuanjingIndex, 1) + '</span>';
            var htmlValue = h1 + h2;
            htmlValue = htmlValue.replace(/\n/g, '<br/>');
            htmlValue = htmlValue.replace(/\s/g, '&nbsp;');
            textdiv[0].innerHTML = htmlValue;
            textdiv[0].scrollTop = textwrap[0].scrollTop;
            var span = $(textdiv).find('span:last');
            var divpos = $(textpdiv).offset();
            var pos = span.offset();
            var left = pos.left - divpos.left + 18;
            var top = pos.top - divpos.top + 25;
            var totalwidth = $(textpdiv).width();
            var remainl = totalwidth - pos.left + divpos.left;
            if (remainl <= 400) {
                left = totalwidth - 400;
            }
            $(textareapop).css({left: left + 'px', top: top + 'px'}).show();
            /*position: "absolute", "z-index": 50, */
        }
    },

    //隐藏当前弹框
    hideCurPop: function (symbol) {
        commonData.publicModel.popShow = false;
        if (commonData.publicModel.addContentWindow) {
            commonData.editingJqTextwrap.parents(".textarea-div").find(".aite-bubble").hide();
            commonData.publicModel.workContent.disableObjBtn = false;
        } else {
            var matter = commonData.publicModel.allMatters[commonData.curMatterIndex];
            matter.disableObjBtn = false;
            matter.disableSopBtn = false;
            commonData.editingJqTextwrap.parents(".textarea-div").find(".textarea-prop").hide();
        }
        // commonData.editingJqTextwrap.parents(".textarea-div").find(".textarea-prop").hide();
        publicMethod.saveObjOrSopSel(symbol);
    },

    //选择对象或选择SOP埋点
    saveObjOrSopSel: function (symbol) {
        if (symbol == '@') {
            myWorkOrderController.saveObjSel();
        } else {
            myWorkOrderController.saveSopSel();
        }
    },

    //确认选择的事项对象
    confirmCheckedMatterObjs: function (model) {
        var work_c = $(event.currentTarget).parents(".import-box")[0]
        if (work_c) {
            publicMethod.confirmCheckedObjs(commonData.types[3]);
        } else {
            publicMethod.confirmCheckedObjs(commonData.types[0]);
        }
        commonData.publicModel.noPop = false;
        commonData.publicModel.blurClose = true;
    },

    //确认勾选的对象
    confirmCheckedObjs: function (type) {
        var deletedObjs = [];
        var type1 = type == commonData.types[1] ? type : commonData.types[0];
        var contentData = publicMethod.getContentData(type);
        var attrName1 = contentData.attrName1;
        var attrName2 = contentData.attrName2;
        var content = contentData.content;
        var content_objs = contentData.content_objs;
        var symbol = type1 == commonData.types[0] ? '@' : '#';
        //var checkedItems = type == commonData.types[0] ? commonData.checkedObjs : commonData.checkedSops;
        deletedObjs = commonData.maybeDeletedObjs;
        console.log('deletedObjs为: ' + JSON.stringify(deletedObjs));
        //筛选出增加的对象
        var addedObjs = [];
        var value;
        value = content[attrName1];
        if (!commonData.publicModel.addContentWindow && commonData.publicModel.regular) {
            value = content.desc_aftpart + content.desc_forepart;
        }
        var numMax;
        numMax = type == commonData.types[3] ? 200 : 1000;
        if (value.length < numMax) {
            var value1;
            for (var i = 0; i < commonData.checkedObjs.length; i++) {
                if (i == 0) value1 = value.substring(1);
                var checkedObj = commonData.checkedObjs[i];
                var newAdded = true;
                for (var j = 0; j < content_objs.length; j++) {
                    var initialObj = content_objs[j];
                    if (checkedObj[type1 + '_id'] == initialObj[type1 + '_id']) {
                        newAdded = false;
                        break;
                    }
                }
                if (value1.length < numMax) {
                    if (newAdded) {
                        if (i == commonData.checkedObjs.length - 1) {
                            value1 = value1 + symbol + checkedObj.obj_name;
                        } else {
                            value1 = value1 + symbol + checkedObj.obj_name + " ";
                        }
                        if (value1.length <= numMax) {
                            checkedObj.obj_type = checkedObj.obj_type ? checkedObj.obj_type : commonData.publicModel.curObjType;
                            addedObjs.push(checkedObj);
                        } else {
                            break;
                        }
                    }
                }

            }
        }
        console.log('addedObjs为: ' + JSON.stringify(addedObjs));

        //删除被替代的对象
        if (!commonData.matchExistingObj[type1 + '_id']) {      //?
            var replacedObjName = commonData.text1.slice(commonData.text1.lastIndexOf(symbol) + 1) + commonData.text2.slice(0, commonData.text2.indexOf(' '));
            if (content[attrName2]) {
                for (var i = 0; i < content[attrName2].length; i++) {
                    if (content[attrName2][i][type1 + '_name'] == replacedObjName) {
                        content[attrName2].splice(i, 1);
                    }
                }
            }
        }
        content[attrName2] = content_objs.concat(addedObjs);
        //  添加新选择的对象内容
        var addedText = '';
        commonData.final_result = '';
        for (var i = 0; i < addedObjs.length; i++) {
            var name = addedObjs[i][type1 + '_name'];
            var prefix = symbol;
            addedText += prefix + name + ' ';
            commonData.final_result += name + (i == addedObjs.length - 1 ? '' : ',');
        }

        //设置数据content.content
        if (commonData.notReplaceObj) {     //普通文本中输入@, 不替代对象
            commonData.text1 = commonData.text1.slice(0, commonData.text1.lastIndexOf(symbol)) + addedText;
            content[attrName1] = commonData.text1 + commonData.text2;
        } else if (!commonData.matchExistingObj[type1 + '_id'] || commonData.publicModel.curObjType == 'search') {     //当前输入对象未匹配搜索结果时，删除当前输入的对象，并在该位置加上新增的对象；或者匹配了搜索结果但是当前为搜索状态时也需替代
            commonData.text1 = commonData.text1.slice(0, commonData.text1.lastIndexOf(symbol)) + addedText;
            var text2;
            if (commonData.text2.indexOf(' ') == -1) {
                commonData.text2 = '';
                text2 = '';
            } else {
                text2 = commonData.text2.slice(commonData.text2.indexOf(' ') + 1);
            }
            content[attrName1] = commonData.text1 + text2;
        } else {        //当前输入对象匹配搜索结果，2011117:是否可以直接用上面的写法commonData.text1 = commonData.text1.slice(0, commonData.text1.lastIndexOf(symbol)) + addedText;
            commonData.text1 = commonData.text1 + commonData.text2.slice(0, commonData.text2.indexOf(' ') + 1) + addedText;
            content[attrName1] = commonData.text1 + commonData.text2.slice(commonData.text2.indexOf(' ') + 1);
        }
        setTimeout(function () {
            publicMethod.setCaretPosition(commonData.editingJqTextwrap[0], commonData.text1.length);
        }, 0);

        //删除取消选择的对象内容
        for (var i = 0; i < deletedObjs.length; i++) {
            var name = deletedObjs[i][type1 + '_name'];
            var deletedText = symbol + name + ' ';
            content[attrName1] = content[attrName1].replace(deletedText, '');
        }

        if (type == commonData.types[3]) {
            publicMethod.setConfirmResultObjs(content, addedObjs);
            if (commonData.publicModel.workContent)
                commonData.publicModel.workContent = JSON.parse(JSON.stringify(commonData.publicModel.workContent));
        }

        //弹框聚焦
        commonData.editingJqTextwrap.focus();

        //关闭弹窗
        //左侧有级别树时恢复初始
        //$('#leftLevelTree' + commonData.contentIndex).precover();
        publicMethod.hideCurPop(symbol);

        if (type == commonData.types[0] || type == commonData.types[1]) {
            commonData.publicModel.allMatters[commonData.curMatterIndex][attrName1] = content[attrName1];
        }

        publicMethod.updateObjs(null, null, type, type1);      //更新当前修改的对象，可能被替代

        if (type == commonData.types[1]) {      //确认勾选SOP关闭弹窗时的处理
            commonData.firstSetMore = true;
        }

        publicMethod.initBpDatas();
    },

    //设置需确认的操作结果对象
    setConfirmResultObjs: function (content, data) {
        var confirm_result = content.confirm_result || [];
        var objTypes = ['system', 'equip', 'other', 'component', '2', 'build', 'floor', 'space'];      //'2'表示obj_type未做转换，为部件
        for (var i = 0; i < data.length; i++) {
            if (objTypes.indexOf(data[i].obj_type) > -1) {
                var belong = false;
                for (var j = 0; j < confirm_result.length; j++) {
                    if (data[i].obj_id == confirm_result[j].obj_id) {
                        belong = true;
                        break;
                    }
                }
                if (!belong) {
                    confirm_result.push(JSON.parse(JSON.stringify(data[i])));
                    if ($('.contentResult').find('.edit-div').is(':visible')) {
                        $('.contentResult').find('.edit-div').hide();
                        $('.contentResult').find('.clear-div').show();
                    }
                }
            }
        }
        $('.confirmSlideBody').show();
    },

    //更新已选择的对象数据/已选择的SOP数据
    //  params:
    //      type: 对应commonData.types中的值
    //      type1 = type == commonData.types[1] ? type : commonData.types[0]; 'obj'或'sop'
    updateObjs: function (index, keyword, type, type1, obj, matterIndex) {
        var contentData = publicMethod.getContentData(type, matterIndex);
        var attrName1 = contentData.attrName1;
        var attrName2 = contentData.attrName2;
        var content = contentData.content;
        var content_objs = contentData.content_objs;
        var originalSelected;
        var symbol = type1 == commonData.types[0] ? '@' : '#';
        //搜索状态下不将当前可能被替换的对象更新至content.content_objs
        if (index === 0) {      //To Delete
            var searchedText = keyword ? keyword : commonData.text1.slice(commonData.text1.lastIndexOf(symbol) + 1) + commonData.text2.slice(0, commonData.text2.indexOf(' '));
            publicMethod.isMatchExistingObj(searchedText, commonData.publicModel.curLevelList, type, type1);
            if (commonData.matchExistingObj[type1 + '_id']) {
                originalSelected = false;
                for (var i = 0; i < content_objs.length; i++) {
                    if (content_objs[i][type1 + '_name'] == commonData.matchExistingObj[type1 + '_name']) {
                        originalSelected = true;
                        break;
                    }
                }
                if (!originalSelected) {
                    content_objs.push(JSON.parse(JSON.stringify(commonData.matchExistingObj)));
                }
            }
        }
        //获取当前文本框中的对象
        //var text = commonData.publicModel.regular ? (type == commonData.types[0] ? content['desc_forepart'] : content['desc_aftpart']): content[attrName1];
        //var text = content[attrName1];
        var text = commonData.publicModel.addContentWindow ? content['content'] : commonData.publicModel.regular ? content['desc_forepart'] + content['desc_aftpart'] : content['description'];
        var textArr = text ? text.split(symbol) : [];
        if (index == 0) {       //搜索状态输入的字符串
            var searchedText;
            if (!keyword) {
                var endIndex = commonData.text2.indexOf(' ') == -1 ? commonData.text2.length : commonData.text2.indexOf(' ');
                searchedText = commonData.text1.slice(commonData.text1.lastIndexOf('@') + 1) + commonData.text2.slice(0, endIndex);
            } else {        //空格结束输入
                searchedText = keyword;
            }
        }
        var objArr = [];
        var i = !text || text.length && text[0] == symbol ? 0 : 1;      //第一项可能为非@的情况
        var count = 0;
        for (i; i < textArr.length; i++) {
            if (textArr[i]) {
                var endIndex = textArr[i].indexOf(' ') == -1 ? textArr[i].length : textArr[i].indexOf(' ');
                var obj_name = textArr[i].slice(0, endIndex);
                if (index == 0 && obj_name == searchedText) {       //[1]:去除搜索状态下输入的字符串匹配了当前的对象，同时排除已选择了当前输入的字符串对象
                    count++;
                } else {
                    objArr.push(obj_name);
                }
            }
        }
        if (count > 1 || obj && count == 1) {       //[1]，[2]:输入空格匹配到搜索结果中的对象
            objArr.push(searchedText);
        }

        var content_objsCopy = content_objs ? JSON.parse(JSON.stringify(content_objs)) : [];

        if (content_objs) {
            for (var i = 0; i < content_objs.length; i++) {
                var deleted = true;
                for (var j = 0; j < objArr.length; j++) {

                    if (content_objs[i][type1 + '_name'] == objArr[j]) {
                        deleted = false;
                        break;
                    }
                }
                if (deleted) {
                    content_objs[i].toDeleted = true;
                    //content_objs.splice(i, 1);
                    //content_objs2.splice(i, 1);
                }
            }

            for (var i = 0; i < content_objs.length; i++) {
                if (content_objs[i].toDeleted) {
                    content_objs.splice(i, 1);
                    i = -1;
                }
            }
        }

        for (var i = 0; i < objArr.length; i++) {
            originalSelected = false;
            for (var j = 0; j < content_objsCopy.length; j++) {
                if (objArr[i] == content_objsCopy[j][type1 + '_name']) {
                    originalSelected = true;
                    break;
                }
            }
            if (!originalSelected/* && (index !== 0 || obj_name !== searchedText)*/) {      //20171028：注释了下面的处理
                //var tempObj = {};
                //tempObj[type1 + '_name'] = objArr[i];
                //tempObj['obj_type'] = "other";
                //content_objs.push(tempObj);
            }
        }

        if (type == commonData.types[0] || type == commonData.types[1]) {
            commonData.publicModel.allMatters[commonData.curMatterIndex][attrName2] = content_objs;
        }
        //console.log('2、allMatters: ' + JSON.stringify(commonData.publicModel.allMatters));

        if (obj) {      //没有弹框，直接输入空格匹配到的是搜索结果中的对象
            for (var i = 0; i < content_objs.length; i++) {
                if (content_objs[i].obj_name == obj.obj_name) {
                    content_objs[i] = JSON.parse(JSON.stringify(obj));
                    break;
                }
            }
            $(".aite-bubble").hide();

            //判断匹配的对象是否存在于已有的对象中
            if (count > 1) {     //'@设备1 @设备1 ' 去除添加的'@设备1 '     //true: 已更新数据
                var text1 = commonData.text1;
                commonData.text1 = text1.slice(0, text1.lastIndexOf('@'));
                content[attrName1] = commonData.text1 + commonData.text2;
                setTimeout(function () {
                    publicMethod.setCaretPosition(commonData.editingJqTextwrap[0], commonData.text1.length);
                }, 0);
            }
            commonData.final_result = count > 1 ? '' : keyword;
            publicMethod.saveObjOrSopSel(symbol);
        }
        //去除content_objs中重复的对象[暂用，待验证空格结束自定义对象是否重复]
        var updateArr = [];
        for (var i = 0; i < content_objs.length; i++) {
            var repeat = false;
            for (var j = 0; j < updateArr.length; j++) {
                if (content_objs[i][type1 + '_id'] == updateArr[j][type1 + '_id']) {
                    repeat = true;
                    break;
                }
            }
            if (!repeat) {
                updateArr.push(JSON.parse(JSON.stringify(content_objs[i])));
            }
        }
        matterIndex = (matterIndex || matterIndex == 0) ? matterIndex : commonData.curMatterIndex;
        if (type == commonData.types[0] || type == commonData.types[1] || type == commonData.types[2]) {
            commonData.publicModel.allMatters[matterIndex][attrName2] = updateArr;
        } else {
            if (!commonData.publicModel.workContent) commonData.publicModel.workContent = {};
            commonData.publicModel.workContent[attrName2] = updateArr;
        }
        publicMethod.markInitialSelectedObjs(type, type1);
    },

    //更新事项中的所有数据（对象、sop、工作内容）
    updateAllMatters: function () {
        var allMatters = commonData.publicModel.allMatters;
        for (var i = 0; i < allMatters.length; i++) {
            for (var j = 0; j < commonData.types.length; j++) {
                var type = commonData.types[j];
                var type1 = type == commonData.types[1] ? type : commonData.types[0];
                publicMethod.updateObjs(null, null, type, type1, null, i);
            }
        }
    },

    //确认自定义对象
    confirmCustomizeObj: function (model, event) {
        var value;
        /*
         if (commonData.publicModel.addContentWindow) {
         if (!commonData.publicModel.noPop) {
         value = $($(commonData.editingJqTextwrap.parents(".slide-div").find(".customText")[1]).find('input')).val();
         } else {
         value = $($(commonData.editingJqTextwrap.parents(".slide-div").find(".customText")[0]).find('input')).val();
         }
         } else {
         */
        if (commonData.publicModel.inputToCustomize) {
            value = commonData.text1.slice(commonData.text1.lastIndexOf('@') + 1) + commonData.text2.slice(0, commonData.text2.indexOf(' '));
        } else {
            value = commonData.curJqPop.find('input').val();
        }

        /*
         }
         */
        value = publicMethod.limitString(value);
        $(event.target).parents(".aite-bubble").find(".customText").children("div").pval(value);
        var verify = $(event.target).parents(".aite-bubble").find(".customText").children("div").pverifi();
        if (!commonData.publicModel.selectedObjType) {
            commonData.publicModel.aiteTips = "请选择所属类别！";
            return;
        } else {
            commonData.publicModel.aiteTips = "";
        }
        /*
         if (!commonData.publicModel.inputToCustomize && !verify) {
         return;
         }
         if (value && value.replace(/\s+/g, '') && value.length <= 40) {
         */
        if (commonData.publicModel.inputToCustomize || verify) {
            if (commonData.publicModel.addContentWindow) {
                var length = commonData.publicModel.workContent.content.length + value.length;
                if (length > 200) {
                    return false;
                }
            } else {
                if (!commonData.publicModel.regular) {
                    var len1 = model.description.length + value.length;
                    if (len1 > 999) {
                        return false;
                    }
                } else {
                    var len2 = model.desc_forepart.length + model.desc_aftpart.length + value.length;
                    if (len2 > 999) {
                        return false;
                    }
                }
            }
            var obj = {
                obj_type: commonData.publicModel.selectedObjType,
                obj_name: value
            }
            var type = commonData.publicModel.addContentWindow ? commonData.types[3] : commonData.types[0];
            myWorkOrderController.existTempObject(obj, true, null, type, function () {
                myWorkOrderController.addTempObjectWithType(obj, true, null, type);
            });
        }
    },

    //成功添加自定义对象后的处理
    //@params: isConfirmCustomizeObj是否为点击确定按钮，确认自定义对象，其它可能的情况：删除已有对象某些字符时自定义、@后输入字符空格结束自定义
    addedTempObjectWithType: function (obj, isConfirmCustomizeObj, isShowPop, type) {
        commonData.custom_result = obj.obj_name;
        if (isConfirmCustomizeObj) {
            var contentData = publicMethod.getContentData(type);
            var attrName1 = contentData.attrName1;
            var attrName2 = contentData.attrName2;
            var content = contentData.content;
            var content_objs = contentData.content_objs;
            var objType = obj.obj_type;
            var type = objType == '2' ? 'component' : objType == '3' ? 'tool' : 'other';

            //自定义对象时，数据已经更新至content.content_objs，此处用于其它地方的容错处理
            var addObj = true;
            if (content_objs) {
                for (var i = 0; i < content_objs.length; i++) {
                    if (content_objs[i].obj_name == obj.obj_name && /*!content_objs[i].obj_id*/content_objs[i].isCustomized) {      //To Confirm
                        content_objs[i].obj_type = type;
                        addObj = false;
                        break;
                    }
                }
            }
            if (addObj) {
                content_objs/* = commonData.otherSelectedObjs*/.push({
                    obj_type: type,
                    obj_name: obj.obj_name,
                    obj_id: obj.obj_id,
                    isCustomized: obj.isCustomized
                });
                console.log("添加一个自定义对象");
            }

            //自定义对象与信息点对象联动
            if (!content.confirm_result) content.confirm_result = [];
            var addInfoPointObj = true;
            for (var i = 0; i < content.confirm_result.length; i++) {
                if (content.confirm_result[i].obj_id == obj.obj_id) {
                    addInfoPointObj = false;
                    break;
                }
            }
            if (addInfoPointObj && (type == 'other' || type == 'component')) {
                content.confirm_result.push({
                    obj_type: type,
                    obj_name: obj.obj_name,
                    obj_id: obj.obj_id,
                    info_points: [],
                    customs: []
                });
                if ($('.contentResult').find('.edit-div').is(':visible')) {
                    $('.contentResult').find('.edit-div').hide();
                    $('.contentResult').find('.clear-div').show();
                }
            }

            $('.confirmSlideBody').show();

            //设置数据content.content
            var spaceOrNoSpaceChar = commonData.text2.length && commonData.text2[0] == ' ' ? '' : ' ';
            commonData.text1 = commonData.text1.slice(0, commonData.text1.lastIndexOf('@')) + '@' + obj.obj_name + spaceOrNoSpaceChar;
            content[attrName1] = commonData.text1 + commonData.text2.slice(commonData.text2.indexOf(' '));
            setTimeout(function () {
                publicMethod.setCaretPosition(commonData.editingJqTextwrap[0], commonData.text1.length);
            }, 0);
            commonData.custom_result = obj.obj_name;
            commonData.final_result = obj.obj_name;
        }

        publicMethod.hideCurPop('@');
    },

    //获取文本框相关数据
    getContentData: function (type, matterIndex) {
        var types = commonData.types;
        var attrName1 = type == types[0] || type == types[1] || type == types[2] ? commonData.textAttrName : 'content';
        var attrName2 = type == types[0] ? 'desc_objs' : type == types[1] ? 'desc_sops' : type == types[2] ? 'desc_works' : 'content_objs';
        var content = publicMethod.getCurDataObj(type, matterIndex);
        if (!content[attrName2]) content[attrName2] = [];
        var content_objs = content[attrName2];
        return {content: content, content_objs: content_objs, attrName1: attrName1, attrName2: attrName2};
    },

    //获取当前文本框中操作的数据对象
    getCurDataObj: function (type, index) {
        var matterIndex = (index || index == 0) ? index : commonData.curMatterIndex;
        if (type == commonData.types[0] || type == commonData.types[1] || type == commonData.types[2]) {
            if (!commonData.publicModel.allMatters[matterIndex]) {
                commonData.publicModel.allMatters[matterIndex] = {     //空的事项
                    //"matter_name": "未命名事项-" + (commonData.publicModel.allMatters.length + 1),
                    "description": "",
                    "desc_forepart": "",
                    "desc_aftpart": "",
                    "desc_photos": [],
                    "desc_objs": [],
                    "desc_sops": [],
                    "desc_works": [],
                    "required_control": [],
                    "onlyCustomizedObjs": true,
                    "unMatchedSopList": [],
                    "invalidObjList": [],
                    "invalidSopList": [],
                    "ignoredErrArr": []
                };
            }
            return commonData.publicModel.allMatters[matterIndex];
        } else {
            if (!commonData.publicModel.workContent) commonData.publicModel.workContent = {};
            return commonData.publicModel.workContent;
        }
    },

    //获取当前步骤中的当前工作内容
    getCurMatter: function () {     //To Replaced By getCurDataObj
        return commonData.publicModel.allMatters[commonData.curMatterIndex];
    },

    //获取当前步骤中的当前工作内容
    getCurContent: function () {     //To Replaced By getCurDataObj
        return commonData.publicModel.curContent ? commonData.publicModel.curContent : {};
    },

    //判断输入的对象是否能匹配搜索结果列表中的某个对象
    isMatchExistingObj: function (keyword, data, type, type1) {
        commonData.matchExistingObj = {};
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (keyword == item[type1 + '_name']) {
                //item.checked = true;
                commonData.matchExistingObj = item;
                break;
            }
        }
        //如果能匹配搜索结果列表中的某个对象，则将该对象推入content.content_objs中
        if (commonData.matchExistingObj[type1 + '_id']) {
            var contentData = publicMethod.getContentData(type);
            var content_objs = contentData.content_objs;
            content_objs.push(JSON.parse(JSON.stringify(commonData.matchExistingObj)));
        }
    },

    //标记初始已选的对象
    markInitialSelectedObjs: function (type) {
        var contentData = publicMethod.getContentData(type);
        var attrName1 = contentData.attrName1;
        var attrName2 = contentData.attrName2;
        var content = contentData.content;
        var content_objs = contentData.content_objs;
        if (type == commonData.types[0]) {
            var onlyCustomizedObjs = true;
            for (var i = 0; i < content_objs.length; i++) {
                //if (/*content_objs[i].obj_id*/!content_objs[i].isCustomized) {
                if (content_objs[i].obj_type !== 'other' && content_objs[i].obj_type !== 'tool' && content_objs[i].obj_type !== 'component') {
                    onlyCustomizedObjs = false;
                    break;
                }
            }
            content.onlyCustomizedObjs = onlyCustomizedObjs;
        }
        for (var i = 0; i < content_objs.length; i++) {
            content_objs[i].initialChecked = true;
        }

        if (type == commonData.types[0] || type == commonData.types[1]) {
            commonData.publicModel.allMatters = JSON.parse(JSON.stringify(commonData.publicModel.allMatters));
        }

        //console.log('3、allMatters: ' + JSON.stringify(commonData.publicModel.allMatters));
    },

    //判断是否是已选对象
    isSelectedObj: function (model, type) {
        //var content = publicMethod.getCurMatter();
        var contentData = publicMethod.getContentData(type);
        var type1 = type == commonData.types[1] ? type : commonData.types[0];
        var content_objs = contentData.content_objs;
        var showTextAite = $(".operate .textarea-prop").css("display");
        var showAite = $(".obj-fragment-div .aite-bubble").css("display");

        if (commonData.publicModel.addContentWindow && type == "content") {
            if (showTextAite == "block" || showAite == "block") {
                type = "obj";
            }
        }
        for (var i = 0; i < commonData.publicModel.curLevelList.length; i++) {
            var item = commonData.publicModel.curLevelList[i];
            var isSelectedObj = false;
            //if (content.content_objs) {
            for (var j = 0; j < /*content.*/content_objs.length; j++) {
                if (item[type1 + '_id'] == /*content.*/content_objs[j][type1 + '_id']) {
                    isSelectedObj = true;
                    break;
                }
            }
            //}
            if (isSelectedObj) {
                item.checked = true;
            }
        }
        if (model) model.notFirstClick = true;
        commonData.publicModel.curLevelList = JSON.parse(JSON.stringify(commonData.publicModel.curLevelList));
    },

    //查询可供选择的sop前的参数处理
    toQuerySopListForSel: function (isInit, searchedText, notReturnCriteria, moveToBeforeSpace, hashtype) {
        //if (isInit) $('#delaySearch input').val('');      //To Modify
        var obj = {
            need_return_criteria: /*!notReturnCriteria*/true
        };
        if (searchedText) obj.sop_name = searchedText;
        if (!isInit) {
            if (commonData.selectedBrands.length) obj.brands = commonData.selectedBrands;
            if (commonData.selectedOrder_type.length) obj.order_type = commonData.selectedOrder_type;
            if (commonData.selectedFit_objs.length) obj.fit_obj_ids = commonData.selectedFit_objs;
            if (commonData.selectedLabels.length) obj.labels = commonData.selectedLabels;
        }
        myWorkOrderController.querySopListForSel(obj, null, moveToBeforeSpace, hashtype);
        //method_yn.scrollLoad();       //To Add
    },

    //确认选择SOP
    confirmCheckSops: function () {
        publicMethod.confirmCheckedObjs(commonData.types[1]);
    },

    //比较方法，用于排序
    compare: function (property) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    },

    //初始化供选择的sop的模态框
    initSopModal: function () {
        var index0 = commonData.textAttrName == 'description' ? 0 : commonData.textAttrName == 'desc_forepart' ? 1 : 2;
        var jqProp = $(".hashtag-bubble").eq(commonData.curMatterIndex * 3 + index0);
        jqProp.find('.hashtag-sop').find('.sop-header-btn').children(':first').show().next().hide();
        jqProp.find('.hashtag-filter').hide();
        publicMethod.selAllTags(true);
        commonData.firstSetMore = true;
    },

    //选中所有"全部"标签locationPop
    selAllTags: function (notQuerySopList, hashtype) {
        var obj = {
            //sop_id: '',     //当sop修订中时选择引用sop时必须传，其它情况不传
            need_return_criteria: true
        };
        //method_yn.scrollLoad();       //To Add

        if (notQuerySopList) {
            $('.sel-all').addClass('sel-span');
            publicMethod.toggleSameClassCriterias(commonData.publicModel.sopCriteria.brandsArr, 'selectedBrands', false);
            publicMethod.toggleSameClassCriterias(commonData.publicModel.sopCriteria.order_type, 'selectedOrder_type', false, 'code');
            publicMethod.toggleSameClassCriterias(commonData.publicModel.sopCriteria.fit_objs, 'selectedFit_objs', false, 'obj_id');
            publicMethod.toggleSameClassCriterias(commonData.publicModel.sopCriteria.labelsArr, 'selectedLabels', false);
        } else {
            myWorkOrderController.querySopListForSel(obj, true, null, hashtype);
        }
    },

    //隐藏'收起'，显示'更多'
    hideCollapseBtns: function () {
        /*
         $(".filter-select").each(function () {
         var a_boxWidth = $(this).width();
         var a_allWidth = $(this).find(".a-box").width();
         if (a_allWidth >= a_boxWidth) {
         $(this).next().find(".more").css("display", "block");
         $(this).find(".a-box").css({"position": "relative", "height": "34px", "overflow": "hidden"});
         } else {
         $(this).next().find(".more").css("display", "none");
         }
         $(this).next().find(".collapse").css("display", "none");
         });
         */
    },

    //添加工作内容名称
    addWorkContentName: function () {
        commonData.publicModel.work_c = false;
        var contentData = publicMethod.getContentData(commonData.types[2]);
        var attrName1 = contentData.attrName1;
        var attrName2 = contentData.attrName2;
        var content = contentData.content;
        var content_objs = contentData.content_objs;
        var desc_work = commonData.publicModel.workContent || {};
        // content[attrName1] = content[attrName1] + (desc_work.work_name || '') + ' ';
        var str = content[attrName1].length && content[attrName1][0] != ' ' ? ' ' : '';
        if (desc_work.work_name != "") {
            content[attrName1] = (content[attrName1] || '') + str + (desc_work.work_name || '') + ' ';
        } else {
            content[attrName1] = content[attrName1] + str + (desc_work.work_name || '') + ' ';
        }
        content["desc_works"].push(desc_work);
        commonData.publicModel.allMatters = JSON.parse(JSON.stringify(commonData.publicModel.allMatters));
        setTimeout(function () {
            if (commonData.jqMatterTextwrap) {
                commonData.jqMatterTextwrap.focus();
            } else {
                if (commonData.publicModel.regular) {
                    $(".regular-text-div").find('textarea').eq(commonData.curMatterIndex * 2 + 1).focus();
                } else {
                    $('.matter-freedom').find('textarea').eq(commonData.curMatterIndex).focus();
                }
            }
        }, 0);
    },

    //处理事项参数
    dealMattersParam: function () {
        //判断工作内容名称是否被删除
        for (var i = 0; i < commonData.publicModel.allMatters.length; i++) {
            var matter = commonData.publicModel.allMatters[i];
            var text = matter[commonData.textAttrName];
            var textArr = text ? text.split(' ') : [];

            var desc_worksCopy = [];
            if (!matter.desc_works) matter.desc_works = [];
            for (var j = 0; j < matter.desc_works.length; j++) {
                var deleted = true;
                for (var k = 0; k < textArr.length; k++) {
                    if (textArr[k] == matter.desc_works[j].work_name) {
                        deleted = false;
                        break;
                    }
                }
                if (!deleted) desc_worksCopy.push(matter.desc_works[j]);
            }
            matter.desc_works = JSON.parse(JSON.stringify(desc_worksCopy));
        }
    },

    //处理工单参数addContent
    dealWorkOrderParam: function () {
        if (commonData.publicModel.workOrderDraft.ask_start_time != "发单后立即开始") {
            commonData.publicModel.workOrderDraft.ask_start_time = commonData.publicModel.workOrderDraft.ask_start_time ? commonData.publicModel.workOrderDraft.ask_start_time.replace(/[^0-9]/g, '') + '00' : '';
        }
        commonData.publicModel.workOrderDraft.ask_end_time = commonData.publicModel.workOrderDraft.ask_end_time ? commonData.publicModel.workOrderDraft.ask_end_time.replace(/[^0-9]/g, '') + '00' : '';
        commonData.publicModel.workOrderDraft.input_mode = commonData.publicModel.regular ? '2' : '1';
        commonData.publicModel.workOrderDraft.matters = JSON.parse(JSON.stringify(commonData.publicModel.allMatters));
    },

    //删除事项中的图片
    deleteMatterPhoto: function (model, indexPhoto) {
        model.desc_photos.splice(indexPhoto, 1);
    },

    timeVerifyLast: function () {
        var index = parseInt($("#time-combobox").psel().index);
        if (index == 1) {//自定义开始时间
            var nowTime = new Date().getTime();
            var start_time = $("#ask_start_time").psel().startTime;
            var start = new Date(start_time).getTime();
            if (start >= nowTime) {
                commonData.publicModel.s_n = false;
                $("#ask_start_time").find(".per-combobox-title").css({
                    "border": "1px solid #cacaca"
                });
            } else {
                commonData.publicModel.s_n = true;
                $("#ask_start_time").find(".per-combobox-title").css({
                    "border": "1px solid #ed6767"
                });
            }
            if ($("#ask-radio").psel()) {//自定义结束时间也存在
                var ask_end_time = $("#ask_end_time").psel().startTime;
                var end_time = new Date(ask_end_time).getTime();
                if (end_time >= nowTime && end_time >= start) {
                    commonData.publicModel.s_e = false;
                    $("#ask_end_time").find(".per-combobox-title").css({
                        "border": "1px solid #cacaca"
                    });
                } else {
                    commonData.publicModel.s_e = true;
                    $("#ask_end_time").find(".per-combobox-title").css({
                        "border": "1px solid #ed6767"
                    });
                }
            } else {//固定时间
                yn_method.askLimit(null, $("#ask_end_limit").val());
            }
        } else {//发单后立即开始
            if ($("#ask-radio").psel()) {//要求结束时间
                /*if(index == 1){
                 var nowTime2 = new Date().getTime();
                 var start_time2 = $("#ask_start_time").psel().startTime;
                 var start2 = new Date(start_time2).getTime();
                 if (start2 >= nowTime2) {
                 commonData.publicModel.s_n = false;
                 }else{
                 commonData.publicModel.s_n = true;
                 }
                 }*/
                var nowTime2 = new Date().getTime();
                var ask_end_time2 = $("#ask_end_time").psel().startTime;
                var end2 = new Date(ask_end_time2).getTime();
                if (end2 >= nowTime2) {
                    commonData.publicModel.s_e = false;
                    $("#ask_end_time").find(".per-combobox-title").css({
                        "border": "1px solid #cacaca"
                    });
                } else {
                    commonData.publicModel.s_e = true;
                    $("#ask_end_time").find(".per-combobox-title").css({
                        "border": "1px solid #ef6767"
                    });
                }
            } else {//固定时间
                yn_method.askLimit(null, $("#ask_end_limit").val());
            }
        }


    },
    //验证事项数据
    verifyMatters: function (call) {
        commonData.isValid = true;
        publicMethod.timeVerifyLast();
        if (commonData.notPlanPage) {
            if (!commonData.publicModel.workOrderDraft.order_type_name) {
                commonData.publicModel.workTypecError = "请选择工单类型！";
                commonData.isValid = false;
            } else {
                commonData.publicModel.workTypecError = "";
            }
            if (!commonData.publicModel.timeTypeSel) {
                if (commonData.publicModel.s_n) {
                    commonData.isValid = false;
                }
            }
            if (!commonData.publicModel.fixedRadio) {
                if (commonData.publicModel.s_e) {
                    commonData.isValid = false;
                }
            } else {
                if (commonData.publicModel.fixlimit) {
                    commonData.isValid = false;
                }
            }
        }
        var allMatters = commonData.publicModel.allMatters;
        var len = allMatters.length;

        if (!len) {
            $('#globalnotice').pshow({text: '请添加工作事项！', state: 'failure'});
            commonData.isValid = false;
        }

        //事项名称是否为空
        for (var i = 0; i < len; i++) {
            var matter = allMatters[i];
            if (!matter.matter_name) {
                matter.matterNameEmpty = true;
                commonData.isValid = false;
            } else {
                matter.matterNameEmpty = false;
            }
        }

        //事项名称是否重复
        for (var i = len - 1; i >= 0; i--) {
            var matter1 = allMatters[i];
            var matterNameRepeat = false;
            if (matter1.matter_name) {
                for (var j = i - 1; j >= 0; j--) {
                    var matter2 = allMatters[j];
                    if (matter1.matter_name == matter2.matter_name) {
                        matterNameRepeat = true;
                        commonData.isValid = false;
                        break;
                    }
                }
            }

            matter1.matterNameRepeat = matterNameRepeat;
        }
        if (matter.matter_name && matter.matter_name.length > 100) {
            commonData.isValid = false;
        }

        //事项内容是否为空
        for (var i = 0; i < len; i++) {
            var matter = allMatters[i];
            var text = !commonData.publicModel.regular ? matter.description : matter.desc_forepart + matter.desc_aftpart;
            if (!text || !text.replace(/\s+/g, '')) {
                matter.matterContentEmpty = true;
                commonData.isValid = false;
            } else {
                matter.matterContentEmpty = false;
            }
            if (text.length > 1000) {
                commonData.isValid = false;
            }
        }

        //commonData.publicModel.allMatters = JSON.parse(JSON.stringify(commonData.publicModel.allMatters));

        $('#globalloading').pshow();
        //输入的SOP是否有效（SOP不可以自定义，空格结束输入、删除SOP名称中的字符失焦都可能产生无效SOP）
        pajax.post({
            url: 'restSopService/querySopListForSel',
            data: {need_return_criteria: false},
            success: function (result) {
                var sopList = result && result.content ? result.content : [];
                for (var i = 0; i < allMatters.length; i++) {
                    var matter = allMatters[i];
                    matter.invalidSopList = [];
                    matter.desc_sops = [];     //1、添加的无效的SOP需要删除 2、特殊情况：开始添加的SOP无效，到点击下一步的时差中添加了一个同名的SOP，变为有效
                    var text = commonData.publicModel.regular ? matter.desc_forepart + ' ' + matter.desc_aftpart : matter.description;
                    var textArr = text ? text.split('#') : [];
                    var arr = [];
                    var j = !text || text.length && text[0] == '#' ? 0 : 1;      //第一项可能为非@的情况
                    for (j; j < textArr.length; j++) {
                        if (textArr[j]) {
                            var name = textArr[j].slice(0, textArr[j].indexOf(' '));
                            arr.push(name);
                        }
                    }
                    for (var j = 0; j < arr.length; j++) {
                        if (arr[j]) {
                            var invalid = true;
                            for (var k = 0; k < sopList.length; k++) {
                                if (arr[j] == sopList[k].sop_name) {
                                    matter.desc_sops.push(sopList[k]);
                                    invalid = false;
                                    break;
                                }
                            }
                            if (invalid) {
                                commonData.isValid = false;
                                matter.invalidSopList.push({name: arr[j]});
                            }
                        }
                    }
                }

                $('#globalloading').phide();
                //输入的对象和SOP的适用对象是否匹配
                publicMethod.verifyNextMatter(allMatters, -1, call);
            },
            error: function (err) {
            },
            complete: function () {
            }
        });

    },

    //验证下一个事项的对象和SOP
    verifyNextMatter: function (allMatters, index, call) {
        if (++index <= allMatters.length - 1) {
            var sop_ids = [];
            for (var j = 0; j < allMatters[index].desc_sops.length; j++) {
                sop_ids.push(allMatters[index].desc_sops[j].sop_id);
            }
            if (allMatters[index].desc_objs.length && sop_ids.length) {
                var paramObj = {
                    objs: allMatters[index].desc_objs,
                    sop_ids: sop_ids
                }
                myWorkOrderController.verifyObjectAndSop(allMatters, paramObj, index, call);
            } else {
                allMatters[index].unMatchedSopList = [];
                publicMethod.verifyNextMatter(allMatters, index, call);
            }
        } else {
            //结束验证
            publicMethod.verifiedMattersNext(call);
        }
    },

    //结束事项验证后的处理
    verifiedMattersNext: function (call) {
        commonData.publicModel.allMatters = JSON.parse(JSON.stringify(commonData.publicModel.allMatters));
        publicMethod.setTextPropertyValue(!commonData.publicModel.regular);        //其中会首先处理事项参数
        var allMatters = commonData.publicModel.allMatters;
        //[补充]验证工单事项是否存在已作废的对象
        pajax.post({
            url: 'restWorkOrderService/verifyObjects',
            data: {
                matters: allMatters
            },
            success: function (result) {
                var data = result && result.data ? result.data : [];
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        allMatters[i].invalidObjList = [];
                        if (commonData.isValid && data[i].length) commonData.isValid = false;
                        for (var j = 0; j < data[i].length; j++) {
                            allMatters[i].invalidObjList.push({name: data[i][j].obj_name, obj_id: data[i][j].obj_id});
                        }
                    }
                }
                if (commonData.isValid) {
                    if (typeof call == 'function') {
                        call();
                    } else {
                        publicMethod.dealWorkOrderParam();      //To Delete
                        if (commonData.saveDraftOrPreview == 1) {
                            myWorkOrderController.saveDraftWorkOrder(commonData.publicModel.workOrderDraft);
                        } else {
                            myWorkOrderController.previewWorkOrder(commonData.publicModel.workOrderDraft);
                        }
                    }
                } else {
                    $('#globalnotice').pshow({text: '请完善工单！', state: 'failure'});
                }
            },
            error: function (err) {
            },
            complete: function () {
            }
        });

        /*
         if (commonData.isValid) {
         publicMethod.setTextPropertyValue(!commonData.publicModel.regular);        //其中会首先处理事项参数
         if (typeof call == 'function') {
         call();
         } else {
         publicMethod.dealWorkOrderParam();      //To Delete
         if (commonData.saveDraftOrPreview == 1) {
         myWorkOrderController.saveDraftWorkOrder(commonData.publicModel.workOrderDraft);
         } else {
         myWorkOrderController.previewWorkOrder(commonData.publicModel.workOrderDraft);
         }
         }
         } else {
         $('#globalnotice').pshow({text: '请完善工单！', state: 'failure'});
         }
         */
    },

    //保存工单草稿
    toSaveWorkOrderDraft: function () {
        publicMethod.getLeftDataAgain();
        //publicMethod.updateAllMatters();
        //if (!commonData.publicModel.s_e && !commonData.publicModel.s_n && commonData.publicModel.workOrderDraft.order_type_name) {
        /*if (!commonData.publicModel.workOrderDraft.order_type_name) {
         commonData.publicModel.workTypecError = "请选择工单类型！";
         commonData.isValid = false;
         } else {
         commonData.publicModel.workTypecError = "";
         }
         if (!commonData.publicModel.timeTypeSel) {
         if (commonData.publicModel.s_n) {
         commonData.isValid = false;
         }
         }
         if (!commonData.publicModel.fixedRadio) {
         if (commonData.publicModel.s_e) {
         commonData.isValid = false;
         }
         }*/
        commonData.saveDraftOrPreview = 1;
        commonData.notPlanPage = true;
        //publicMethod.verifyMatters();
        publicMethod.dealWorkOrderParam();
        myWorkOrderController.saveDraftWorkOrder(commonData.publicModel.workOrderDraft);

        //}
    },

    //预览工单草稿
    toPreviewWorkOrder: function () {
        publicMethod.clickSpaceHidePop();
        if (commonData.clickInputMode) {
            myWorkOrderController.saveWoInputMode();
        }
        publicMethod.getLeftDataAgain();
        //publicMethod.updateAllMatters();
        /*if (!commonData.publicModel.workOrderDraft.order_type_name) {
         commonData.publicModel.workTypecError = "请选择工单类型！";
         commonData.isValid = false;
         } else {
         commonData.publicModel.workTypecError = "";
         }
         if (!commonData.publicModel.timeTypeSel) {
         if (commonData.publicModel.s_n) {
         commonData.isValid = false;
         }
         }
         if (!commonData.publicModel.fixedRadio) {
         if (commonData.publicModel.s_e) {
         commonData.isValid = false;
         }
         }*/
        //if (!commonData.publicModel.s_e && !commonData.publicModel.s_n) {

        commonData.saveDraftOrPreview = 2;
        commonData.notPlanPage = true;
        publicMethod.verifyMatters();
        //}
    },
    //已发布的工单
    publishedWorkOrder: function (model, index) {
        commonData.publicModel.workListSave = commonData.publicModel.workList;
        myWorkOrderController.queryWorkOrderById(model.order_id)
        commonData.publicModel.workList = commonData.publicModel.workListSave;
    },
    //添加事项
    addMatter: function () {
        var emptyMatter = {     //空的事项
            //"matter_name": "未命名事项-" + (commonData.publicModel.allMatters.length + 1),
            "description": "",
            "desc_forepart": "",
            "desc_aftpart": "",
            "desc_photos": [],
            "desc_objs": [],
            "desc_sops": [],
            "desc_works": [],
            "required_control": [],
            "onlyCustomizedObjs": true,
            "unMatchedSopList": [],
            "invalidObjList": [],
            "invalidSopList": [],
            "ignoredErrArr": []
        };
        commonData.publicModel.allMatters.push(emptyMatter);
    },

    //切换输入模式
    toggleInputMode: function () {
        commonData.clickInputMode = true;
        publicMethod.clickSpaceHidePop();
        commonData.publicModel.regular = !commonData.publicModel.regular;
        publicMethod.setTextPropertyValue(commonData.publicModel.regular);
        myWorkOrderController.saveUserWoInputMode();
    },

    //设置文本属性(description, desc_forepart, desc_aftpart)值
    setTextPropertyValue: function (toRegular) {
        publicMethod.dealMattersParam();
        var allMatters = commonData.publicModel.allMatters;
        if (toRegular) {     //结构化
            for (var i = 0; i < allMatters.length; i++) {
                var matter = allMatters[i];
                var desc_aftpart = matter.description;
                var symbol = '@';
                //var contentData = publicMethod.getContentData(commonData.types[0]);
                //var attrName1 = contentData.attrName1;
                //var content = contentData.content;

                //获取当前文本框中的对象
                var text = matter.description;
                var textArr = text ? text.split(symbol) : [];
                var objArr = [];
                var j = !text || text.length && text[0] == symbol ? 0 : 1;      //第一项可能为非@的情况
                for (j; j < textArr.length; j++) {
                    if (textArr[j]) {
                        var obj_name = symbol + textArr[j].slice(0, textArr[j].indexOf(' '));
                        objArr.push(obj_name);
                    }
                }
                console.log(JSON.stringify(objArr));

                var desc_forepart = '';
                for (var j = 0; j < objArr.length; j++) {
                    desc_forepart += objArr[j] + ' ';
                    desc_aftpart = desc_aftpart.replace(objArr[j] + ' ', '');
                }
                matter.desc_forepart = desc_forepart;
                matter.desc_aftpart = desc_aftpart;
            }
        } else {
            commonData.textAttrName = 'description';
            for (var i = 0; i < allMatters.length; i++) {
                var matter = allMatters[i];
                matter.description = matter.desc_forepart + matter.desc_aftpart;
            }
        }
        commonData.publicModel.allMatters = JSON.parse(JSON.stringify(commonData.publicModel.allMatters));
    },

    //设置管控需求
    setMattersControlRequire: function (model, event, index0, controlRequireIndex) {
        event.stopPropagation();
        commonData.curMatterIndex = index0;
        var initialChecked = $(event.currentTarget).children().eq(1).hasClass('pcheckbox-checked');
        var matter = commonData.publicModel.allMatters[commonData.curMatterIndex];
        if (!initialChecked) {
            if (!matter.required_control) matter.required_control = [];
            matter.required_control.push(model.code);
        } else {
            for (var i = 0; i < matter.required_control.length; i++) {
                if (matter.required_control[i] == model.code) {
                    matter.required_control.splice(i, 1);
                    break;
                }
            }
        }
    },

    //是否勾选扫码
    isCheckedScan: function (model) {
        return model.required_control.indexOf('obj_first_sign') > -1;
    },

    //设置管控需求复选框状态
    setControlRequireStatus: function (index0, controlRequireIndex) {
        var isAble = false;
        var requireControlList = commonData.publicModel.allMatters[index0].required_control;
        for (var i = 0; i < requireControlList.length; i++) {
            if (requireControlList[i] == frameModel.controlRequireList[controlRequireIndex].code) {
                isAble = true;
                break;
            }
        }
        return isAble;
    },

    //是否able管控需求
    isDisableControlRequire: function (controlRequire, index0, controlRequireIndex) {
        var matter = commonData.publicModel.allMatters[index0];
        var result = controlRequire.code == 'obj_first_photo' && (!matter.desc_objs || !matter.desc_objs.length) || controlRequire.code == 'obj_first_sign' && (!matter.desc_objs || !matter.desc_objs.length || matter.onlyCustomizedObjs);
        if (result && matter.required_control.indexOf(controlRequire.code) > -1) {
            matter.required_control.splice(matter.required_control.indexOf(controlRequire.code), 1);
        }
        return result;
    },

    //是否包含附件
    isIncludeAttachments: function (obj) {
        var include = obj.order_id && obj.matters && obj.matters.length && obj.matters[0].desc_photos && obj.matters[0].desc_photos.length ? true : false;
        if (include) {
            obj.matters[0].attachments = [];
            for (var i = 0; i < obj.matters[0].desc_photos.length; i++) {
                obj.matters[0].attachments.push({
                    path: obj.matters[0].desc_photos[i],
                    toPro: 'desc_photos',
                    multiFile: true,
                    isNewFile: false,
                    fileType: 1
                });
            }
        }
        var requestType;
        if (include) {
            requestType = 'updateWithFile';
        } else {
            requestType = 'post';
        }
        obj.matters[0].desc_photos = [];
        return {obj: obj, requestType: requestType};
    },

    //修改人员
    modifyPerson: function (event) {
        event.stopPropagation();
        // Vue.nextTick(function () {
            $('#choosePersonPosition').find('.choicePersonPosition_con_persion_position').each(function () {
                $(this).show();
                $(this).parent().find('.arrow_icon').text("b");
            });
        // });
        var title = orderDetail_data.goBackFlag =='4' ? '此工单将会发送给' : '此计划的工单将会发送给：';
        $('#choosePersonPosition').pshow({title: title});
        commonData.publicModel.personPositionsCopy = JSON.parse(JSON.stringify(commonData.publicModel.personPositions));
    },

    //处理工单 人员
    dealPositionPersonStr: function (returnStr) {
        var str = '';
        var next_route = commonData.publicModel.personPositions;
        for (var i = 0; i < next_route.length; i++) {
            if (next_route[i].type == '2') {
                if (next_route[i].selected) str += next_route[i].name + '、';
            }
        }
        for (var i = 0; i < next_route.length; i++) {
            if (next_route[i].type == '2') {        //岗位
                for (var j = 0; j < (next_route[i].persons || []).length; j++) {
                    var person = next_route[i].persons[j];
                    if (person.selected) str += person.name + '、';
                }
            } else {        //人员
                if (next_route[i].selected) str += next_route[i].name + '、';
            }
        }
        str = str.slice(0, -1);
        if (str || !returnStr) commonData.publicModel.positionPersonStr = str;
        if (returnStr) return str;
    },

    //选中或取消选中人员或岗位复选框
    togglePersonOrPosition: function (item, firstLevelIndex, type) {
        item.selected = !item.selected;
        if (type == '2') {      //岗位
            item.persons.map(function (person) {
                person.selected = item.selected;
            });
        } else if (type == '3a') {      //岗位下的人员
            var position = commonData.publicModel.personPositions[firstLevelIndex];;
            if (item.selected != position.selected) {
                position.selected = position.persons.reduce(function (result, info) {
                    if (!result) return result;
                    return info.selected;
                }, true);
            }
        }
        commonData.publicModel.personPositions = JSON.parse(JSON.stringify(commonData.publicModel.personPositions));
    },

    //岗位人员列表显示
    personPositionShow: function (e, argu) {
        var $target = $(e.target);
        var $person_position_list = $target.parent().parent().find(".choicePersonPosition_con_persion_position");
        if (!$person_position_list.is(":visible")) {
            $person_position_list.show();
            $target.text("b")
        } else {
            $person_position_list.hide();
            $target.text("r")
        }
    },

    //确认选择人员岗位
    confirmPersonPosition: function () {
        if (publicMethod.dealPositionPersonStr(true)) {
            $("#add_person_position_tishi").hide();
            $("#choosePersonPosition").phide();
        } else {
            $("#add_person_position_tishi").show();
        }
    },

    //取消选择人员岗位
    cancelPersonPosition: function () {
        $("#choosePersonPosition").phide();
        setTimeout(function() {
            $("#add_person_position_tishi").hide();
            commonData.publicModel.personPositions = commonData.publicModel.personPositionsCopy;
        }, 500);
    },

    //获取当前弹窗中工作内容中
    confirmResult: function () {
        return commonData.publicModel.workContent
    },
    //信息点-隐藏当前弹框
    hideCurPop2: function () {
        myWorkOrderController.saveInfoPointSel();
        $(commonData.jqPopDataDivs2).parents('.aite-bubble').hide();
    },
    //删除对象
    deleteObj: function (obj, index, contentIndex) {
        commonData.contentIndex = contentIndex;
        var content = commonData.publicModel.workContent;
        content.confirm_result.splice(index, 1);
        // commonData.publicModel.allSteps[commonData.publicModel.curStepIndex].step_content[commonData.contentIndex].confirm_result.splice(index, 1);
    },
    //自定义信息点 弹框-删除选项
    deleteOption: function (model, index, event, contentIndex) {
        event.stopPropagation();
        commonData.contentIndex = contentIndex;
        if (commonData.publicModel.seltype == 2) {
            if (commonData.publicModel.customItem.items.length > 1) {
                commonData.publicModel.customItem.items.splice(index, 1);
            } else {
                commonData.publicModel.customItem.items = [{name: ''}];
            }
        } else if (commonData.publicModel.seltype == 3) {
            if (commonData.publicModel.customItem.items.length > 2) {
                commonData.publicModel.customItem.items.splice(index, 1);
            }
        }

    },
    //自定义信息点 列表状态-删除选项
    deleteOption2: function (custom, itemIndex, event, contentIndex) {
        event.stopPropagation();
        commonData.contentIndex = contentIndex;
        if (custom.type == 2) {
            if (custom.items.length > 1) {
                custom.items.splice(itemIndex, 1);
            }
        } else if (custom.type == 3) {
            if (custom.items.length > 2) {
                custom.items.splice(itemIndex, 1);
            }
        }
    },
    //删除信息点
    deleteInfoPoint: function (infoPoint, infoPointIndex, objIndex, contentIndex) {
        commonData.contentIndex = contentIndex;
        var content = commonData.publicModel.workContent;
        content.confirm_result[objIndex].info_points.splice(infoPointIndex, 1);
        // commonData.publicModel.allSteps[commonData.publicModel.curStepIndex].step_content[commonData.contentIndex].confirm_result[objIndex].info_points.splice(infoPointIndex, 1);
    },
    //删除自定义的信息点
    deleteCustomizedInfoPoint: function (custom, customIndex, objIndex, contentIndex) {
        commonData.contentIndex = contentIndex;
        var content = commonData.publicModel.workContent;
        content.confirm_result[objIndex].customs.splice(customIndex, 1);
    },
    //点击编辑时，设置页面
    setEditDraft: function () {
        var comyes = false;
        for (var i = 0; i < commonData.publicModel.workTypeC.length; i++) {
            if (commonData.publicModel.workOrderDraft.order_type_name == commonData.publicModel.workTypeC[i].name) {
                $("#work-typec").psel(commonData.publicModel.workOrderDraft.order_type_name, true);
                comyes = true;
                break;
            }
        }
        if (!comyes) {
            $("#work-typec").precover('请选择')
        }
        $("#work-urgency").psel(commonData.publicModel.workOrderDraft.urgency, false);

        //新的开始
        if (commonData.publicModel.workOrderDraft.ask_end_time && commonData.publicModel.workOrderDraft.ask_end_time != "--") {//radio-要求开始和结束
            commonData.publicModel.fixedRadio = false;
            $("#fixed-radio").psel(false, true);//固定-false
            $("#ask-radio").psel(true, true);//要求-true
            $("#ask_end_limit").val("");//固定期限置空
            if (commonData.publicModel.workOrderDraft.start_time_type == 1) {//发单后立即开始
                $("#time-combobox").psel(0, true);
            } else {//自定义开始时间
                $("#time-combobox").psel(1, true);
                var startTime = commonData.publicModel.workOrderDraft.ask_start_time;
                $("#ask_start_time").psel(publicMethod.cutTime(startTime), true)
            }
            var endTime = commonData.publicModel.workOrderDraft.ask_end_time;
            $("#ask_end_time").psel(publicMethod.cutTime(endTime), true);
        } else {//要求固定时间
            commonData.publicModel.fixedRadio = true;
            $("#fixed-radio").psel(true, true);
            $("#ask-radio").psel(false, true);
            if (commonData.publicModel.workOrderDraft.ask_end_limit && commonData.publicModel.workOrderDraft.ask_end_limit != "--") {
                $("#ask_end_limit").val(commonData.publicModel.workOrderDraft.ask_end_limit)
            } else {
                $("#ask_end_limit").val("");
            }
            if (commonData.publicModel.workOrderDraft.start_time_type == 1) {//发单后立即开始
                $("#time-combobox").psel(0, true);
            } else {//自定义开始时间
                $("#time-combobox").psel(1, true);
                var startTime = commonData.publicModel.workOrderDraft.ask_start_time;
                $("#ask_start_time").psel(publicMethod.cutTime(startTime), true)
            }
        }
        //新的结束
        /*if (commonData.publicModel.workOrderDraft.start_time_type != 1) {//自定义开始时间
         commonData.publicModel.fixedRadio = false;
         $("#fixed-radio").psel(false, true)
         $("#ask-radio").psel(true, true)
         $("#ask_end_limit").val("");
         var endTime = commonData.publicModel.workOrderDraft.ask_end_time;
         $("#ask_end_time").psel(publicMethod.cutTime(endTime), true)
         } else {//发单后立即开始
         commonData.publicModel.fixedRadio = true;
         $("#fixed-radio").psel(true, true)
         $("#ask-radio").psel(false, true)
         if (commonData.publicModel.workOrderDraft.ask_end_limit != "--") {
         $("#ask_end_limit").val(commonData.publicModel.workOrderDraft.ask_end_limit)
         } else {
         $("#ask_end_limit").val("");
         }
         }
         if (commonData.publicModel.workOrderDraft.start_time_type == 1) {
         $("#time-combobox").psel(0, true);
         } else {
         $("#time-combobox").psel(1, true);
         var startTime = commonData.publicModel.workOrderDraft.ask_start_time;
         $("#ask_start_time").psel(publicMethod.cutTime(startTime), true)
         }*/
        commonData.publicModel.LorC = false;
        //旧的结束
    },
    //分割时间
    cutTime: function (time) {
        //{y:2017,M:1,d:1,h:0,m:0}
        var timeObj = {};
        timeObj.y = time.substring(0, 4);
        timeObj.M = time.substring(4, 6);
        timeObj.d = time.substring(6, 8);
        timeObj.h = time.substring(8, 10);
        timeObj.m = time.substring(10, 12);
        return timeObj;
    },
    //格式化 . 时间
    formatTime: function (stringTime) {
        if (stringTime) {
            var arr = stringTime.split("");
            arr.length = arr.length - 2;
            for (var i = 0; i < arr.length; i++) {
                if (i == 4 || i == 7) {
                    arr.splice(i, 0, ".");
                } else if (i == 10) {
                    arr.splice(i, 0, " ");
                } else if (i == 13) {
                    arr.splice(i, 0, ":");
                }

            }
            var newtime = arr.join("");
            return newtime;
        }
    },
    //统一在获取一遍左侧数据
    getLeftDataAgain: function () {
        commonData.publicModel.workOrderDraft["order_type_name"] = $("#work-typec").psel().text;
        if (commonData.publicModel.workTypeC[$("#work-typec").psel().index]) {
            commonData.publicModel.workOrderDraft["order_type"] = commonData.publicModel.workTypeC[$("#work-typec").psel().index].code;
        }
        commonData.publicModel.workOrderDraft["urgency"] = $("#work-urgency").psel().text;
        var index = parseInt($("#time-combobox").psel().index);
        commonData.publicModel.workOrderDraft["start_time_type"] = String(index + 1);
        if (index == 0) {
            commonData.publicModel.workOrderDraft["ask_start_time"] = "发单后立即开始";
        } else {
            commonData.publicModel.workOrderDraft["ask_start_time"] = $("#ask_start_time").psel().startTime;
        }
        var fixed = $("#fixed-radio").psel();
        if (fixed) {
            var value = $("#ask_end_limit").val();
            if (value == "000") {
                var value1 = "0";
                $("#ask_end_limit").val(value1)
            }
            commonData.publicModel.workOrderDraft["ask_end_limit"] = $("#ask_end_limit").val();
            commonData.publicModel.workOrderDraft["ask_end_time"] = "";
        } else {
            commonData.publicModel.workOrderDraft["ask_end_time"] = $("#ask_end_time").psel().startTime;
            commonData.publicModel.workOrderDraft["ask_end_limit"] = "";
        }

    },
    //添加信息点--自定义信息点
    customizeInfoPoint2: function (event) {
        commonData.click_custom_button = '1';
        commonData.publicModel.selSeriesType = commonData.publicModel.curObjType;//记录自定义之前的curObjType
        commonData.publicModel.searchResultLength = null;
        publicMethod.setCurPopInfo(1);
        commonData.publicModel.customItem.items = [];
    },

    //选择专业
    selDomain: function (model) {
        if (model.code) commonData.click_domain_button = '1';
        if (model.code == commonData.publicModel.curSelectedDomain.code) return;
        if (arguments[1] && arguments[1].target) {
            commonData.publicModel.curSelectedSystem = {};
            $(arguments[1].target).parents('.system-major').children().eq(2).precover('系统');
        }
        commonData.publicModel.curSelectedDomain = JSON.parse(JSON.stringify(model));
        commonData.publicModel.systemList = [];
        if (model.code) {
            myWorkOrderController.querySystemForSystemDomain(model);
        }
        publicMethod.toQueryEquip();
    },

    //选择系统
    selSystem: function (model, event) {
        if (model.system_id) commonData.click_system_button = '1';
        commonData.publicModel.curSelectedSystem = JSON.parse(JSON.stringify(model));
        publicMethod.toQueryEquip();
    },

    //查询设备实例前的处理
    toQueryEquip: function (model) {
        model = model ? model : commonData.leftLevelSelectedObj;
        if (model.obj_type != 'floor' && model.obj_id) {
            var obj = {
                user_id: commonData.user_id,
                project_id: commonData.project_id,
                need_back_parents: true
            }
            obj[model.obj_type + '_id'] = model.obj_id;
            if (commonData.publicModel.curSelectedDomain.code) {
                obj.domain_code = commonData.publicModel.curSelectedDomain.code;
            }
            if (commonData.publicModel.curSelectedSystem.system_id) {
                obj.system_id = commonData.publicModel.curSelectedSystem.system_id;
            }
            myWorkOrderController.queryEquip(obj);
        } else {
            commonData.publicModel.curLevelList = [];
        }
    },

    //面板关闭
    panelClose: function () {
        $(".import-box").find(".textarea-prop").hide();
        $(".import-box").find(".clear-div").each(function () {
            $(this).next().phide()
        });
        if ($(".obj-info-btn .aite-bubble").is(':visible')) {
            myWorkOrderController.saveInfoPointSel();
        }
        $(".import-box").find(".obj-info-btn .aite-bubble").hide();
        var isVisible = false;
        $(".import-box").find(".add-info-btn .aite-bubble").each(function () {
            if ($(this).is(':visible')) isVisible = true;
        });
        if (isVisible) {
            myWorkOrderController.saveInfoPointSel();
        }
        $(".import-box").find(".add-info-btn .aite-bubble").hide();
    },
    //创建权限
    /*createRight:function () {
     for(var i=0;i<frameModel.projectList.length;i++){
     if(frameModel.selectedProjectId==frameModel.projectList[i].project_id){
     commonData.publicModel.createrights=frameModel.projectList[i].rights.wo_create;
     break;
     }
     }
     }*/

}

var commonData = {
    stop_order_content: '',//中止内容
    publicModel: {},        //我的工单、计划监控的model
    types: ['obj', 'sop', 'workContentName', 'content'],       //事项@对象、事项#SOP、添加工作内容@对象、事项添加工作内容名称
    copyOrQuote: null,      //1复制，2引用
    curMatterIndex: 0,      //当前事项索引
    isValid: true,      //事项验证是否合法
    saveDraftOrPreview: null,       //1为保存草稿、2为预览工单
    ignoredErrorList: [],       //忽略的报错提示列表
    notPlanPage: null,      //计划监控/我的工单

    deletedChar: '',        //文本框被删除的字符

    user_id: '',
    project_id: '',

    textAttrName: '',       //文本属性名称

    //对象类
    objClass: {
        system_class: '通用系统类',
        equip_class: '通用设备类',
        build: '建筑体',
        floor: '楼层',
        space: '空间',
        system: '系统',
        equip: '设备',
        component: '部件',
        tool: '工具',
    },

    contentItemAttrNames: ['pre_conform', 'content', 'notice', 'confirm_result', 'domain'],

    checkedSops: [],     //页面选择的SOP
    selectedBrands: [],     //选择的品牌
    selectedLabels: [],     //选择的自定义标签
    selectedOrder_type: [],     //选择的工单类型
    selectedFit_objs: [],     //选择的适用对象
    firstSetMore: true,      //是否为第一次设置'更多'显示
    beforeCheckedSteps: 0,      //选择复制/引用sop之前页面步骤数
    checkedSopsSteps: 0,        //复制/引用sop的步骤数

    //curObjType: 'init',     //当前对象类型

    maybeDeletedContent: {},        //可能被删除的工作内容
    maybeDeletedContentIndex: null,         //可能被删除的工作内容在当前步骤下的索引

    beforeLen: null,        //keydown时文本长度

    editingContentObjs: [],     //编辑中的操作内容涉及的对象列表
    editingJqTextwrap: null,      //编辑的文本框dom节点对应的jquery对象，事项、工作内容弹框共用
    jqMatterTextwrap: null,         //用于区分editingJqTextwrap
    curJqPop: null,         //当前弹框jquery对象

    buildList: [],      //建筑体列表
    tempObjectList: [],      //工具/部件列表
    equip: [],      //设备
    equipClass: [],      //设备实例

    contentIndex: 0,        //当前工作内容索引

    initialSelectedObjs: [],       //操作内容中初始已选择的对象
    otherSelectedObjs: [],      //操作内容中其他类别已选择的对象
    selectedObjs: [],       //所有选择的对象
    initialCheckedObjs: [],        //操作内容中当前类别初始选择的对象
    checkedObjs: [],        //弹框页面check的对象

    maybeDeletedObjs: [],       //可能被删除的已选对象数组

    contentObjsCopy: [],       //当前内容中的对象
    // 副本

    focusContent: false,        //是否聚焦操作内容输入框

    jqTarget: null,
    textwrap: null,
    textdiv: null,
    textareapop: null,
    text: '',
    text1: '',
    text2: '',


    infoPoint_obj: {},        //信息点所属的对象
    info_pointsCopy: [],        //修改前的信息点

    jqInfoPointPop: null,       //选择信息点弹框
    jqPopDataDivs2: [],       //信息点弹框
    jqPopDataDivsInfo: [],       //小信息点弹框
    belongChoosedObj: false,         //信息点是否属于已选择的对象

    controlName: '普通文本',        //选择的控件名称

    selectedTools2Copy: [],     //新建/编辑SOP 下一步页面中所选的工具列表 副本

    matchExistingObj: {},       //自定义对象时匹配的已存在的对象

    composing: false,        //输入框中是否为 非单个字符输入状态
    notReplaceObj: false,       //在普通文本中间添加对象时不替代文本

    selectionStart: 0,      //光标选区开始位置
    selectionEnd: 0,        //光标选区结束位置

    isBackspace: false,       //文本框输入时是否为退格键

    // notShowPop: false,      //是否显示[搜索]弹框
    // notShowSopPop: false,       //是否显示SOP[搜索]弹框
    // notShowSopPop2: false,       //是否显示SOP[推荐]弹框
    showWhichPop: 0,        //异步返回数据时，对应哪一个弹框，0 不显示、1 对象、2 SOP搜索、3 SOP推荐

    leftLevelSelectedObj: {},       //左侧级别树选择的对象
    isWorkOrder: false,        //true 创建/编辑工单、false 录入/修改计划
    personPositionsCopy: [],     //我的工单-人员岗位列表副本，弹框操作人员岗位后的数据

    bpCreateWorkOrder: false,       //是否调用“埋点-新建工单"

    click_at_button: '0',     //点击@按钮，1-是，0-否
    click_class_option: '0',      //点击入口选项，1-是，0-否
    class_option_name: '',     //选择入口选项，点击的入口项具体的文字，包括通用设备、通用系统、建筑、楼层、空间等
    input_text: '0',            //直接输入文字，1-是，0-否，必须，@之后若输入过文字，则记录为1
    click_custom_button: '0',   //点击自定义按钮，1-是，0-否，必须，
    custom_result: '',         //自定义结果
    click_domain_button: '0',   //点击专业按钮，1-是，0-否，必须
    click_system_button: '0',   //点击系统按钮，1-是，0-否，必须
    final_result: '',           //最终结果

    custom_sop_name: '',       //自定义的SOP，输入#之后直接输入的文字，且该文字对应不到数据库中的SOP上时，这里把输入的文字记录下来
    click_sop_name: '0',        //点击列表中SOP名称，1-是，0-否，必须
    click_sop_screen_button: '0',//点击SOP的筛选按钮，1-是，0-否，必须

    //click_add_obj_info_point: '0',      //点击添加新对象和信息点按钮，1-是，0-否，必须      //To Delete
    click_add_info_point: '0',  //点击添加信息点按钮，1-是，0-否，必须
    click_search_button: '0',        //搜索时使用回车键触发，1-是，0-否，必须
    search_use_enter_key: '0',      //搜索时使用回车键触发，1-是，0-否，必须
    keyword_num: '0',             //输入关键词数量0

    new_tool_num: '0',        //添加的工具数量，1-是，0-否
}

var yn_method = {
    delConfirm: function (index, content, event) {
        event.stopPropagation();
        commonData.publicModel.del_plan_id = content;
        $("#del-confirm").pshow({title: '您确定要删除此条工单吗？', subtitle: '删除后此工单不可恢复'});
    },

    cancelConfirm: function () {
        $("#del-confirm").phide();
        $("#delete-matter-confirm").phide();
    },
    /*scrollLoad: function () {
     if ($("#work-already").psel()) {
     commonData.publicModel.workAlreadyID = commonData.publicModel.workAlready[$("#work-already").psel().index].id;
     }
     if ($("#work-type").psel()) {
     var orderType = commonData.publicModel.workTypeL[$("#work-type").psel().index].code;
     }
     //判断url
     var url = commonData.publicModel.workAlreadyID == "0" ? "restMyWorkOrderService/queryMyDraftWorkOrder" : commonData.publicModel.workAlreadyID == "1" ? "restMyWorkOrderService/queryMyPublishWorkOrder" : "restMyWorkOrderService/queryMyParticipantWorkOrder";
     orderType = orderType == "all" ? "" : orderType;
     var nScrollHight = 0; //滚动距离总长
     var nScrollTop = 0;   //滚动到的当前位置
     var nDivHight = $(".myWork-table-body").height();
     $(".myWork-table-body").scroll(function () {
     nScrollHight = $(this)[0].scrollHeight;
     nScrollTop = $(this)[0].scrollTop;
     if (nScrollTop + nDivHight >= nScrollHight) {
     // alert("到底部了")
     commonData.publicModel.pageNum += 1;
     var conditionSelObj = {

     order_type: orderType,                      //工单类型编码
     page: commonData.publicModel.pageNum,                       //当前页号，必须
     page_size: 50                        //每页返回数量，必须
     };
     myWorkOrderController.queryWorkOrder(url, conditionSelObj);//查询所有工单

     }

     });
     },*/
    /*创建页面*/
    createShow: function () {
        commonData.isWorkOrder = true;
        commonData.publicModel.workOrderDraft = {};
        commonData.publicModel.LorC = false;
        commonData.publicModel.allMatters = [];
        publicMethod.addMatter();
        commonData.ignoredErrorList = [];
        $("#work-typec").precover("请选择");
        $("#work-urgency").psel(0);
        $("#time-combobox").psel(0, true);
        $("#fixed-radio").psel(true, true);
        $("#ask-radio").psel(false, true);
        $("#ask_end_limit").val("");
        $(".matter-name").val("");
        $(".freedom-textarea").val("");
        yn_method.getDateTime();
        var date = new Date();
        var y = date.getFullYear(), mo = date.getMonth() + 1, da = date.getDate(), h = date.getHours(),
            m = date.getMinutes();
        $("#ask_start_time").psel({y: y, M: mo, d: da, h: h, m: m});
        $("#ask_end_time").psel({y: y, M: mo, d: da, h: h + 2, m: m});
        myWorkOrderController.queryUserWoInputMode();//用户输入方式
    },
    /*回到列表页*/
    listShow: function () {
        publicMethod.clickSpaceHidePop();
        commonData.publicModel.LorC = true;
        commonData.publicModel.workTypecError = "";
        commonData.publicModel.fixlimit = false;
        // $("#work-already").psel().text;
        // $("#work-type").psel().text;
        myWorkOrderController.selAlreadyEvent()
    },
    getDateTime: function () {
        commonData.publicModel.starYear = parseInt(new Date().getFullYear());
        commonData.publicModel.endYear = commonData.publicModel.starYear + 3;
    },
    radioChange: function (event) {
        event.stopPropagation();
        commonData.publicModel.fixedRadio = $("#fixed-radio").psel();
        var starttime = $("#ask_start_time").psel().startTime;
        var hours = parseInt(starttime.substr(-5, 2));
        $("#ask_end_time").psel({h: hours + 2}, false);

    },
    starTimeTypeSel: function (obj, event) {
        event.stopPropagation();
        if (obj.id == "1") {
            commonData.publicModel.timeTypeSel = true;
        } else {
            commonData.publicModel.timeTypeSel = false;
        }
    },
    /*事项名称计数*/
    matterNameCounter1: function (dom, value) {
        var strlen = value.length;
        var reg = /\s+/g;
        commonData.publicModel.workContent.work_name = commonData.publicModel.workContent.work_name.replace(/\s+/g, "");
        /*if (commonData.publicModel.workContent.work_name.length) {
         var chinese = commonData.publicModel.workContent.work_name[commonData.publicModel.workContent.work_name.length - 1].pisChinese();
         var englishNumber = commonData.publicModel.workContent.work_name[commonData.publicModel.workContent.work_name.length - 1].pisNumberAlph();
         if (!chinese && !englishNumber) {
         commonData.publicModel.workContent.work_name = commonData.publicModel.workContent.work_name.substring(0, commonData.publicModel.workContent.work_name.length - 1)
         }
         }
         $(dom).next(".counter").find("b").text(commonData.publicModel.workContent.work_name.length);*/
        /*var strArr = value.split("");
         for (var i = 0; i < strArr.length; i++) {
         var space = strArr[i].pisSpace();
         var ch = strArr[i].pisChinese();
         var enN = strArr[i].pisNumberAlph();
         if (space || !ch && !enN) {
         strArr.splice(i, 1);
         i = i - 1;
         }
         }
         var newVal = strArr.join("");
         commonData.publicModel.workContent.work_name = newVal;*/
        commonData.publicModel.workContent.work_name = publicMethod.limitString(value)
    },
    freedomOrRegular: function () {
        commonData.publicModel.regular = $("#switch-slide").psel();
        if (commonData.publicModel.regular) {
            var text = $(".freedom-textarea").val();
            if (!text || text == '') return;
            var textRemain = text;
            var reg = /(@[^\s]+\s?)|(#[^\s]+\s?)/gi;//f分割字符
            var objSopArr = text.match(reg);
            var objs = "";
            var sops = "";
            objSopArr.forEach(function (value, index, arr) {
                var i = value.indexOf("@");
                if (i != -1) {
                    objs += value + " ";
                } else {
                    sops += value + " ";
                }
                textRemain = textRemain.replace(value, "");
            });
            sops += textRemain;
            commonData.publicModel.singleMatters.desc_forepart = objs;
            commonData.publicModel.singleMatters.desc_aftpart = sops;
        } else {
            var reObjs = $(".regular-obj-text").find("textarea").val();
            var reSops = $(".regular-sop-text").find("textarea").val();
            commonData.publicModel[commonData.textAttrName] = reObjs + reSops;
        }
    },
    /*结构输入两者相加计数*/
    bothCountNum: function (dom, value) {
        var totalNum = 0;
        var bothP = $(dom).parents(".regular-text-div")
        var textareas = $(bothP).find("textarea");
        $(textareas).each(function (index, vdom) {
            totalNum += $(vdom).val().length;
        });
        var remainNum = 1000 - totalNum;
        $(bothP).find(".counter b").text(totalNum);
        if (totalNum == 1000) {
            var max1 = textareas[0].value.length;
            var max2 = textareas[1].value.length;
            textareas[0].maxLength = max1;
            textareas[1].maxLength = max2;
        }
        var textwrap = $(event.srcElement);
        var textpdiv = $(event.srcElement).parents(".textarea-div");
        var textdiv = $(textwrap).siblings(".textareadiv");
        var textareapop = $(textwrap).siblings(".textarea-prop");
        var focusIndex = textwrap[0].selectionStart;
        var firstPartStr = value.substring(0, focusIndex);
        var secondPartStr = value.substring(focusIndex);
        var lastQuanIndex = firstPartStr.lastIndexOf('@');
        var lastJingIndex = firstPartStr.lastIndexOf('#');
        var lastQuanjingIndex = Math.max(lastQuanIndex, lastJingIndex);
        var lastSpaceIndex = firstPartStr.lastIndexOf(' ');
        if (lastQuanjingIndex != -1) {
            if (lastQuanIndex > lastJingIndex) {
                commonData.publicModel.aite = true;
            } else if (lastQuanIndex < lastJingIndex) {
                commonData.publicModel.aite = false;
                publicMethod.selAllTags();
                //where--自由输入方式/结构输入，who--@/#，which--手动输入浮窗/点击浮窗
                yn_method.upDownSelecting(null, null, true);
            }
            var h1 = '<span>' + firstPartStr.substring(0, lastQuanjingIndex) + '</span>';
            var h2 = '<span>' + firstPartStr.substr(lastQuanjingIndex, 1) + '</span>';
            var htmlValue = h1 + h2;
            htmlValue = htmlValue.replace(/\n/g, '<br/>');
            htmlValue = htmlValue.replace(/\s/g, '&nbsp;');
            textdiv[0].innerHTML = htmlValue;
            textdiv[0].scrollTop = textwrap.scrollTop;
            var span = $(textdiv).find('span:last');
            var divpos = $(textpdiv).offset();
            var pos = span.offset();
            var left = pos.left - divpos.left + 18;
            var top = pos.top - divpos.top + 25;
            $(textareapop).css({left: left + 'px', top: top + 'px'});
            /*position: "absolute", "z-index": 50, */
            $(textareapop).show();

        }


    },

    /*添加工作内容界面*/
    //2018.01.08 add start
    barClickShow: function (dom) {
        publicMethod.clickSpaceHidePop();
        $(dom).next().slideDown();
        $(dom).next().find("textarea").focus();
        $(dom).find(".edit-div").hide().next().show();
    },
    //2018.01.08 add end
    /*编辑框出现并聚焦*/
    editable: function (event) {
        event.stopPropagation();
        publicMethod.clickSpaceHidePop();
        $(event.currentTarget).parent().hide().next().show();
        var slideDiv = $(event.currentTarget).parents(".prev-title").next();
        $(slideDiv).slideDown();
        $(slideDiv).find("textarea").focus()
    },
    /*清空bubble出现*/
    delBubbleShow: function (event) {
        event.stopPropagation();
        publicMethod.panelClose();
        var jqContentPrev = $(event.currentTarget).parents('.standard-content');
        if (jqContentPrev && !jqContentPrev.length) {       //不是点击的标准作业操作内容的清空按钮
            publicMethod.clickSpaceHidePop();
        }
        var bubbleDiv = $(event.currentTarget).parent(".clear-div").next();
        if (jqContentPrev && jqContentPrev.length && !jqContentPrev.find('textarea').val()) return;
        $(bubbleDiv).pshow({
            "title": "确定要清空此条内容吗？",
            "subtitle": "被清空的内容将不可恢复",
            "position": "absolute",
            "top": "40px",
            "left": "-310px",
            "z-index": "50"
        });
    },
    /*清空bubble消失*/
    delBubbleHide: function (event) {
        event.stopPropagation();
        var bubbleDiv = $(event.currentTarget.offsetParent.offsetParent);
        $(bubbleDiv).phide();
    },
    /*清空内容框*/
    clearAll: function (event, attrName1, attrName2) {
        event.stopPropagation();
        var jqContentPrev = $(event.currentTarget).parents('.standard-content');
        if (jqContentPrev && jqContentPrev.length) {       //点击的标准作业操作内容的清空按钮
            publicMethod.clickSpaceHidePop();
        }
        var textDiv = $(event.currentTarget).parents(".prev-title").next();
        var a = $(textDiv).find("textarea").length;
        if (attrName1 != "confirm_result" && attrName1 != "domain") {
            commonData.publicModel.workContent[attrName1] = "";
            $(textDiv).find("textarea").val("").css("border", "none");
            $(textDiv).find(".counterNum").text("0");
            if (attrName2) {
                commonData.publicModel.workContent[attrName2] = [];
            }
        } else if (attrName1 == "confirm_result") {
            commonData.publicModel.workContent[attrName1] = [];
            $(textDiv).find(".objs").empty();
        } else if (attrName1 == "domain") {
            commonData.publicModel.workContent[attrName1] = "";
            commonData.publicModel.workContent[attrName2] = "";
            $("#add-major").precover("选择专业");
        }
        /*switch ($(textDiv).find("textarea").length) {
         case 0:
         if ($(textDiv).find(".major-sel").length) {
         $("#add-major").precover("选择专业");
         }
         if ($(textDiv).find(".obj-div").length) {
         $(textDiv).find(".objs").empty();
         }
         break;
         case 1:
         $(textDiv).find("textarea").val("").css("border", "none");
         $(textDiv).find(".counterNum").text("0");
         $(textDiv).slideUp();
         break;
         default:
         break;
         }*/
        var bubbleDiv = $(event.currentTarget.offsetParent.offsetParent);
        $(bubbleDiv).phide();
        $(bubbleDiv).prev().hide().prev().show();
        $(textDiv).slideUp();

    },
    /*计数textarea*/
    counterNum: function (event) {
        var dom = event.currentTarget;
        var maxnum = parseInt($(dom).attr("maxlength"));
        var num = $(dom).val().length;
        if (num > maxnum) {
            $(dom).next().css("color", "#ef6767");
        } else {
            $(dom).next().css("color", "#cacaca");
        }
        $(dom).next().find(".counterNum").text(num)
    },
    quanjingInputEvent: function (event, isReply) {
        var textwrap = isReply == true ? event.currentTarget : document.getElementById('textwrap');
        var textdiv = isReply == true ? $(textwrap).next()[0] : document.getElementById('textdiv');
        var textareapop = isReply == true ? $(textdiv).next()[0] : document.getElementById('textarea-pop');
        var value = textwrap.value;//.ptrimHeadTail();


        workController.focusIndex = textwrap.selectionStart;
        var firstPartStr = value.substring(0, workController.focusIndex);
        var secondPartStr = value.substring(workController.focusIndex);
        var lastQuanIndex = firstPartStr.lastIndexOf('@');
        var lastJingIndex = firstPartStr.lastIndexOf('#');
        var lastDaoIndex = firstPartStr.lastIndexOf('$');
        var lastQuanjingIndex = Math.max(lastQuanIndex, lastJingIndex);
        lastQuanjingIndex = Math.max(lastQuanjingIndex, lastDaoIndex);
        var lastSpaceIndex = firstPartStr.lastIndexOf(' ');

        if (lastSpaceIndex >= lastQuanjingIndex || lastQuanjingIndex == -1) {
            $(textareapop).hide();
            workModel.instance().textSearchs([]);
            workController.focusIndex = -1;
            if (workController.quanjingAjax) workController.quanjingAjax.abort();
            return;
        }

        //0 @用户    1 #设备    2 $分项
        var isQuan = lastQuanIndex > lastJingIndex && lastQuanIndex > lastDaoIndex ? 0 :
            lastJingIndex > lastQuanIndex && lastJingIndex > lastDaoIndex ? 1 :
                lastDaoIndex > lastQuanIndex && lastDaoIndex > lastJingIndex ? 2 : -1;
        workController.isQuan = isQuan;

        var keyWord = firstPartStr.substring(lastQuanjingIndex + 1, workController.focusIndex);
        workController.searchUsersOrEqu(keyWord, isQuan, function () {
            var jqtextareapop = $(textareapop);
            //if (workModel.instance().textSearchs().length == 0) return jqtextareapop.hide();

            var text = workModel.instance().textSearchs().length == 0 ? '点击空格完成输入' :
                isQuan == 0 ? '选择用户姓名或点击空格完成输入' :
                    isQuan == 1 ? '选择设备或点击空格完成输入' :
                        isQuan == 2 ? '选择分项或点击空格完成输入' : '';

            isReply != true ? $('#liresultre').text(text) : jqtextareapop.find('li:first').text(text);
            jqtextareapop.show();
        });

        var h1 = '<span>' + firstPartStr.substring(0, lastQuanjingIndex) + '</span>';
        var h2 = '<span>' + firstPartStr.substr(lastQuanjingIndex, 1) + '</span>';
        var htmlValue = h1 + h2;
        htmlValue = htmlValue.replace(/\n/g, '<br/>');
        htmlValue = htmlValue.replace(/\s/g, '&nbsp;');
        textdiv.innerHTML = htmlValue;
        textdiv.scrollTop = textwrap.scrollTop;

        var span = $(textdiv).find('span:last');
        var divpos = $(textdiv).offset();
        var pos = span.offset();

        var left = pos.left - divpos.left;
        if (isReply == true) {
            left = left - textwrap.scrollLeft;
            var maxLeft = $(textwrap).width();
            left = Math.min(left, maxLeft);
        }
        var top = pos.top - divpos.top;

        $(textareapop).css({left: left + 'px', top: top + 'px'});
    },
    /*#筛选条件展开折叠*/
    unfold: function (dom, unfold) {
        if (unfold) {
            commonData.click_sop_screen_button = '1';
            $(dom).hide().next().show();
            $(dom).parents(".hashtag-sop").next().show();
            commonData.firstSetMore = false;
        } else {
            $(dom).hide().prev().show();
            $(dom).parents(".hashtag-sop").next().hide();
        }
        yn_method.locationHashPop(unfold);

    },
    locationHashPop: function (unfold) {
        var textwrap = commonData.editingJqTextwrap;
        var textpdiv = commonData.editingJqTextwrap.parents(".textarea-div")
        var textdiv = $(textwrap).siblings(".textareadiv");
        var textareapop = $(textwrap).siblings(".textarea-prop");
        textdiv[0].scrollTop = textwrap[0].scrollTop;
        var span = $(textdiv).find('span:last');
        var divpos = $(textpdiv).offset();
        var pos = span.offset();
        var left = pos.left - divpos.left + 18;
        var top = pos.top - divpos.top + 35;
        var totalwidth = $(textpdiv).width();
        var remainl;
        if (!commonData.publicModel.regular) {
            remainl = totalwidth - pos.left + divpos.left;
        } else {
            remainl = totalwidth - 50 - pos.left + divpos.left;
        }
        if (unfold) {
            if (remainl <= 780) {
                if (!commonData.publicModel.regular) {
                    left = totalwidth - 780;
                } else {
                    left = totalwidth - 50 - 780;
                }
            }
        } else {
            if (remainl <= 400) {
                left = totalwidth - 400;
            }
        }
        $(textareapop).css({left: left + 'px', top: top + 'px'}).show();
    },
    /*删除照片*/
    removeImage: function (dom) {
        $(dom).parent().remove();
    },

    //转换成父级链字符串形式
    getParentsLinks: function (parents) {
        if (!parents || !parents.length) return '';
        var str = '(';
        for (var i = 0; i < parents.length; i++) {
            str += parents[i].parent_names.join('-');
            if (i != parents.length - 1) str += '/';
        }
        return str + ')';
    },
    //转换控件文字
    contolTransfer: function (num) {
        var str = "";
        str = num == 1 ? "文本" : num == 2 ? "单选" : num == 3 ? "多选" : num == 4 ? "无单位的数字" : "有单位的数字"
        return str;
    },
    /*#浮窗中上下键选择*/
    upDownSelect: function (where, who, which) {//where--自由输入方式/结构输入，who--@/#，which--手动输入浮窗/点击浮窗
        var num = 0;
        var hashtagBubble = null;
        /*  完善中
         *   var bubble=null;
         *   if(where && who && which){//自由方式输入时@浮窗
         *   bubble=$(".matter-freedom .textarea-prop .aite-bubble");
         *   }else if(where && who && !which){//自由方式点击@浮窗
         *   bubble=$(".matter-freedom .add-obj .aite-bubble");
         *   }else if(where && !who && which){//自由方式输入时#浮窗
         *   bubble=$(".matter-freedom .textarea-prop .hashtag-bubble")
         *   }else if(where && !who && !which) {//自由方式点击时#浮窗
         *   bubble=$(".matter-freedom .add-sop .hashtag-bubble")
         *   }else if(!where && who && which){//结构化方式输入时@浮窗
         *   bubble=$(".matter-regular .textarea-prop .aite-bubble");
         *   }
         * */


        if (which) {//输入时的#浮窗
            hashtagBubble = $(".matter-freedom .textarea-prop .hashtag-sop")
        } else {
            // hashtagBubble=$(".add-sop .sop-list .aite-list")
            hashtagBubble = $(".matter-freedom .add-sop .hashtag-sop")

        }
        $(document).keyup(function (e) {
            var code = e.keyCode;
            // e.preventDefault();
            if (code == 40 && num == 0) {
                if (!counterNum.aite) {
                    // $(".sop-list .aite-list:first-of-type").addClass("updownmove");
                    // $(hashtagBubble).eq(0).addClass("updownmove");
                    $(hashtagBubble).find(".aite-list").eq(0).addClass("updownmove");
                }
                num++;
            } else {
                if ($(".updownmove")[0]) {
                    var prev = $(".updownmove")[0].previousElementSibling;//选中元素前置位元素是否存在,以此判断元素是否还可以上下移动
                    var next = $(".updownmove")[0].nextElementSibling;//选中元素后置位元素是否存在,以此判断元素是否还可以上下移动
                    switch (code) {
                        case 38://上
                            // e.preventDefault();
                            if (prev) {
                                if (!commonData.publicModel.aite) {
                                    $(hashtagBubble).find(".aite-list").each(function () {
                                        $(this).removeClass("updownmove");
                                    });
                                    $(prev).addClass("updownmove");
                                }
                            }
                            break;
                        case 40://下
                            if (!commonData.publicModel.aite) {
                                if (next) {
                                    $(hashtagBubble).find(".aite-list").each(function () {
                                        $(this).removeClass("updownmove");
                                    });
                                    $(next).addClass("updownmove");
                                }
                            }


                            break;
                        case 32://空格选中
                            if (!commonData.publicModel.aite) {
                                var id = $(hashtagBubble).find(".aite-list.updownmove>div:last-of-type>div").attr("id");
                                $(hashtagBubble).find("#" + id).psel(true);//空格选中
                                $(hashtagBubble).find("#able-btn").pdisable(false);
                            }
                            break;
                        case 13://回车确定
                            if (!commonData.publicModel.aite) {
                                var checks = $(hashtagBubble).find(".aite-list>div:last-of-type").children("div");
                                var sop = "";
                                checks.each(function (i, dom, arr) {
                                    var check = $(hashtagBubble).find("#" + dom.id).psel();
                                    if (check) {
                                        sop += "#" + $(hashtagBubble).find(dom).parent().prev().children().text() + " ";
                                    }
                                });
                                commonData.publicModel[commonData.textAttrName] += sop;

                            }
                            break;
                        default:
                            break;
                    }
                }

            }
        })
    },
    /*#浮窗中上下键选择*/
    upDownSelecting: function (where, who, which) {//where--自由输入方式/结构输入，who--@/#，which--手动输入浮窗/点击浮窗
        var num = 0;
        var bubble = null;
        var timely = null;
        /*完善中*/
        if (where && who && which) {//自由方式输入时@浮窗
            timely = $(".matter-freedom .textarea-prop .aite-bubble .timely-checkbox");
            if (timely.css("visibility") == "visible") {
                bubble = timely;
            }
        } else if (where && who && !which) {//自由方式点击@浮窗
            timely = $(".matter-freedom .add-obj .aite-bubble .timely-checkbox");
            if (timely.css("visibility") == "visible") {
                bubble = timely;
            }
        } else if (where && !who && which) {//自由方式输入时#浮窗
            bubble = $(".matter-freedom .textarea-prop .hashtag-bubble")
        } else if (where && !who && !which) {//自由方式点击时#浮窗
            bubble = $(".matter-freedom .add-sop .hashtag-bubble")
        } else if (!where && who && which) {//结构化方式输入时@浮窗
            // bubble = $(".matter-regular .textarea-prop .aite-bubble");
            timely = $(".matter-regular .textarea-prop .aite-bubble .timely-checkbox");
            if (timely.css("visibility") == "visible") {
                bubble = timely;
            }
        } else if (!where && who && !which) {//结构化方式点击时@浮窗
            // bubble = $(".matter-regular .add-obj .hashtag-bubble");
            timely = $(".matter-regular .add-obj .aite-bubble .timely-checkbox");
            if (timely.css("visibility") == "visible") {
                bubble = timely;
            }
        } else if (!where && !who && which) {//结构化方式输入时#浮窗
            bubble = $(".matter-regular .textarea-prop .hashtag-bubble");
        } else if (!where && !who && !which) {//结构化方式点击时#浮窗
            bubble = $(".matter-regular .add-sop .hashtag-bubble");
        }
        $(document).keyup(function (e) {
            var code = e.keyCode;
            if (code == 40 && num == 0) {
                if (!who || who && timely) {
                    $(bubble).find(".aite-list").eq(0).addClass("updownmove");
                }
                num++;
            } else {
                if ($(".updownmove")[0]) {
                    var prev = $(".updownmove")[0].previousElementSibling;//选中元素前置位元素是否存在,以此判断元素是否还可以上下移动
                    var next = $(".updownmove")[0].nextElementSibling;//选中元素后置位元素是否存在,以此判断元素是否还可以上下移动
                    switch (code) {
                        case 38://上
                            // e.preventDefault();
                            if (prev) {
                                if (!commonData.publicModel.aite) {
                                    $(bubble).find(".aite-list").each(function () {
                                        $(this).removeClass("updownmove");
                                    });
                                    $(prev).addClass("updownmove");
                                }
                            }
                            break;
                        case 40://下
                            if (!commonData.publicModel.aite) {
                                if (next) {
                                    $(bubble).find(".aite-list").each(function () {
                                        $(this).removeClass("updownmove");
                                    });
                                    $(next).addClass("updownmove");
                                }
                            }
                            break;
                        case 32://空格选中
                            var id = $(bubble).find(".aite-list.updownmove>div:last-of-type>div").attr("id");
                            $(bubble).find("#" + id).psel(true);//空格选中
                            $(bubble).find("#able-btn").pdisable(false);
                            break;
                        case 13://回车确定
                            var checks = $(bubble).find(".aite-list>div:last-of-type").children("div");
                            var sop = "";
                            checks.each(function (i, dom, arr) {
                                var check = $(bubble).find("#" + dom.id).psel();
                                if (check) {
                                    sop += "#" + $(bubble).find(dom).parent().prev().children().text() + " ";
                                }
                            });
                            commonData.publicModel[commonData.textAttrName] += sop;
                            // }
                            break;
                        default:
                            break;
                    }
                }

            }
        })
    },
    /*sop选中chedckbox*/
    checkSop: function () {
        // event.stopPropagation();
        if (!commonData.publicModel.aite) {
            // var id=$(".sop-list .aite-list.updownmove>div:last-of-type div").attr("id");
            // $("#able-btn").pdisable(false);
        }
    },
    /*回车确定*/
    enterSop: function (e, which) {
        var timely = $(".textarea-prop .aite-bubble .timely-checkbox");
        // var timely=$(".add-obj .aite-bubble .timely-checkbox");
        if (timely.css("visibility") == "visible") {
            hashtagBubble = timely;
        }
        if (which) {//输入时的#浮窗
            // hashtagBubble=$(".textarea-prop .sop-list .aite-list")
            hashtagBubble = $(".textarea-prop .hashtag-sop")
        } else {
            // hashtagBubble=$(".add-sop .sop-list .aite-list")
            hashtagBubble = $(".add-sop .hashtag-sop")

        }
        if (!commonData.publicModel.aite) {
            // var checks = $(".sop-list .aite-list>div:last-of-type").children("div");
            var checks = $(e.target).parents(".hashtag-bubble").find(".sop-list .aite-list>div:last-of-type").children("div");

            var sop = "";
            checks.each(function (i, dom, arr) {
                var check = $(e.target).parents(".hashtag-bubble").find("#" + dom.id).psel();
                if (check) {
                    sop += "#" + $(e.target).parents(".hashtag-bubble").find("#" + dom.id).parent().prev().children().text() + " ";
                }
            });
            if (which) {//输入时的#浮窗
                sop = sop.substring(1);
            }
            commonData.publicModel[commonData.textAttrName] += sop;
            // $(".matter-freedom textarea").

        }
    },
    clickLeftItem: function (content) {
        commonData.leftLevelSelectedObj = JSON.parse(JSON.stringify(content));
        commonData.checkedObjs = [];
        commonData.maybeDeletedObjs = [];
        commonData.publicModel.curLevelList = [];//树切换的时候中间层和信息点清掉
        commonData.publicModel.infoArray = [];//树切换的时候中间层和信息点清掉
        $(".result-center-level").each(function () {//中间层选中项清掉标记
            $(this).removeClass("selectionOn");
        });
        commonData.publicModel.isCustomizeBtnAble = false;//自定义按钮和确定按钮disable
        if ($(arguments[1].target).parents('.per-tree-title').hasClass('per-tree-ts_active')) {
            if (!content.obj_type) {
                content.obj_type = commonData.publicModel.curObjType;
            }
            if (commonData.publicModel.curObjType == "floor" || commonData.publicModel.curObjType == "system") {
                commonData.publicModel.curLevelList = [];
                commonData.publicModel.curLevelList = content.contentCopy;
                var type = commonData.publicModel.addContentWindow ? commonData.types[3] : commonData.types[0];
                publicMethod.isSelectedObj(null, type);
            } else if (commonData.publicModel.curObjType == "space") {
                if (!content.content) {
                    myWorkOrderController.querySpace(content.obj_id, "floor", false)
                } else if (content.content && content.content.length == 0) {
                    myWorkOrderController.querySpace(content.obj_id, "build", false)
                }
            } else if (commonData.publicModel.curObjType == "equip") {
                publicMethod.toQueryEquip(content);
            }
        } else {
            commonData.publicModel.curLevelList = [];
        }

    },
    defaultPage: function (dom, event) {
        if (event) event.stopPropagation();
        commonData.publicModel.searchResultLength = 0;
        commonData.publicModel.curObjType = 'init';
        $(dom).parents(".aite-bubble").find(".list-body").show().siblings().hide();
        $(dom).parents(".aite-bubble").find(".none-both").show().siblings().hide();
        // commonData.publicModel.isCustomizeBtnAble=false;
        // commonData.publicModel.curObjType2='init';
    },
    defaultPageContent: function (dom, event) {
        //setCurPop2中调用下面方法
        myWorkOrderController.saveInfoPointSel();
        event.stopPropagation();
        // $(dom).parents(".aite-bubble").find(".list-body").show().siblings().hide();
        if (commonData.publicModel.curObjType2 == 'custom') {
            // commonData.publicModel.curObjType2 = 'infoPoint';
            publicMethod.setCurPop2(1, true);
            commonData.publicModel.isCustomizeBtnAble = true;
        } else {
            commonData.publicModel.searchResultLength = null;
            publicMethod.setCurPop2(0);
        }
    },
    defaultPage2: function (dom) {
        publicMethod.setCurPopInfo(0)
        // commonData.publicModel=JSON.parse(JSON.stringify(commonData.publicModel))
    },
    closeBubble: function () {
        $(document).click(function (event) {
            yn_method.dealClickOtherRegion(event);
        });

    },

    //处理点击其它区域
    dealClickOtherRegion: function (event) {
        if (!event) return;
        var tg = event.target;
        if (commonData.publicModel.addContentWindow) {
            if ($(".obj-info-btn .aite-bubble").is(':visible')) {
                myWorkOrderController.saveInfoPointSel();
            }
            $(".obj-info-btn .aite-bubble").hide();
            var isVisible = false;
            if (!$(tg).hasClass('aite-bubble') && !$(tg).parents('.aite-bubble').length && $(".aite-bubble").length || $(tg).hasClass('aite-title') || $(tg).parents('.aite-title').length) {
                $(".add-info-btn .aite-bubble").each(function () {
                    if ($(this).is(':visible')) isVisible = true;
                });
            }
            if (isVisible) {
                myWorkOrderController.saveInfoPointSel();
            }
            var ifcon = $(event.target).parents(".aite-bubble").prev().hasClass("info-btn");
            if (!ifcon) {
                $(".add-info-btn .aite-bubble").hide();
            }
            $(".add-sop .hashtag-bubble").hide();
            commonData.publicModel.clickAiteShow = false;
            commonData.publicModel.clickHashShow = false;
            commonData.publicModel.noPop = false;
            commonData.publicModel.blurClose = true;
            if (!$(tg).hasClass('aite-bubble') && !$(tg).parents('.aite-bubble').length && $(".aite-bubble").length /*&& !commonData.focusContent*/) {
                var jqProp = $(".aite-bubble").eq(commonData.publicModel.allMatters.length * 3);
                if (jqProp.is(':visible')) {
                    publicMethod.setHidePopDatas(commonData.types[3]);
                    $(".aite-bubble").hide();
                }
            }
        } else {
            var index0 = commonData.textAttrName == 'description' ? 0 : commonData.textAttrName == 'desc_forepart' ? 1 : 2;
            var jqProp;
            if (!$(tg).hasClass('aite-bubble') && !$(tg).parents('.aite-bubble').length && $(".aite-bubble").length /*&& !commonData.focusContent*/) {
                jqProp = $(".aite-bubble").eq(commonData.curMatterIndex * 3 + index0);
                if (jqProp.is(':visible')) {
                    publicMethod.setHidePopDatas(commonData.types[0]);
                    $(".aite-bubble").hide();
                }
            }
            if (!$(tg).hasClass('hashtag-bubble') && !$(tg).parents('.hashtag-bubble').length && $(".hashtag-bubble").length /*&& !commonData.focusContent*/) {
                jqProp = $(".hashtag-bubble").eq(commonData.curMatterIndex * 3 + index0);
                if (jqProp.is(':visible')) {
                    publicMethod.setHidePopDatas(commonData.types[1]);
                    $(".hashtag-bubble").hide();
                    publicMethod.initSopModal();
                }
            }
        }
        // $("[con]").slideUp()


    },

    btnAble: function (index, obj, $event) {
        if (event.pEventAttr.state) {
            $("#able-btn").pdisable(false);
        } else {
            var checks = $(event.target).parents(".last-level-box").find(".aite-list>div:last-of-type").children();
            $(checks).some(function (i, dom, arr) {
                $("#" + dom.id).psel();
            });
        }
    },
    clickAiteShowFn: function (e, aite, event) {
        event.stopPropagation();
        if (aite) {
            commonData.publicModel.clickAiteShow = true;
            commonData.publicModel.clickHashShow = false;
        } else {
            commonData.publicModel.clickAiteShow = false;
            commonData.publicModel.clickHashShow = true;
        }
        $(e).children("div").show();
        //where--自由输入方式/结构输入，who--@/#，which--手动输入浮窗/点击浮窗
        yn_method.upDownSelecting(true, false, false);
    },
    delObjs: function (dom) {
        $(dom).parents(".obj-div").remove();
    },
    /*添加工作内容中的专业*/
    addMajor: function (majors) {
        commonData.publicModel.workContent.domain = majors.code;
        commonData.publicModel.workContent.domain_name = majors.name;

    },
    /*添加工作内容中，需确认的操作结果添加选项*/
    addSel: function (dom) {
        var sel = "<div class='info-dot'> <input type='text' /> <img src='../images/info_close.png' alt='删除图标x' onclick='yn_method.removeImage(this)'/> </div>"
        $(dom).parent().before(sel)
    },
    /*添加工作内容中，需确认的操作结果添加对象和信息点*/
    infoBubbleShow: function (dom, event) {
        publicMethod.initBpDatas();
        //commonData.click_add_obj_info_point = '1';
        event.stopPropagation();
        publicMethod.panelClose();
        $(dom).next().show();
        commonData.jqPopDataDivsInfo = [];
        $(dom).next().find(".keyinput").val("");
        $(dom).next().find(".customize div:first-of-type div").pval("");
        commonData.jqPopDataDivs2 = $(dom).next().find('.list-body').children();
        publicMethod.setCurPop2(0);//选择大类
    },
    /*添加工作内容中，需确认的操作结果添加信息点中的关键字*/
    addKey: function (e) {
        var str = $(e).parent().prev().val();
        if (str) {
            var strHtml = "<div class='key-div'> <span>" + str + "</span> <i onclick='yn_method.removeKey(this)'>x</i> </div>";
            $(e).parent().prev().before(strHtml);
            $(e).parent().prev().val("");
            var length = $(".key-div").length;
            // if(length>1){
            var inpWidth = $(e).parent().prev().width();
            // }else{
            //     var inpWidth = $(e).parent().prev().width() - 48;
            // }
            var prevWidth = $(e).parent().prev().prev().width();
            var neWidth = inpWidth - prevWidth - 20;
            if (neWidth > 45) {

                $(e).parent().prev().width(neWidth + "px");
            } else {
                $(e).parent().prev().width("100%");
            }
        }
    },
    removeAllKey: function (e) {
        $(e).parents(".info-search-box").find(".key-div").remove();
    },
    removeKey: function (e) {
        $(e).parents(".key-div").remove();
    },
    selContent: function (content) {
        commonData.publicModel.seltype = content.type;
        commonData.publicModel.customItem.type = content.type;
        if (content.type == 2) {
            commonData.publicModel.customItem.items = [];
            commonData.publicModel.customItem.items.push({name: ''});
        } else if (content.type == 3) {
            commonData.publicModel.customItem.items = [];
            commonData.publicModel.customItem.items.push({name: ''}, {name: ''});
        }
        commonData.controlName = content.name;
    },
    selContent2: function (model, event) {
        var id = $(event.target).parents("div[id^='custom-sel']").attr('id');
        var index1 = parseInt(id.slice(id.indexOf('custom-sel') + 10, id.indexOf('sep')));
        var index2 = parseInt(id.slice(id.indexOf('sep') + 'sep'.length));
        var customCurrent = publicMethod.confirmResult().confirm_result[index1].customs[index2];
        var newtype = model.type;
        // commonData.controlName = content.name;
        if (newtype == customCurrent.type) return;
        switch (customCurrent.type) {
            case '1':
            case '4':
            case '5':
                if (newtype == '2' || newtype == '3') {
                    if (newtype == '2') {
                        customCurrent.items = [''];//默认一个选项
                    } else {
                        customCurrent.items = ['', ''];//默认添加两个选项
                    }

                    customCurrent.type = newtype;
                }
                customCurrent.unit = '';
                break;
            case '2':
            case '3':
                if (newtype == '1' || newtype == '4' || newtype == '5') {
                    publicMethod.confirmResult().confirm_result[index1].customs[index2] = {
                        name: customCurrent.name,
                        type: newtype,
                        unit: ''
                    };
                } else if (newtype == '2') {
                    customCurrent.items = [''];//默认一个选项
                } else if (newtype == '3') {
                    customCurrent.items = ['', ''];//默认添加两个选项
                }
                customCurrent.unit = '';
                // $($($(".obj-div")[index1]).find(".self-div")[index2]).find(".info-self-input").parent(".info-dot").remove();
                break;
            default:
                break;
        }
        // $($($(".obj-div")[index1]).find(".self-div")[index2]).find(".info-self-input").val('');
        publicMethod.confirmResult().confirm_result[index1].customs[index2].type = newtype;
        commonData.publicModel.workContent = JSON.parse(JSON.stringify(commonData.publicModel.workContent))
    },
    /*自定义页面*/
    customShow: function (e) {
        e.stopPropagation();
        $(e.target).parents(".aite-footer").prev().find(".customize").show().siblings().hide();
    },
    /*忽略报错*/
    ignoreError: function (dom) {
        $(dom).parent().hide();
    },
    /*转换时间*/
    transferTime: function (time) {
        time = time.substring(0, 16);
        time = time.replace(/-/g, '/');
        var timestamp = new Date(time).getTime();
        return timestamp;
    },
    /*验证时间*/
    verifyTime: function () {
        if ($("#time-combobox").psel().index == 1) {
            var nowTime = new Date().getTime();
            var start_time = $("#ask_start_time").psel().startTime;
            var start = new Date(start_time).getTime();
            if (start >= nowTime) {
                commonData.publicModel.s_n = false;
            } else {
                commonData.publicModel.s_n = true;
            }
            var ask_start_time = $("#ask_start_time").psel();
            var ask_end_time = $("#ask_end_time").psel();
            var end_timestamp = yn_method.transferTime(ask_end_time.startTime);
            var start_timestamp = yn_method.transferTime(ask_start_time.startTime);
            if (start_timestamp > end_timestamp || nowTime >= end_timestamp) {
                $("#ask_end_time").find(".per-combobox-title").css({
                    "border": "1px solid #ef6767"
                });
                commonData.publicModel.s_e = true;
            } else if (start_timestamp <= end_timestamp) {
                $("#ask_end_time").find(".per-combobox-title").css({
                    "border": "1px solid #cacaca"
                });
                commonData.publicModel.s_e = false;
            }
        } else {
            var nowTime2 = new Date().getTime();
            var ask_end_time2 = $("#ask_end_time").psel().startTime;
            var end_timestamp2 = new Date(ask_end_time2).getTime();
            if (end_timestamp2 >= nowTime2) {
                commonData.publicModel.s_e = false;
                $("#ask_end_time").find(".per-combobox-title").css({
                    "border": "1px solid #cacaca"
                });
            } else {
                commonData.publicModel.s_e = true;
                $("#ask_end_time").find(".per-combobox-title").css({
                    "border": "1px solid #ef6767"
                });
            }
        }


    },
    /*删除事项*/
    deleteMatter: function (dom) {
        $(dom).parents(".matter-all").remove();
    },
    //参数处理，工作内容名称，工作内容，注意事项，强制确认前提的非空验证
    contentVerifyEmpty: function () {
        commonData.publicModel.workContent.confirm_result_copy = JSON.parse(JSON.stringify(commonData.publicModel.workContent.confirm_result));
        $(".obj-div").each(function (index1, value1) {//重新获取自定义信息点
            $(this).find(".self-div").each(function (index2, value2) {
                // commonData.publicModel.workContent.confirm_result[index1].customs[index2].items = [];
                commonData.publicModel.workContent.confirm_result_copy[index1].customs[index2].items = [];
                $(this).find(".info-self-input").each(function (index3, value3) {
                    var item = $(this).val();
                    if (item.replace(/\s+/g, "") != '' && item.length < 100) {
                        commonData.publicModel.workContent.confirm_result_copy[index1].customs[index2].items.push(item);
                    }
                })
            })
        });
        for (var i = 0; i < commonData.publicModel.workContent.confirm_result_copy.length; i++) {
            var confirm_obj = commonData.publicModel.workContent.confirm_result_copy[i];
            if (confirm_obj.customs) {
                for (var j = 0; j < confirm_obj.customs.length; j++) {
                    var customs_obj = confirm_obj.customs[j]
                    if (customs_obj.type == 2 || customs_obj.type == 3 && customs_obj.items) {
                        var hash = {};
                        var objlen = customs_obj.items.length;
                        if (customs_obj.type == 2 && objlen < 1) {
                            $('#globalnotice').pshow({text: '单选至少有一个选项不为空且字符小于100！', state: 'failure'});
                            return false;
                        } else if (customs_obj.type == 3 && objlen < 2) {
                            $('#globalnotice').pshow({text: '多选至少有两个选项不为空且字符小于100！', state: 'failure'});
                            return false;
                        }
                        for (var k = 0; k < objlen; k++) {
                            if (!hash[customs_obj.items[k]]) {
                                hash[customs_obj.items[k]] = true;
                            } else {
                                $('#globalnotice').pshow({text: '选项不可重复！', state: 'failure'});
                                return false;
                            }
                        }
                    } else if (customs_obj.type == 5) {
                        if (customs_obj.unit.replace(/\s+/g, '') == '') {
                            $('#globalnotice').pshow({text: '请填写单位！', state: 'failure'});
                            return false;
                        }

                    }
                }
            }
        }
        var proarr = ['work_name', /*'pre_conform',*/ /*'content', */'notice'];
        for (var i = 0; i < proarr.length; i++) {
            commonData.publicModel.workContent[proarr[i]] = commonData.publicModel.workContent[proarr[i]].replace(/\s+/g, "");
        }
        if (!Boolean(commonData.publicModel.workContent.work_name)) {//名称为必填项，不能为空
            $(".alert-container .matter-title-div .counter").find("b").text("0");
            $("#globalnotice").pshow({text: '作业简称不能为空', state: "failure"});
            return false;
        } else {
            var desc_works_arr = commonData.publicModel.mattersVip.desc_works;
            for (var i = 0; i < desc_works_arr.length; i++) {
                if (commonData.publicModel.workContent.work_name == desc_works_arr[i].work_name) {
                    $("#globalnotice").pshow({text: '作业简称在该事项中已使用！', state: "failure"});
                    return false;
                }
            }
            if (commonData.publicModel.workContent.work_name.length > 100) {
                // $("#globalnotice").pshow({text: '工作内容名称字数超出限制！', state: "failure"});
                return false;
            }
        }
        if (!Boolean(commonData.publicModel.workContent.pre_conform.replace(/\s+/g, ""))) {//强制确认操作前提
            $($(".import-box .content-prev")[0]).find("b").text("0");
        } else {
            if (commonData.publicModel.workContent.pre_conform.length > 100) {//强制确认前提，超出200限制，不可添加和关闭弹窗
                return false;
            }
        }
        if (commonData.publicModel.workContent.content.length > 200) return false;//标准作业操作内容超过两百不可添加
        if (!Boolean(commonData.publicModel.workContent.content.replace(/\s+/g, ""))) {//标准作业操作内容为必填项，不能为空
            $($(".import-box .content-prev")[1]).find("b").text("0");
            $("#globalnotice").pshow({text: '标准操作要求不能为空', state: "failure"});
            return false;
        }
        // if (commonData.publicModel.workContent.content.length > 200)return false;//标准作业操作内容超过两百不可添加
        if (!Boolean(commonData.publicModel.workContent.notice)) {//注意事项
            $($(".import-box .content-prev")[2]).find("b").text("0");
        }

    },
    confirmAddWorkContent: function () {
        myWorkOrderController.saveAddWork(true);
        if (yn_method.contentVerifyEmpty() != undefined) {
            return false;
        } else {
            commonData.publicModel.workContent.confirm_result = commonData.publicModel.workContent.confirm_result_copy
        }
        console.log(commonData.publicModel.workContent)
        commonData.publicModel.addContentWindow = false;
        $(".workcontent-alert").hide();
        commonData.publicModel.work_c = false;
        commonData.textAttrName = commonData.publicModel.regular ? 'desc_aftpart' : 'description';
        publicMethod.addWorkContentName();

    },
    contentAiteShow: function (dom, event) {
        event.stopPropagation();
        var len = commonData.publicModel.workContent.content.length;
        if (len == 0) {
            commonData.publicModel.workContent.content += "@";
        } else if (commonData.publicModel.workContent.content[len] != "@") {
            commonData.publicModel.workContent.content[len] += "@";
        }
        $(dom).parents(".import-box").find(".textarea-prop").hide();
        $(dom).parents(".import-box").find(".obj-info-btn  .aite-bubble").hide();
        $(dom).parents(".import-box").find(".add-info-btn  .aite-bubble").hide();
        // $(dom).children(".aite-bubble").show();
        commonData.publicModel.blurClose = false;
        commonData.publicModel.noPop = true;
        publicMethod.setCurPop(4, 'content');
    },
    /*开始时间选择*/
    startTimeSave: function () {
        var nowTime = new Date().getTime();
        var ask_start_time = $("#ask_start_time").psel().startTime;
        var start = new Date(ask_start_time).getTime();
        if (start >= nowTime) {
            commonData.publicModel.s_n = false;
            $("#ask_start_time").find(".per-combobox-title").css({
                "border": "1px solid #cacaca"
            });
            var ask_end_time = new Date(ask_start_time).getTime() + 7200000;
            var ymd = yn_method.selTimeFormat(ask_end_time);
            $("#ask_end_time").psel(ymd, true);
        } else {
            commonData.publicModel.s_n = true;
            $("#ask_start_time").find(".per-combobox-title").css({
                "border": "1px solid #ef6767"
            });
        }
        if ($("#ask-radio").psel()) {//要求结束时间
            var ask_end_time = $("#ask_end_time").psel().startTime;
            var end = new Date(ask_end_time).getTime();
            if (end >= nowTime && end >= start) {
                commonData.publicModel.s_e = false;
                $("#ask_end_time").find(".per-combobox-title").css({
                    "border": "1px solid #cacaca"
                });
            } else {
                commonData.publicModel.s_e = true;
                $("#ask_end_time").find(".per-combobox-title").css({
                    "border": "1px solid #ef6767"
                });
            }
        }
    },
    selTimeFormat: function (strTime) {
        var obj = {};
        var time = new Date(strTime)
        obj.y = time.getFullYear();
        obj.M = time.getMonth() + 1;
        obj.d = time.getDate();
        obj.h = time.getHours();
        obj.m = time.getMinutes();
        return obj;
    },
    //选择对象所属类别
    selObjType: function (obj_type) {
        commonData.publicModel.selectedObjType = obj_type;
        if (!commonData.publicModel.selectedObjType) {
            commonData.publicModel.aiteTips = "请选择所属类别！"
        } else {
            commonData.publicModel.aiteTips = "";
        }
    },
    //时间限制的存储
    askLimit: function (dom, value) {
        var reg1 = /^\d{0,3}$/gi;
        var reg2 = /^\d{1,3}\.\d{1}$/gi;
        if (reg1.test(value)) {
            commonData.publicModel.fixlimit = false;
        } else if (reg2.test(value)) {
            commonData.publicModel.fixlimit = false;
        } else {
            commonData.publicModel.fixlimit = true;
        }
        if (value == "000") {
            var value1 = "0";
            $(dom).val(value1)
        }
        // commonData.publicModel.workOrderDraft["ask_end_limit"] = event.target.value
    },
    /*scrollLoadMonitor: function () {
     if ($("#time-type").psel()) {
     var time = workOrderMngModel.timeType[$("#time-type").psel().index].code;
     }
     if ($("#work-type").psel()) {
     var orderType = workOrderMngModel.workType[$("#work-type").psel().index].code;
     }
     if ($("#work-state").psel()) {
     var orderState = workOrderMngModel.workState[$("#work-state").psel().index].code;
     }
     if ($("#create-person").psel()) {
     var creatorId = workOrderMngModel.createPerson[$("#create-person").psel().index].person_id;
     }
     time = time == "all" ? "" : time;
     orderType = orderType == "all" ? "" : orderType;
     orderState = orderState == "all" ? "" : orderState;
     creatorId = creatorId == "all" ? "" : creatorId;
     var nScrollHight = 0; //滚动距离总长
     var nScrollTop = 0;   //滚动到的当前位置
     var nDivHight = $(".monitor-table-body").height();
     $(".monitor-table-body").scroll(function () {
     nScrollHight = $(this)[0].scrollHeight;
     nScrollTop = $(this)[0].scrollTop;
     if (nScrollTop + nDivHight >= nScrollHight) {
     // alert("到底部了")
     workOrderMngModel.pageNum += 1;
     var conditionSelObj = {
     time_type: time,                       //时间类型，temp-临时，plan计划
     order_type: orderType,                      //工单类型编码
     order_state: orderState,                     //工单状态编码
     creator_id: creatorId,                      //创建人id
     page: workOrderMngModel.pageNum,                       //当前页号，必须
     page_size: 50                        //每页返回数量，必须
     };
     controller.queryAllWorkOrder(conditionSelObj);//查询所有工单

     }

     });
     },*/
    //发布列表页闪现
    flashNone: function () {
        $(".flash").removeClass("flash-pub")
    },
    //工单类型选择
    workSel: function (content, event) {
        var sel = $("#work-typec").psel();
        if (sel) {
            commonData.publicModel.workTypecError = "";
        } else {
            commonData.publicModel.workTypecError = "请选择工单类型！";
        }
    },
    preventBubbleFn: function (event) {
        event.stopPropagation();
    }
}
