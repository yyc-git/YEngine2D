/**YSound 声音库
 * author：YYC
 * date：2014-05-26
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    //todo 增加cache机制
    //todo 增强浏览器兼容性

    //内部类变量不作为SoundManager的静态成员，因为内部类变量不是设计为全局共享的
    var _AudioBase = null,
        _WebAudio = null,
        _Html5Audio = null;

    var SoundManager = YYC.Class({
        Init: function (config) {
            this.ye_config = config;
        },
        Private: {
            ye_config: null
        },
        Public: {
            initWhenCreate: function () {
                switch (SoundManager._audioType) {
                    case SoundManager.AudioType.WEBAUDIO:
                        SoundManager._audioObj = _WebAudio.create(this.ye_config);
                        break;
                    case SoundManager.AudioType.HTML5AUDIO:
                        SoundManager._audioObj = _Html5Audio.create(this.ye_config);
                        break;
                    case SoundManager.AudioType.NONE:
                        YE.log("浏览器不支持Web Audio和Html5 Audio");
                        return YE.returnForTest;
                        break;
                    default:
                        return YE.returnForTest;
                        break;
                }

                SoundManager._audioObj.load();
            },
            play: function () {
                SoundManager._audioObj.play();
            },
            getPlayState: function () {
                return SoundManager._audioObj.getPlayState();
            },


            forTest_getAudioBase: function () {
                return _AudioBase;
            },
            forTest_getWebAudio: function () {
                return _WebAudio;
            },
            forTest_getHtml5Audio: function () {
                return _Html5Audio;
            }
        },
        Static: {
            _audioType: null,
            _ctx: null,
            _audioObj: null,
            AudioType: {
                NONE: 0,
                WEBAUDIO: 1,
                HTML5AUDIO: 2
            },
            PlayState: {
                NONE: 0,
                PLAYING: 1,
                END: 2
            },

            audioDetect: function () {
                try {
                    var contextClass = window.AudioContext ||
                        window.webkitAudioContext ||
                        window.mozAudioContext ||
                        window.oAudioContext ||
                        window.msAudioContext;
                    if (contextClass) {
                        this._ctx = new contextClass();
                        this._audioType = this.AudioType.WEBAUDIO;
                    }
                    else {
                        this._html5AudioDetect();
                    }
                }
                catch (e) {
                    this._html5AudioDetect();
                }
            },
            _html5AudioDetect: function () {
                if (typeof Audio !== "undefined") {
                    try {
                        new Audio();
                        this._audioType = this.AudioType.HTML5AUDIO;
                    }
                    catch (e) {
                        this._audioType = this.AudioType.NONE;
                    }
                }
                else {
                    this._audioType = this.AudioType.HTML5AUDIO;
                }
            },
            create: function (config) {
                var manager = new this(config);

                manager.initWhenCreate();

                return manager;
            }
        }
    });

    SoundManager.audioDetect();

    (function () {
        _AudioBase = YYC.AClass({
            Private: {
                ye_getCanPlayUrl: function () {
                    var self = this,
                        canPlayUrl = null;

                    this.ye_P_urlArr.forEach(function (url) {
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

                    //todo 完善mimeType
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
            Protected: {
                ye_P_urlArr: null,
                ye_P_url: null
            },
            Public: {
                initWhenCreate: function () {
                    this.ye_P_url = this.ye_getCanPlayUrl();
                }
            },
            Abstract: {
                play: function () {
                },
                load: function () {
                },
                getPlayState: function () {
                }
            }
        });

        _WebAudio = YYC.Class(_AudioBase, {
            Init: function (config) {
                this.ye__config = config;

                this.ye_P_urlArr = config.urlArr;
                this.ye__onLoad = config.onLoad;
                this.ye__onError = config.onError;
            },
            Private: {
                ye__buffer: null,
                ye__bufferSource: null,
                ye__onLoad: null,
                ye__onError: null,
                ye__config: null,
                ye__playState: null,

                ye__loadBuffer: function (obj, url) {
                    var self = this;

                    YE.$.ajax({
                        type: "get",
                        url: url,
                        dataType: "arraybuffer",
                        success: function (data) {
                            self.ye__decodeAudioData(data, obj);
                        },
                        error: function () {
                            YE.log("使用Web Audio加载失败！尝试使用Html5 Audio加载");
                            SoundManager._audioObj = _Html5Audio.create(self.ye__config);
                            SoundManager._audioObj.load();
                        }
                    });
                },
                ye__decodeAudioData: function (arraybuffer, obj) {
                    var self = this;

                    SoundManager._ctx.decodeAudioData(
                        arraybuffer,
                        function (buffer) {
                            if (buffer) {
                                self.ye__buffer = buffer;
                                self.ye__onLoad(self);
                            }
                        },
                        function (err) {
                            obj.ye__onError(err.err);
                        }
                    );
                }
            },
            Public: {
                initWhenCreate: function () {
                    this.base();

                    this.ye__playState = SoundManager.PlayState.NONE;
                },
                load: function () {
                    this.ye__loadBuffer(this, this.ye_P_url);
                },
                play: function () {
                    var source = SoundManager._ctx.createBufferSource(),
                        self = this;

                    source.buffer = this.ye__buffer;
                    source.connect(SoundManager._ctx.destination);
                    source.start(0);
                    this.ye__playState = SoundManager.PlayState.PLAYING;

                    /*!
                     有问题！线程阻塞时可能会不触发onended！
                     因此使用timer代替
                     source.onended = function(){
                     self.ye__status = 2;
                     };*/

                    setTimeout(function () {
                        self.ye__playState = SoundManager.PlayState.END;
                    }, this.ye__buffer.duration * 1000);
                },
                getPlayState: function () {
                    return this.ye__playState;
                }
            },
            Static: {
                create: function (config) {
                    var audio = new this(config);

                    audio.initWhenCreate();

                    return audio;
                }
            }
        });

        _Html5Audio = YYC.Class(_AudioBase, {
            Init: function (config) {
                this.ye_P_urlArr = config.urlArr;
                this.ye__onLoad = config.onLoad;
                this.ye__onError = config.onError;
            },
            Private: {
                ye__audio: null,
                ye__onLoad: null,
                ye__onError: null,

                ye__load: function () {
                    //应该在绑定了事件后再设置src
                    //因为设置src后，即会开始加载声音，所以事件handle越早有效越好。
                    this.ye__audio.src = this.ye_P_url;
                }
            },
            Public: {
                load: function () {
                    var self = this;

                    this.ye__audio = new Audio();

                    this.ye__audio.addEventListener("canplaythrough", function () {
                        self.ye__onLoad(self);
                    }, false);
                    this.ye__audio.addEventListener("error", function () {
                        self.ye__onError("errorCode " + self.ye__audio.error.code);
                    }, false);
//
//                audio.autoplay = false;
//                audio.preload = 'auto';
//                audio.autobuffer = true;

                    /*!
                     audio在Chrome下必须被reloaded，否则只会播放一次
                     audio在Firefox下不能被reloaded，否则会延迟
                     */
                    this.ye__audio.addEventListener("ended", function () {
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

                    this.ye__load();

//                setTimeout(function () {
//                }, 50);
                },
                play: function () {
                    this.ye__audio.play();
                },
                getPlayState: function () {
                    var playState = 0;

                    if (this.ye__audio.ended) {
                        playState = SoundManager.PlayState.END;
                    }
                    else if (this.ye__audio.currentTime > 0) {
                        playState = SoundManager.PlayState.PLAYING;
                    }
                    else {
                        playState = SoundManager.PlayState.NONE;
                    }

                    return playState;
                }
            },
            Static: {
                create: function (config) {
                    var audio = new this(config);

                    audio.initWhenCreate();

                    return audio;
                }
            }
        });
    }());


    YE.YSound = SoundManager;
}());

