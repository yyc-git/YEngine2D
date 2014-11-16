/**YEngine2D
 * author：YYC
 * date：2014-05-17
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("SoundManager", function () {
    var manager = null;
    var sandbox = null;

    beforeEach(function () {
        manager = new YE.SoundManager();
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("该类为单例类", function () {
        testTool.judgeSingleInstance(YE.SoundManager);
    });

    describe("play", function () {
        var fakeSound1 = null,
            fakeSound2 = null;

        beforeEach(function () {
            fakeSound1 = sandbox.createSpyObj("play");
            fakeSound2 = sandbox.createSpyObj("play");
            sandbox.stub(YE.SoundLoader, "getInstance").returns({
                get: sandbox.stub().returns([fakeSound1, fakeSound2])
            });
        });
        afterEach(function () {
        });

        it("如果声音没有被加载，则返回", function () {
            YE.SoundLoader.getInstance.returns({
                get: sandbox.stub().returns(undefined)
            });

            var result = manager.play("");

            expect(result).toEqual(YE.returnForTest);
        });
        it("依次播放声音数组", function () {
            fakeSound1.getPlayState = sandbox.stub().returns(0);
            fakeSound2.getPlayState = sandbox.stub().returns(0);

            manager.play();
            manager.play();
            manager.play();

            expect(fakeSound1.play.firstCall).toCalledBefore(fakeSound2.play.firstCall);
            expect(fakeSound1.play.callCount).toEqual(2);
            expect(fakeSound2.play.callCount).toEqual(1);
        });
        it("如果声音正在播放，则不调用play方法播放声音", function () {
            fakeSound1.getPlayState = sandbox.stub().returns(0);
            fakeSound2.getPlayState = sandbox.stub().returns(1);

            manager.play();
            manager.play();

            expect(fakeSound1.play.callCount).toEqual(1);
            expect(fakeSound2.play.callCount).toEqual(0);
        });
    });
});
