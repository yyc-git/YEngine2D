/**YEngine2D
 * author：YYC
 * date：2014-01-13
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Frame", function () {
    var frame = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        frame = YE.Frame.create({}, []);
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
        it("获得bitmap和rect实例", function () {
        });
    });

    it("index属性保存在动画中的帧序号，默认为-1", function () {
        expect(frame.index).toEqual(-1);
    });

    describe("操作bitmap", function () {
        var fakeBitmap = null;

        beforeEach(function () {
            fakeBitmap = {};
            frame.setBitmap(fakeBitmap);
        });

        describe("getImg", function () {
            it("获得bitmap的图片对象", function () {
                var fakeImg = {};
                fakeBitmap.img = fakeImg;

                expect(frame.getImg()).toEqual(fakeImg);
            });
        });

        describe("getBitmap", function () {
            it("获得bitmap", function () {
                expect(frame.getBitmap()).toBeSame(fakeBitmap);
            });
        });

        describe("setAnchor", function () {
            it("设置bitmap锚点", function () {
                fakeBitmap.setAnchor = sandbox.stub();

                frame.setAnchor(10, 20);

                expect(fakeBitmap.setAnchor).toCalledWith(10,20);
            });
        });

        describe("setFlipX", function () {
            it("设置bitmap的x轴翻转", function () {
                fakeBitmap.setFlipX = sandbox.stub();

                frame.setFlipX();

                expect(fakeBitmap.setFlipX).toCalledOnce();
            });
        });

        describe("setFlipY", function () {
            it("设置bitmap的y轴翻转", function () {
                fakeBitmap.setFlipY = sandbox.stub();

                frame.setFlipY();

                expect(fakeBitmap.setFlipY).toCalledOnce();
            });
        });

        describe("getPixelOffsetX", function () {
            it("获得bitmap的x轴偏移量", function () {
                fakeBitmap.pixelOffsetX = 10;

                expect(frame.getPixelOffsetX()).toEqual(10);
            });
        });

        describe("getPixelOffsetY", function () {
            it("获得bitmap的y轴偏移量", function () {
                fakeBitmap.pixelOffsetY = 10;

                expect(frame.getPixelOffsetY()).toEqual(10);
            });
        });
    });


    describe("copy", function () {
        it("返回副本，共享rect，但是获得bitmap的副本", function () {
            var bitmapCopy = {a: 1};
            var fakeBitmap = {
                copy: sandbox.stub().returns(bitmapCopy)
            } ;
            var fakeRect = {b: 1};
            frame = YE.Frame.create(fakeBitmap, fakeRect);

            var result = frame.copy();

            expect(result).toBeInstanceOf(YE.Frame);
            expect(result).not.toBeSame(frame);
            expect(result.getBitmap()).toEqual(bitmapCopy);
            expect(result.ye_rect).toBeSame(fakeRect);
        });
    });

    describe("获得在大图片中切出该帧使用图片的数据", function () {
        var frame = null,
            bimap = {},
            rect = {
                origin: {x: 1, y: 2},
                size: {width: 10, height: 20}
            };

        beforeEach(function () {
            frame = YE.Frame.create(bimap, rect);
        });

        describe("getX", function () {
            it("获得起点的x坐标", function () {
                expect(frame.getX()).toEqual(1);
            });
        });
        describe("getY", function () {
            it("获得起点的y坐标", function () {
                expect(frame.getY()).toEqual(2);
            });
        });
        describe("getWidth", function () {
            it("获得切出的宽度", function () {
                expect(frame.getWidth()).toEqual(10);
            });
        });
        describe("getHeight", function () {
            it("获得切出的高度", function () {
                expect(frame.getHeight()).toEqual(20);
            });
        });
    });
});