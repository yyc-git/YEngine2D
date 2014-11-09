/**YEngine2D
 * author：YYC
 * date：2014-04-28
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("RepeatCondition", function () {
    var action = null,
        sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = new YE.RepeatCondition();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("initWhenCreate", function () {
        it("如果没有传入重复条件方法，则报错", function () {
            action.ye____conditionFunc = undefined;
            sandbox.stub(YE, "error");

            action.initWhenCreate();

            expect(YE.error).toCalled();
        });
    });

    describe("update", function () {
        it("运行重复条件方法并设置其上下文，如果返回false，则完成动作并返回", function () {
            action.ye____conditionFunc = {
                call: sandbox.stub().returns(false)
            };
            sandbox.stub(action, "finish");

            action.update();

            expect(action.finish).toCalledOnce();
        });
        it("如果内部动作完成，则完成动作并返回", function () {
            action.ye____conditionFunc = {
                call: sandbox.stub().returns(true)
            };
            sandbox.stub(action, "ye____innerAction", {
                isFinish: sandbox.stub().returns(true)
            });
            sandbox.stub(action, "finish");

            action.update();

            expect(action.finish).toCalledOnce();
        });
        it("否则，更新内部动作", function () {
            action.ye____conditionFunc = {
                call: sandbox.stub().returns(true)
            };
            sandbox.stub(action, "ye____innerAction", {
                isFinish: sandbox.stub().returns(false),
                update: sandbox.stub()
            });

            action.update(1);

            expect(action.ye____innerAction.update).toCalledWith(1);
        });
    });

    describe("copy", function () {
        it("返回动作副本，拷贝内部动作", function () {
            var context = {},
                conditionFunc = function () {
                };
            var copyAction = {},
                copyAction1 = {a: 1};
            sandbox.stub(action, "ye____innerAction",
                {copy: sandbox.stub().returns(copyAction1)}
            );
            sandbox.stub(YE.RepeatCondition, "create").returns(copyAction);
            sandbox.stub(action, "ye____context", context);
            sandbox.stub(action, "ye____conditionFunc", conditionFunc);

            var result = action.copy();

            expect(result).toEqual(copyAction);
            expect(YE.RepeatCondition.create).toCalledWith(copyAction1, context, conditionFunc);
        });
    });

    describe("getInnerActions", function () {
        function init(innerAction, context, conditionFunc) {
            action.ye____innerAction = innerAction;
            action.ye____context = context;
            action.ye____conditionFunc = conditionFunc;
        }

        it("获得内部动作", function () {
            var fakeAction = {};
            init(fakeAction);

            expect(action.getInnerActions()).toEqual([fakeAction]);
        });
    });

//    describe("getCurrentAction", function () {
//        it("获得当前运行的动作", function () {
//           var fakeAction = {};
//            action.forTest_init(fakeAction);
//
//            expect(action.getCurrentAction()).toEqual(fakeAction);
//        });
//    });

    describe("start", function () {
        it("启动当前动作", function () {
            var fakeActon = sandbox.createSpyObj("start");
            sandbox.stub(action, "ye____innerAction", fakeActon);

            action.start();

            expect(fakeActon.start).toCalledOnce();
        });
    });

    describe("stop", function () {
        it("停止当前动作", function () {
            var fakeActon = sandbox.createSpyObj("stop");
            sandbox.stub(action, "ye____innerAction", fakeActon);

            action.stop();

            expect(fakeActon.stop).toCalledOnce();
        });
    });

    describe("create", function () {
//        it("创建实例并返回", function () {
//            expect(YE.RepeatCondition.create({}, {}, function () {
//            })).toBeInstanceOf(YE.RepeatCondition);
//        });
//        it("初始化实例", function () {
//        });
    });
});
