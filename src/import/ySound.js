/**YSound web audio库
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

    var AudioType = {
            NONE: 0,
            WEBAUDIO: 1,
            HTML5AUDIO: 2
        },
        PlayState = {
            NONE: 0,
            PLAYING: 1,
            END: 2
        };
    var _audioType = null,
        _ctx = null,
        _audioObj = null;

    _audioTest();

    function _audioTest() {
        try {
            var contextClass = window.AudioContext ||
                window.webkitAudioContext ||
                window.mozAudioContext ||
                window.oAudioContext ||
                window.msAudioContext;
            if (contextClass) {
                _ctx = new contextClass();
                _audioType = AudioType.WEBAUDIO;
            }
            else {
                _html5AudioTest();
            }
        }
        catch (e) {
            _html5AudioTest();
        }
    }

    function _html5AudioTest() {
        if (typeof Audio !== "undefined") {
            try {
                new Audio();
                _audioType = AudioType.HTML5AUDIO;
            }
            catch (e) {
                _audioType = AudioType.NONE;
            }
        }
        else {
            _audioType = AudioType.HTML5AUDIO;
        }
    }


    var SoundManager = YYC.Class({
        Init: function (config) {
            this.ye_config = config;
        },
        Private: {
            ye_config: null
        },
        Public: {
            initWhenCreate: function () {
                switch (_audioType) {
                    case AudioType.WEBAUDIO:
                        _audioObj = WebAudio.create(this.ye_config);
                        break;
                    case AudioType.HTML5AUDIO:
                        _audioObj = Html5Audio.create(this.ye_config);
                        break;
                    case AudioType.NONE:
                        YE.log("浏览器不支持Web Audio和Html5 Audio");
                        return YE.returnForTest;
                        break;
                    default:
                        return YE.returnForTest;
                        break;
                }

                _audioObj.load();
            },
            play: function () {
                _audioObj.play();
            },
            getPlayState: function () {
                _audioObj.getPlayState();
            }
        },
        Static: {
            create: function (config) {
                var api = new this(config);

                api.initWhenCreate();

                return api;
            }
        }
    });

    var AudioBase = YYC.AClass({
        Private: {
            ye_P_urlArr: null,
            ye_P_url: null,

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

    var WebAudio = YYC.Class(AudioBase, {
        Init: function (config) {
            this.ye_config = config;

            this.ye_P_urlArr = config.urlArr;
            this.ye_onload = config.onload;
            this.ye_onerror = config.onerror;
        },
        Private: {
            ye_buffer: null,
            ye_bufferSource: null,
            ye_onload: null,
            ye_onerror: null,
            ye_config: null,
            ye_playState: null,

            ye_loadBuffer: function (obj, url) {
//                // check if the buffer has already been cached
//                if (url in cache) {
//                    // set the duration from the cache
//                    obj._duration = cache[url].duration;
//
//                    // load the sound into this object
//                    loadSound(obj);
//                    return;
//                }

//                if (/^data:[^;]+;base64,/.test(url)) {
//                    // Decode base64 data-URIs because some browsers cannot load data-URIs with XMLHttpRequest.
//                    var data = atob(url.split(',')[1]);
//                    var dataView = new Uint8Array(data.length);
//                    for (var i=0; i<data.length; ++i) {
//                        dataView[i] = data.charCodeAt(i);
//                    }
//
//                    ye_decodeAudioData(dataView.buffer, obj, url);
//                } else {


                var self = this;

                // load the buffer from the URL

                YE.$.ajax({
                    type: "get",
                    url: url,
                    dataType: "arraybuffer",
                    success: function (data) {
                        self.ye_decodeAudioData(data, obj, url);
                    },
                    error: function () {
                        // if there is an error, switch the sound to HTML Audio
//                    if (obj._webAudio) {
//                        obj._buffer = true;
//                        obj._webAudio = false;
//                        obj._audioNode = [];
//                        delete obj._gainNode;
//                        delete cache[url];
//                        obj.load();
//                    }
                        YE.log("使用Web Audio加载失败！尝试使用Html5 Audio加载");
                        _audioObj = Html5Audio.create(self.ye_config);
                        _audioObj.load();
                    }
                });
            },
            ye_decodeAudioData: function (arraybuffer, obj, url) {
                var self = this;

                // decode the buffer into an audio source
                _ctx.decodeAudioData(
                    arraybuffer,
                    function (buffer) {
                        if (buffer) {
//                            cache[url] = buffer;
//                            loadSound(obj, buffer);
                            self.ye_buffer = buffer;
                            self.ye_onload(self);
                        }
                    },
                    function (err) {
                        obj.ye_onerror(err.err);
                    }
                );
            }
        },
        Public: {
            initWhenCreate: function () {
                this.base();

                this.ye_playState = PlayState.NONE;
            },
            load: function () {
                this.ye_loadBuffer(this, this.ye_P_url);
            },
            play: function () {
                var source = _ctx.createBufferSource(),
                    self = this;

//                有问题！线程阻塞时可能会不触发onended！
//                因此使用timer代替
//                source.onended = function(){
//                    self.ye_status = 2;
//                };


                source.buffer = this.ye_buffer;
                source.connect(_ctx.destination);
                source.start(0);
                this.ye_playState = PlayState.PLAYING;

                setTimeout(function () {
                    self.ye_playState = PlayState.END;
                }, this.ye_buffer.duration * 1000);
            },
            getPlayState: function () {
                return this.ye_playState;
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

    var Html5Audio = YYC.Class(AudioBase, {
        Init: function (config) {
            this.ye_P_urlArr = config.urlArr;
            this.ye_onload = config.onload;
            this.ye_onerror = config.onerror;
        },
        Private: {
            ye_audio: null,
            ye_onload: null,
            ye_onerror: null,

            ye_load: function () {
                //应该在绑定了事件后再设置src
                //因为设置src后，即会开始加载声音，所以事件handle越早有效越好。
                this.ye_audio.src = this.ye_P_url;
            }
        },
        Public: {
            initWhenCreate: function () {
                this.base();
            },
            load: function () {
                var self = this;

                this.ye_audio = new Audio();

                this.ye_audio.addEventListener("canplaythrough", function () {
                    self.ye_onload(self);
                }, false);
                this.ye_audio.addEventListener("error", function () {
                    self.ye_onerror("errorCode " + self.ye_audio.error.code);
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

//                setTimeout(function () {
//                }, 50);
            },
            play: function () {
                this.ye_audio.play();
            },
            getPlayState: function () {
                var playState = 0;

                if(this.ye_audio.ended){
                    playState = PlayState.END;
                }
                else if(this.ye_audio.currentTime > 0){
                    playState = PlayState.PLAYING;
                }
                else{
                    playState = PlayState.NONE;
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

    YE.YSound = SoundManager;
}());

