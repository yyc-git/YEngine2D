describe("MoveBy", function () {
    var action = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = new YE.MoveBy();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
        it("获得移动时间、移动相对距离", function () {
            action = new YE.MoveBy(1, 2, 3);

            expect(action.ye___duration).toEqual(1);
            expect(action.ye___x).toEqual(2);
            expect(action.ye___y).toEqual(3);
        });
    });

    describe("init", function () {
        var fakeTarget = null;

        beforeEach(function () {
            fakeTarget = {
                getPositionX: sandbox.stub(),
                getPositionY: sandbox.stub()
            };
            sandbox.stub(action, "getTarget").returns(fakeTarget);
        });

        it("计算目的地坐标", function () {
            fakeTarget.getPositionX.returns(100);
            sandbox.stub(action, "ye___x", 10);
            fakeTarget.getPositionY.returns(200);
            sandbox.stub(action, "ye___y", -20);

            action.init();

            expect(action.ye___destX).toEqual(100 + 10);
            expect(action.ye___destY).toEqual(200 - 20);
        });
    });

    describe("update", function () {
        var fakeTarget = null;

        beforeEach(function () {
            fakeTarget = {
                setPosition: sandbox.stub(),
                setPositionX: sandbox.stub(),
                setPositionY: sandbox.stub(),
                getPositionX: sandbox.stub(),
                getPositionY: sandbox.stub()
            };
            sandbox.stub(action, "getTarget").returns(fakeTarget);
        });

        describe("如果完成了动作", function () {
            beforeEach(function () {
                sandbox.stub(action, "finish");
                sandbox.stub(action, "ye___elapsed", 1);
                sandbox.stub(action, "ye___duration", 1);
            });

            it("完成动作", function () {
                action.update();

                expect(action.finish).toCalledOnce();
            });
            it("将精灵定位到目的地坐标", function () {
                sandbox.stub(action, "ye___destX", 10);
                sandbox.stub(action, "ye___destY", 20);

                action.update();

                expect(fakeTarget.setPosition).toCalledWith(10, 20);
            });
        });

        describe("否则", function () {
            var time = null;

            beforeEach(function () {
                time = 0.1;
                sandbox.stub(action, "ye___elapsed", 0);
                sandbox.stub(action, "ye___duration", 1);
            });
            afterEach(function () {
            });

            it("计算精灵在本次更新中移动的距离，并更新精灵坐标", function () {
                var ratio = time / action.ye___duration;
                sandbox.stub(action, "ye___x", 50);
                sandbox.stub(action, "ye___y", 100);
                fakeTarget.getPositionX.returns(1);
                fakeTarget.getPositionY.returns(2);

                action.update(time);

                expect(fakeTarget.setPositionX).toCalledWith(1 + ratio * 50);
                expect(fakeTarget.setPositionY).toCalledWith(2 + ratio * 100);
            });

            it("记录已经过的时间", function () {
                action.update(time);

                expect(action.ye___elapsed).toEqual(0.1);
            });
        });
    });

    describe("copy", function () {
        it("返回动作副本", function () {
            var result = action.copy();

            expect(result).not.toBeSame(action);
            expect(result).toBeInstanceOf(YE.MoveBy);
        });
    });

    describe("reverse", function () {
        it("反转跳跃的距离", function () {
            sandbox.stub(action, "ye___x", 10);
            sandbox.stub(action, "ye___y", 20);

            var result = action.reverse();

            expect(result.ye___x).toEqual(-10);
            expect(result.ye___y).toEqual(-20);
        });
    });
});
