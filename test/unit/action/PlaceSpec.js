describe("Place", function () {
    var action = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        action = new YE.Place();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
        beforeEach(function () {
        });
        afterEach(function () {
        });

        it("获得精灵x、y坐标", function () {
            action = new YE.Place(10, 20);

            expect(action.ye___posX).toEqual(10);
            expect(action.ye___posY).toEqual(20);
        });
    });

    describe("update", function () {
        it("设置精灵坐标", function () {
            var fakeTarget = {
                setPositionX: sandbox.stub(),
                setPositionY: sandbox.stub()
//                getPositionX: sandbox.stub().returns(1),
//                getPositionY: sandbox.stub().returns(2)
            };
            action = new YE.Place(10, 20);
            sandbox.stub(action, "getTarget").returns(fakeTarget);

            action.update();

            expect(fakeTarget.setPositionX).toCalledWith(10);
            expect(fakeTarget.setPositionY).toCalledWith(20);
        });
    });

    describe("copy", function () {
        it("返回动作副本", function () {
            var result = action.copy();

            expect(result).not.toBeSame(action);
            expect(result).toBeInstanceOf(YE.Place);
        });
    });

    describe("reverse", function () {
        it("反转移动的距离", function () {
            sandbox.stub(action, "ye___posX", 10);
            sandbox.stub(action, "ye___posY", 20);

            var result = action.reverse();

            expect(result.ye___posX).toEqual(-10);
            expect(result.ye___posY).toEqual(-20);
        });
    });
});
