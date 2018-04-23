/*数据model映射配置，支持无限嵌套*/
var dataModelMap = {
  "restPersonService/queryPersonDetailByidNumber": {
    note: "人员信息-新增页:根据身份证号查询人员详细信息",
    type: "object",
    proArr: [
      {
        note: "姓名",
        name: "name",
        mapName: "",
        type: "string"
      },
      {
        note: "身份证号码",
        name: "id_number",
        mapName: "",
        type: "string"
      },
      {
        note: "手机号",
        name: "phone_num",
        mapName: "",
        type: "string"
      },
      {
        note: "性别",
        name: "gender",
        mapName: "",
        type: "string"
      },
      {
        note: "出生年月 yyyy-MM-dd",
        name: "birthday",
        mapName: "",
        type: "string",
        isToSpecial: false
      }
    ]
  },
  "restPersonService/queryPersonWithGroup": {
    note: "人员信息-列表页:查询人员缩略图",
    type: "array",
    proArr: [
    {
        note: "岗位id",
        name: "position_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },
    {
        note: "岗位名称",
        name: "position_name",
        mapName: "",
        type: "string",
        isToSpecial: false
    },
    {
        note: "员工数组",
        name: "persons",
        mapName: "",
        type: "array",
        proArr: [
        {
            note: "员工id",
            name: "person_id",
            mapName: "",
            type: "string"
        },
        {
            note: "所属项目id",
            name: "project_id",
            mapName: "",
            type: "string",
            isToSpecial: false
        },
        {
            note: "员工编号",
            name: "person_num",
            mapName: "",
            type: "string"
        },
         {
            note: "姓名",
            name: "name",
            mapName: "",
            type: "string"
        },
        {
            note: "系统头像",
            name: "head_portrait",
            mapName: "",
            type: "fileLink",
            fileType: 1
        }]
      }
    ]
  },
  "restPersonService/queryPersonDetailById":{
    note: "人员管理-详细页:根据查询人员详细信息",
    type: "object",
    proArr: [{
        note: "员工id",
        name: "person_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "所属项目id ",
        name: "project_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "姓名",
        name: "name",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "员工识别码",
        name: "id_number",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "手机号",
        name: "phone_num",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "性别",
        name: "gender",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "出生年月",
        name: "birthday",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "邮箱",
        name: "person_mail",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "人员类型",
        name: "person_type",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "人员类型",
        name: "person_type",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "员工编号",
        name: "person_num",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "部门id",
        name: "dept_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "部门名称",
        name: "dept_name",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "岗位id",
        name: "position_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "岗位名称",
        name: "position_name",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "专业编码",
        name: "specialty",
        mapName: "",
        type: "array",
    },{
        note: "已选中专业对象",
        name: "specialty_name",
        mapName: "",
        type: "array",
        proArr: [{
            "note": "code",
            "name": "code",
            "mapName": "",
            "type": "string"
        },{
            "note": "name",
            "name": "name",
            "mapName": "",
            "type": "string"
        },]
    },{
        note: "证件照片",
        name: "id_photo",
        mapName: "",
        type: "string",
    },{
        note: "key",
        name: "head_portrait",
        mapName: "",
        type: "fileLink",
        fileType: 1
    },{
        note: "人员状态",
        name: "person_status",
        mapName: "",
        type: "string",
    },{
        note: "账号id",
        name: "person_user_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "账号名称",
        name: "person_user_name",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "权限包名称",
        name: "func_pack_names",
        mapName: "",
        type: "string",
        isToSpecial: false
    }],
  },
  "restPersonService/queryPersonDetailByidNumber":{
    note: "根据员工识别码查询人员详细信息",
    type: "object",
    proArr: [{
        note: "员工id",
        name: "person_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "所属项目id ",
        name: "project_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "姓名",
        name: "name",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "员工识别码",
        name: "id_number",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "手机号",
        name: "phone_num",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "性别",
        name: "gender",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "出生年月",
        name: "birthday",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "邮箱",
        name: "person_mail",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "人员类型",
        name: "person_type",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "人员类型",
        name: "person_type",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "员工编号",
        name: "person_num",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "部门id",
        name: "dept_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "部门名称",
        name: "dept_name",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "岗位id",
        name: "position_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "岗位名称",
        name: "position_name",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "专业编码",
        name: "specialty",
        mapName: "",
        type: "array",
    },{
        note: "已选中专业对象",
        name: "specialty_name",
        mapName: "",
        type: "array",
        proArr: [{
            "note": "code",
            "name": "code",
            "mapName": "",
            "type": "string"
        },{
            "note": "name",
            "name": "name",
            "mapName": "",
            "type": "string"
        },]
    },{
        note: "证件照片",
        name: "id_photo",
        mapName: "",
        type: "string",
    },{
        note: "key",
        name: "head_portrait",
        mapName: "",
        type: "fileLink",
        fileType: 1
    },{
        note: "人员状态",
        name: "person_status",
        mapName: "",
        type: "string",
    },{
        note: "账号id",
        name: "person_user_id",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "账号名称",
        name: "person_user_name",
        mapName: "",
        type: "string",
        isToSpecial: false
    },{
        note: "权限包名称",
        name: "func_pack_names",
        mapName: "",
        type: "string",
        isToSpecial: false
    }],
  }
};
module.exports = dataModelMap;
