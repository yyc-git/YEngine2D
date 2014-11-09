/**YEngine2D 帧动画动作类
 * author：YYC
 * date：2014-01-11
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
(function () {
    YE.Animate = YYC.Class(YE.ActionInterval, {
        Init: function (animation) {
            this.base();

            this.ye___anim = animation;
        },
        Private: {
            ye___anim: null,
            ye___frames: null,
            // 包含的Frame数目
            ye___frameCount: -1,

            ye___duration: 0,

            ye___currentFrameIndex: -1,
            ye___currentFramePlayed: -1,
            ye___currentFrame: null,

            ye___setCurrentFrame: function (index) {
                this.ye___currentFrameIndex = index;
                this.ye___setFrame(this.ye___frames.getChildAt(index));
                this.ye___currentFramePlayed = 0;
            },
            ye___setFrame: function (frame) {
                this.ye___currentFrame = frame;
            }
        },
        Public: {
            initWhenCreate: function () {
                this.ye___frames = YE.Collection.create();

                this.ye___frames.addChilds(this.ye___anim.getFrames());
                this.ye___duration = this.ye___anim.getDurationPerFrame();
                this.ye___frameCount = this.ye___frames.getCount();

                this.ye___anim.setFrameIndex(this.ye___anim.getFrames());

                this.ye___setCurrentFrame(0);
            },
            /**
             * 更新Animation状态，只播放一次
             * @param deltaTime 游戏主循环的间隔时间，以秒为单位
             */
            update: function (deltaTime) {
                //判断当前Frame是否已经播放完成,
                if (this.ye___currentFramePlayed >= this.ye___duration) {
                    //播放下一帧

                    //如果最后一帧播放完毕
                    if (this.ye___currentFrameIndex >= this.ye___frameCount - 1) {
                        this.finish();

                        return YE.returnForTest;
                    }

                    //进入下一帧
                    this.ye___currentFrameIndex++;

                    //设置当前帧信息
                    this.ye___setCurrentFrame(this.ye___currentFrameIndex);

                }
                else {
                    //增加当前帧的已播放时间.
                    this.ye___currentFramePlayed += deltaTime;
                }


                this.ye___currentFrame.setCacheData("animSize", this.ye___anim.getAnimSize());
                this.getTarget().setDisplayFrame(this.ye___currentFrame);
            },
            reset: function () {
                this.base();

                this.ye___setCurrentFrame(0);
            },
            copy: function () {
                return YE.Animate.create(this.ye___anim.copy());
            },
            reverse: function () {
                this.ye___frames.reverse();
                this.ye___anim.setFrameIndex(this.ye___frames.getChilds());
                this.ye___setFrame(this.ye___frames.getChildAt(this.ye___currentFrameIndex));

                return this;
            }
        },
        Static: {
            create: function (animation) {
                var animate = new this(animation);
                animate.initWhenCreate();

                return animate;
            }
        }
    });
}());