YE.fntLoader = {
    INFO_EXP: /info [^\n]*(\n|$)/gi,
    COMMON_EXP: /common [^\n]*(\n|$)/gi,
    PAGE_EXP: /page [^\n]*(\n|$)/gi,
    CHAR_EXP: /char [^\n]*(\n|$)/gi,
    KERNING_EXP: /kerning [^\n]*(\n|$)/gi,
    ITEM_EXP: /\w+=[^ \r\n]+/gi,
    INT_EXP: /^[\-]?\d+$/,       //还会有“-”？


    _cache: {},

    _parseStrToObj: function (str) {
        var arr = str.match(this.ITEM_EXP);
        var obj = {};
        if (arr) {
            for (var i = 0, li = arr.length; i < li; i++) {
                var tempStr = arr[i];
                var index = tempStr.indexOf("=");
                var key = tempStr.substring(0, index);
                var value = tempStr.substring(index + 1);
                if (value.match(this.INT_EXP)) value = parseInt(value);
                else if (value[0] == '"') value = value.substring(1, value.length - 1);
                obj[key] = value;
            }
        }
        return obj;
    },

    /**
     * Parse Fnt string.
     * @param fntStr
     * @param url
     * @returns {{}}
     */
    parseFnt: function (fntStr, url) {
        var self = this, fnt = {};

        //padding
        var infoObj = this._parseStrToObj(fntStr.match(this.INFO_EXP)[0]);
        var paddingArr = infoObj["padding"].split(",");
        var padding = {
            left: parseInt(paddingArr[0]),
            top: parseInt(paddingArr[1]),
            right: parseInt(paddingArr[2]),
            bottom: parseInt(paddingArr[3])
        };

        //common
        var commonObj = self._parseStrToObj(fntStr.match(self.COMMON_EXP)[0]);
        fnt.commonHeight = commonObj["lineHeight"];
//        if (cc._renderType === cc._RENDER_TYPE_WEBGL) {
//            var texSize = cc.configuration.getMaxTextureSize();
//            if (commonObj["scaleW"] > texSize.width || commonObj["scaleH"] > texSize.height)
//                cc.log("cc.LabelBMFont._parseCommonArguments(): page can't be larger than supported");
//        }


//下面的Texture用来设置纹理贴图的总大小，
// 当改大小不足以装下所有字符时，
// 会使用分页的方式来实现，即一个fnt文件对应多张png纹理图。

        if (commonObj["pages"] !== 1) YE.log("cc.LabelBMFont._parseCommonArguments(): only supports 1 page");

        //page
        var pageObj = self._parseStrToObj(fntStr.match(self.PAGE_EXP)[0]);
        if (pageObj["id"] !== 0) YE.log("cc.LabelBMFont._parseImageFileName() : file could not be found");
        fnt.atlasName = YE.Tool.path.changeBasename(url, pageObj["file"]);

        //char
        var charLines = fntStr.match(self.CHAR_EXP);
        var fontDefDictionary = fnt.fontDefDictionary = {};
        for (var i = 0, li = charLines.length; i < li; i++) {
            var charObj = self._parseStrToObj(charLines[i]);
            var charId = charObj["id"];
            fontDefDictionary[charId] = {
                rect: {x: charObj["x"], y: charObj["y"], width: charObj["width"], height: charObj["height"]},
                xOffset: charObj["xoffset"],
                yOffset: charObj["yoffset"],

                //xadvance等于字符纹理宽度
                xAdvance: charObj["xadvance"]
            };
        }

        //todo 待研究 kerning
//        http://www.blueidea.com/design/doc/2007/5160.asp

        //kerning
//        var kerningDict = fnt.kerningDict = {};
//        var kerningLines = fntStr.match(self.KERNING_EXP);
//        if (kerningLines) {
//            for (var i = 0, li = kerningLines.length; i < li; i++) {
//                var kerningObj = self._parseStrToObj(kerningLines[i]);
//                kerningDict[(kerningObj["first"] << 16) | (kerningObj["second"] & 0xffff)] = kerningObj["amount"];
//            }
//        }
        return fnt;
    },

    /**
     * load the fnt
     * @param realUrl
     * @param url
     * @param res
     * @param cb
     */
//    load: function (realUrl, url, res, cb) {
//    load: function (url, callback) {
    load: function (url, id) {
        var self = this;

        YE.loader.loadTxt(url, function (err, txt) {
            if (err) {
//                return callback(err);
                YE.LoaderManager.getInstance().onResError(url, err);
                return
            }

//            callback(null, self.parseFnt(txt, url));
            YE.LoaderManager.getInstance().onResLoaded();
            self._cache[id] = self.parseFnt(txt, url);
        });
    },
    getRes: function (id) {
        return this._cache[id];
    }
};