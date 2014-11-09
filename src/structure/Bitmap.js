(function () {
    YE.Bitmap = YYC.Class(YE.Entity, {
        Init: function (img) {
            this.base();

            this.img = img;
            this.width = this.img.width;
            this.height = this.img.height;
        },
        Private: {
            ye_isFlipX: false,
            ye_isFlipY: false
        },
        Public: {
            img: null,
            width: 0,
            height: 0,
            pixelOffsetX: 0,
            pixelOffsetY: 0,

            setFlipX: function () {
                this.ye_isFlipX = true;

                return this;
            },
            setFlipY: function () {
                this.ye_isFlipY = true;

                return this;
            },
            isFlipX: function () {
                return this.ye_isFlipX;
            },
            isFlipY: function () {
                return this.ye_isFlipY;
            },
            setAnchor: function (pixelOffsetX, pixelOffsetY) {
                this.pixelOffsetX = pixelOffsetX;
                this.pixelOffsetY = pixelOffsetY;

                return this;
            },
            copy: function () {
                var bitmap = YE.Bitmap.create(this.img);

                YE.Tool.extend.extend(bitmap, this);

                return bitmap;
            }
        },
        Static: {
            create: function (img) {
                return new this(img);
            }
        }
    });
}());

