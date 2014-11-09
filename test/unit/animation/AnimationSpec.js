/**YEngine2D
 * author：YYC
 * date：2014-01-13
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Animation", function () {
    var animation = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
        it("获得动画的所有帧和配置参数", function () {
        });
    });


    describe("getFrames", function () {
        it("获得动画的所有帧", function () {
        });
    });

    describe("getAnimSize", function () {
        it("获得动画的显示大小", function () {
        });
    });

    describe("getDurationPerFrame", function () {
        it("获得每帧的持续时间", function () {
            var config = {
                duration: 1
            };
            animation = new YE.Animation([], config);

            expect(animation.getDurationPerFrame()).toEqual(1);
        });
    });

    describe("initWhenCreate", function () {
        var config = {},
            fakeBitmap1 = null,
            fakeBitmap2 = null,
            fakeFrame1 = null,
            fakeFrame2 = {};

        beforeEach(function () {
            fakeBitmap1 = sandbox.createSpyObj("setFlipX", "setFlipY", "setAnchor");
            fakeFrame1 = {
                getBitmap: sandbox.stub().returns(fakeBitmap1),
                setBitmap: sandbox.stub()
            };
            fakeFrame2 = {
                getBitmap: sandbox.stub().returns(fakeBitmap2),
                setBitmap: sandbox.stub()
            };
            animation = new YE.Animation([fakeFrame1, fakeFrame2], config);
        });
        afterEach(function () {
        });

        it("获得帧的bitmap（因为动画的每帧的bitmap都一样，所以直接获得第1帧的bitmap即可）", function () {
            animation.initWhenCreate();

            expect(fakeFrame1.getBitmap).toCalledOnce();
            expect(fakeFrame2.getBitmap).not.toCalled();
        });
        it("如果要x轴翻转，则设置bitmap", function () {
            config.flipX = true;

            animation.initWhenCreate();

            expect(fakeBitmap1.setFlipX).toCalledOnce();
        });
        it("如果要y轴翻转，则设置bitmap", function () {
            config.flipY = true;

            animation.initWhenCreate();

            expect(fakeBitmap1.setFlipY).toCalledOnce();
        });
        it("设置bitmap的锚点", function () {
            config.pixelOffsetX = 10;
            config.pixelOffsetY = 20;

            animation.initWhenCreate();

            expect(fakeBitmap1.setAnchor).toCalledWith(10, 20);
        });
        it("更新每帧frame的bitmap为设置后的bitmap", function () {
            animation.initWhenCreate();

            expect(fakeFrame1.setBitmap).toCalledWith(fakeBitmap1);
            expect(fakeFrame2.setBitmap).toCalledWith(fakeBitmap1);
        });
    });

    describe("copy", function () {
        beforeEach(function () {
            sandbox.stub(YE.Animation, "create");
        });
        afterEach(function () {
        });

        it("拷贝frames", function () {
            var frame1 = sandbox.createSpyObj("copy"),
                frame2 = sandbox.createSpyObj("copy");
            animation.ye_frames = [frame1, frame2];

            animation.copy();

            expect(frame1.copy).toCalledOnce();
            expect(frame2.copy).toCalledOnce();
        });
        it("拷贝config", function () {
            sandbox.stub(YE.Tool.extend, "extend");

            animation.copy();

            expect(YE.Tool.extend.extend).toCalledOnce();
        });
        it("创建animation实例并返回", function () {
            animation.copy();

            expect(YE.Animation.create).toCalledOnce();
        });
    });

    describe("setFrameIndex", function () {
        it("设置帧序列中每个帧的序号", function () {
            var frame1 = {},
                frame2 = {a: 1},
                frame3 = {b: 1};
            var frames = [frame1, frame2, frame3];

            animation.setFrameIndex(frames);

            expect(frame1.index).toEqual(0);
            expect(frame2.index).toEqual(1);
            expect(frame3.index).toEqual(2);
        });
    });
});