describe("Action.js", function () {
    var action = null;

    function getInstance() {
        var T = YYC.Class(YE.Action, {
            Init: function () {
            },
            Public: {
                update: function (time) {
                },
                copy: function () {
                },
                start: function () {
                },
                stop: function () {
                },
                isStop: function () {
                },
                reverse: function () {
                }
            }
        });

        return new T();
    }

    beforeEach(function () {
        action = getInstance();
    });

    describe("setTarget", function () {
        it("设置target", function () {
        });
    });

    describe("getTarget", function () {
        it("获得target", function () {
        });
    });

    describe("isFinish", function () {
        it("判断是否完成动作", function () {
            expect(action.isFinish()).toBeNull();
            action.finish();
            expect(action.isFinish()).toBeTruthy();
        });
    });

    describe("finish", function () {
        it("设置完成标志", function () {
            action.finish();

            expect(action.isFinish()).toBeTruthy();
        });
        it("停止动作", function () {
            sinon.stub(action, "stop");

            action.finish();

            expect(action.stop).toCalledOnce();
        });
    });

    describe("isStart", function () {
        it("判断动作是否开始", function () {
        });
    });

    describe("reset", function () {
        it("重置完成标志", function () {
            action.ye_isFinish = true;

            action.reset();

            expect(action.isFinish()).toBeFalsy();
        });
    });

    describe("init", function () {
        it("初始化", function () {
        });
    });


    describe("自定义动作钩子", function () {
        it("onenter存在", function () {
            expect(action.onEnter).toBeExist();
        });
        it("onexit存在", function () {
            expect(action.onExit).toBeExist();
        });
    });
});