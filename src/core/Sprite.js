(function () {
    YE.Sprite = YYC.AClass(YE.Node, {
        Init: function (displayTarget) {
            this.base();

            this.setDisplayTarget(displayTarget);

            this.ye___actionManager = YE.ActionManager.create();
            this.ye___animationManager = YE.AnimationManager.create();
            this.ye___animationFrameManager = YE.AnimationFrameManager.create();
        },
        Private: {
            ye___displayTarget: null,
            ye___actionManager: null,
            ye___animationManager: null,
            ye___animationFrameManager: null,
            ye___displayFrame: null,
            ye___x: 0,
            ye___y: 0,
            //精灵在画布中显示的图片大小
            ye___width: 0,
            ye___height: 0,

            ye___context: null,
            ye___canvasData: null,
            ye___offsetX: 0,
            ye___offsetY: 0,
            ye___clipRange: null,

            ye___setContextAndReturnDrawData: function (displayTarget, data, context) {
                var pixelOffsetX = 0,
                    pixelOffsetY = 0,
                    x = 0,
                    y = 0,
                    width = 0,
                    height = 0,
                    canvasWidth = this.getCanvasData().width,
                    canvasHeight = this.getCanvasData().height,
                    posX = 0,
                    posY = 0,
                    isChangeX = false,
                    isChangeY = false;

                x = data[0] || this.ye___x;
                y = data[1] || this.ye___y;
                width = data[2] || this.ye___width;
                height = data[3] || this.ye___height;

                if (displayTarget.isInstanceOf(YE.Frame)) {
                    pixelOffsetX = displayTarget.getPixelOffsetX();
                    pixelOffsetY = displayTarget.getPixelOffsetY();
                }
                else if (displayTarget.isInstanceOf(YE.Bitmap)) {
                    pixelOffsetX = displayTarget.pixelOffsetX;
                    pixelOffsetY = displayTarget.pixelOffsetY;
                }

                if (this.ye___clipRange) {
                    this.ye___clip(context);
                }

                if (displayTarget.isFlipX()) {
                    context.translate(canvasWidth, 0);
                    context.scale(-1, 1);

                    posX = canvasWidth - width - this.ye___computeX(x, pixelOffsetX);
                    isChangeX = true;
                }
                if (displayTarget.isFlipY()) {
                    context.translate(0, canvasHeight);
                    context.scale(1, -1);

                    posY = canvasHeight - height - this.ye___computeY(y, pixelOffsetY);
                    isChangeY = true;
                }

                posX = isChangeX ? posX : this.ye___computeX(x, pixelOffsetX);
                posY = isChangeY ? posY : this.ye___computeY(y, pixelOffsetY);

                return [posX, posY, width, height];
            },
            ye___computeX: function (x, pixelOffsetX) {
                return x - this.ye___offsetX - pixelOffsetX;
            },
            ye___computeY: function (y, pixelOffsetY) {
                return y - this.ye___offsetY - pixelOffsetY;
            },
            ye___clip: function (context) {
                var beginPoint = null;

                context.beginPath();
                beginPoint = this.ye___clipRange.shift();
                context.moveTo(beginPoint.x, beginPoint.y);

                this.ye___clipRange.forEach(function (point) {
                    context.lineTo(point.x, point.y);
                });

                context.lineTo(beginPoint.x, beginPoint.y);

                context.closePath();
                context.clip();

                this.ye___clipRange = null;
            },
            ye___drawDisplayTarget: function (context) {
                var bitmap = null,
                    frame = null,
                    spriteData = [],
                    data = null;

                context.save();

                data = this.ye___setContextAndReturnDrawData(this.ye___displayTarget, spriteData, context);

                if (this.ye___displayTarget.isInstanceOf(YE.Bitmap)) {
                    bitmap = this.ye___displayTarget;

                    context.drawImage(bitmap.img, data[0], data[1], data[2], data[3]);
                }
                else if (this.ye___displayTarget.isInstanceOf(YE.Frame)) {
                    frame = this.ye___displayTarget;

                    context.drawImage(
                        frame.getImg(),
                        frame.getX(), frame.getY(), frame.getWidth(), frame.getHeight(),
                        data[0], data[1], data[2], data[3]
                    );
                }

                context.restore();
            },
            ye___drawAnim: function (context) {
                var frame = null,
                    data = null;

                frame = this.getDisplayFrame();

                if (!frame) {
                    return "no frame";
                }

                context.save();

                data = this.ye___setContextAndReturnDrawData(frame, this.ye___getAnimData(frame), context);
                this.ye___setSize(data[2], data[3]);

                context.drawImage(
                    frame.getImg(),
                    frame.getX(), frame.getY(), frame.getWidth(), frame.getHeight(),
                    data[0], data[1], data[2], data[3]
                );

                context.restore();
            },
            ye___getAnimData: function (frame) {
                var spriteData = [],
                    animSize = null;

                animSize = frame.getCacheData("animSize");

                spriteData = [this.ye___x, this.ye___y];
                if (animSize) {
                    spriteData[2] = animSize.width !== undefined ? animSize.width : this.ye___width;
                    spriteData[3] = animSize.height !== undefined ? animSize.height : this.ye___height;
                }
                else {
                    spriteData[2] = this.ye___width;
                    spriteData[3] = this.ye___height;
                }

                return spriteData;
            },
            ye___setSize: function (width, height) {
                this.ye___width = width;
                this.ye___height = height;
            },
            ye___runOnlyOneChild: function (child, tag, container, func) {
                if (container.getCount() === 1 &&
                    (container.hasChild(child) || (tag && container.hasChild(tag)))) {
                    return YE.returnForTest;
                }

                container.removeAllChilds();
                func.call(this, null);
            }
        },
        Public: {
            init: function (parent) {
                this.base(parent);

                this.ye___context = parent.getContext();
                this.ye___graphics = parent.getGraphics();
                this.ye___canvasData = parent.getCanvasData();
            },
            getContext: function () {
                return this.ye___context;
            },
            getGraphics: function () {
                return this.ye___graphics;
            },
            getCanvasData: function () {
                return this.ye___canvasData;
            },
            runAction: function (action, tag) {
                if (tag) {
                    action.setTag(tag);
                }

                if (this.ye___actionManager.hasChild(action) || (tag && this.ye___actionManager.hasChild(tag))) {
                    return YE.returnForTest;
                }

                this.ye___actionManager.addChild(action, this);
            },
            update: function () {
                this.ye___actionManager.update();
                this.ye___animationManager.update();
            },
            setPosition: function (x, y) {
                this.ye___x = x;
                this.ye___y = y;
            },
            setPositionX: function (x) {
                this.ye___x = x;
            },
            setPositionY: function (y) {
                this.ye___y = y;
            },
            getPositionX: function () {
                return this.ye___x;
            },
            getPositionY: function () {
                return this.ye___y;
            },
            getAnimationFrameManager: function () {
                return this.ye___animationFrameManager;
            },
            getActionManager: function () {
                return this.ye___actionManager;
            },
            setDisplayFrame: function (frame) {
                this.ye___displayFrame = frame;
            },
            getDisplayFrame: function () {
                return this.ye___displayFrame;
            },
            /**
             * 播放动画
             * @param arg 可以为动画名，也可以为动画动作
             * @returns {undefined}
             */
            runOnlyOneAnim: function (anim, tag) {
                return this.ye___runOnlyOneChild(anim, tag, this.ye___animationManager, function () {
                    this.ye___animationManager.addChild(this.ye___animationFrameManager.initAndReturnAnim(anim, tag), this);
                });
            },
            runOnlyOneAction: function (action, tag) {
                return this.ye___runOnlyOneChild(action, tag, this.ye___actionManager, function () {
                    this.runAction(action, tag);
                });
            },
            getCurrentAnim: function () {
                return this.ye___animationManager.getChilds()[0];
            },
            getCurrentActions: function () {
                return this.ye___actionManager.getChilds();
            },
            getCurrentAction: function () {
                var actions = this.getCurrentActions();

                YE.error(actions.length === 0, "没有运行的动作");

                YE.assert(actions.length === 1, "当前运行的动作不止一个");

                return actions[actions.length - 1];
            },
            removeAllActions: function (isReset) {
                this.ye___actionManager.removeAllChilds(isReset);
            },
            removeAllAnims: function (isReset) {
                this.ye___animationManager.removeAllChilds(isReset);
            },
            isCurrentAnimExactly: function (animName) {
                return this.ye___animationManager.hasChild(animName);
            },
            isCurrentAnim: function (animName) {
                var anim = null;

                anim = this.getCurrentAnim();
                if (!anim) {
                    return false;
                }

                return anim.containTag(animName)
            },
            getWidth: function () {
                return this.ye___width;
            },
            getHeight: function () {
                return this.ye___height;
            },
            setWidth: function (width) {
                this.ye___width = width;
            },
            setHeight: function (height) {
                this.ye___height = height;
            },
            setDisplayTarget: function (displayTarget) {
                this.ye___displayTarget = displayTarget;
            },
            setOffsetX: function (offsetX) {
                this.ye___offsetX = offsetX;
            },
            setOffsetY: function (offsetY) {
                this.ye___offsetY = offsetY;
            },
            getOffsetX: function () {
                return this.ye___offsetX;
            },
            getOffsetY: function () {
                return this.ye___offsetY;
            },
            /**
             * 设置画布剪辑区域
             * @param range 剪辑区域
             */
            setClipRange: function (range) {
                this.ye___clipRange = range;
            },

            Virtual: {
                draw: function (context) {
                    var returnvalueForTest = null;

                    if (this.ye___displayTarget) {
                        this.ye___drawDisplayTarget(context);
                        return YE.returnForTest;
                    }

                    returnvalueForTest = this.ye___drawAnim(context);

                    return returnvalueForTest;
                },
                clear: function (context) {
                    context.clearRect(this.ye___x, this.ye___y, this.ye___width, this.ye___height);
                },
                onBeforeDraw: function (context) {
                },
                onAfterDraw: function (context) {
                }
            }
        },
        Static: {
            create: function (bitmap) {
                var T = YYC.Class(YE.Sprite, {
                    Init: function (bitmap) {
                        this.base(bitmap);
                    },
                    Public: {
                    }
                });

                return new T(bitmap);
            }
        }
    });
}());