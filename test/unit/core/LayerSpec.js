/**YEngine2D
 * author：YYC
 * date：2013-12-28
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Layer.js", function () {
    var layer = null;
    var sandbox = null;

    function getInstance(id, position) {
        return YE.Layer.create(id, position);
    }

    function setCanvasData(layer, width, height) {
        sandbox.stub(layer, "getCanvasData").returns({
            width: width,
            height: height
        });
    }

    beforeEach(function () {
        layer = getInstance();
        sandbox = sinon.sandbox.create();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
        function insertCanvas() {
            $("body").append($("<canvas id='t_c'></canvas>"));
        }

        function removeCanvas() {
            $("body").remove("#t_c");
        }

        beforeEach(function () {
            insertCanvas();
        });
        afterEach(function () {
            removeCanvas();
        });

        it("如果传入画布的id参数，则获得canvas", function () {
            layer = getInstance("t_c");

            expect(layer.ye___canvas).toBeCanvas();
        });
        it("如果传入画布的id参数和position参数，则获得canvas，设置画布position坐标", function () {
            layer = getInstance("t_c", {x: 10, y: 20});

            expect(layer.ye___canvas).toBeCanvas();
            expect(layer.ye___canvas.style.position).toEqual("absolute");
            expect(layer.ye___canvas.style.top).toEqual("20px");
            expect(layer.ye___canvas.style.left).toEqual("10px");
        });
        it("如果只传入position参数，不传入id参数，则报错", function () {
            expect(function () {
                layer = getInstance(null, {x: 10, y: 20});
            }).toThrow();
        });
        it("如果没有参数，则什么也不做，用户需要自己调用API来设置canvas", function () {
        });

        describe("设置state", function () {
            it("如果isChange返回true，则state设为change", function () {
                sandbox.stub(layer, "isChange").returns(true);

                layer.Init();

                expect(layer.ye___state).toEqual(YE.Layer.State.CHANGE);
            });
            it("如果isChange返回false，则state设为normal", function () {
                sandbox.stub(layer, "isChange").returns(false);

                layer.Init();

                expect(layer.ye___state).toEqual(YE.Layer.State.NORMAL);
            });
        });
    });

    describe("getGraphics", function () {
        it("如果没有创建Graphics实例，则创建并返回", function () {
            var fakeContext = {};
            var fakeGraphics = {a: 1};
            layer.ye___graphics = null;
            sandbox.stub(YE.Graphics, "create").returns(fakeGraphics);
            sandbox.stub(layer, "getContext").returns(fakeContext);

            var graphics = layer.getGraphics();

            expect(YE.Graphics.create).toCalledWith(fakeContext);
            expect(graphics).toEqual(fakeGraphics);
        });
        it("否则直接返回graphics实例", function () {
            var fakeGraphics = {a: 1};
            layer.ye___graphics = fakeGraphics;

            var graphics = layer.getGraphics();

            expect(graphics).toEqual(fakeGraphics);
        });
    });


    describe("change", function () {
        beforeEach(function () {
        });
        afterEach(function () {
        });

        it("判断钩子isChange方法的返回值，如果为true，则令状态为change", function () {
            sandbox.stub(layer, "setStateChange");
            layer.isChange = function () {
                return true;
            };

            layer.change();

            expect(layer.setStateChange).toCalledOnce();
        });
        it("否则，调用setStateNormal", function () {
            sandbox.stub(layer, "setStateNormal");
            layer.isChange = function () {
                return false;
            };

            layer.change();

            layer.isChange = function () {
            };

            layer.change();

            expect(layer.setStateNormal.callCount).toEqual(2);
        });
    });

    describe("ye_P_run", function () {
        function setStateNormal() {
            layer.setStateNormal();
        }

        function setStateChange() {
            layer.setStateChange();
        }

        beforeEach(function () {
            setStateNormal();

            sandbox.stub(layer, "iterate");
        });

//        it("执行精灵的onbeforeRun方法", function () {
//            layer.ye_P_run();
//
//            expect(layer.iterate).toCalledWith("onbeforeRun");
//        });
        it("执行精灵类所有动作", function () {
            layer.ye_P_run();

            expect(layer.iterate).toCalledWith("update");
        });

        describe("如果_state为change", function () {
            beforeEach(function () {
                setStateChange();
                sandbox.stub(layer, "clear");
                sandbox.stub(layer, "change");
            });

            it("调用clear", function () {
                layer.ye_P_run();

                expect(layer.clear).toCalledOnce();
            });
            it("调用精灵类的onbeforeDraw方法", function () {
                layer.ye_P_run();

                expect(layer.iterate.secondCall).toCalledWith("onBeforeDraw", [layer.getContext()]);
            });
            it("调用draw，传入context", function () {
                var fakeContext = {};
                sandbox.stub(layer, "draw");
                sandbox.stub(layer, "getContext").returns(fakeContext);

                layer.ye_P_run();

                expect(layer.draw).toCalledWith(fakeContext);
            });
            it("调用精灵类的onafterDraw方法", function () {
                layer.ye_P_run();

                expect(layer.iterate.getCall(3).args).toEqual(["onAfterDraw", [layer.getContext()]]);
            });
            it("恢复状态state为normal", function () {
                layer.setStateChange();

                layer.ye_P_run();

                expect(layer.ye___isNormal()).toBeTruthy();
            });
        });

//        it("执行精灵的onafterRun方法", function () {
//            layer.ye_P_run();
//
//            expect(layer.iterate).toCalledWith("onafterRun");
//        });
        it("调用change方法", function () {
            sandbox.stub(layer, "change");

            layer.ye_P_run();

            expect(layer.change).toCalledOnce();
        });
    });

    describe("getCanvasData", function () {
        it("获得画布数据", function () {
            sandbox.stub(layer, "ye___canvas", {width: 1, height: 2});

            expect(layer.getCanvasData().width).toEqual(1);
            expect(layer.getCanvasData().height).toEqual(2);
        });
    });


    describe("封装Canvas，提供API", function () {
        function insertCanvas() {
            $("body").append($("<canvas id='t_c'></canvas>"));
        }

        function removeCanvas() {
            $("body").remove("#t_c");
        }

        beforeEach(function () {
            insertCanvas();

            layer.setCanvasById("t_c");
        });
        afterEach(function () {
            removeCanvas();
        });

        describe("setCanvasById", function () {
            it("如果canvasId对应的canvas不存在，则报错", function () {
                sandbox.stub(document, "getElementById").returns(null);

                expect(function () {
                    layer.setCanvasById("a");
                }).toThrow();
            });

            describe("获得canvas，并进行对应设置", function () {
                var fakeCanvas = null,
                    fakeContext = null;

                beforeEach(function () {
                    fakeContext = {};
                    fakeCanvas = {
                        getContext: sandbox.stub().returns(fakeContext)
                    };
                    sandbox.stub(document, "getElementById").returns(fakeCanvas);
                });
                afterEach(function () {
                });

                it("根据传入新的canvas的id来获得新的canvas", function () {
                    var canvasId = "a";

                    layer.setCanvasById(canvasId);

                    expect(layer.ye___canvas).toEqual(fakeCanvas);
                });
                it("获得context", function () {
                    layer.setCanvasById("a");

                    expect(layer.getContext()).toEqual(fakeContext);
                });
            });
        });

        describe("setWidth", function () {
            it("设置画布宽度", function () {
            });
        });

        describe("setHeight", function () {
            it("设置画布高度", function () {
            });
        });

        describe("setZIndex", function () {
            it("设置画布层叠顺序zIndex", function () {
                layer.setZIndex(10);

                expect(layer.getZIndex()).toEqual(10);
            });
        });

        describe("getZIndex", function () {
            it("获得画布层叠顺序zIndex", function () {
            });
        });

        describe("setPosition", function () {
            it("设置position的定位模式，默认为绝对定位", function () {
                layer.setPosition(10, 20);

                expect(layer.ye___canvas.style.position).toEqual("absolute");

                layer.setPosition(10, 20, "relative");

                expect(layer.ye___canvas.style.position).toEqual("relative");
            });
            it("设置画布位置", function () {
                layer.setPosition(10, 20);

                expect(layer.ye___canvas.style.top).toEqual("20px");
                expect(layer.ye___canvas.style.left).toEqual("10px");
            });
        });
    });

    describe("getContext", function () {
        it("获得画布的context", function () {
        });
    });

    describe("isSetRunInterval", function () {
        it("判断是否设置了run的间隔时间", function () {
            expect(layer.isSetRunInterval()).toBeFalsy();

            layer.setRunInterval(10);

            expect(layer.isSetRunInterval()).toBeTruthy();
        });
    });


    describe("setRunInterval", function () {
        it("设置调用run的间隔时间", function () {
            var interval = 10;

            layer.setRunInterval(interval);

            expect(layer.ye___runInterval).toEqual(interval);
        });
        it("保存当前调用layer的时间", function () {
            var dateNow = 1000;
            sandbox.stub(layer, "ye___getTimeNow").returns(dateNow);

            layer.setRunInterval(10);

            expect(layer.ye___lastTime).toEqual(dateNow);
        });
    });

    describe("changeRunInterval", function () {
        it("更改调用run的间隔时间", function () {
            var fakeInterval = 10;

            layer.changeRunInterval(fakeInterval);

            expect(layer.ye___runInterval).toEqual(fakeInterval);
        });
    });


    describe("resumeRunInterval", function () {
        it("恢复为每次主循环都调用run", function () {
            layer.resumeRunInterval();

            expect(layer.ye___runInterval).toEqual(-1);
        });
    });

    describe("run", function () {
        describe("如果设置了调用layer的间隔时间", function () {
            var interval = 0;

            beforeEach(function () {
                interval = 1;
                layer.setRunInterval(interval);
            });

            it("如果还没有到调用run的时间，则返回", function () {
                layer.ye___lastTime = 100;
                sandbox.stub(layer, "ye___getTimeNow").returns(200);

                var result = layer.run();

                expect(result).toEqual(YE.returnForTest);
            });
            it("否则，保存当前调用layer的时间，执行父类的run方法", function () {
                layer.stubParentMethodByAClass(sandbox, "run");
                layer.ye___lastTime = 100;
                sandbox.stub(layer, "ye___getTimeNow").returns(1500);

                layer.run();

                expect(layer.ye___lastTime).toEqual(1500);
                expect(layer.lastBaseClassForTest.run).toCalledOnce();
            });
        });

        it("否则，执行父类的run方法", function () {
            layer.stubParentMethodByAClass(sandbox, "run");

            layer.run();

            expect(layer.lastBaseClassForTest.run).toCalledOnce();
        });
    });

    describe("startLoop", function () {
        beforeEach(function () {
            sandbox.stub(layer, "iterate");
            sandbox.stub(layer, "onStartLoop");
        });

        it("调用onstartLoop", function () {
            layer.startLoop();

            expect(layer.onStartLoop).toCalledOnce();
        });
        it("调用每个sprite的onstartLoop", function () {
            layer.startLoop();

            expect(layer.iterate).toCalledWith("onStartLoop");
        });
        it("先调用自己的onstartLoop，再调用每个sprite的onstartLoop", function () {
            layer.startLoop();

            expect(layer.iterate).toCalledAfter(layer.onStartLoop);
        });
    });

    describe("endLoop", function () {
        beforeEach(function () {
            sandbox.stub(layer, "iterate");
            sandbox.stub(layer, "onEndLoop");
        });

        it("调用onendLoop", function () {
            layer.endLoop();

            expect(layer.onEndLoop).toCalledOnce();
        });
        it("调用每个sprite的onendLoop", function () {
            layer.endLoop();

            expect(layer.iterate).toCalledWith("onEndLoop");
        });
        it("先调用每个sprite的onendLoop，再调用自己的onendLoop", function () {
            layer.endLoop();

            expect(layer.iterate).toCalledBefore(layer.onEndLoop);
        });
    });

    describe("虚方法", function () {
        describe("isChange", function () {
            it("默认返回true", function () {
                expect(layer.isChange()).toBeTruthy();
            });
        });

        describe("clear", function () {
            it("清空画布", function () {
                setCanvasData(layer, 1, 2);
                sandbox.stub(layer, "ye___context", sandbox.createSpyObj("clearRect"));

                layer.clear();

                expect(layer.getContext().clearRect).toCalledWith(0, 0, 1, 2);
            });
        });

        describe("draw", function () {
            function addChilds(childs) {
                layer.ye__childs.addChilds(childs);
            }

            it("调用每个精灵类的draw方法，传入参数context、canvasWidth、canvasHeight", function () {
                var sprite1 = sandbox.createSpyObj("draw") ,
                    sprite2 = sandbox.createSpyObj("draw");
                setCanvasData(layer, 10, 20);
                addChilds([sprite1, sprite2]);

                layer.draw();

                expect(sprite1.draw).toCalledWith(layer.getContext());
                expect(sprite2.draw).toCalledWith(layer.getContext());
            });
        });
    });
})
;
