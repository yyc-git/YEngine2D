/**YEngine2D
 * author：YYC
 * date：2015-01-26
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
//(function () {
//    YE.Boot = YYC.Class(YE.Entity, {
//        Init: function () {
//            this.base();
//        },
//        Private: {
//        },
//        Public: {
//            loadTxt: function (url, callback) {
//                var self = this;
//
//                YE.$.ajax({
//                    type: "get",
//                    //async: true,
//                    url: url,
//                    contentType: "text/plain; charset=utf-8",
//                    dataType: "text",
//                    //cache: false,
//                    success: function (data) {
//                        callback(null, data);
////                        self.ye_P_container.addChild(key, data);
////                        YE.LoaderManager.getInstance().onResLoaded();
//                    },
//                    error: function (XMLHttpRequest, errorThrown) {
//                        callback("url:" + url + "\nreadyState:" + XMLHttpRequest.readyState + "\nstatus:" + XMLHttpRequest.status
//                                + "\nmessage:" + errorThrown.message
//                                + "\nresponseText:" + XMLHttpRequest.responseText)
////                        YE.LoaderManager.getInstance().onResError(jsonFilePath,
////                            "readyState:" + XMLHttpRequest.readyState + "\nstatus:" + XMLHttpRequest.status
////                                + "\nmessage:" + errorThrown.message
////                                + "\nresponseText:" + XMLHttpRequest.responseText);
//                    }
//                });
//            }
//        },
//        Static: {
//            _instance: null,
//
//            getInstance: function () {
//                if (this._instance === null) {
//                    this._instance = new this();
//                }
//                return this._instance;
//            }
//        }
//    });
//}());


YE.loader = {
    loadTxt: function (url, callback) {
        var self = this;

        YE.$.ajax({
            type: "get",
            //async: true,
            url: url,
            contentType: "text/plain; charset=utf-8",
            dataType: "text",
            //cache: false,
            success: function (data) {
                callback(null, data);
//                        self.ye_P_container.addChild(key, data);
//                        YE.LoaderManager.getInstance().onResLoaded();
            },
            error: function (XMLHttpRequest, errorThrown) {
                callback("url:" + url + "\nreadyState:" + XMLHttpRequest.readyState + "\nstatus:" + XMLHttpRequest.status
                    + "\nmessage:" + errorThrown.message
                    + "\nresponseText:" + XMLHttpRequest.responseText)
//                        YE.LoaderManager.getInstance().onResError(jsonFilePath,
//                            "readyState:" + XMLHttpRequest.readyState + "\nstatus:" + XMLHttpRequest.status
//                                + "\nmessage:" + errorThrown.message
//                                + "\nresponseText:" + XMLHttpRequest.responseText);
            }
        });
    }
};


