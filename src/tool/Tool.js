/**YEngine2D
 * author：YYC
 * date：2013-12-21
 * email：395976266@qq.com
 * qq: 395976266
 * blog：http://www.cnblogs.com/chaogex/
 */
(function () {
    //*全局方法
    (function () {
        /**
         * 来自《HTML5 Canvas 核心技术》
         * 不能写到global中，否则会报错“illegal invocation”！
         */
        window.requestNextAnimationFrame = (function () {
            var originalRequestAnimationFrame = undefined,
                wrapper = undefined,
                callback = undefined,
                geckoVersion = 0,
                userAgent = navigator.userAgent,
                index = 0,
                self = this;

            wrapper = function (time) {
                time = +new Date();
                self.callback(time);
            };

            // Workaround for Chrome 10 bug where Chrome
            // does not pass the time to the animation function

            if (window.webkitRequestAnimationFrame) {
                // Define the wrapper

                // Make the switch

                originalRequestAnimationFrame = window.webkitRequestAnimationFrame;

                window.webkitRequestAnimationFrame = function (callback, element) {
                    self.callback = callback;

                    // Browser calls the wrapper and wrapper calls the callback

                    return originalRequestAnimationFrame(wrapper, element);
                }
            }

            //修改time参数
            if (window.msRequestAnimationFrame) {
                originalRequestAnimationFrame = window.msRequestAnimationFrame;

                window.msRequestAnimationFrame = function (callback) {
                    self.callback = callback;

                    return originalRequestAnimationFrame(wrapper);
                }
            }

            // Workaround for Gecko 2.0, which has a bug in
            // mozRequestAnimationFrame() that restricts animations
            // to 30-40 fps.

            if (window.mozRequestAnimationFrame) {
                // Check the Gecko version. Gecko is used by browsers
                // other than Firefox. Gecko 2.0 corresponds to
                // Firefox 4.0.

                index = userAgent.indexOf('rv:');

                if (userAgent.indexOf('Gecko') != -1) {
                    geckoVersion = userAgent.substr(index + 3, 3);

                    if (geckoVersion === '2.0') {
                        // Forces the return statement to fall through
                        // to the setTimeout() function.

                        window.mozRequestAnimationFrame = undefined;
                    }
                }
            }

//            return  window.requestAnimationFrame ||  //传递给callback的time不是从1970年1月1日到当前所经过的毫秒数！
            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||

                function (callback, element) {
                    var start,
                        finish;

                    window.setTimeout(function () {
                        start = +new Date();
                        callback(start);
                        finish = +new Date();

                        self.timeout = 1000 / 60 - (finish - start);

                    }, self.timeout);
                };
        }());

        window.cancelNextRequestAnimationFrame = window.cancelRequestAnimationFrame
            || window.webkitCancelAnimationFrame
            || window.webkitCancelRequestAnimationFrame
            || window.mozCancelRequestAnimationFrame
            || window.oCancelRequestAnimationFrame
            || window.msCancelRequestAnimationFrame
            || clearTimeout;
    }());

    //*工具类
    (function () {
        var Tool = {};

        /**
         * 继承
         */
        Tool.extend = (function () {
            return {
                /**
                 * 浅拷贝
                 */
                extend: function (destination, source) {
                    var property = "";

                    for (property in source) {
                        destination[property] = source[property];
                    }
                    return destination;
                },
                extendExist: function (destination, source) {
                    var property = "";

                    for (property in source) {
                        if (destination[property] !== undefined) {    //destination中没有的属性不拷贝
                            destination[property] = source[property];
                        }
                    }
                    return destination;
                },
                extendNoExist: function (destination, source) {
                    var property = "";

                    for (property in source) {
                        if (destination[property] === undefined) {
                            destination[property] = source[property];
                        }
                    }
                    return destination;
                },
                /**
                 * 浅拷贝(不包括source的原型链)
                 */
                extendNoPrototype: function (destination, source) {
                    //            var temp = {};
                    var property = "";

                    for (property in source) {
                        if (source.hasOwnProperty(property)) {
                            destination[property] = source[property];
                        }
                    }
                    return destination;
                },
                /**
                 * 深拷贝
                 *
                 * 示例：
                 * 如果拷贝对象为数组，能够成功拷贝（不拷贝Array原型链上的成员）
                 * expect(extend.extendDeep([1, { x: 1, y: 1 }, "a", { x: 2 }, [2]])).toEqual([1, { x: 1, y: 1 }, "a", { x: 2 }, [2]]);
                 *
                 * 如果拷贝对象为对象，能够成功拷贝（能拷贝原型链上的成员）
                 * var result = null;
                 function A() {
	            };
                 A.prototype.a = 1;

                 function B() {
	            };
                 B.prototype = new A();
                 B.prototype.b = { x: 1, y: 1 };
                 B.prototype.c = [{ x: 1 }, [2]];

                 var t = new B();

                 result = extend.extendDeep(t);

                 expect(result).toEqual(
                 {
                     a: 1,
                     b: { x: 1, y: 1 },
                     c: [{ x: 1 }, [2]]
                 });
                 * @param parent
                 * @param child
                 * @returns
                 */
                extendDeep: function (parent, child) {
                    var i = null,
                        len = 0,
                        toStr = Object.prototype.toString,
                        sArr = "[object Array]",
                        sOb = "[object Object]",
                        type = "",
                        _child = null;

                    //数组的话，不获得Array原型上的成员。
                    if (toStr.call(parent) === sArr) {
                        _child = child || [];

                        for (i = 0, len = parent.length; i < len; i++) {
                            type = toStr.call(parent[i]);
                            if (type === sArr || type === sOb) {    //如果为数组或object对象
                                _child[i] = type === sArr ? [] : {};
                                arguments.callee(parent[i], _child[i]);
                            } else {
                                _child[i] = parent[i];
                            }
                        }
                    }
                    //对象的话，要获得原型链上的成员。因为考虑以下情景：
                    //类A继承于类B，现在想要拷贝类A的实例a的成员（包括从类B继承来的成员），那么就需要获得原型链上的成员。
                    else if (toStr.call(parent) === sOb) {
                        _child = child || {};

                        for (i in parent) {
                            type = toStr.call(parent[i]);
                            if (type === sArr || type === sOb) {    //如果为数组或object对象
                                _child[i] = type === sArr ? [] : {};
                                arguments.callee(parent[i], _child[i]);
                            } else {
                                _child[i] = parent[i];
                            }
                        }
                    }
                    else {
                        _child = parent;
                    }

                    return _child;
                }
            }
        }());

        /**
         * 判断类型
         */
        Tool.judge = (function () {
            return {
                /**
                 * 判断浏览器类型
                 */
                browser: {
                    //ie: +[1, ],   //有问题！在ie下“+[1, ]”居然为false！！！！？？？
                    isIE: function () {
                        return !!(document.all && navigator.userAgent.indexOf('Opera') === -1);
                    },
                    //不能用===，因为navigator.appVersion.match(/MSIE\s\d/i)为object类型，不是string类型
                    isIE7: function () {
                        return navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 7";
                    },
                    isIE8: function () {
                        return navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 8";
                    },
                    isIE9: function () {
                        return navigator.appVersion.match(/MSIE\s\d/i) == "MSIE 9";
                    },
                    isFF: function () {
                        return navigator.userAgent.indexOf("Firefox") >= 0 && true;
                    },
                    isOpera: function () {
                        return  navigator.userAgent.indexOf("Opera") >= 0 && true;
                    },
                    isChrome: function () {
                        return navigator.userAgent.indexOf("Chrome") >= 0 && true;
                    }
                },
                /**
                 * 判断是否为jQuery对象
                 */
                isjQuery: function (ob) {
                    if (!window.jQuery) {
                        return false;
                    }

                    return ob instanceof window.jQuery;
                },
                isFunction: function (func) {
                    return Object.prototype.toString.call(func) === "[object Function]";
                },
                isArray: function (val) {
                    return Object.prototype.toString.call(val) === "[object Array]";
                },
                isDate: function (val) {
                    return Object.prototype.toString.call(val) === "[object Date]";
                },
                isString: function (str) {
                    return Object.prototype.toString.call(str) === "[object String]";
                },
                /**
                 * 检测对象是否是空对象(不包含任何可读属性)。
                 * 方法只检测对象本身的属性，不检测从原型继承的属性。
                 */
                isOwnEmptyObject: function (obj) {
                    var name = "";

                    for (name in obj) {
                        if (obj.hasOwnProperty(name)) {
                            return false;
                        }
                    }
                    return true;
                },
                /**
                 * 检测对象是否是空对象(不包含任何可读属性)。
                 * 方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使hasOwnProperty)。
                 */
                isEmptyObject: function (obj) {
                    var name = "";

                    for (name in obj) {
                        return false;
                    }
                    return true;
                },
                /**
                 * 判断是否为奇数
                 * @param num
                 * @returns
                 */
                isOdd: function (num) {
                    return num % 2 !== 0;
                },
                /**
                 * 判断是否为对象字面量（{}）
                 */
                isDirectObject: function (obj) {
                    if (Object.prototype.toString.call(obj) === "[object Object]") {
                        return true;
                    }

                    return false;
                },
                isHTMLImg: function (img) {
                    return Object.prototype.toString.call(img) === "[object HTMLImageElement]";
                },
                isDom: function (obj) {
                    return obj instanceof HTMLElement;
                },
                isNumber: function (obj) {
                    return Object.prototype.toString.call(obj) === "[object Number]";
                },
                isBool: function (obj) {
                    return Object.prototype.toString.call(obj) === "[object Boolean]";
                },
                /**
                 * 检查宿主对象是否可调用
                 *
                 * 任何对象，如果其语义在ECMAScript规范中被定义过，那么它被称为原生对象；
                 环境所提供的，而在ECMAScript规范中没有被描述的对象，我们称之为宿主对象。

                 该方法用于特性检测，判断对象是否可用。用法如下：

                 MyEngine addEvent():
                 if (Tool.judge.isHostMethod(dom, "addEventListener")) {    //判断dom是否具有addEventListener方法
            dom.addEventListener(sEventType, fnHandler, false);
            }
                 */
                isHostMethod: (function () {
                    function isHostMethod(object, property) {
                        var type = typeof object[property];

                        return type === "function" ||
                            (type === "object" && !!object[property]) ||
                            type === "unknown";
                    };

                    return isHostMethod;
                }()),
                /**
                 判断一个元素是否为另一个元素的子元素
                 * @param children  被判断的元素。可以为dom或jquery对象
                 * @param parentSelector    父元素选择器。如“"#parent"”
                 * @returns

                    示例：
                 <div id="parent">
                 <span id="chi"></span>
                 <div>

                 isChildOf($("#chi"), "#parent");    //true
                 */
                isChildOf: function (children, parentSelector) {
                    return $(children).parents(parentSelector).length >= 1
                }
            }
        }() );

        /**
         * 异步操作
         */
        Tool.asyn = (function () {
            return {
                /**
                 * 清空"所有"的定时器
                 * @param index 其中一个定时器序号（不一定为第一个计时器序号）
                 */
                clearAllTimer: function (index) {
                    var i = 0,
                        num = 0,
                        timerNum = 250, //最大定时器个数
                        firstIndex = 0;

                    //获得最小的定时器序号
                    firstIndex = (index - timerNum >= 1) ? (index - timerNum) : 1;
                    num = firstIndex + timerNum * 2;    //循环次数

                    //以第一个计时器序号为起始值（计时器的序号会递加，但是ie下每次刷新浏览器后计时器序号会叠加，
                    //且最初的序号也不一定从1开始（可能比1大），也就是说ie下计时器序号的起始值可能很大；chrome和firefox计时器每次从1开始）
                    for (i = firstIndex; i < num; i++) {
                        window.clearTimeout(i);
                    }
                    //for (i = firstIndex.timer_firstIndex; i < num; i++) {
                    for (i = firstIndex; i < num; i++) {
                        window.clearInterval(i);
                    }
                }
            }
        }());

        /**
         * 事件
         */
        Tool.event = (function () {
            return {
                //注意！bindEvent传的参数与BindWithArguments类似，只是第一个参数为event！
                bindEvent: function (object, fun) {
                    var args = Array.prototype.slice.call(arguments, 2);
                    var self = this;

                    return function (event) {
                        return fun.apply(object, [self.wrapEvent(event)].concat(args)); //对事件对象进行包装
                    }
                },
                /* oTarget既可以是单个dom元素，也可以使jquery集合。
                 如：
                 Tool.event.addEvent(document.getElementById("test_div"), "mousedown", _Handle);
                 Tool.event.addEvent($("div"), "mousedown", _Handle);
                 */
                addEvent: function (oTarget, sEventType, fnHandler) {
                    //            var oTarget = $(oTarget)[0];    //转换为dom对象
                    var dom = null,
                        i = 0,
                        len = 0,
                        temp = null;

                    if (Tool.judge.isjQuery(oTarget)) {
                        oTarget.each(function () {
                            dom = this;

                            if (Tool.judge.isHostMethod(dom, "addEventListener")) {
                                dom.addEventListener(sEventType, fnHandler, false);
                            }
                            else if (Tool.judge.isHostMethod(dom, "attachEvent")) {
                                dom.attachEvent("on" + sEventType, fnHandler);
                            }
                            else {
                                dom["on" + sEventType] = fnHandler;
                            }
                        });
                    }
                    else {
                        dom = oTarget;

                        if (Tool.judge.isHostMethod(dom, "addEventListener")) {
                            dom.addEventListener(sEventType, fnHandler, false);
                        }
                        else if (Tool.judge.isHostMethod(dom, "attachEvent")) {
                            dom.attachEvent("on" + sEventType, fnHandler);
                        }
                        else {
                            dom["on" + sEventType] = fnHandler;
                        }
                    }
                },
                removeEvent: function (oTarget, sEventType, fnHandler) {
                    var dom = null;


                    if (Tool.judge.isjQuery(oTarget)) {
                        oTarget.each(function () {
                            dom = this;
                            if (Tool.judge.isHostMethod(dom, "removeEventListener")) {
                                dom.removeEventListener(sEventType, fnHandler, false);
                            }
                            else if (Tool.judge.isHostMethod(dom, "detachEvent")) {
                                dom.detachEvent("on" + sEventType, fnHandler);
                            }
                            else {
                                dom["on" + sEventType] = null;
                            }
                        });
                    }
                    else {
                        dom = oTarget;
                        if (Tool.judge.isHostMethod(dom, "removeEventListener")) {
                            dom.removeEventListener(sEventType, fnHandler, false);
                        }
                        else if (Tool.judge.isHostMethod(dom, "detachEvent")) {
                            dom.detachEvent("on" + sEventType, fnHandler);
                        }
                        else {
                            dom["on" + sEventType] = null;
                        }
                    }
                },
                /*!
                 包装event对象   -待补充

                 event.type:返回事件名。返回没有“on”作为前缀的事件名，比如，onclick事件返回的type是click
                 event.target: 返回事件源，就是发生事件的元素
                 event.preventDefault: 阻止默认事件动作
                 event.stopBubble: 阻止冒泡
                 //event.offsetLeft:为匹配的元素集合中获取第一个元素的当前坐标的left，相对于文档（document）。
                 //event.offsetTop:为匹配的元素集合中获取第一个元素的当前坐标的top，相对于文档（document）。
                 //event.positionLeft:获取匹配元素中第一个元素的当前坐标的left，相对于offset parent的坐标。( offset parent指离该元素最近的而且被定位过的祖先元素 )
                 //event.positionTop:获取匹配元素中第一个元素的当前坐标的top，相对于offset parent的坐标。( offset parent指离该元素最近的而且被定位过的祖先元素 )
                 event.pageX: 鼠标相对于文档的左边缘的位置。
                 event.pageY: 鼠标相对于文档的上边缘的位置。
                 event.relatedTarget: 发生mouseover和mouseout事件时，相关的dom元素。
                 （mouseover：鼠标来之前的元素；mouseout：鼠标将要去的那个元素）
                 event.mouseButton: 鼠标按键。
                 左键： 0
                 右键： 1
                 中键： 2

                 */
                wrapEvent: function (oEvent) {
                    var e = oEvent ? oEvent : global.event,
                        target = e.srcElement || e.target;

                    //ie
                    if (Tool.judge.browser.isIE()) {
                        e.pageX = e.clientX + document.body.scrollLeft || document.documentElement.scrollLeft;
                        e.pageY = e.clientY + document.body.scrollTop || document.documentElement.scrollTop;

                        e.stopBubble = function () {
                            e.cancelBubble = true;
                        };

                        if (Tool.judge.browser.isIE7() || Tool.judge.browser.isIE8()) {
                            e.preventDefault = function () {
                                e.returnValue = false;
                            };

                            if (e.type == "mouseout") {
                                e.relatedTarget = e.toElement;
                            }
                            else if (e.type == "mouseover") {
                                e.relatedTarget = e.fromElement;
                            }

                            switch (e.button) {
                                case 1:
                                    e.mouseButton = 0;
                                    break;
                                case 4:
                                    e.mouseButton = 1;
                                    break;
                                case 2:
                                    e.mouseButton = 2;
                                    break;
                                default:
                                    e.mouseButton = e.button;
                                    break;
                            }
                        }
                        else {
                            e.mouseButton = e.button;
                        }
                    }
                    else {
                        e.stopBubble = e.stopPropagation;

                        e.keyCode = e.which;
                        //注意：firefox没有多个键一起按的事件
                        e.mouseButton = e.button;
                    }
                    e.target = target;

                    return e;
                },
                getEvent: function () {
                    //this.getEvent.caller为调用了getEvent方法的函数的引用
                    return this.getEvent.caller.arguments[0];
                },
                /*! 手动触发事件

                 默认为不冒泡，不进行默认动作。

                 2012-12-03

                 网上资料：http://hi.baidu.com/suchen36/item/fb3eefbb8125c0a4eaba93e2


                 为大家介绍js下的几个方法：
                 1. createEvent（eventType）
                 参数：eventType 共5种类型：
                 Events ：包括所有的事件.

                 HTMLEvents：包括 'abort', 'blur', 'change', 'error', 'focus', 'load', 'reset', 'resize', 'scroll', 'select',
                 'submit', 'unload'. 事件

                 UIEevents ：包括 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'keydown', 'keypress', 'keyup'.
                 间接包含 MouseEvents.

                 MouseEvents：包括 'click', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup'.

                 MutationEvents:包括 'DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved',
                 'DOMCharacterDataModified', 'DOMNodeInsertedIntoDocument',
                 'DOMNodeRemovedFromDocument', 'DOMSubtreeModified'.

                 2. 在createEvent后必须初始化，为大家介绍5种对应的初始化方法

                 HTMLEvents 和 通用 Events：
                 initEvent( 'type', bubbles, cancelable )

                 UIEvents ：
                 initUIEvent( 'type', bubbles, cancelable, windowObject, detail )

                 MouseEvents：
                 initMouseEvent( 'type', bubbles, cancelable, windowObject, detail, screenX, screenY,
                 clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget )

                 MutationEvents ：
                 initMutationEvent( 'type', bubbles, cancelable, relatedNode, prevValue, newValue,
                 attrName, attrChange )

                 3. 在初始化完成后就可以随时触发需要的事件了，为大家介绍targetObj.dispatchEvent(event)
                 使targetObj对象的event事件触发
                 需要注意的是在IE 5.5+版本上请用fireEvent方法，还是浏览兼容的考虑

                 4. 例子
                 //例子1 立即触发鼠标被按下事件
                 var fireOnThis = document.getElementById('someID');
                 var evObj = document.createEvent('MouseEvents');
                 evObj.initMouseEvent( 'click', true, true, global, 1, 12, 345, 7, 220, false, false, true, false, 0, null );
                 fireOnThis.dispatchEvent(evObj);

                 //例子2 考虑兼容性的一个鼠标移动事件
                 var fireOnThis = document.getElementById('someID');
                 if( document.createEvent )
                 {
                 var evObj = document.createEvent('MouseEvents');
                 evObj.initEvent( 'mousemove', true, false );
                 fireOnThis.dispatchEvent(evObj);
                 }
                 else if( document.createEventObject )
                 {
                 fireOnThis.fireEvent('onmousemove');
                 }

                 */
                triggerEvent: function (oTarget, type) {
                    var evObj = null,
                        dom = null;

                    if (Tool.judge.isHostMethod(document, "createEvent")) {
                        /*! 判断事件类型
                         switch (type) {
                         case 'abort':
                         case 'blur':
                         case 'change':
                         case 'error':
                         case 'focus':
                         case 'load':
                         case 'reset':
                         case 'resize':
                         case 'scroll':
                         case 'select':
                         case 'submit':
                         case 'unload':
                         evObj = document.createEvent('HTMLEvents');
                         evObj.initEvent(type, false, true);
                         break;
                         case 'DOMActivate':
                         case 'DOMFocusIn':
                         case 'DOMFocusOut':
                         case 'keydown':
                         case 'keypress':
                         case 'keyup':
                         evObj = document.createEvent('UIEevents');
                         evObj.initUIEvent(type, false, true);     //出错：参数过少
                         break;
                         case 'click':
                         case 'mousedown':
                         case 'mousemove':
                         case 'mouseout':
                         case 'mouseover':
                         case 'mouseup':
                         evObj = document.createEvent('MouseEvents');
                         evObj.initMouseEvent(type, false, true);  //出错：参数过少
                         break;
                         case 'DOMAttrModified':
                         case 'DOMNodeInserted':
                         case 'DOMNodeRemoved':
                         case 'DOMCharacterDataModified':
                         case 'DOMNodeInsertedIntoDocument':
                         case 'DOMNodeRemovedFromDocument':
                         case 'DOMSubtreeModified':
                         evObj = document.createEvent('MutationEvents');
                         evObj.initMutationEvent(type, false, true);   //出错：参数过少
                         break;
                         default:
                         throw new Error("超出范围！");
                         break;

                         }
                         */

                        //此处使用通用事件
                        evObj = document.createEvent('Events');
                        evObj.initEvent(type, false, true);
                        if (Tool.judge.isjQuery(oTarget)) {
                            oTarget.each(function () {
                                dom = this;
                                dom.dispatchEvent(evObj);
                            });
                        }
                        else {
                            dom = oTarget;
                            dom.dispatchEvent(evObj);
                        }
                    }
                    else if (Tool.judge.isHostMethod(document, "createEventObject")) {
                        if (Tool.judge.isjQuery(oTarget)) {
                            oTarget.each(function () {
                                dom = this;
                                dom.fireEvent('on' + type);
                            });
                        }
                        else {
                            dom = oTarget;
                            dom.fireEvent('on' + type);
                        }
                    }
                }
            }
        }());

        /**
         * 路径操作
         */
        Tool.path = (function () {
            /*!
             location.pathname： 返回URL的域名（域名IP）后的部分。

             例如 http://www.example.com/wordpress/返回/wordpress/，
             又或则 http://127.0.0.1/index.html 返回/index.html，
             注意是带url的域名或域名IP

             在磁盘上随便建个Html文件进行location.pathname测试，如浏览器上的路径是： C:\Documents and Settings\Administrator\桌面\testjs.html， 这样，得到的结果是: /C:\Documents and Settings\Administrator\桌面\testjs.html

             既然提到这了，那我们就分析下下面的URL：

             http://www.example.com:8080/test.php?user=admin&pwd=admin#login
             想得到整个如上的完整url，我们用：location.href;
             得到传输协议http:,我们用：location.protocol;
             得到主机名连同端口www.example.com:8080，我们用：location.host;
             得到主机名www.joymood.cn，我们用：location.hostname;
             得到主机后部分不包括问号?后部分的/test.php，就用我们刚才讲的：location.pathname;
             得到url中问号?之后井号#之前的部分?user=admin&pwd=admin，我们就用： location.search;
             得到#之前的部分#login，我们就用location.hash

             如上，我们可以通过location对象的某些属性得到一个完整URL的各个部分。
             */
            return {
                /**
                 获得指定的js文件的加载目录

                 @param jsName   js文件名
                 */
                getJsDir: function (jsName) {
                    //var path = $("script").eq(-1).attr("src");
                    var path = $("script[src*='" + jsName + "']").attr("src");

                    return path.substring(0, path.lastIndexOf("/") + 1);
                },
                //todo 待单元测试和重构

                isPath: function (pathStr) {
                      return this.extname(pathStr) !== null;
                },

                //来自cocos2d

                /**
                 * Get the ext name of a path.
                 * @example
                 cc.path.extname("a/b.png");//-->".png"
                 cc.path.extname("a/b.png?a=1&b=2");//-->".png"
                 cc.path.extname("a/b");//-->null
                 cc.path.extname("a/b?a=1&b=2");//-->null
                 * @param {string} pathStr
                 * @returns {*}
                 */
                extname: function (pathStr) {
                    var temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(pathStr);
                    return temp ? temp[1] : null;
                },
                /**
                 * Get the file name of a file path.
                 * @example
                 cc.path.basename("a/b.png");//-->"b.png"
                 cc.path.basename("a/b.png?a=1&b=2");//-->"b.png"
                 cc.path.basename("a/b.png", ".png");//-->"b"
                 cc.path.basename("a/b.png?a=1&b=2", ".png");//-->"b"
                 cc.path.basename("a/b.png", ".txt");//-->"b.png"
                 * @param {string} pathStr
                 * @param {string} [extname]
                 * @returns {*}
                 */
                basename: function (pathStr, extname) {
                    var index = pathStr.indexOf("?");
                    if (index > 0) pathStr = pathStr.substring(0, index);
                    var reg = /(\/|\\\\)([^(\/|\\\\)]+)$/g;
                    var result = reg.exec(pathStr.replace(/(\/|\\\\)$/, ""));
                    if (!result) return null;
                    var baseName = result[2];
                    if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() == extname.toLowerCase())
                        return baseName.substring(0, baseName.length - extname.length);
                    return baseName;
                },
                /**
                 * Change extname of a file path.
                 * @example
                 cc.path.changeExtname("a/b.png", ".plist");//-->"a/b.plist"
                 cc.path.changeExtname("a/b.png?a=1&b=2", ".plist");//-->"a/b.plist?a=1&b=2"
                 * @param {string} pathStr
                 * @param {string} [extname]
                 * @returns {string}
                 */
                changeExtname: function (pathStr, extname) {
                    extname = extname || "";
                    var index = pathStr.indexOf("?");
                    var tempStr = "";
                    if (index > 0) {
                        tempStr = pathStr.substring(index);
                        pathStr = pathStr.substring(0, index);
                    }
                    index = pathStr.lastIndexOf(".");
                    if (index < 0) return pathStr + extname + tempStr;
                    return pathStr.substring(0, index) + extname + tempStr;
                },
                /**
                 * Change file name of a file path.
                 * @example
                 cc.path.changeBasename("a/b/c.plist", "b.plist");//-->"a/b/b.plist"
                 cc.path.changeBasename("a/b/c.plist?a=1&b=2", "b.plist");//-->"a/b/b.plist?a=1&b=2"
                 cc.path.changeBasename("a/b/c.plist", ".png");//-->"a/b/c.png"
                 cc.path.changeBasename("a/b/c.plist", "b");//-->"a/b/b"
                 cc.path.changeBasename("a/b/c.plist", "b", true);//-->"a/b/b.plist"
                 * @param {String} pathStr
                 * @param {String} basename
                 * @param {Boolean} [isSameExt]
                 * @returns {string}
                 */
                changeBasename: function (pathStr, basename, isSameExt) {
                    if (basename.indexOf(".") == 0) return this.changeExtname(pathStr, basename);
                    var index = pathStr.indexOf("?");
                    var tempStr = "";
                    var ext = isSameExt ? this.extname(pathStr) : "";
                    if (index > 0) {
                        tempStr = pathStr.substring(index);
                        pathStr = pathStr.substring(0, index);
                    }
                    index = pathStr.lastIndexOf("/");
                    index = index <= 0 ? 0 : index + 1;
                    return pathStr.substring(0, index) + basename + ext + tempStr;
                }
            };
        }());

        Tool.collection = (function () {
            return {
                getChildByTag: function (childs, tag) {
                    var childTag = null,
                        tags = YE.Tool.judge.isArray(tag) ? tag : [tag],
                        result = null,
                        breakOuter = {};

                    try {
                        childs.forEach(function (child) {
                            childTag = child.getTag();

                            if (!childTag) {
                                return;
                            }

                            tags.forEach(function (tag) {
                                childTag.forEach(function (t) {
                                    if (t === tag) {
                                        result = child;
                                        throw breakOuter;
                                    }
                                });
                            });
                        });
                    }
                    catch (e) {
                        if (e !== breakOuter) {
                            throw  e;
                        }
                    }

                    return result;
                },
                getChildsByTag: function (childs, tag) {
                    var childTag = null,
                        result = false,
                        tags = YE.Tool.judge.isArray(tag) ? tag : [tag],
                        breakOuter = {};

                    return childs.filter(function (child) {
                        result = false;
                        childTag = child.getTag();

                        if (!childTag) {
                            return;
                        }

                        try {
                            tags.forEach(function (tag) {
                                childTag.forEach(function (t) {
                                    if (t === tag) {
                                        result = true;
                                        throw breakOuter;
                                    }
                                });
                            });
                        }
                        catch (e) {
                            if (e !== breakOuter) {
                                throw  e;
                            }
                        }

                        return result;
                    });
                },
                removeChildByTag: function (childs, tag, func) {
                    var childTag = null,
                        result = false,
                        tags = YE.Tool.judge.isArray(tag) ? tag : [tag],
                        breakOuter = {};

                    childs.removeChild(function (child) {
                        result = false;
                        childTag = child.getTag();

                        if (!childTag) {
                            return false;
                        }

                        try {
                            tags.forEach(function (tag) {
                                childTag.forEach(function (t) {
                                    if (t === tag) {
                                        result = true;
                                        func && func(child);
                                        throw breakOuter;
                                    }
                                });
                            });
                        }
                        catch (e) {
                            if (e !== breakOuter) {
                                throw  e;
                            }
                        }

                        return result;
                    });
                },
                removeChildsByTag: function (childs, tag, func) {
                    var childTag = null,
                        tags = YE.Tool.judge.isArray(tag) ? tag : [tag],
                        arr = [],
                        breakOuter = {};

                    childs.forEach(function (child) {
                        childTag = child.getTag();

                        if (!childTag) {
                            arr.push(child);
                            return;
                        }

                        try {
                            tags.forEach(function (tag) {
                                childTag.forEach(function (t) {
                                    if (t === tag) {
                                        func && func(child);
                                        throw breakOuter;
                                    }
                                });
                            });
                            arr.push(child);
                        }
                        catch (e) {
                            if (e !== breakOuter) {
                                throw  e;
                            }
                        }
                    });

                    childs.removeAllChilds();
                    childs.addChilds(arr);
                }
            }
        }());

        YE.Tool = Tool;
    }());
}());
