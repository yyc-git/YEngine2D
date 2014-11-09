describe("Bitmap.js", function () {
    var bitmap = null;
    var dom = null;

    function insertDom() {
        dom = $("<img id='test_img' width='50' height='100'>");
        $("body").append(dom);
    }

    function removeDom() {
        dom.remove();
    }

    beforeEach(function () {
        insertDom();
        bitmap = YE.Bitmap.create($("#test_img")[0]);
    });
    afterEach(function () {
        removeDom();
    });

    describe("构造函数Init", function () {
        it("获得预加载后的图片对象、图片宽度、图片高度", function () {
            bitmap = YE.Bitmap.create($("#test_img")[0]);

            expect(bitmap.img).not.toBeNull();
            expect(bitmap.width).toEqual($("#test_img")[0].width);
            expect(bitmap.height).toEqual($("#test_img")[0].height);
        });
    });

    describe("setFlipX", function () {
        it("置水平翻转标志为true", function () {
            expect(bitmap.isFlipX()).toBeFalsy();

            bitmap.setFlipX();

            expect(bitmap.isFlipX()).toBeTruthy();
        });
        it("返回this，支持链式操作", function () {
            expect(bitmap.setFlipX()).toBeInstanceOf(YE.Bitmap);
        });
    });

    describe("setFlipY", function () {
        it("置垂直翻转标志为true", function () {
            expect(bitmap.isFlipY()).toBeFalsy();

            bitmap.setFlipY();

            expect(bitmap.isFlipY()).toBeTruthy();
        });
        it("返回this，支持链式操作", function () {
            expect(bitmap.setFlipY()).toBeInstanceOf(YE.Bitmap);
        });
    });

    describe("isFlipX", function () {
        it("判断是否水平翻转", function () {
        });
    });

    describe("isFlipY", function () {
        it("判断是否垂直翻转", function () {
        });
    });

    describe("setAnchor", function () {
        it("设置锚点", function () {
            bitmap.setAnchor(1, 2);

            expect(bitmap.pixelOffsetX).toEqual(1);
            expect(bitmap.pixelOffsetY).toEqual(2);
        });
        it("返回this，支持链式操作", function () {
            expect(bitmap.setAnchor()).toBeInstanceOf(YE.Bitmap);
        });
    });

    describe("copy", function () {
        it("返回副本，共享img", function () {
            var fakeImg = {a: 1};
            bitmap = YE.Bitmap.create(fakeImg);
            bitmap.setFlipX();
            bitmap.setFlipY();
            bitmap.setAnchor(10, 20);

            var result = bitmap.copy();

            expect(result).not.toBeSame(bitmap);
            expect(result).toBeInstanceOf(YE.Bitmap);
            expect(result.isFlipX()).toBeTruthy();
            expect(result.isFlipY()).toBeTruthy();
            expect(result.img).toEqual(bitmap.img); //共享img
            expect(result.pixelOffsetX).toEqual(10);
            expect(result.pixelOffsetY).toEqual(20);
        });
    });
});

