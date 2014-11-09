/**YEngine2D
 * author：YYC
 * date：2014-04-21
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("CallFunc", function () {
    var action = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = new YE.CallFunc();
    });
    afterEach(function () {
    });

    describe("init", function () {
        it("获得方法上下文、方法、传入方法的参数数组", function () {
        });
    });

    describe("update", function () {
//        it("如果方法为空，则直接完成动作", function () {
//            sandbox.stub(action, "finish");
//
//            action.update();
//
//            expect(action.finish).toCalledOnce();
//        });

//        describe("否则", function () {
        var context = null,
            func = null,
            data = null,
            target = null;

        function setParam(func, context, dataArr) {
            action.ye___context = context;
            action.ye___callFunc = func;
            action.ye___dataArr = dataArr;
        }

        beforeEach(function () {
            context = {};
            func = sandbox.createSpyObj("call");
            data = 1;
            target = {a: 1};
            setParam(func, context, [data]);
            sandbox.stub(action, "getTarget").returns(target);
        });

        it("调用方法，设置其上下文为context，并传入target和参数数组", function () {
            action.update();

            expect(func.call).toCalledWith(context, target, [data]);
        });
        it("完成动作", function () {
            sandbox.stub(action, "finish");

            action.update();

            expect(action.finish).toCalledOnce();
        });
//        });
    });

    describe("copy", function () {
        it("返回动作副本", function () {
            var a = action.copy();

            expect(a).toBeInstanceOf(YE.CallFunc);
            expect(a === action).toBeFalsy();

        });
        it("传入的参数要进行深拷贝", function () {
            var data = {a: 1};
            action.ye___dataArr = [data];

            var a = action.copy();
            a.ye___dataArr[0].a = 100;

            expect(data.a).toEqual(1);
        });
    });

    describe("reverse", function () {
        it("直接返回动作", function () {
            expect(action.reverse()).toBeSame(action);
        });
    });

//    describe("isFinish", function () {
//        it("返回true", function () {
//            expect(action.isFinish()).toBeTruthy();
//        });
//    });


    describe("create", function () {
        it("创建实例并返回", function () {
            expect(YE.CallFunc.create()).toBeInstanceOf(YE.CallFunc);
        });
    });
});
   