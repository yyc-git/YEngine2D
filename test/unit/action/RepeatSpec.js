describe("Repeat", function () {
    var action = null;
    var sandbox = null;

    function init(innerAction, times) {
        action.ye____innerAction = innerAction;
        action.ye____times = times;
        action.ye____originTimes = times;
    }

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = new YE.Repeat();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("initWhenCreate", function () {
//        it("加入内部动作", function () {
//            var fakeAction = {};
//
//            action.initWhenCreate(fakeAction);
//
//            expect(action.ye____innerAction).toEqual(fakeAction);
//        });
        it("保存初始的重复次数", function () {
            action.ye____times = 5;

            action.initWhenCreate();

            expect(action.ye____originTimes).toEqual(5);
        });
    });

    describe("update", function () {
        it("如果已经重复了指定次数，则完成动作", function () {
            sandbox.stub(action, "finish");
            init({}, 5);
            action.ye____times = 0;

            action.update(1);

            expect(action.finish).toCalledOnce();
        });

        describe("否则", function () {
            var fakeAction = null;

            it("更新内部动作", function () {
                fakeAction = {
                    update: sandbox.stub(),
                    isFinish: sandbox.stub().returns(false)
                };
                init(fakeAction, 5);

                action.update(1);

                expect(fakeAction.update).toCalledWith(1);
            });

            describe("如果内部动作已经完成", function () {
                beforeEach(function () {
                    fakeAction = {
                        update: sandbox.stub(),
                        reset: sandbox.stub(),
                        isFinish: sandbox.stub().returns(true)
                    };
                    init(fakeAction, 5);
                });

                it("重复剩余次数-1", function () {
                    action.update(1);

                    expect(action.ye____times).toEqual(4);
                });
                it("如果完成的不是最后一个动作，则重置", function () {
                    action.ye____times = 2;

                    action.update(1);

                    expect(fakeAction.reset).toCalledOnce();

                });
            });
        });
    });

//    describe("getCurrentFrame", function () {
//        it("返回内部动画的当前帧", function () {
//            var frame = {};
////            var fakeAction = {
////                getTarget: function () {
////                    return target;
////                }
////            };
//            var fakeAction = {
//                getCurrentFrame: sandbox.stub().returns(frame)
//            };
//            sandbox.stub(action, "ye____innerAction", fakeAction);
//
//            expect(action.getCurrentFrame()).toEqual(frame);
//        });
//    });
//
//    describe("getAnimSize", function () {
//        it("获得显示大小", function () {
//            var size = {width: 100, height: 200};
//            sandbox.stub(action, "ye____innerAction", {
//                getAnimSize: sandbox.stub().returns(size)
//            });
//
//            var result = action.getAnimSize();
//
//            expect(result).toEqual(size);
//        });
//    });

//    describe("isFinish", function () {
//        it("判断是否完成动作", function () {
//        });
//    });

//    describe("canClear", function () {
//        it("判断是否清除精灵", function () {
//            action.ye____innerAction = testTool.spyReturn("canClear", true);
//
//            var flag = action.canClear();
//
//            expect(flag).toBeTruthy();
//            expect(action.ye____innerAction.canClear).toHaveBeenCalled();
//        });
//    });


    describe("copy", function () {
        it("返回动作副本，拷贝内部动作", function () {
            var copyAction = {},
                copyAction1 = {a: 1};
            sandbox.stub(action, "ye____innerAction",
                {copy: sandbox.stub().returns(copyAction1)}
            );
            sandbox.stub(YE.Repeat, "create").returns(copyAction);
            sandbox.stub(action, "ye____times", 10);

            var result = action.copy();

            expect(result).toEqual(copyAction);
            expect(YE.Repeat.create).toCalledWith(copyAction1, 10);
        });
    });

//    describe("reverse", function () {
//        it("内部动作反序", function () {
//             sandbox.stub(action, "ye____innerAction", sandbox.createSpyObj("reverse"));
//
//             action.reverse();
//
//            expect(action.ye____innerAction.reverse).toCalledOnce();
//        });
//    });

    describe("getInnerActions", function () {
        it("获得内部动作", function () {
            fakeAction = {};
            init(fakeAction, 5);

            expect(action.getInnerActions()).toEqual([fakeAction]);
        });
    });

//    describe("getCurrentAction", function () {
//        it("获得当前运行的动作", function () {
//            fakeAction = {};
//            init(fakeAction, 5);
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
        it("创建Repeat实例并返回", function () {
            expect(YE.Repeat.create({
                copy: function () {
                }
            })).toBeInstanceOf(YE.Repeat);
        });
        it("初始化实例", function () {
        });
//        it("获得动作的副本", function () {
//            var fake = {
//                copy: function () {
//                    return {}
//                }
//            };
//
//            action = YE.Repeat.create(fake, 5);
//
//            action.ye____innerAction.c = {};
//
//            expect(fake.c).toBeUndefined();
//        });
    });
});