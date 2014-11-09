/**YEngine2D
 * author：YYC
 * date：2014-01-21
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("ActionInterval", function () {
    var interval = null;

    function getInstance() {
        var T = YYC.Class(YE.ActionInterval, {
            Public: {
                init: function () {
                },
                update: function (time) {
                },
                copy: function () {
                },
                reverse: function () {
                }
            }
        });
        return new T();
    }

    beforeEach(function () {
        interval = getInstance();

    });

//    describe("canClear", function () {
//        it("判断是否清除精灵", function () {
//        });
//    });

    describe("start", function () {
        it("设置标志", function () {
            interval.start();

            expect(interval.isStop()).toBeFalsy();
        });
    });

    describe("isStop", function () {
        it("判断是否停止动作", function () {
        });
    });

    describe("stop", function () {
//        it("调用父类同名方法", function () {
//        });
        it("标志停止", function () {
            interval.stop();

            expect(interval.isStop()).toBeTruthy();
        });
//        it("标志不可清除", function () {
//            interval.stop();
//
//            expect(interval.canClear()).toBeFalsy();
//        });
    });

    describe("reset", function () {
        it("重置停止标志", function () {
//            interval.ye__isFinish = true;
            interval.ye__isStop = true;
//            interval.ye__canClear = false;

            interval.reset();

//            expect(interval.isFinish()).toBeFalsy();
            expect(interval.isStop()).toBeFalsy();
//            expect(interval.canClear()).toBeTruthy();
        });
    });

    describe("create", function () {
        it("创建实例", function () {
        });
    })
});
