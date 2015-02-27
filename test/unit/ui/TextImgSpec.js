/**YEngine2D
 * author：YYC
 * date：2015-02-27
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
describe("TextImg", function () {
    var text = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        text = new YE.TextImg();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("构造函数", function () {
    });

    describe("initWhenCreate", function(){
        beforeEach(function(){
            sandbox.stub(text, "getContext").returns({});
            sandbox.stub(text, "getCanvasData").returns({
                width:1000,
                height:1000
            });
        });

        it("如果没有传入fnt文件和图片的id（同一个id），则返回", function(){
            var result = text.initWhenCreate();

            expect(result).toBeFalsy();
        });

        describe("否则", function(){
            function judgeCharSprite(charSprite, x, y, width, height, char){
                expect(charSprite.getPositionX()).toEqual(x);
                expect(charSprite.getPositionY()).toEqual(y);
                expect(charSprite.getWidth()).toEqual(width);
                expect(charSprite.getHeight()).toEqual(height);
                if(char){
                    expect(charSprite.char).toEqual(char);
                }
            }

            beforeEach(function(){
                sandbox.stub(YE.fntLoader, "getRes").returns({
                    fontDefDictionary: {
                        1:{
                            rect: {
                                x: 0,
                                y: 0,
                                width: 100,
                                height: 200
                            },
                            xOffset: 1,
                            yOffset: 2,
                            xAdvance: 3
                        }
                    },
                    commonHeight: 50
                });
                sandbox.stub(YE.ImgLoader, "getInstance").returns({
                    get: sandbox.stub().returns({})
                });
                sandbox.stub(text, "ye_getFontDef", function(dict){
                    return dict[1];
                });
            });

            it("测试单行文本", function(){
                text.ye_string = "正ab";
                text.ye_maxWidth = 1000;

                text.initWhenCreate("a");

                expect(text.getChilds().length).toEqual(3);
                judgeCharSprite(text.getChildByTag(0), 1, 2, 100, 200);
                judgeCharSprite(text.getChildByTag(1), 4, 2, 100, 200);
                judgeCharSprite(text.getChildByTag(2), 7, 2, 100, 200);
            });

            describe("测试多行文本", function(){
                it("文本超过最大宽度", function(){
                    text.ye_string = "正ab";
                    text.ye_maxWidth = 7;

                    text.initWhenCreate("a");

                    judgeCharSprite(text.getChildByTag(0), 1, 2, 100, 200);
                    judgeCharSprite(text.getChildByTag(1), 4, 2, 100, 200);
                    judgeCharSprite(text.getChildByTag(2), 1, 52, 100, 200);
                });
                describe("文本包含换行符", function(){
                    it("测试1", function(){
                        text.ye_string = "正\nab\nc\n";

                        text.ye_maxWidth = 50;

                        text.initWhenCreate("a");

                        judgeCharSprite(text.getChildByTag(0), 1, 2, 100, 200);
                        judgeCharSprite(text.getChildByTag(1), 3, 0, 0, 0);
                        judgeCharSprite(text.getChildByTag(2), 1, 52, 100, 200);
                        judgeCharSprite(text.getChildByTag(3), 4, 52, 100, 200);
                        judgeCharSprite(text.getChildByTag(4), 6, 50, 0, 0);
                        judgeCharSprite(text.getChildByTag(5), 1, 102, 100, 200);
                        judgeCharSprite(text.getChildByTag(6), 3, 100, 0, 0);
                    });
                    it("测试2", function(){
                        text.ye_string = "正\nabc";

                        text.ye_maxWidth = 7;

                        text.initWhenCreate("a");

                        judgeCharSprite(text.getChildByTag(0), 1, 2, 100, 200);
                        judgeCharSprite(text.getChildByTag(1), 3, 0, 0, 0);
                        judgeCharSprite(text.getChildByTag(2), 1, 52, 100, 200);
                        judgeCharSprite(text.getChildByTag(3), 4, 52, 100, 200);
                        judgeCharSprite(text.getChildByTag(4), 1, 102, 100, 200);
                    });
                });

                describe("文本包含空格符", function(){
                    it("测试1", function(){
                        text.ye_string = "正  1";

                        text.ye_maxWidth = 50;

                        text.initWhenCreate("a");

                        judgeCharSprite(text.getChildByTag(0), 1, 2, 100, 200);
                        judgeCharSprite(text.getChildByTag(1), 4, 2, 100, 200, " ");
                        judgeCharSprite(text.getChildByTag(2), 7, 2, 100, 200, " ");
                        judgeCharSprite(text.getChildByTag(3), 10, 2, 100, 200, "1");
                    });
                    it("测试2", function(){
                        text.ye_string = "正\na  dbc";

                        text.ye_maxWidth = 10;

                        text.initWhenCreate("a");

                        judgeCharSprite(text.getChildByTag(0), 1, 2, 100, 200);
                        judgeCharSprite(text.getChildByTag(1), 3, 0, 0, 0);
                        judgeCharSprite(text.getChildByTag(2), 1, 52, 100, 200);
                        judgeCharSprite(text.getChildByTag(3), 4, 52, 100, 200, " ");
                        judgeCharSprite(text.getChildByTag(4), 7, 52, 100, 200, " ");
                        judgeCharSprite(text.getChildByTag(5), 1, 102, 100, 200, "d");
                        judgeCharSprite(text.getChildByTag(6), 4, 102, 100, 200, "b");
                        judgeCharSprite(text.getChildByTag(7), 7, 102, 100, 200, "c");
                    });
                    it("保留段尾的空格符（可为多行）", function(){
                        text.ye_string = "正\na   ";

                        text.ye_maxWidth = 7;

                        text.initWhenCreate("a");

                        judgeCharSprite(text.getChildByTag(0), 1, 2, 100, 200);
                        judgeCharSprite(text.getChildByTag(1), 3, 0, 0, 0);
                        judgeCharSprite(text.getChildByTag(2), 1, 52, 100, 200, "a");
                        judgeCharSprite(text.getChildByTag(3), 4, 52, 100, 200, " ");
                        judgeCharSprite(text.getChildByTag(4), 1, 102, 100, 200, " ");
                        judgeCharSprite(text.getChildByTag(5), 4, 102, 100, 200, " ");
                    });
                });
            });

            describe("测试水平对齐", function(){
                it("居中对齐", function(){
                    text.ye_xAlignment = YE.TEXT_XALIGNMENT.CENTER;
                    text.ye_string = "正1";

                    text.ye_maxWidth = 10;

                    text.initWhenCreate("a");

                    judgeCharSprite(text.getChildByTag(0), 2.5, 2, 100, 200);
                    judgeCharSprite(text.getChildByTag(1), 5.5, 2, 100, 200);
                });
                it("右对齐", function(){
                    text.ye_xAlignment = YE.TEXT_XALIGNMENT.RIGHT;
                    text.ye_string = "正1";

                    text.ye_maxWidth = 10;

                    text.initWhenCreate("a");

                    judgeCharSprite(text.getChildByTag(0), 4, 2, 100, 200);
                    judgeCharSprite(text.getChildByTag(1), 7, 2, 100, 200);
                });

                describe("忽略行尾空格符", function(){
                    it("测试居中对齐", function(){
                        text.ye_xAlignment = YE.TEXT_XALIGNMENT.CENTER;
                        text.ye_string = "正1     ";

                        text.ye_maxWidth = 100;

                        text.initWhenCreate("a");

                        judgeCharSprite(text.getChildByTag(0), 47.5, 2, 100, 200);
                        judgeCharSprite(text.getChildByTag(1), 50.5, 2, 100, 200);
                    });
                    it("测试右对齐", function(){
                        text.ye_xAlignment = YE.TEXT_XALIGNMENT.RIGHT;
                        text.ye_string = "正1   ";

                        text.ye_maxWidth = 100;

                        text.initWhenCreate("a");

                        judgeCharSprite(text.getChildByTag(0), 94, 2, 100, 200);
                        judgeCharSprite(text.getChildByTag(1), 97, 2, 100, 200);
                    });
                });
            });

            describe("测试特殊情况", function(){
                it("如果最大宽度小于行首字符的宽度（xAdvance），则该行显示一个字符", function(){
                    text.ye_string = "正12";

                    text.ye_maxWidth = 1;

                    text.initWhenCreate("a");

                    judgeCharSprite(text.getChildByTag(0), 1, 2, 100, 200);
                    judgeCharSprite(text.getChildByTag(1), 1, 52, 100, 200);
                    judgeCharSprite(text.getChildByTag(2), 1, 102, 100, 200);
                });
            });
        });
    });
});
