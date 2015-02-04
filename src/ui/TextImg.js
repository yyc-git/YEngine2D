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

//    YE.CharType = {
//        NEWLINE: "/n"
//    };

    YE.TEXT_XALIGNMENT = {
        LEFT: 0,
        CENTER: 1,
        RIGHT: 2
    };
    YE.TEXT_YALIGNMENT = {
        TOP: 0,
        MIDDLE: 1,
        BOTTOM: 2
    };


    YE.TextImg = YYC.Class({Class: YE.NodeContainer}, {
        Init: function (string, maxWidth, xAlignment) {
            this.base();

            this.ye_string = string;
            this.ye_maxWidth = maxWidth || 0;
            this.ye_xAlignment = xAlignment || YE.TEXT_XALIGNMENT.LEFT;
        },
        Private: {
            ye_string: null,
            ye_maxWidth: null,
            ye_xAlignment: null,
//
//            ye_getFontName: function (fontPath) {
//                return YE.Tool.path.basename(fontPath, YE.Tool.path.extname(fontPath));
//            }

            //Checking whether the character is a whitespace
            ye_isSpaceUnicode: function (char) {
                var charCode = char.charCodeAt(0);

                return  (
//                    (charCode >= 9 && charCode <= 13)   //要排除10（newline）这种情况
                    charCode == 32 || charCode == 133 || charCode == 160 || charCode == 5760
                        || (charCode >= 8192 && charCode <= 8202) || charCode == 8232 || charCode == 8233 || charCode == 8239
                        || charCode == 8287 || charCode == 12288);
            },
            ye_isNewline: function (char) {
                return char.charCodeAt(0) == 10;
            },
            ye_getLetterPosXLeft: function (sp) {
//                return sp.getPositionX() * this._scaleX - (sp._getWidth() * this._scaleX * sp._getAnchorX());
                return sp.startPosX;
            },
            ye_getLetterPosXRight: function (sp) {
//                return sp.getPositionX() * this._scaleX + (sp._getWidth() * this._scaleX * sp._getAnchorX());
//                return sp.getPositionX() + sp.getWidth();
                return sp.getPositionX() + sp.xAdvance;
            },


            /*!
             ////空格字符没有精灵，但是也算一个序号。
             ////如str = "1 a";
             ////那么getChildByTag(0)对应“1”，getChildByTag(1)对应空格（没有精灵，为null），getChildByTag(2)对应“a”

             空白符、换行符都有对应的精灵

             */

            ye_createAndAddFontCharSprites: function (fntObj, img) {
                var self = this;


                //todo 待研究cocos2d位置的计算nextFontPositionX/Y

                //todo 使用setCacheData来重构设置属性（如fontChar.string）

                var stringLen = this.ye_string.length;
                var locStr = this.ye_string;
                var locFontDict = fntObj.fontDefDictionary;
                var nextFontPositionX = 0,
                    nextFontPositionY = 0;

                var locCfg = fntObj;

                for (var i = 0; i < stringLen; i++) {
                    var key = locStr.charCodeAt(i);

                    //todo 什么情况下会为0？
//                    if (key == 0) continue;

//                        if (this.ye_isNewline(key)) {
//                            //new line
//                            nextFontPositionX = 0;
////                            nextFontPositionY -= locCfg.commonHeight;
//                            nextFontPositionY +-= locCfg.commonHeight;
//
//                            continue;
//                        }


                    if (this.ye_isNewline(locStr[i])) {
                        var fontChar = self.getChildByTag(i);


                        if (!fontChar) {
                            fontChar = YE.Sprite.create();
                        }

                        fontChar.char = locStr[i];


                        this.addChild(fontChar, 0, i);

//                        else{
//                            this._renderCmd._updateCharTexture(fontChar, rect, key);
//                        }


                        fontChar.setPosition(nextFontPositionX, nextFontPositionY);
//
                        fontChar.startPosX = nextFontPositionX;
                        fontChar.xAdvance = 0;


//                        nextFontPositionX = nextFontPositionX + fontDef.xAdvance;

                        nextFontPositionX = 0;
////                            nextFontPositionY -= locCfg.commonHeight;
                        nextFontPositionY = nextFontPositionY + locCfg.commonHeight;

                        continue;
                    }


//                        var kerningAmount = locKerningDict[(prev << 16) | (key & 0xffff)] || 0;
                    var fontDef = locFontDict[key];
                    if (!fontDef) {
                        YE.log("cocos2d: LabelBMFont: character not found " + locStr[i]);
                        continue;
                    }

//                    //如果为空白符，则不创建对应的精灵，右移x坐标（空格也是一个字符，应该包含在fnt文件中）
//                    if (this.ye_isSpaceUnicode(key)) {
//                        nextFontPositionX = nextFontPositionX + fontDef.xAdvance;
////                        this.ye_space_xAdvance = fontDef.xAdvance;
//                        continue;
//                    }


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


//                            fontChar.setWidth(newConf.commonHeight);
//                            fontChar.setHeight(newConf.commonHeight);

                        fontChar.setWidth(rect.size.width);
                        fontChar.setHeight(rect.size.height);


                    }


//                    fontChar.setCacheData();
                    fontChar.char = locStr[i];


                    this.addChild(fontChar, 0, i);

//                        else{
//                            this._renderCmd._updateCharTexture(fontChar, rect, key);
//                        }


                    fontChar.setPosition(nextFontPositionX + fontDef.xOffset, nextFontPositionY + fontDef.yOffset);

                    fontChar.startPosX = nextFontPositionX;
                    fontChar.xAdvance = fontDef.xAdvance;


                    nextFontPositionX = nextFontPositionX + fontDef.xAdvance;


                }
            },
            ye_formatText: function (fntObj) {
                //处理多行、空格、超出宽度（需要换行）


//                var fontCharSprites = this.getChilds();

                var self = this;


//                self.string = self._initialString;

                // Step 1: Make multiline
                if (self.ye_maxWidth > 0) {
//                    var stringLength = self.ye_string.length;
//                    var multiline_string = [];
//                    var last_word = [];
//
//                    var line = 1, i = 0, start_line = false, start_word = false, startOfLine = -1, startOfWord = -1, skip = 0;
//
                    var characterSprite;

                    var x = 0,
                        y = 0;

                    var lineHeight = fntObj.commonHeight;

                    //todo 改为iterate

                    //这里遍历string而不是遍历childs，是为了获得正确的序号index，从而能获得对应字符的精灵
                    for (var i = 0, lj = self.ye_string.length; i < lj; i++) {
                        characterSprite = this.getChildByTag(i);

//                        //不是每个字符都有精灵（如空格字符就没有精灵）
//                        if (!characterSprite) {
////                            x = x - this.ye_space_xAdvance;
//                            continue;
//                        }

                        if (!characterSprite) {
                            throw new Error("字符不能没有对应的精灵！");
                        }


//                    for (var i = 0, lj = self.getChilds().length; i < lj; i++) {
//                        var justSkipped = 0;
//                        while (!(characterSprite = self.getChildByTag(j + skip + justSkipped)))
//                            justSkipped++;
//                        skip += justSkipped;
//
//                        if (i >= stringLength)
//                            break;
//
//                        var character = self.ye_string[i];
//                        if (!start_word) {
//                            startOfWord = self._getLetterPosXLeft(characterSprite);
//                            start_word = true;
//                        }
//                        if (!start_line) {
//                            startOfLine = startOfWord;
//                            start_line = true;
//                        }
//
//                        // Newline.
//                        if (character.charCodeAt(0) == 10) {
//                            last_word.push('\n');
//                            multiline_string = multiline_string.concat(last_word);
//                            last_word.length = 0;
//                            start_word = false;
//                            start_line = false;
//                            startOfWord = -1;
//                            startOfLine = -1;
//                            //i+= justSkipped;
//                            j--;
//                            skip -= justSkipped;
//                            line++;
//
//                            if (i >= stringLength)
//                                break;
//
//                            character = self.ye_string[i];
//                            if (!startOfWord) {
//                                startOfWord = self._getLetterPosXLeft(characterSprite);
//                                start_word = true;
//                            }
//                            if (!startOfLine) {
//                                startOfLine = startOfWord;
//                                start_line = true;
//                            }
//                            i++;
//                            continue;
//                        }

//                        // Whitespace.
//                        if (this._isspace_unicode(character)) {
//                            last_word.push(character);
//                            multiline_string = multiline_string.concat(last_word);
//                            last_word.length = 0;
//                            start_word = false;
//                            startOfWord = -1;
//                            i++;
//                            continue;
//                        }


                        if (this.ye_isNewline(characterSprite.char)) {


                            //newline和fullline标志应该放在行最后一个字符


                            characterSprite.newline = true;


//                            if (this.getChildByTag(i + 1)) {
//                                var nextSpriteXVdance = this.getChildByTag(i + 1).xAdvance;
//                            }
//                            else {
//                                var nextSpriteXVdance = 0;
//                            }
//
//                            if (this.ye_getLetterPosXRight(characterSprite) - x + nextSpriteXVdance > this.ye_maxWidth) {
//                                characterSprite.fullLine = true;
//                            }

                            //主动回车的字符，fullline为false
                            characterSprite.fullLine = false;


                            characterSprite.setPosition(characterSprite.getPositionX() - x,
                                characterSprite.getPositionY() + y);

                            x = 0;
                        }

                        // Out of bounds.
//                        if (self._getLetterPosXRight(characterSprite) - startOfLine > self.ye_maxWidth) {

//                        if (this.ye_isOutOfBounds()) {


                        else if (this.ye_getLetterPosXRight(characterSprite) - x > this.ye_maxWidth) {
                            //todo 实现空格不能导致换行的设置
                            //先实现空格可以导致换行（lineBreakWithoutSpaces）的情况


//                            lastCharSprite = this.getChildByTag(i - 1);
//
//                            if (lastCharSprite) {
//                                x = x + this.ye_getLetterPosXRight(lastCharSprite);
//                            }
//                            else{
//
//                            }


                            if (this.getChildByTag(i - 1)) {
                                var prevCharSprite = this.getChildByTag(i - 1);


                                prevCharSprite.newline = true;


////                                if (this.ye_getLetterPosXRight(prevCharSprite) - x + characterSprite.xAdvance > this.ye_maxWidth) {
//                                prevCharSprite.fullLine = true;
////                                }

                                //如果前一个字符是空格字符（即行最后字符为空格字符），则行不算fullline（因为在对齐时会将行最后的空格字符去掉）
                                 if(!this.ye_isSpaceUnicode(prevCharSprite.char)){
                                     prevCharSprite.fullLine = true;
                                 }

                            }

//                            characterSprite.newline = true;


//                            if (this.getChildByTag(i + 1)) {
//                                var nextSpriteXVdance = this.getChildByTag(i + 1).xAdvance;
//                            }
//                            else {
//                                var nextSpriteXVdance = 0;
//                            }
//
//                            if (this.ye_getLetterPosXRight(characterSprite) - x + nextSpriteXVdance > this.ye_maxWidth) {
//                                characterSprite.fullLine = true;
//                            }


                            x = this.ye_getLetterPosXLeft(characterSprite);


                            y = y + lineHeight;

                            characterSprite.setPosition(characterSprite.getPositionX() - x,
                                characterSprite.getPositionY() + y);


//                            if (!self._lineBreakWithoutSpaces) {
//                                last_word.push(character);
//
//                                var found = multiline_string.lastIndexOf(" ");
//                                if (found != -1)
//                                    this._utf8_trim_ws(multiline_string);
//                                else
//                                    multiline_string = [];
//
//                                if (multiline_string.length > 0)
//                                    multiline_string.push('\n');
//
//                                line++;
//                                start_line = false;
//                                startOfLine = -1;
//                                i++;
//                            } else {
//                                this._utf8_trim_ws(last_word);
//
//                                last_word.push('\n');
//                                multiline_string = multiline_string.concat(last_word);
//                                last_word.length = 0;
//                                start_word = false;
//                                start_line = false;
//                                startOfWord = -1;
//                                startOfLine = -1;
//                                line++;
//
//                                if (i >= stringLength)
//                                    break;
//
//                                if (!startOfWord) {
//                                    startOfWord = self._getLetterPosXLeft(characterSprite);
//                                    start_word = true;
//                                }
//                                if (!startOfLine) {
//                                    startOfLine = startOfWord;
//                                    start_line = true;
//                                }
//                                j--;
//                            }
                        }
//                        else {
//                            // Character is normal.
//                            last_word.push(character);
//                            i++;
//                        }

                        else {
                            characterSprite.setPosition(characterSprite.getPositionX() - x,
                                characterSprite.getPositionY() + y);
                        }
                    }

//                    multiline_string = multiline_string.concat(last_word);
//                    var len = multiline_string.length;
//                    var str_new = "";
//
//                    for (i = 0; i < len; ++i)
//                        str_new += multiline_string[i];
//
//                    str_new = str_new + String.fromCharCode(0);
//                    //this.updateString(true);
//                    self._setString(str_new, false)
                }


                //处理对齐

                //以行为单位进行遍历
                //如果该行满员，则不处理
                //否则，根据对齐方式，调整该行的字符位置（不会换行）

                //换行的最后一个字符设置为换行标志，并设置该行是否满员的标志。



                if (this.ye_xAlignment != YE.TEXT_XALIGNMENT.LEFT) {
                    var line = [];

                    //行可以全为空格，对齐时不将空行去掉！如："     2"，则第一行为空

                    //行最后的空格不算

                    this.iterate(function (characterSprite) {







//                        if (!this.ye_isNewline(characterSprite.char)) {
                        if (!characterSprite.newline) {
                            line.push(characterSprite);
                            return;
                        }

                        if (characterSprite.newline && characterSprite.fullLine) {
                            line = [];
                            return;
                        }


                        //newline, not full line
//                        line.push(characterSprite);
                        self.ye_alignLine(line, line[line.length - 1]);

                        line = [];
                    });

                    //处理最后一行
                    if (line.length > 0) {
                        self.ye_alignLine(line, line[line.length - 1]);
                    }
                }
            },
            ye_alignLine: function (line, lastCharSprite) {
                var self = this;
//                    line = line.filter(function (cp) {
//                        return !self.ye_isSpaceUnicode(cp.char);
//
//                    });


                line = this.ye_trimBottomSpaceChar(line);

                lastCharSprite = line[line.length - 1];

                line.forEach(function (cp) {
                    var shift = null;

                    var lineWidth = self.ye_getLetterPosXRight(lastCharSprite);

                    switch (self.ye_xAlignment) {
                        case YE.TEXT_XALIGNMENT.CENTER:
                            shift = (self.ye_maxWidth - lineWidth) / 2;
                            break;
                        case YE.TEXT_XALIGNMENT.RIGHT:
                            shift = self.ye_maxWidth - lineWidth;
                            break;
                        default:
                            break;
                    }

                    cp.setPositionX(cp.getPositionX() + shift);
                });
            },
            ye_trimBottomSpaceChar: function (line) {
                var i = line.length - 1;

//                for (i = line.length; i >= 0; i--) {
//
//                }

//                var temp = null;

                if(this.ye_isNewline(line[i].char)){
//                    temp = line[i];

                    i = i - 1;
                }

                while(i >= 0 && this.ye_isSpaceUnicode(line[i].char)){
                       i = i - 1;
                }

                line = line.splice(0, i + 1);

                return line;
//
//                line = line.filter(function (cp) {
//                    return !self.ye_isSpaceUnicode(cp.char);
//
//                });
            }
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

            //todo 设置width, xAlignment, imageOffset

            initWhenCreate: function (id) {
                //todo 暂不支持kerning

                if (id) {
//                    var newConf = cc.loader.getRes(fntFile);
                    var newConf = YE.fntLoader.getRes(id + "_fnt");
                    if (!newConf) {
                        YE.log("cc.LabelBMFont.initWithString(): Impossible to create font. Please check file");
                        return false;
                    }

//                    var img = YE.ImgLoader.get(newConf.atlasName)

                    var img = YE.ImgLoader.getInstance().get(id + "_image");


                    this.ye_createAndAddFontCharSprites(newConf, img);


                    this.ye_formatText(newConf);


                    //todo 设置偏移量等


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
            create: function (str, id, maxWidth, xAlignment) {
                var text = new this(str, maxWidth, xAlignment);

                text.initWhenCreate(id);

                return text;
            }
        }
    });
}());