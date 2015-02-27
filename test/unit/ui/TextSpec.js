/**YEngine2D
 * author：YYC
 * date：2015-02-08
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("Text", function () {
    var text = null;
    var sandbox = null;

    function setDimensions(width, height){
        text.ye_dimensions = {
            width: width,
            height : height || 0
        }
    }

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        text = new YE.Text();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
    });

    describe("initWhenCreate", function(){
        beforeEach(function(){
            text.ye_dimensions = {};
        });

        it("使用fill来绘制文本", function(){
            text.ye_fillEnabled = false;

            text.initWhenCreate();

            expect(text.ye_fillEnabled).toBeTruthy();
        });

        it("设置fillStyle", function(){
            text.initWhenCreate();

            expect(text.ye_fillStyle).toEqual("rgba(0, 0, 0, 1)");
        });

        it("禁用stroke", function(){
            text.initWhenCreate();

            expect(text.ye_strokeEnabled).toBeFalsy();
        });

        describe("设置fontFamily", function(){
            it("如果传入了fontFamily文件的路径，则从路径中获得fontFamily并设置", function(){
                text.ye_fontPath = "./a/bbb.ttf";

                text.initWhenCreate();

                expect(text.ye_fontFamily).toEqual("bbb");
            });
            it("否则，直接设置fontFamily", function(){
                text.ye_fontPath = "bbb";

                text.initWhenCreate();

                expect(text.ye_fontFamily).toEqual("bbb");
            });
        });

        it("设置文字区域默认的高度", function(){
            text.initWhenCreate();

            expect(text.ye_dimensions.height).toEqual(0);
        });
    });

    describe("init", function(){
        var parent = null;


        beforeEach(function(){
            text.stubParentMethod(sandbox, "init");
            parent = {
                getContext: sandbox.stub()
            };
            setDimensions(0, 0);
            text.ye_string = "";
        });
        it("调用父类同名方法", function(){
        });

        it("创建fontClientHeightCache实例", function(){
            var fakeCache = {};
            sandbox.stub(YE.Hash, "create").returns(fakeCache);

            text.init(parent);

            expect(text.ye_fontClientHeightCache).toEqual(fakeCache);
        });

        it("获得容器的context", function(){
            var fakeContext = {};
            parent.getContext.returns(fakeContext);

            text.init(parent);

            expect(text.ye_context).toEqual(fakeContext);
        });

        describe("格式化文本，确保文本不超过文本区域的宽度", function(){
            beforeEach(function(){
                text.ye_fontSize = 50;
                text.ye_fontFamily = "sans-serif";
                parent.getContext.returns({
                    measureText: function(str) {
                        return {
                            width:str.length * text.ye_fontSize
                        }
                    }
                });
            });

            it("测试“文本宽度没有超出区域”的情况", function(){
                text.ye_string = "阿斯";
                setDimensions(200, 0);

                text.init(parent);

                expect(text.ye_strArr).toEqual(["阿斯"]);
            });


            describe("测试“文本宽度超出区域”的情况", function(){
                it("测试“区域宽度小于一个字符的宽度”的情况", function(){
                    text.ye_string = "阿斯";
                    setDimensions(20, 0);

                    text.init(parent);

                    expect(text.ye_strArr).toEqual(["阿", "斯"]);
                });

                it("测试“全中文”的情况", function(){
                    text.ye_string = "啊是的规范";
                    setDimensions(100, 0);

                    text.init(parent);

                    expect(text.ye_strArr).toEqual(["啊是", "的规", "范"]);
                });

                describe("测试“有换行符”的情况", function(){
                    beforeEach(function(){
                        setDimensions(150, 0);
                    });

                    it("测试1", function(){
                        text.ye_string = "啊是的\n范\n在想个好";

                        text.init(parent);

                        expect(text.ye_strArr).toEqual(["啊是的", "范", "在想个", "好"]);
                    });

                    it("测试2", function(){
                        text.ye_string = "啊1\n范\n在wod";

                        text.init(parent);

                        expect(text.ye_strArr).toEqual(["啊1", "范", "在", "wod"]);
                    });

                    it("测试3", function(){
                        text.ye_string = "啊1\n范\n在word";

                        text.init(parent);

                        expect(text.ye_strArr).toEqual(["啊1", "范", "在", "w", "ord"]);
                    });

                    it("测试4", function(){
                        text.ye_string = "1234asdf\ng\nww";

                        text.init(parent);

                        expect(text.ye_strArr).toEqual(["1", "2", "3", "4", "a", "sdf", "g", "ww"]);
                    });
                });

                describe("测试“有空格符”的情况", function(){
                    beforeEach(function(){
                        setDimensions(150, 0);
                    });

                    it("测试1", function(){
                        text.ye_string = "啊 ok is your 在想个     好";

                        text.init(parent);

                        expect(text.ye_strArr).toEqual(['啊 ', 'ok ', 'is ', 'y', 'our', ' 在想', '个  ', '   ', '好']);
                    });
                });

                describe("测试“有换行符和空格符”的情况", function(){
                    beforeEach(function(){
                        setDimensions(150, 0);
                    });

                    it("测试1", function(){
                        text.ye_string = "啊 ok is\n\n\n your 想要10个吗\n\n     好";

                        text.init(parent);

                        expect(text.ye_strArr).toEqual(['啊 ', 'ok ', 'is', '', '', ' ', 'y', 'our', ' 想要', '10个', '吗', '', '   ', '  好']);
                    });
                });

                describe("测试“有标点符号”的情况", function(){
                    beforeEach(function(){
                        setDimensions(150, 0);
                    });

                    it("测试1", function(){
                        text.ye_string = ";啊 ok you, hello\n\n your 想要10个吗？， 。  ；啊啊！!\n\n  好";

                        text.init(parent);

                        expect(text.ye_strArr).toEqual([';啊 ', 'ok ', 'you', ', ', 'h', 'e', 'llo', '', ' ', 'y', 'our', ' 想要', '10个', '吗？，', ' 。 ', ' ；啊', '啊！!', '', '  好']);
                    });
                });

                describe("去除末尾的换行符、空格符", function(){
                    beforeEach(function(){
                        setDimensions(150, 0);
                    });

                    it("去除末尾的换行符", function(){
                        text.ye_string = "1234asdf\ng\nww\n";

                        text.init(parent);

                        expect(text.ye_strArr).toEqual(["1", "2", "3", "4", "a", "sdf", "g", "ww"]);
                    });

                    it("去除末尾的空格符", function(){
                        text.ye_string = "1234asdf\ng\nww   ";

                        text.init(parent);

                        expect(text.ye_strArr).toEqual(["1", "2", "3", "4", "a", "sdf", "g", "ww"]);
                    });

                    it("去除末尾的换行符、空格符", function(){
                        text.ye_string = "1234asdf\ng\nww \n\n  ";

                        text.init(parent);

                        expect(text.ye_strArr).toEqual(["1", "2", "3", "4", "a", "sdf", "g", "ww"]);
                    });
                });
            });
        });

        function setDefaultLineHeight57(){
            text.ye_fontSize = 50;
            text.ye_fontFamily = "sans-serif";
        }

        describe("设置默认的行高", function(){
            it("默认行高为normal", function(){
                setDefaultLineHeight57();

                text.init(parent);

                expect(text.ye_lineHeight).toEqual(57);
            });
        });
    });

    describe("draw", function(){
        var context = null;

        beforeEach(function(){
            context = {
                save: sandbox.stub(),
                restore: sandbox.stub()
            };
            context.measureText = function(str) {
                return {
                    width:str.length * text.ye_fontSize
                }
            };
            context.fillText = sandbox.stub();
            context.strokeText = sandbox.stub();
            text.ye_context = context;

            text.ye_strArr = [];
            text.ye_lineHeight = 60;
            text.ye_fontClientHeightCache = {
                getValue: sandbox.stub(),
                addChild: sandbox.stub()
            };
            text.setPosition(0, 0);
            text.ye_fontSize = 50;
            text.ye_fontFamily = "sans-serif";

            setDimensions(500, 400);
        });

        it("保存context", function(){
            text.draw(context);

            expect(context.save).toCalledOnce();
        });

        it("设置context.font", function(){
            text.ye_fontSize = 10;
            text.ye_fontFamily = "微软雅黑";

            text.draw(context);

            expect(context.font).toEqual("10px '微软雅黑'");
        });

        describe("设置文本对齐", function(){
            it("设置垂直对齐为top", function(){
                text.draw(context);

                expect(context.textBaseline).toEqual("top");
            });

            it("设置水平对齐为start", function(){
                text.draw(context);

                expect(context.textAlign).toEqual("start");
            });
        });

        describe("如果文本为多行", function(){
            beforeEach(function(){
                text.ye_strArr = ["测试", "12 34", "hello"];
            });

            describe("如果为默认的LEFT-TOP对齐方式", function(){
                it("如果使用fill方式绘制，则用fillText方法绘制文本", function(){
                    var fillStyle = "rgba(10,10,10,1)";
                   text.enableFill(fillStyle);

                    text.draw(context);

                    expect(context.fillStyle).toEqual(fillStyle);
                    expect(context.fillText).toCalledThrice();
                    expect(context.fillText.firstCall).toCalledWith("测试", 0, 0);
                    expect(context.fillText.secondCall).toCalledWith("12 34", 0, text.ye_lineHeight);
                    expect(context.fillText.thirdCall).toCalledWith("hello", 0, text.ye_lineHeight + 60);
                });
                it("如果使用stroke方式绘制，则用strokeText方法绘制文本", function(){
                    var strokeStyle = "rgba(10,10,10,1)";
                   text.enableStroke(strokeStyle);

                    text.draw(context);

                    expect(context.strokeStyle).toEqual(strokeStyle);
                    expect(context.strokeText).toCalledThrice();
                    expect(context.strokeText.firstCall).toCalledWith("测试", 0, 0);
                    expect(context.strokeText.secondCall).toCalledWith("12 34", 0, text.ye_lineHeight);
                    expect(context.strokeText.thirdCall).toCalledWith("hello", 0, text.ye_lineHeight + 60);
                });
            });

            describe("如果为CENTER-BOTTOM对齐方式", function(){
                it("测试“使用fill的方式绘制的情况”", function(){
                    var fillStyle = "rgba(10,10,10,1)";
                    text.enableFill(fillStyle);
                    text.ye_xAlignment = YE.TEXT_XALIGNMENT.CENTER;
                    text.ye_yAlignment = YE.TEXT_YALIGNMENT.BOTTOM;

                    text.draw(context);

                    expect(context.fillStyle).toEqual(fillStyle);
                    expect(context.fillText).toCalledThrice();
                    expect(context.fillText.firstCall).toCalledWith("测试", 200, 230);
                    expect(context.fillText.secondCall).toCalledWith("12 34", 125, 290);
                    expect(context.fillText.thirdCall).toCalledWith("hello", 125, 350);
                });
            });

            describe("如果为RIGHT-MIDDLE对齐方式", function(){
                it("测试“使用fill的方式绘制的情况”", function(){
                    var fillStyle = "rgba(10,10,10,1)";
                    text.enableFill(fillStyle);
                    text.ye_xAlignment = YE.TEXT_XALIGNMENT.RIGHT;
                    text.ye_yAlignment = YE.TEXT_YALIGNMENT.MIDDLE;

                    text.draw(context);

                    expect(context.fillStyle).toEqual(fillStyle);
                    expect(context.fillText).toCalledThrice();
                    expect(context.fillText.firstCall).toCalledWith("测试", 400, 115);
                    expect(context.fillText.secondCall).toCalledWith("12 34", 250, 175);
                    expect(context.fillText.thirdCall).toCalledWith("hello", 250, 235);
                });
            });
        });

        describe("否则", function(){
            beforeEach(function(){
                text.ye_strArr = ["hi 1;"];
            });

            describe("如果为默认的LEFT-TOP对齐方式", function(){
                it("如果使用fill方式绘制，则用fillText方法绘制文本", function(){
                    var fillStyle = "rgba(10,10,10,1)";
                    text.enableFill(fillStyle);

                    text.draw(context);

                    expect(context.fillStyle).toEqual(fillStyle);
                    expect(context.fillText).toCalledWith("hi 1;", 0, 0);
                });
                it("如果使用stroke方式绘制，则用strokeText方法绘制文本", function(){
                    var strokeStyle = "rgba(10,10,10,1)";
                    text.enableStroke(strokeStyle);

                    text.draw(context);

                    expect(context.strokeStyle).toEqual(strokeStyle);
                    expect(context.strokeText).toCalledWith("hi 1;", 0, 0);
                });
            });

            describe("如果为CENTER-BOTTOM对齐方式", function(){
                it("测试“使用fill的方式绘制的情况”", function(){
                    var fillStyle = "rgba(10,10,10,1)";
                    text.enableFill(fillStyle);
                    text.ye_xAlignment = YE.TEXT_XALIGNMENT.CENTER;
                    text.ye_yAlignment = YE.TEXT_YALIGNMENT.BOTTOM;

                    text.draw(context);

                    expect(context.fillStyle).toEqual(fillStyle);
                    expect(context.fillText).toCalledWith("hi 1;", 125, 350);
                });
            });

            describe("如果为RIGHT-MIDDLE对齐方式", function(){
                it("测试“使用fill的方式绘制的情况”", function(){
                    var fillStyle = "rgba(10,10,10,1)";
                    text.enableFill(fillStyle);
                    text.ye_xAlignment = YE.TEXT_XALIGNMENT.RIGHT;
                    text.ye_yAlignment = YE.TEXT_YALIGNMENT.MIDDLE;

                    text.draw(context);

                    expect(context.fillStyle).toEqual(fillStyle);
                    expect(context.fillText).toCalledWith("hi 1;", 250, 175);
                });
            });
        });

        it("恢复context", function(){
            text.draw(context);

            expect(context.restore).toCalledOnce();
            expect(context.restore).toCalledAfter(context.save);
        });
    });
});
