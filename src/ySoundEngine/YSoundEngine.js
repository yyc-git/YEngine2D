/**YSoundEngine
 * author：YYC
 * date：2014-05-26
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    YE.YSoundEngine = YYC.Class({
        Init: function (config) {
            this.ye_urlArr = config.urlArr;
            this.ye_onload = config.onload;
            this.ye_onerror = config.onerror;
        },
        Private: {
            ye_audio: null,
            ye_urlArr: null,
            ye_onload: null,
            ye_onerror: null,

            ye_load: function () {
                //应该在绑定了事件后再设置src
                //因为设置src后，即会开始加载声音，所以事件handle越早有效越好。
                this.ye_audio.src = this.ye_getCanPlayUrl();
            },
            ye_getCanPlayUrl: function () {
                var self = this,
                    canPlayUrl = null;

                this.ye_urlArr.forEach(function (url) {
                    var result = url.match(/\.(\w+)$/);

                    if (result === null) {
                        YE.error(true, "声音url错误，必须加上类型后缀名");
                        return $break;
                    }

                    if (self.ye_canplay(result[1])) {
                        canPlayUrl = url;
                        return $break;
                    }
                });

                if (canPlayUrl === null) {
                    YE.error(true, "浏览器不支持该声音格式");
                    return;
                }

                return canPlayUrl;
            },
            ye_canplay: function (mimeType) {
                var audio = new Audio(),
                    mimeStr = null;

                switch (mimeType) {
                    case 'mp3':
                        mimeStr = "audio/mpeg";
                        break;
//                    case 'vorbis':
//                        mimeStr = "audio/ogg; codecs='vorbis'";
//                        break;
//                    case 'opus':
//                        mimeStr = "audio/ogg; codecs='opus'";
////                        break;
//                    case 'webm':
//                        mimeStr = "audio/webm; codecs='vorbis'";
//                        break;
//                    case 'mp4':
//                        mimeStr = "audio/mp4; codecs='mp4a.40.5'";
//                        break;
                    case 'wav':
                        mimeStr = "audio/wav";
                        break;
                    default :
                        YE.error(true, "声音类型错误");
                        break;
                }

                if (mimeType == 'mp3' && YE.Tool.judge.browser.isFF()) {
                    return false;
                }

                return !!audio.canPlayType && audio.canPlayType(mimeStr) !== "";
            }
        },
        Public: {
            initWhenCreate: function () {
                var self = this;

                if (!Audio) {
                    YE.log("浏览器不支持Audio对象");
                    return YE.returnForTest;
                }

                this.ye_audio = new Audio();

                this.ye_audio.addEventListener("canplaythrough", function () {
                    self.ye_onload();
                }, false);
                this.ye_audio.addEventListener("error", function () {
                    self.ye_onload(self.ye_audio.error.code);
                }, false);
//
//                audio.autoplay = false;
//                audio.preload = 'auto';
//                audio.autobuffer = true;

                /*!
                 audio在Chrome下必须被reloaded，否则只会播放一次
                 audio在Firefox下不能被reloaded，否则会延迟
                 */
                this.ye_audio.addEventListener("ended", function () {
                    if (YE.Tool.judge.browser.isChrome()) {
                        this.load();
                    }
                    else if (YE.Tool.judge.browser.isFF()) {
                        this.currentTime = 0;
                    }
                    else {
                        YE.error(true, "目前仅支持Chrome、Firefox浏览器");
                    }
                }, false);

                this.ye_load();

                setTimeout(function () {
                }, 50);
            },
            play: function () {
                this.ye_audio.play();
            }
        },
        Static: {
            create: function (config) {
                var engine = new this(config);

                engine.initWhenCreate();

                return engine;
            }
        }
    });
}());