/**YEngine2D
 * author：YYC
 * date：2013-12-28
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    YE.Layer = YYC.AClass(YE.NodeContainer, {
        Init: function (id, position) {
            this.base();

            id && this.setCanvasById(id);
            position && this.setPosition(position.x, position.y);

            if (!id && position) {
                YE.error("请传入画布id");
            }

            if (this.isChange()) {
                this.ye___state = YE.Layer.State.CHANGE;
            }
            else {
                this.ye___state = YE.Layer.State.NORMAL;
            }
        },
        Private: {
            ye___graphics: null,
            ye___state: null,
            ye___context: null,
            ye___canvas: null,
            ye___runInterval: -1,
            ye___lastTime: 0,

            ye___getContext: function () {
                this.ye___context = this.ye___canvas.getContext("2d");
            },
            ye___isChange: function () {
                return this.ye___state === YE.Layer.State.CHANGE;
            },
            ye___isNormal: function () {
                return this.ye___state === YE.Layer.State.NORMAL;
            },
            ye___clearCanvas: function () {
                var canvasData = this.getCanvasData();

                this.ye___context.clearRect(0, 0, canvasData.width, canvasData.height);
            },
            ye___getDurationFromLastLoop: function () {
                return this.ye___getTimeNow() - this.ye___lastTime;
            },
            ye___getTimeNow: function () {
                return +new Date();
            },
            ye___isTimeToRun: function () {
                return this.ye___getDurationFromLastLoop() >= this.ye___runInterval * 1000;
            }
        },
        Protected: {
            ye_P_run: function () {
                //todo 待重构

                var layerChilds = this.getChilds().filter(function (child) {
                    return child.isInstanceOf(YE.NodeContainer);
                });
                var nodeChilds = this.getChilds().filter(function (child) {
                    return child.isInstanceOf(YE.Node);
                });

                layerChilds.map("run", [this.getContext()]);


                if(nodeChilds.length > 0){
                    nodeChilds.map("update");

                    if (this.ye___isChange()) {
                        this.clear();
                        nodeChilds.map("onBeforeDraw", [this.getContext()]);


//                    this.draw(this.getContext());
                        nodeChilds.map("draw", [this.getContext()]);


                        nodeChilds.map("onAfterDraw", [this.getContext()]);
                        this.setStateNormal();
                    }
                }



                this.change();
            }
        },
        Public: {
            setStateNormal: function () {
                this.ye___state = YE.Layer.State.NORMAL;
            },
            setStateChange: function () {
                this.ye___state = YE.Layer.State.CHANGE;
            },
            setZIndex: function (zIndex) {
                this.ye___canvas.style.zIndex = zIndex;
            },
            getZIndex: function () {
                return Number(this.ye___canvas.style.zIndex);
            },
            setCanvasById: function (canvasID) {
                var canvas = document.getElementById(canvasID);

                YE.error(!canvas, "没有找到" + canvasID);

                this.ye___canvas = canvas;
                this.ye___getContext();
            },
            setWidth: function (width) {
                this.ye___canvas.width = width;
            },
            setHeight: function (height) {
                this.ye___canvas.height = height;
            },
            setPosition: function (x, y, position) {
                this.ye___canvas.style.position = position || "absolute";
                this.ye___canvas.style.top = y.toString() + "px";
                this.ye___canvas.style.left = x.toString() + "px";
            },
            getContext: function () {
                return this.ye___context;
            },
            getGraphics: function () {
                if (!this.ye___graphics) {
                    this.ye___graphics = YE.Graphics.create(this.getContext());
                }

                return this.ye___graphics;
            },
            change: function () {
                if (this.isChange() === true) {
                    this.setStateChange();
                }
                else {
                    this.setStateNormal();
                }
            },
            getCanvasData: function () {
                return {
                    width: this.ye___canvas.width,
                    height: this.ye___canvas.height
                }
            },
            isSetRunInterval: function () {
                return this.ye___runInterval !== -1;
            },
            /**
             * 设置调用run的间隔时间
             * @param interval 间隔时间（单位为秒）
             */
            setRunInterval: function (interval) {
                this.ye___runInterval = interval;
                this.ye___lastTime = this.ye___getTimeNow();
            },
            changeRunInterval: function (interval) {
                this.ye___runInterval = interval;
            },
            /**
             * 恢复为每次主循环都调用run
             */
            resumeRunInterval: function () {
                this.ye___runInterval = -1;
            },
            run: function () {
                if (this.isSetRunInterval()) {
                    if (!this.ye___isTimeToRun()) {
                        return YE.returnForTest;
                    }
                    this.ye___lastTime = this.ye___getTimeNow();
                }

                this.base();
            },
            startLoop: function () {
                this.onStartLoop();
                this.iterate("onStartLoop");
            },
            endLoop: function () {
                this.iterate("onEndLoop");
                this.onEndLoop();
            },
            Virtual: {
                clear: function () {
                    this.ye___clearCanvas();
                },
                isChange: function () {
                    return true;
                },
                draw: function (context) {
                    this.iterate("draw", [context || this.getContext()]);
                }
            }
        },
        Static: {
            State: {
                NORMAL: 0,
                CHANGE: 1
            },

            create: function (id, position) {
                var T = YYC.Class(YE.Layer, {
                    Init: function () {
                        this.base(id, position);
                    }
                });
                return new T();
            }
        }
    });
}());