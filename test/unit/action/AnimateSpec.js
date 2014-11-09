describe("Animate.js", function () {
    var animate = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        animate = new YE.Animate();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
        it("获得精灵的一个动画", function () {
            var fakeAnimation = {};

            animate = new YE.Animate(fakeAnimation);

            expect(animate.ye___anim).toEqual(fakeAnimation);
        });
    });

    describe("initWhenCreate", function () {
        var fakeFrames = null,
            fakeFrame1 = null,
            fakeFrame2 = null,
            fakeAnimation = null;

        beforeEach(function () {
            fakeFrame1 = {};
            fakeFrame2 = {};
            fakeFrames = [
                fakeFrame1,
                fakeFrame2
            ];
            fakeAnimation = {
                getFrames: sandbox.stub().returns(fakeFrames),
                getDurationPerFrame: function () {
                },
                setFrameIndex: sandbox.stub()
            };
            animate = new YE.Animate(fakeAnimation);
        });

        it("创建帧集合", function () {
            animate.initWhenCreate();

            expect(animate.ye___frames).toBeInstanceOf(YE.Collection);
        });
        it("获得当前播放动画的所有帧", function () {
            animate.initWhenCreate();

            expect(fakeAnimation.getFrames).toCalled();
        });
        it("获得每帧持续时间", function () {
            sandbox.stub(fakeAnimation, "getDurationPerFrame");

            animate.initWhenCreate();

            expect(fakeAnimation.getDurationPerFrame).toCalledOnce();
        });
        it("获得当前播放动画的所有帧的数量", function () {
            animate.initWhenCreate();

            expect(animate.ye___frameCount).toEqual(2);
        });
        it("设置每帧的序号", function () {
            animate.initWhenCreate();

            expect(animate.ye___anim.setFrameIndex).toCalledWith(fakeFrames);
        });
        it("设置当前帧为第1帧", function () {
            animate.initWhenCreate();

            expect(animate.ye___currentFrameIndex).toEqual(0);
            expect(animate.ye___currentFramePlayed).toEqual(0);
        });
    });


    describe("update", function () {
        var fakeTarget = null;
        var deltaTime = null;

        beforeEach(function () {
            deltaTime = 10;

            sandbox.stub(animate, "ye___anim", {
                getAnimSize: sandbox.stub()
            });
            sandbox.stub(animate, "ye___currentFrame", {
                setCacheData: sandbox.stub()
            });
            fakeTarget = sandbox.createSpyObj("setDisplayFrame");
            sandbox.stub(animate, "getTarget").returns(fakeTarget);
        });

        it("如果当前帧未播放完毕，则加上本次播放时间", function () {
            sandbox.stub(animate, "ye___currentFramePlayed", 10);
            sandbox.stub(animate, "ye___duration", 20);

            animate.update(deltaTime);

            expect(animate.ye___currentFramePlayed).toEqual(10 + deltaTime);
        });

        describe("否则", function () {
            beforeEach(function () {
                sandbox.stub(animate, "ye___currentFramePlayed", 20);
                sandbox.stub(animate, "ye___duration", 20);
            });

            it("如果最后一帧播放完毕，则结束动作并返回", function () {
                sandbox.stub(animate, "ye___currentFrameIndex", 2);
                sandbox.stub(animate, "ye___frameCount", 3);
                sandbox.stub(animate, "finish");

                var result = animate.update();

                expect(animate.finish).toCalledOnce();
                expect(result).toEqual(YE.returnForTest);
            });

            it("否则，播放下一帧", function () {
                sandbox.stub(animate, "ye___currentFrameIndex", 1);
                sandbox.stub(animate, "ye___frameCount", 3);
                sandbox.stub(animate, "ye___setCurrentFrame");

                animate.update();

                expect(animate.ye___setCurrentFrame).toCalledWith(2);
            });
        });

        it("将动画数据animSize保存到当前帧中", function () {
            var animSize = {width: 1, height: 2};
            animate.ye___anim.getAnimSize.returns(animSize);

            animate.update();

            expect(animate.ye___currentFrame.setCacheData).toCalledWith("animSize", animSize);
        });
        it("设置当前帧为target的播放帧", function () {
            animate.update();

            expect(fakeTarget.setDisplayFrame).toCalledWith(animate.ye___currentFrame);
        });
    });

    describe("ye___setCurrentFrame", function () {
        var fakeFrame = null;

        beforeEach(function () {
            fakeFrame = {};
            sandbox.stub(animate, "ye___frames", {
                getChildAt: sandbox.stub().returns(fakeFrame)
            });
        });

        it("设置当前帧序号", function () {
            animate.ye___setCurrentFrame(2);

            expect(animate.ye___currentFrameIndex).toEqual(2);
        });
        it("设置序号对应的当前帧", function () {
            animate.ye___setCurrentFrame(2);

            expect(animate.ye___currentFrame).toEqual(fakeFrame);
            expect(animate.ye___frames.getChildAt).toCalledWith(2);
        });
        it("重置当前帧播放帧时间", function () {
            animate.ye___setCurrentFrame(2);

            expect(animate.ye___currentFramePlayed).toEqual(0);
        });
    });

    describe("reset", function () {
//        it("调用父类同名方法", function () {
//        });
        it("重置播放的动画", function () {
            sandbox.stub(animate, "ye___setCurrentFrame");

            animate.reset();

            expect(animate.ye___setCurrentFrame).toCalledWith(0);
        });
    });

    describe("copy", function () {
        it("返回动作副本，拷贝animation", function () {
            var fakeAnimate = {};
            sandbox.stub(YE.Animate, "create").returns(fakeAnimate);
            animate.ye___anim = sandbox.createSpyObj("copy");

            var result = animate.copy();

            expect(result).toEqual(fakeAnimate);
            expect(animate.ye___anim.copy).toCalledOnce();
        });
    });

    describe("reverse", function () {
        var fakeFrame1 = null,
            fakeFrame2 = null,
            fakeAnimation = null;

        function createFramesContainer() {
            animate.ye___frames = YE.Collection.create();
        }

        beforeEach(function () {
            fakeFrame1 = {
                a: 1
            };
            fakeFrame2 = {
                b: 1
            };
            fakeAnimation = {
                setFrameIndex: sandbox.stub()
            };
            createFramesContainer();
            animate.ye___frames.addChilds([
                fakeFrame1,
                fakeFrame2
            ]);
            sandbox.stub(animate, "ye___anim", fakeAnimation);
        });

        it("动画播放顺序反向", function () {
            var result = animate.reverse();

            expect(result.ye___frames.getChilds()).toEqual([fakeFrame2, fakeFrame1]);
        });
        it("刷新每帧的序号", function () {
            var frames = [];
            sandbox.stub(animate.ye___frames, "getChilds").returns(frames);

            var result = animate.reverse();

            expect(fakeAnimation.setFrameIndex).toCalledWith(frames);
        });
        it("当前帧反序", function () {
            animate.reset();

            var result = animate.reverse();

            expect(result.ye___currentFrame).toEqual(fakeFrame2);
        });
//        it("设置精灵的当前动画帧为反序后的当前帧", function () {
//            animate.reset();
//
//            animate.reverse();
//
//            expect(fakeTarget.setDisplayFrame).toCalledWith(fakeFrame2);
//        });
    });

//    describe("getCurrentFrame", function () {
//        it("获得当前帧", function () {
//        });
//    });
//
//    describe("getAnimSize", function () {
//        it("获得显示大小", function () {
//            var size = {width: 100, height: 200};
//            sandbox.stub(animate, "ye___anim", {
//                getAnimSize: sandbox.stub().returns(size)
//            });
//
//            var result = animate.getAnimSize();
//
//            expect(result).toEqual(size);
//        });
//    });


    describe("create", function () {
//        var fakeFrame1 = {},
//            fakeAnimation = {
//                getFrames: function () {
//                    return [
//                        fakeFrame1
//                    ];
//                },
//                getDurationPerFrame: function () {
//                }
//            };
//
//        it("创建Animate实例并返回", function () {
//            expect(YE.Animate.create(fakeAnimation)).toBeInstanceOf(YE.Animate);
//        });
    });
});