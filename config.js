/*配置项*/
var config = {
    port: 9095,
    mainUrl: '/layout',
    isRealData: true,
    commonLibUrl: 'http://192.168.100.30:9000/',
    serviceUrl: 'http://192.168.100.210:8080/saas',
    // serviceUrl: 'http://192.168.30.98:8080/saas',
    // serviceUrl: 'http://165a5949.ngrok.io/saas',
    fileServiceUrl: 'http://192.168.20.225:8080/image-service/common/file_upload?',
    downFileServiceUrl: 'http://192.168.20.225:8080/image-service/common/file_get/'
};

module.exports = config;