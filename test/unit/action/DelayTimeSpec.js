/**YEngine2D
 * author：YYC
 * date：2014-04-21
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("DelayTime", function () {
    var action = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = YE.DelayTime.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

//    describe("init", function () {
//        it("获得延迟时间", function () {
//        });
//    });

    describe("update", function () {
        it("如果第一次调用update，则设置elapsed为0，设置标志并返回", function () {
            sandbox.stub(action, "___firstTick", true);

            var result = action.update();

            expect(action.___firstTick).toBeFalsy();
            expect(action.___elapsed).toEqual(0);
            expect(result).toEqual(YE.returnForTest);
        });

        describe("否则", function () {
            beforeEach(function () {
                action.update();
            });

            it("计算运行时间", function () {
                action.update(10);

                expect(action.___elapsed).toEqual(10);
            });
            it("如果运行时间大于等于延迟时间，则完成动作", function () {
                sandbox.stub(action, "___delayTime", 9);
                sandbox.stub(action, "finish");

                action.update(9);

                expect(action.finish).toCalledOnce();
            });
        });
    });

    describe("copy", function () {
        it("返回动作拷贝", function () {
            sandbox.stub(action, "___delayTime", 10);

            var c = action.copy();

            expect(c).toBeInstanceOf(YE.DelayTime);
            expect(c === action).toBeFalsy();
            expect(c.___delayTime).toEqual(10);
        });
    });

    describe("reverse", function () {
        it("直接返回动作", function () {
            expect(action.reverse()).toBeSame(action);
        });
    });

    describe("create", function () {
        it("创建实例并返回", function () {
            expect(YE.DelayTime.create()).toBeInstanceOf(YE.DelayTime);
        });
    });
});
