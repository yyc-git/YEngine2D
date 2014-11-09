/**YEngine2D
 * author：YYC
 * date：2014-01-22
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Spawn", function () {
    var action = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = new YE.Spawn();
    });
    afterEach(function () {
        sandbox.restore();
    });

//    describe("init", function () {
//        var fake1 = {},
//            fake2 = {
//                a: 1
//            }       ,
//            fake3 = {
//                b: 2
//            };
//
//        beforeEach(function () {
//        });
//
//        it("获得第1部分动作和第2部分动作。" +
//            "其中第2部分只包含最后一个动作，而第1部分包含它之前的所有动作", function () {
//            action.forTest_init([fake1, fake2, fake3]);
//
//            expect(action.forTest_getOne()).toEqual([fake1, fake2]);
//            expect(action.forTest_getTwo()).toEqual(fake3);
//        });
//    });

//    describe("setTarget", function () {
//        it("调用父类同名方法", function () {
//        });
//        it("设置每个动作的target", function () {
//            var target = {};
//            var fakeAction1 = sinon.createSpyObj("setTarget"),
//                fakeAction2 = sinon.createSpyObj("setTarget");
//            action.forTest_init([fakeAction1, fakeAction2]);
//
//            action.setTarget(target);
//
//            expect(fakeAction1.setTarget.calledWith(target));
//            expect(fakeAction2.setTarget.calledWith(target));
//        });
//    });

    describe("update", function () {
        function buildFakeAction(isFinish) {
            return {
                isFinish: sandbox.stub().returns(isFinish),
                update: sandbox.stub()
            };
        }

        describe("判断是否完成动作", function () {
            beforeEach(function () {
                sandbox.stub(action, "finish");
            });
            afterEach(function () {
            });

            it("如果每个动作都完成了，则完成动作", function () {
                sandbox.stub(action, "ye____actions", [
                    buildFakeAction(true), buildFakeAction(true)
                ]);

                action.update();

                expect(action.finish).toCalledOnce();
            });
            it("否则，不调用finish", function () {
                sandbox.stub(action, "ye____actions", [
                    buildFakeAction(true), buildFakeAction(false)
                ]);

                action.update();

                expect(action.finish).not.toCalled();
            });
        });

        it("依次调用每个未完成的动作的update", function () {
            var action1 = buildFakeAction(true),
                action2 = buildFakeAction(false),
                action3 = buildFakeAction(false);

            sandbox.stub(action, "ye____actions", [
                action1, action2, action3
            ]);

            action.update(1);

            expect(action1.update).not.toCalled();
            expect(action2.update).toCalledOnce();
            expect(action3.update).toCalledOnce();
            expect(action2.update).toCalledBefore(action3);
        });
    });

//    describe("getTarget", function () {
//        it("获得所有动作的target，返回数组", function () {
//            var target1 = {},
//                target2 = {a: 1},
//                target3 = {b: 1};
//            build("getTarget");
//            sinon.stub(fake1, "getTarget").returns(target1);
//            sinon.stub(fake2, "getTarget").returns(target2);
//            sinon.stub(fake3, "getTarget").returns(target3);
//
//            var target = action.getTarget();
//
//            expect(target).toEqual([target1, target2, target3]);
//        });
//    });

    function buildFakeActions(method) {
        var action1 = sandbox.createSpyObj(method),
            action2 = sandbox.createSpyObj(method);
//        action1.isFinish = sandbox.stub().returns(false);
//        action2.isFinish = sandbox.stub().returns(false);

        return [action1, action2];
    }

    describe("调用所有内部动作的方法", function () {
        function judgeIterator(method) {
            var actions = buildFakeActions(method),
                action1 = actions[0],
                action2 = actions[1];
            sandbox.stub(action, "ye____actions", actions);
            action.stubParentMethod(sandbox, method);

            action[method]();

            expect(action1[method]).toCalledOnce();
            expect(action2[method]).toCalledOnce();
            expect(action1[method]).toCalledBefore(action2[method]);
        }

        function judgeIteratorWithArg(method, arg) {
            var actions = buildFakeActions(method),
                action1 = actions[0],
                action2 = actions[1];
            sandbox.stub(action, "ye____actions", actions);

            action[method](arg);

            expect(action1[method]).toCalledWith(arg);
            expect(action2[method]).toCalledWith(arg);
        }

        beforeEach(function () {
        });
        afterEach(function () {
        });

        describe("start", function () {
            it("调用所有动作的start", function () {
                judgeIterator("start");
            });
        });

        describe("stop", function () {
            it("调用所有动作的stop", function () {
                judgeIterator("stop");
            });
        });

        describe("reset", function () {
            it("调用所有动作的reset", function () {
                judgeIterator("reset");
            });
        });

        describe("setTarget", function () {
            it("设置所有动作的target", function () {
                judgeIteratorWithArg("setTarget", {});
            });
        });
    });

    describe("reverse", function () {
        it("将动作序列反转，并反转每个动作，返回反转后的动作", function () {
            var actions = buildFakeActions("reverse"),
                action1 = actions[0],
                action2 = actions[1];
            sandbox.stub(action, "ye____actions", actions);

            var result = action.reverse();

            expect(action1.reverse).toCalledOnce();
            expect(action2.reverse).toCalledOnce();
            expect(action1.reverse).toCalledAfter(action2.reverse);
            expect(result).toBeSame(action);
        });
    });

    describe("copy", function () {
//        it("拷贝动作序列", function () {
//            var actions = [
//                {},
//                {}
//            ];
//            sandbox.stub(action,"ye____actions",actions);
//
//            var result = action.copy();
//
//            expect(result.ye____actions).toEqual(actions);
//            expect(result.ye____actions).not.toBeSame(actions);
//        });
//        it("返回动作副本", function () {
//            var result = action.copy();
//
//            expect(result).not.toBeSame(action);
//            expect(result).toBeInstanceOf(YE.Spawn);
//        });

        it("返回动作副本，拷贝内部动作", function () {
            var copyAction = {},
                copyAction1 = {a: 1},
                copyAction2 = {b: 1};
            sandbox.stub(action, "ye____actions", [
                {
                    copy: sandbox.stub().returns(copyAction1)
                },
                {
                    copy: sandbox.stub().returns(copyAction2)
                }
            ]);
            sandbox.stub(YE.Spawn, "create").returns(copyAction);

            var result = action.copy();

            expect(result).toEqual(copyAction);
            expect(YE.Spawn.create).toCalledWith(copyAction1, copyAction2);
        });
    });

    describe("getInnerActions", function () {
        it("获得内部动作", function () {
            var actions = [
                {},
                {a: 1}
            ];
            sandbox.stub(action, "ye____actions", actions);

            expect(action.getInnerActions()).toEqual(actions);
        });
    });
//
//    describe("getCurrentAction", function () {
//        it("获得当前运行的动作", function () {
//            var currentAction = {},
//                fakeAction = [currentAction, {a: 1}];
//            action.forTest_init(fakeAction);
//
//            expect(action.getCurrentAction()).toEqual(currentAction);
//        });
//    });

    describe("create", function () {
        it("如果参数小于2，则断言", function () {
            sandbox.stub(YE.main, "getConfig").returns({
                isDebug: true
            });

            expect(function () {
                YE.Spawn.create({});
            }).toAssert();
            expect(function () {
                YE.Spawn.create({}, {});
            }).not.toAssert();
            expect(function () {
                YE.Spawn.create({}, {}, {});
            }).not.toAssert();

            sandbox.restore();
        });
        it("创建实例并返回", function () {
            expect(YE.Spawn.create({})).toBeInstanceOf(YE.Spawn);
        });
        it("初始化动作", function () {
        });
    })
});

