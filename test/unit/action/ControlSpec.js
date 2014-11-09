/**YEngine2D
 * author：YYC
 * date：2014-04-23
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Control", function () {
    var action = null;
    var sandbox = null;

    function getInstance() {
        var T = YYC.Class(YE.Control, {
            Public: {
                getInnerActions: function () {
                },
//                getCurrentAction: function () {
//                },
                update: function () {
                },
                copy: function () {
                }
            }
        });

        return new T();
    }

    function judgeIterator(method) {
        var fakeAction1 = sandbox.createSpyObj(method),
            fakeAction2 = sandbox.createSpyObj(method);
        sandbox.stub(action, "getInnerActions").returns([fakeAction1, fakeAction2]);

        action[method]();

        expect(fakeAction1[method]).toCalledOnce();
        expect(fakeAction2[method]).toCalledOnce();
//
//        action.getInnerActions = sandbox.stub().returns({
//            iterate: function () {
//                fakeAction1[method]();
//                fakeAction2[method]();
//            }
//        });
//
//        action[method]();
//
//        expect(fakeAction1[method]).toCalledTwice();
//        expect(fakeAction2[method]).toCalledTwice();
    }

    function judgeIteratorWithArg(method, arg) {
        var fakeAction1 = sandbox.createSpyObj(method),
            fakeAction2 = sandbox.createSpyObj(method);
        sandbox.stub(action, "getInnerActions").returns([fakeAction1, fakeAction2]);

        action[method](arg);

        expect(fakeAction1[method]).toCalledWith(arg);
        expect(fakeAction2[method]).toCalledWith(arg);
//
//        action.getInnerActions = sandbox.stub().returns({
//            iterate: function () {
//                fakeAction1[method](arg);
//                fakeAction2[method](arg);
//            }
//        });
//
//        action[method](arg);
//
//        expect(fakeAction1[method]).toCalledWith(arg);
//        expect(fakeAction2[method]).toCalledWith(arg);
    }

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = getInstance();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("init", function () {
        it("初始化内部动作", function () {
            judgeIterator("init");
        });
    });

    describe("onEnter", function () {
        it("调用内部动作的onenter", function () {
            judgeIterator("onEnter");
        });
    });

    describe("onExit", function () {
        it("调用内部动作的onexit", function () {
            judgeIterator("onExit");
        });
    });

    describe("setTarget", function () {
        it("设置内部动作的target", function () {
            judgeIteratorWithArg("setTarget", {});
        });
    });

//    describe("start", function () {
//        it("启动当前动作", function () {
//            var fakeActon = sandbox.createSpyObj("start");
//            sandbox.stub(action, "getCurrentAction").returns(fakeActon);
//
//            action.start();
//
//            expect(fakeActon.start).toCalledOnce();
//        });
//    });
//
//    describe("stop", function () {
//        it("停止当前动作", function () {
//            var fakeActon = sandbox.createSpyObj("stop");
//            sandbox.stub(action, "getCurrentAction").returns(fakeActon);
//
//            action.stop();
//
//            expect(fakeActon.stop).toCalledOnce();
//        });
//    });

    describe("reverse", function () {
        it("反转内部动作", function () {
            judgeIterator("reverse");
        });
        it("获得反转后的动作", function () {
            sandbox.stub(action, "ye_P_iterate");

            expect(action.reverse()).toBeSame(action);
        });
    });

    describe("reset", function () {
        it("重置内部动作", function () {
            judgeIterator("reset");
        });
    });
});

