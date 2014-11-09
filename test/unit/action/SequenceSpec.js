describe("Sequence", function () {
    var action = null;
    var sandbox = null;

    function setAcions(actions) {
        var actionArr = Array.prototype.slice.call(arguments, 0);

        action.ye____actions = YE.Collection.create().addChilds(actionArr);
    }

//    function init(actions) {
//        action.ye____actions = YE.Collection.create().addChilds(actions);
//        action.ye____currentAction = action.ye____actions.getChildAt(0);
//        action.ye____actionIndex = 0;
//    }

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = YE.Sequence.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("initWhenCreate", function () {
        var fakeAction1 = null,
            fakeAction2 = null;

        beforeEach(function () {
            fakeAction1 = {
            };
            fakeAction2 = {
                a: 1
            };
//            init([fakeAction1, fakeAction2]);
        });

        it("创建动作容器", function () {
            action.initWhenCreate();

            expect(action.ye____actions).toBeInstanceOf(YE.Collection);
        });
        it("加入内部动作", function () {
            var actionArr = [
                {}
            ];

            action.initWhenCreate(actionArr);

            expect(action.ye____actions.getCount()).toEqual(1);
        });
        it("获得当前动作", function () {
            action.initWhenCreate([fakeAction1, fakeAction2]);

            expect(action.ye____currentAction).toEqual(fakeAction1);
        });
        it("动作序号设为0", function () {
            action.initWhenCreate();

            expect(action.ye____actionIndex).toEqual(0);
        });
    });

    describe("update", function () {
        beforeEach(function () {
        });


        it("如果已完成所有动作，则标志完成并返回", function () {
            sandbox.stub(action, "finish");
            sandbox.stub(action.ye____actions, "getCount").returns(0);

            action.update(1);

            expect(action.finish).toCalledOnce();
        });

        describe("否则", function () {
            var fakeAction = null;

            it("根据动作序号，获得当前执行的动作", function () {
                action.ye____actionIndex = 0;
                fakeAction = {
                    isFinish: sandbox.stub().returns(false),
                    update: sandbox.stub()
                };
                setAcions(fakeAction);
                sandbox.spy(action.ye____actions, "getChildAt");

                action.update(1);

                expect(action.ye____currentAction).toEqual(fakeAction);
                expect(action.ye____actions.getChildAt).toCalledWith(0);
            });

            describe("如果当前动作没有完成", function () {
                beforeEach(function () {
                    fakeAction = {
                        isFinish: sandbox.stub().returns(false),
                        update: sandbox.stub()
                    };
                });

                it("更新当前动作并返回", function () {
                    setAcions(fakeAction, {});

                    var result = action.update(1);

                    expect(fakeAction.update).toCalledWith(1);
                    expect(result).toEqual(YE.returnForTest);
                });

//                    it("如果当前动作为最后一个动作且不需要清除精灵，则标志为不清除", function () {
//                        testTool.spyReturn(fakeAction, "canClear", false);
//                        setAcions(fakeAction);
//
//                        action.update(1);
//
//                        expect(action.canClear()).toBeFalsy();
//                    });
            });

            describe("否则", function () {
                beforeEach(function () {
                    fakeAction = {
                        isFinish: sandbox.stub().returns(true),
                        update: sandbox.stub(),
                        reset: sandbox.stub(),
                        stop: sandbox.stub()
                    };
                    setAcions(fakeAction);
                });

//                it("重置当前动作", function () {
//                    action.update(1);
//
//                    expect(fakeAction.reset).toCalledOnce();
//                });
//                it("停止当前动作", function () {
//                    action.update(1);
//
//                    expect(fakeAction.stop).toCalledOnce();
//                }) ;
                it("动作序号指向下一个动作", function () {
                    action.update(1);

                    expect(action.ye____actionIndex).toEqual(1);
                });
                it("更新下一个动作（递归调用自身）", function () {
                    sandbox.spy(action, "update");
                    setAcions(fakeAction);

                    action.update(1);

                    expect(action.update.callCount).toEqual(2);
                });
            });
        });
    });

    describe("reverse", function () {
        function buildFakeActions(method) {
            var action1 = sandbox.createSpyObj(method),
                action2 = sandbox.createSpyObj(method);
            action1.isFinish = sandbox.stub().returns(false);
            action2.isFinish = sandbox.stub().returns(false);

            return [action1, action2];
        }

//        beforeEach(function () {
//            action.stubParentMethod(sandbox, "reverse");
//        });
//
//        it("调用父类同名方法", function () {
//            action.reverse();
//
//            expect(action.lastBaseClassForTest.reverse).toCalledOnce();
//        });
//        it("反向动作序列", function () {
//            var fakeAction1 = {
//                },
//                fakeAction2 = {
//                    a: 1
//                };
//            init([fakeAction1, fakeAction2]);
//
//            action.reverse();
//
//            expect(action.getInnerActions().getChilds()).toEqual([fakeAction2, fakeAction1]);
//        });

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

//    describe("getCurrentFrame", function () {
//        it("返回当前动画的当前帧", function () {
//            var frame = {};
//            action.ye____currentAction = {
//                getCurrentFrame: sandbox.stub().returns(frame)
//            };
//
//            expect(action.getCurrentFrame()).toEqual(frame);
//        });
//    });
//
//    describe("getAnimSize", function () {
//        it("获得显示大小", function () {
//            var size = {width: 100, height: 200};
//            sandbox.stub(action, "ye____currentAction", {
//                getAnimSize: sandbox.stub().returns(size)
//            });
//
//            var result = action.getAnimSize();
//
//            expect(result).toEqual(size);
//        });
//    });

    describe("getInnerActions", function () {
        it("获得内部动作", function () {
            var fakeActionArr = [
                {},
                {a: 1}
            ];
            action.ye____actions = fakeActionArr;

            expect(action.getInnerActions()).toEqual(fakeActionArr);
        });
    });

//    describe("getCurrentAction", function () {
//        it("获得当前运行的动作", function () {
//            var currentAction = {},
//                fakeAction = [currentAction, {a: 1}];
//            init(fakeAction);
//
//            expect(action.getCurrentAction()).toEqual(currentAction);
//        });
//    });

    describe("copy", function () {
        it("返回动作副本，拷贝内部动作", function () {
            var copyAction = {},
                copyAction1 = {a: 1},
                copyAction2 = {b: 1};
            var fakeActions = YE.Collection.create().addChilds([
                {
                    copy: sandbox.stub().returns(copyAction1)
                },
                {
                    copy: sandbox.stub().returns(copyAction2)
                }
            ]);
            sandbox.stub(action, "ye____actions", fakeActions);
            sandbox.stub(YE.Sequence, "create").returns(copyAction);

            var result = action.copy();

            expect(result).toEqual(copyAction);
            expect(YE.Sequence.create).toCalledWith(copyAction1, copyAction2);
        });
    });

    describe("reset", function () {
        it("重置动作序号", function () {
            action.ye____actionIndex = 100;

            action.reset();

            expect(action.ye____actionIndex).toEqual(0);
        });
        it("重置每个内部动作", function () {
            action.ye____actions = {
                map: sandbox.stub()
            };

            action.reset();

            expect(action.ye____actions.map).toCalledWith("reset");
        });
    });


    describe("start", function () {
        it("启动当前动作", function () {
            var fakeActon = sandbox.createSpyObj("start");
            sandbox.stub(action, "ye____currentAction", fakeActon);

            action.start();

            expect(fakeActon.start).toCalledOnce();
        });
    });

    describe("stop", function () {
        it("停止当前动作", function () {
            var fakeActon = sandbox.createSpyObj("stop");
            sandbox.stub(action, "ye____currentAction", fakeActon);

            action.stop();

            expect(fakeActon.stop).toCalledOnce();
        });
    });

    describe("create", function () {
        function buildFakeAction() {
            return sandbox.createSpyObj("copy");
        }

        beforeEach(function () {
        });

        it("如果参数小于2，则断言", function () {
            sandbox.stub(YE.main, "getConfig").returns({
                isDebug: true
            });

            expect(function () {
                YE.Sequence.create(buildFakeAction());
            }).toAssert();
            expect(function () {
                YE.Sequence.create(buildFakeAction(), buildFakeAction());
            }).not.toAssert();
            expect(function () {
                YE.Sequence.create(buildFakeAction(), buildFakeAction(),
                    buildFakeAction());
            }).not.toAssert();

            sandbox.restore();
        });
//        it("获得每个动作的副本", function () {
//            var fakeAction1 = buildFakeAction(),
//                fakeAction2 = buildFakeAction();
//
//            action = YE.Sequence.create(fakeAction1, fakeAction2);
//
//            expect(fakeAction1.copy).toCalledOnce();
//            expect(fakeAction2.copy).toCalledOnce();
//        });
        it("创建实例并返回", function () {
            expect(YE.Sequence.create(buildFakeAction())).toBeInstanceOf(YE.Sequence);
        });
        it("初始化动作", function () {
        });
    });
});