/**YEngine2D
 * author：YYC
 * date：2014-01-11
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    YE.Frame = YYC.Class(YE.Entity, {
        Init: function (bitmap, rect) {
            this.base();

            this.ye_bitmap = bitmap;
            this.ye_rect = rect;
        },
        Private: {
            ye_bitmap: null,
            ye_rect: {}
        },
        Public: {
            index: -1,

            getImg: function () {
                return this.getBitmap().img;
            },
            getBitmap: function () {
                return this.ye_bitmap;
            },
            setBitmap: function (bitmap) {
                this.ye_bitmap = bitmap;
            },
            getPixelOffsetX: function () {
                return this.getBitmap().pixelOffsetX;
            },
            getPixelOffsetY: function () {
                return this.getBitmap().pixelOffsetY;
            },
            setAnchor: function (pixelOffsetX, pixelOffsetY) {
                this.getBitmap().setAnchor(pixelOffsetX, pixelOffsetY);
            },
            setFlipX: function () {
                this.getBitmap().setFlipX();
            },
            setFlipY: function () {
                this.getBitmap().setFlipY();
            },
            isFlipX: function () {
                return this.getBitmap().isFlipX();
            },
            isFlipY: function () {
                return this.getBitmap().isFlipY();
            },
            getX: function () {
                return this.ye_rect.origin.x;
            },
            getY: function () {
                return this.ye_rect.origin.y;
            },
            getWidth: function () {
                return this.ye_rect.size.width;
            },
            getHeight: function () {
                return this.ye_rect.size.height;
            },
            copy: function () {
                return YE.Frame.create(this.getBitmap().copy(), this.ye_rect);
            }
        },
        Static: {
            create: function (bitmap, rect) {
                return new this(bitmap, rect);
            }
        }
    });
}());
