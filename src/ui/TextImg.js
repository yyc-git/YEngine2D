/**YEngine2D
 * author：YYC
 * date：2015-01-25
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
//    var IText = YYC.Interface(
////        "setString",
////        "enableStroke",
////        "enableFill",
////        "setFontFillColor",
////        "setFontName",
////        "setFontSize",
////        "setDimensions",
////        "setPosition",
////        "getChildByTag"
//    );


    YE.TextImg = YYC.Class({Class: YE.NodeContainer}, {
//        Init: function (string, fontPath, fontSize) {
//            this.base();
//
////            this.ye_string = string;
////            this.ye_fontPath = fontPath || "sans-serif";
////            this.ye_fontSize = fontSize || 10;
//        },
        Private: {
//            ye_string: null,
//            ye_fontPath: null,
//            ye_fontName: null,
//            ye_fontSize: null,
//            ye_x: null,
//            ye_y: null,
//            ye_strokeEnabled: null,
//            ye_fillEnabled: null,
//            ye_strokeStyle: null,
//            ye_strokeSize: null,
//
//            ye_getFontName: function (fontPath) {
//                return YE.Tool.path.basename(fontPath, YE.Tool.path.extname(fontPath));
//            }
        },
        Protected: {
            ye_P_run: function () {
//                if (this.ye___isChange()) {
//                    this.clear();

                var canvasData = this.getCanvasData();

                this.getContext().clearRect(0, 0, canvasData.width, canvasData.height);



                this.iterate("onBeforeDraw", [this.getContext()]);


//                    this.draw(this.getContext());
                    this.iterate("draw", [this.getContext()]);


                    this.iterate("onAfterDraw", [this.getContext()]);
//                    this.setStateNormal();
//                }
            }
        },
        Public: {
//            //游戏主循环调用的方法
//            run: function (context) {
//                if (this.isSortAllChilds) {
//                    this.sortByZOrder();
//                }
//
//                this.ye_P_run(context);
//            },

            //todo 待重构
            getContext: function () {
                return $("#uiLayerCanvas")[0].getContext("2d");
            },
            getGraphics: function () {

            },
            getCanvasData: function () {
                return {
                    width: $("#uiLayerCanvas")[0].width,
                    height: $("#uiLayerCanvas")[0].height
                }
            },


            initWhenCreate: function (str, id) {
                var self = this;

                //todo 显示多个字符时，重叠到一起了！需要解决

                if (id) {
//                    var newConf = cc.loader.getRes(fntFile);
                    var newConf = YE.fntLoader.getRes(id + "_fnt");
                    if (!newConf) {
                        YE.log("cc.LabelBMFont.initWithString(): Impossible to create font. Please check file");
                        return false;
                    }

//                    var img = YE.ImgLoader.get(newConf.atlasName)

                    var img = YE.ImgLoader.getInstance().get(id + "_image");

                    //todo charCode===10 换行？

                    var stringLen = str.length;
                    var locStr = str;
                    var locFontDict = newConf.fontDefDictionary;

                    for (var i = 0; i < stringLen; i++) {
                        var key = locStr.charCodeAt(i);
                        if (key == 0) continue;

//                        if (key === 10) {
//                            //new line
//                            nextFontPositionX = 0;
//                            nextFontPositionY -= locCfg.commonHeight;
//                            continue;
//                        }

//                        var kerningAmount = locKerningDict[(prev << 16) | (key & 0xffff)] || 0;
                        var fontDef = locFontDict[key];
                        if (!fontDef) {
                            YE.log("cocos2d: LabelBMFont: character not found " + locStr[i]);
                            continue;
                        }


                        var rect = YE.rect(fontDef.rect.x, fontDef.rect.y, fontDef.rect.width, fontDef.rect.height);
//                        rect = cc.rectPixelsToPoints(rect);
//                        rect.x += self._imageOffset.x;
//                        rect.y += self._imageOffset.y;

                        var fontChar = self.getChildByTag(i);

                        if (!fontChar) {
//                            fontChar = new YE.Sprite();
//                            fontChar.initWithTexture(locTexture, rect, false);
//                            fontChar._newTextureWhenChangeColor = true;
//                            this.addChild(fontChar, 0, i);


                            var frame = YE.Frame.create(YE.Bitmap.create(img), rect);
//                             bitmap.setAnchor(imgData.rect);

                            fontChar = YE.Sprite.create(frame);

                            //todo 大小为size？
                            //暂时设为commonHeight

                            fontChar.setWidth(newConf.commonHeight);
                            fontChar.setHeight(newConf.commonHeight);

                            this.addChild(fontChar, 0, i);

                        }
//                        else{
//                            this._renderCmd._updateCharTexture(fontChar, rect, key);
//                        }
                    }

                    //todo 如何setPosition

                    //todo 设置偏移量，xAdvance等

                    //todo updateLabel


//                    self._config = newConf;
//                    self._fntFile = fntFile;
//                    texture = cc.textureCache.addImage(newConf.atlasName);
//                    var locIsLoaded = texture.isLoaded();
//                    self._textureLoaded = locIsLoaded;
//                    if (!locIsLoaded) {
//                        texture.addEventListener("load", function (sender) {
//                            var self1 = this;
//                            self1._textureLoaded = true;
//                            //reset the LabelBMFont
//                            self1.initWithTexture(sender, self1._initialString.length);
//                            self1.setString(self1._initialString, true);
//                            self1.dispatchEvent("load");
//                        }, self);
//                    }


                }
//                else {
//                    texture = new cc.Texture2D();
//                    var image = new Image();
//                    texture.initWithElement(image);
//                    self._textureLoaded = false;
//                }
            }
//
//            setString: function (string) {
//                this.ye_string = string;
//            },
//            setPosition: function (x, y) {
//                this.ye_x = x;
//                this.ye_y = y;
//            },
//            enableStroke: function (strokeStyle, strokeSize) {
//                this.ye_strokeEnabled = true;
//                this.ye_fillEnabled = false;
//
//                this.ye_strokeStyle = strokeStyle;
//                this.ye_strokeSize = strokeSize;
//            },
//            enableFill: function (fillStyle) {
//                this.ye_fillEnabled = true;
//                this.ye_strokeEnabled = false;
//
//                this._fillStyle = fillStyle;
//            },
//            draw: function (context) {
//                context.save();
//
//                context.font = this.ye_fontSize + "px '" + this.ye_fontName + "'";
//
//                if (this.ye_fillEnabled) {
//                    context.fillStyle = this._fillStyle;
//                    context.fillText(this.ye_string, this.ye_x, this.ye_y);
//                }
//                else if (this.ye_strokeEnabled) {
//                    context.strokeStyle = this.ye_strokeStyle;
//                    context.lineWidth = this.ye_strokeSize;
//                    context.strokeText(this.ye_string, this.ye_x, this.ye_y);
//                }
//
//                context.restore();
//            }
        },
        Static: {
            create: function (str, id) {
                var text = new this();

                text.initWhenCreate(str, id);

                return text;
            }
        }
    });
}());