describe("RepeatForever", function () {
    var action = null;
    var sandbox = null;

    function init(innerAction) {
        action.ye____innerAction = innerAction;
    }

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = new YE.RepeatForever();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("update", function () {
        var fakeAction = null;

        it("更新内部动作", function () {
            fakeAction = {
                update: sandbox.stub(),
                isFinish: sandbox.stub().returns(false)
            };
            init(fakeAction);

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
                init(fakeAction);
            });

            it("重置内部动作", function () {
                action.update(1);

                expect(fakeAction.reset).toCalledOnce();

            });
        });
    });

    describe("isFinish", function () {
        it("因为一直重复，所以一直要不能完成", function () {
            expect(action.isFinish()).toBeFalsy();
        });
    });

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

//    describe("start", function () {
//        it("调用父类同名方法", function () {
//        });
//        it("启动动作", function () {
//            buildFake("start");
//            action.forTest_init(fakeAction);
//
//            action.start();
//
//            expect(fakeAction.start).toHaveBeenCalled();
//        });
//    });

    describe("copy", function () {
        it("返回动作副本", function () {
            var copyAction = {},
                copyAction1 = {a: 1};
            sandbox.stub(action, "ye____innerAction",
                {copy: sandbox.stub().returns(copyAction1)}
            );
            sandbox.stub(YE.RepeatForever, "create").returns(copyAction);

            var result = action.copy();

            expect(result).toEqual(copyAction);
            expect(YE.RepeatForever.create).toCalledWith(copyAction1);
        });
    });
//
//    describe("reverse", function () {
//        it("动作反向", function () {
//            buildFake("reverse");
//            action.forTest_init(fakeAction);
//
//            action.reverse();
//
//            expect(fakeAction.reverse).toHaveBeenCalled();
//        });
//    });

    describe("create", function () {
        it("创建RepeatForever实例并返回", function () {
            expect(YE.RepeatForever.create({
                copy: function () {
                }
            })).toBeInstanceOf(YE.RepeatForever);
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
//            action = YE.RepeatForever.create(fake, 5);
//
//            action.ye____innerAction.c = {};
//
//            expect(fake.c).toBeUndefined();
//        });
    });
});