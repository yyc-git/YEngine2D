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
    YE.Animation = YYC.Class(YE.Entity, {
        Init: function (frames, config) {
            this.base();

            this.ye_frames = frames;
            this.ye_config = config;
        },
        Private: {
            ye_frames: null,
            ye_config: null
        },
        Public: {
            initWhenCreate: function () {
                var bitmap = this.ye_frames[0].getBitmap(),
                    pixelOffsetX = this.ye_config.pixelOffsetX || 0,
                    pixelOffsetY = this.ye_config.pixelOffsetY || 0;

                if (this.ye_config.flipX) {
                    bitmap.setFlipX();
                }
                if (this.ye_config.flipY) {
                    bitmap.setFlipY();
                }
                bitmap.setAnchor(pixelOffsetX, pixelOffsetY);

                this.ye_frames.forEach(function (frame) {
                    frame.setBitmap(bitmap);
                });
            },
            copy: function () {
                var frames = [];

                this.ye_frames.forEach(function (frame) {
                    frames.push(frame.copy());
                });

                return YE.Animation.create(frames, YE.Tool.extend.extend({}, this.ye_config));
            },
            getFrames: function () {
                return this.ye_frames;
            },
            getDurationPerFrame: function () {
                return this.ye_config.duration;
            },
            getAnimSize: function () {
                return  this.ye_config.size;
            },
            setFrameIndex: function (frames) {
                frames.forEach(function (frame, index) {
                    frame.index = index;
                });
            }
        },
        Static: {
            create: function (frames, config) {
                var animation = new this(frames, config);

                animation.initWhenCreate();

                return animation;
            }
        }
    });
}());