/**YEngine2D
 * author：YYC
 * date：2014-01-05
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
/**
 * 该测试为记录测试，需要手动触发事件，然后记录打印的信息
 */
describe("EventManager.js", function () {
    var manager = YE.EventManager;

    function insertDom() {
        $("<div id='eventManager_test' style='width:500px;height:500px;border:1px solid red;" +
            "position:absolute;top:0px;left:0px;'></div>")
            .appendTo($("body"));
    }

    function removeDom() {
        $("#eventManager_test").remove();
    }

//    beforeEach(function () {
//        insertDom();
//    });
//    afterEach(function () {
//        removeDom();
//    });

    describe("addListener", function () {
        it("绑定事件。addListener(eventType, handler, eventContext, handlerContext)", function () {
//            manager.addListener(YE.Event.KEY_DOWN, function(event){
//                console.log(event.keyCode);
//            });
//            manager.addListener(YE.Event.MOUSE_MOVE, function (event) {
//                console.log(event.pageX, event.pageY);
//            });
        });
        it("handler指向handlerContext", function () {
//            manager.addListener(YE.Event.KEY_DOWN, function(event){
//                console.log(this);
//            });

//            var f = {
//                a: 1
//            };
//
//            manager.addListener(YE.Event.MOUSE_OVER, function (event) {
//                console.log(this.a);
//            }, window, f);
        });
        it("event绑定到eventContext中", function () {
//               insertDom();
//
//            manager.addListener(YE.Event.MOUSE_OVER, function (event) {
//                console.log(1);
//            }, $("#eventManager_test"), null);
//            manager.addListener(YE.Event.MOUSE_OUT, function (event) {
//                console.log(2);
//            }, $("#eventManager_test"), null);
        });
        it("如果重复绑定同一事件，则叠加上一次的handler", function () {
//           manager.addListener(YE.Event.KEY_DOWN, function(event){
//                console.log(event.keyCode);
//            });
//
//            manager.addListener(YE.Event.KEY_DOWN, function(event){
//                console.log(this);
//            });
        });
        it("可绑定keydown、keyup、keypress、mouse事件", function () {

        });
    });

    describe("removeListener", function () {
        it("移除该事件上所有的handler。removeListener(eventType)", function () {
//            manager.addListener(YE.Event.KEY_UP,function (event) {
//                console.log(event.keyCode);
//            });
//            manager.addListener(YE.Event.KEY_UP, function (event) {
//                console.log(this);
//            });
//
//            insertDom();
////
//            manager.addListener(YE.Event.MOUSE_MOVE,function (event) {
//                console.log("a");
//            });
//            manager.addListener(YE.Event.MOUSE_MOVE,function (event) {
//                console.log("b");
//            }, $("#eventManager_test"));
//
//            manager.removeListener(YE.Event.KEY_UP);
//
//            manager.addListener(YE.Event.KEY_UP,function (event) {
//                console.log(event.keyCode);
//            });
        });
    });

    describe("removeAllListener", function () {
        it("移除所有事件", function () {
//            manager.addListener(YE.Event.KEY_UP,function (event) {
//                console.log(event.keyCode);
//            });
//            manager.addListener(YE.Event.KEY_UP, function (event) {
//                console.log(this);
//            });
//
//            insertDom();
////
//            manager.addListener(YE.Event.MOUSE_MOVE,function (event) {
//                console.log("a");
//            });
//            manager.addListener(YE.Event.MOUSE_MOVE,function (event) {
//                console.log("b");
//            }, $("#eventManager_test"));
//
//            manager.removeAllListener();
        });
    });
});