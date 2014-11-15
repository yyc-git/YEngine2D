/**YEngine2D
 * author：YYC
 * date：2014-07-27
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 * homepage:
 * license: MIT
 */
(function () {
    function _extend(destination, source) {
        var property = "";

        for (property in source) {
            destination[property] = source[property];
        }
        return destination;
    }

    function JsLoader() {
        this.ye_container = [];
    }

    JsLoader.prototype = {
        ye_loadJsSync: function (js, func) {
            var script = null;

            script = this.ye_createScript(js);
            this.ye_appendScript(script);

            this.ye_onloadSync(js, script, func);
        },
        ye_appendScript: function (script) {
            var head = document.getElementsByTagName("head")[0];

            head.appendChild(script);
        },
        ye_createScript: function (js) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = js.src;

            return script;
        },
        ye_onloadSync: function (js, script, func) {
            var self = this;

            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        js.callback && js.callback.apply(js.obj, js.args);

                        self.ye_loadNext(func);
                    }
                };
            }
            else { //Others
                script.onload = function () {
                    js.callback && js.callback.apply(js.obj, js.args);

                    self.ye_loadNext(func);
                };
            }
        },
        ye_loadNext: function (func) {
            if (this.ye_container.length == 0) {
                this.onload();
                return;
            }
            else {
                func.call(this, null);
            }
        },

        onload: function () {
        },

        add: function (src, callback, args, obj) {
            this.ye_container.push({ src: src, callback: callback, args: args || [], obj: obj ? obj : window });

            return this;
        },
        loadSync: function () {
            var js = null;

            if (this.ye_container.length == 0) {
                throw new Error("请先加入js");
            }

            js = this.ye_container.shift();

            this.ye_loadJsSync(js, this.loadSync);
        }
    };

    JsLoader.create = function () {
        return new this();
    };

    //*全局方法
    (function () {
        /**
         * 创建命名空间。
         示例：
         namespace("YE.Tool.Button");
         */
        var global = {
            namespace: function (str) {
                var parent = window,
                    parts = str.split('.'),
                    i = 0,
                    len = 0;

                if (str.length == 0) {
                    YE.error(true, "命名空间不能为空");
                }

                for (i = 0, len = parts.length; i < len; i++) {
                    if (typeof parent[parts[i]] === "undefined") {
                        parent[parts[i]] = {};
                    }
                    parent = parent[parts[i]];  //递归增加命名空间
                }

                return parent;
            }
        };

        _extend(window, global);
    }());

    //创建命名空间
    namespace("YE");

    //* 调试辅助方法
    (function () {
        function _logToWebPage(message) {
            YE.$("body").prepend("<div style='color:red;font-size: 20;'>引擎调试信息：" + message + "</div>");
        }

        //定义用于测试的返回值
        YE.returnForTest = "YEngine2D_testReturn";

        /**
         * Output Debug message.
         * @function
         * @param {String} message
         */
        YE.log = function (message) {
            if (YE.main.getConfig().isDebug) {
                if (!YE.main.getConfig().isShowDebugOnPage) {
                    console.log && console.log(message);
                } else {
                    _logToWebPage(message);
                }
            }
        };

        /**
         * 断言失败时，会提示错误信息，但程序会继续执行下去
         * 使用断言捕捉不应该发生的非法情况。不要混淆非法情况与错误情况之间的区别，后者是必然存在的并且是一定要作出处理的。
         *
         * 1）对非预期错误使用断言
         断言中的布尔表达式的反面一定要描述一个非预期错误，下面所述的在一定情况下为非预期错误的一些例子：
         （1）空指针。
         （2）输入或者输出参数的值不在预期范围内。
         （3）数组的越界。
         非预期错误对应的就是预期错误，我们通常使用错误处理代码来处理预期错误，而使用断言处理非预期错误。在代码执行过程中，有些错误永远不应该发生，这样的错误是非预期错误。断言可以被看成是一种可执行的注释，你不能依赖它来让代码正常工作（《Code Complete 2》）。例如：
         int nRes = f(); // nRes 由 f 函数控制， f 函数保证返回值一定在 -100 ~ 100
         Assert(-100 <= nRes && nRes <= 100); // 断言，一个可执行的注释
         由于 f 函数保证了返回值处于 -100 ~ 100，那么如果出现了 nRes 不在这个范围的值时，就表明一个非预期错误的出现。后面会讲到“隔栏”，那时会对断言有更加深刻的理解。
         2）不要把需要执行的代码放入断言中
         断言用于软件的开发和维护，而通常不在发行版本中包含断言。
         需要执行的代码放入断言中是不正确的，因为在发行版本中，这些代码通常不会被执行，例如：
         Assert(f()); // f 函数通常在发行版本中不会被执行
         而使用如下方法则比较安全：
         res = f();
         Assert(res); // 安全
         3）对来源于内部系统的可靠的数据使用断言，而不要对外部不可靠的数据使用断言，对于外部不可靠数据，应该使用错误处理代码。
         再次强调，把断言看成可执行的注释。
         * @param cond 如果cond返回false，则断言失败，显示message
         * @param message
         */
        YE.assert = function (cond, message) {
            if (YE.main.getConfig().isDebug) {
                if (console.assert) {
                    console.assert(cond, message);
                }
                else {
                    if (!cond && message) {
                        if (console && console.log) {
                            console.log("断言：" + message);
                        }
                        else {
                            alert("断言：" + message);
                        }
                    }
                }
            }
        };

        /**
         * 如果发生错误，则抛出异常并终止程序
         * @param cond
         * @param message
         */
        YE.error = function (cond, message) {
            if (cond) {
                throw new Error(message);
            }
        };
    }());


    YE.main = {
        ye_config: {
            isDebug: false,  //是否处于调试状态
            isShowDebugOnPage: false, //是否在页面上显示调试信息
            isAutoLoadWhenDomReady: true, //是否在DOM加载完成后自动加载
            engineDir: "",
            isSingleEngineFile: true,
            userFilePaths: [],              //这里加入用户文件路径
            onload: function () {
            }
        },
        ye_engineFilePaths: [
            "import/yeQuery.js",
            "import/jsExtend.js",

            "tool/Tool.js",

            "base/Entity.js",
            "base/Node.js",
            "base/NodeContainer.js",
            "base/CollectionManager.js" ,

            "structure/Hash.js"  ,
            "structure/Collection.js" ,
            "structure/Geometry.js",
            "structure/Bitmap.js",

            "algorithm/collision.js",
            "algorithm/AStar.js" ,

            "loader/Loader.js"  ,
            "loader/ImgLoader.js" ,

            "loader/JsonLoader.js",
            "loader/SoundLoader.js",
            "loader/LoaderManager.js" ,

            "sound/SoundManager.js"  ,

            "core/Director.js",
            "core/Scene.js",
            "core/Layer.js" ,
            "core/Sprite.js"  ,

            "event/Event.js",
            "event/EventManager.js" ,

            "animation/AnimationFrame.js"  ,
            "animation/Animation.js" ,
            "animation/Frame.js",
            "animation/FrameCache.js",
            "animation/AnimationManager.js",
            "animation/AnimationFrameManager.js" ,
            "animation/AnimationCache.js"  ,

            "action/Action.js",
            "action/ActionInterval.js" ,
            "action/ActionInstant.js" ,
            "action/Control.js"  ,
            "action/Animate.js" ,
            "action/ActionManager.js",
            "action/Repeat.js",
            "action/RepeatForever.js" ,
            "action/RepeatCondition.js"  ,
            "action/Sequence.js" ,
            "action/Spawn.js"  ,
            "action/CallFunc.js" ,
            "action/DelayTime.js",
            "action/MoveBy.js",
            "action/JumpBy.js",
            "action/Place.js",

            "ui/Graphics.js",

            "soundEngine/YSoundEngine.js"
        ],
        ye_isLoaded: false,

        ye_loadJsLoader: function () {
            var engineFilePaths = this.ye_engineFilePaths,
                engineDir = this.ye_config.engineDir,
                userFilePaths = this.ye_config.userFilePaths,
                onload = this.ye_config.onload,
                jsLoader = JsLoader.create();

            this.ye_isLoaded = true;
            jsLoader.onload = onload;

            if (!this.ye_config.isSingleEngineFile) {
                engineFilePaths.forEach(function (filePath) {
                    jsLoader.add(engineDir + filePath);
                });
            }

            userFilePaths.forEach(function (filePath) {
                jsLoader.add(filePath);
            });

            jsLoader.loadSync();
        },
        setConfig: function (config) {
            var self = this;

            _extend(this.ye_config, config);

            if (this.ye_config.isAutoLoadWhenDomReady) {
                window.addEventListener("DOMContentLoaded", function () {
                    self.ye_loadJsLoader();
                });
            }
        },
        getConfig: function () {
            return this.ye_config;
        },
        load: function () {
            if (this.ye_config.isAutoLoadWhenDomReady) {
                YE.log("已配置为DOM加载完成后自动加载文件，此处不再进行加载");
                return false;
            }
            if (this.ye_isLoaded) {
                YE.log("已经加载过文件了，不能重复加载");
                return false;
            }

            this.ye_loadJsLoader();
        },

        forTest_getJsLoader: function () {
            return JsLoader;
        }
    };

}());