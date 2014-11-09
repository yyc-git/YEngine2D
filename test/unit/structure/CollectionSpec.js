describe("Collection.js", function () {
    var collection = null;
    var sandbox = null;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        collection = new YE.Collection();
    });
    afterEach(function () {
        sandbox.restore();
    });

    describe("sort", function () {
        it("对容器元素进行排序", function () {
            collection.addChild(2);
            collection.addChild(1);

            collection.sort(function (a, b) {
                return a - b;
            });

            expect(collection.getChilds()).toEqual([1, 2]);
        });
    });


    describe("hasChild", function () {
        it("如果参数为func,则使用func进行遍历判断", function () {
            collection.addChild(1);
            collection.addChild("a");

            expect(collection.hasChild(function (c) {
                return c === 1;
            })).toBeTruthy();
            expect(collection.hasChild(function (c) {
                return c === "b";
            })).toBeFalsy();
        });

        it("判断容器中是否存在该数据", function () {
            var fake = {};
            fake2 = {
                a: 1
            };
            collection.addChild(fake);

            expect(collection.hasChild(fake)).toBeTruthy();
            expect(collection.hasChild(fake2)).toBeFalsy();
        });
        it("如果容器元素有getUid方法（引擎类实例），则根据uid判断", function () {
            var fake = {getUid: function () {
                    return 1;
                }},
                fake2 = {getUid: function () {
                    return 2;
                }},
                fake3 = {getUid: function () {
                    return 1;
                }};
            collection.addChild(fake);

            expect(collection.hasChild(fake)).toBeTruthy();
            expect(collection.hasChild(fake3)).toBeTruthy();
            expect(collection.hasChild(fake2)).toBeFalsy();

        });
    });

    describe("getChilds", function () {
        it("获得容器", function () {
            var childs = collection.getChilds();

            expect(childs).toBeSameArray(collection.ye_childs);
        });
    });

    describe("getChildAt", function () {
        it("获得容器指定位置的数据", function () {
            collection.ye_childs = [1, 2];
            var child = collection.getChildAt(1);

            expect(child).toEqual(2);
        });
    });

    describe("addChild", function () {
        it("插入到容器的末尾", function () {
            var childs = null;

            collection.addChild(1).addChild(2);

            childs = collection.getChilds();

            expect(childs).toEqual([1, 2]);
        });
    });

    describe("addChilds", function () {
        it("批量加入元素", function () {
            var fakeElement = [1, 2];

            collection.addChilds(fakeElement);

            expect(collection.getChilds()).toEqual(fakeElement);
        });
        it("也可以加入一个元素", function () {
            collection.addChilds(1);

            expect(collection.getChilds()).toEqual([1]);

        });
    });

    describe("getCount", function () {
        it("返回元素个数", function () {
            collection.addChilds([1, 2]);

            expect(collection.getCount()).toEqual(2);
        });
    });

    describe("removeChild", function () {
        describe("如果第一个参数为function", function () {
            it("删除容器中调用func返回true的元素。", function () {
                var child = {
                    x: 1,
                    y: 1
                };
                collection.addChild(child);

                collection.removeChild(function (e) {
                    if (e.x === 1 && e.y === 1) {
                        return true;
                    }
                    return false;
                });

                expect(collection.getChilds().length).toEqual(0);
            });
            it("第二种调用方式", function () {
                var child = {
                    x: 1,
                    y: 1
                };
                var target = {
                    x: 1,
                    y: 1
                };
                collection.addChild(child);

                collection.removeChild(function (e) {
                    if (e.x === target.x && e.y === target.y) {
                        return true;
                    }
                    return false;
                });

                expect(collection.getChilds().length).toEqual(0);
            });
            it("删除成功返回true，失败返回false", function () {
                var arr = [1, 2];

                collection.addChilds(arr);

                expect(collection.removeChild(function (e) {
                    return e === 1;
                })).toBeTruthy();
                expect(collection.removeChild(function (e) {
                    return e === 1;
                })).toBeFalsy();
            });
        });

        describe("如果第一个参数为引擎实体类", function () {
            beforeEach(function () {
                sandbox.stub()
            });

            function buildObj(uid) {
                return {
                    isInstanceOf: sandbox.stub().returns(true),
                    getUid: sandbox.stub().returns(uid)
                }
            }

            it("删除匹配项（Uid匹配）", function () {
                var child = buildObj(1);
                collection.addChild(child);

                collection.removeChild(child);

                expect(collection.getChilds().length).toEqual(0);
            });
            it("删除成功返回true，失败返回false", function () {
                var child = buildObj(1);

                collection.addChild(child);

                expect(collection.removeChild(child)).toBeTruthy();
                expect(collection.removeChild(child)).toBeFalsy();
            });
        });

        describe("否则", function () {
            it("删除匹配项（===匹配）", function () {
                var child = {
                    x: 1,
                    y: 1
                };
                collection.addChild(child);
                collection.addChild(1);

                collection.removeChild(child);

                expect(collection.getChilds().length).toEqual(1);

                collection.removeChild(1);

                expect(collection.getChilds().length).toEqual(0);
            });
            it("删除成功返回true，失败返回false", function () {
                var arr = [1, 2];

                collection.addChilds(arr);

                expect(collection.removeChild(1)).toBeTruthy();
                expect(collection.removeChild(1)).toBeFalsy();
            });
        });

    });

    describe("removeChildAt", function () {
        it("如果序号小于0，则报错", function () {
            expect(function () {
                collection.removeChildAt(-1);
            }).toThrow();
        });
        it("删除容器中指定位置的元素。", function () {
            collection.addChilds([1, 2, 3]);

            collection.removeChildAt(1);

            expect(collection.getChilds().length).toEqual(2);
            expect(collection.getChildAt(1)).toEqual(3);
        });
    });

    describe("removeAllChilds", function () {
        it("清空容器", function () {
            collection.addChild(1).addChild(2);

            collection.removeAllChilds();

            expect(collection.getChilds().length).toEqual(0);
        });
//        it("重置cursor", function () {
//            collection.removeAllChilds();
//
//            expect(collection.ye_cursor).toEqual(0);
//        });
    });

    describe("copy", function () {
        it("返回容器副本（深拷贝）", function () {
            var arr = [1, {a: 1}];
            collection.addChilds(arr);

            var a = collection.copy();
            a[1].a = 100;

            expect(a === arr).toBeFalsy();
            expect(a.length).toEqual(2);
            expect(arr[1].a).toEqual(1);
        });
    });

    describe("reverse", function () {
//        it("如果容器为空，则报错", function () {
//            collection.removeAllChilds();
//
//            expect(function () {
//                collection.reverse();
//            }).toThrow();
//        });
        it("容器反序", function () {
            var arr = [
                {},
                2,
                3,
                4
            ];
            collection.addChilds(arr);

            collection.reverse();

            expect(collection.getChilds()).toEqual([4, 3, 2, {}]);
        });
    });

//    describe("hasNext", function () {
//        it("没有到达尾部，则返回true", function () {
//            collection.addChild(1);
//
//            expect(collection.hasNext()).toBeTruthy();
//        });
//        it("已经到达尾部，则返回false", function () {
//            expect(collection.hasNext()).toBeFalsy();
//        });
//    });
//
//    describe("next", function () {
//        it("没有到达尾部，则返回下一个元素,并且游标指向下一个元素", function () {
//            collection.addChild(1);
//
//            expect(collection.next()).toEqual(1);
//            expect(collection.hasNext()).toBeFalsy();
//        });
//        it("已经到达尾部，则返回null", function () {
//            expect(collection.next()).toBeNull();
//        });
//    });
//
//    describe("resetCursor", function () {
//        it("重置游标为0", function () {
//            collection.addChild(1);
//
//            collection.next();
//            collection.resetCursor();
//
//            expect(collection.hasNext()).toBeTruthy();
//        });
//    });

//    describe("iterate", function () {
//        describe("如果第1个参数为function", function () {
//            it("遍历集合内元素，调用并将元素传给参数function", function () {
//                var a = 0;
//                collection.addChild(1);
//                collection.addChild(2);
//
//                collection.iterate(function (ele, num) {
//                    a += ele;
//                    a += num;
//                }, 5);
//
//                expect(a).toEqual(13);
//            });
//        });
//
//        describe("如果第1个参数为handler字符串", function () {
//            it("迭代调用容器内元素的方法", function () {
//                var sprite1 = sandbox.createSpyObj("clear"),
//                    sprite2 = sandbox.createSpyObj("clear");
//                collection.addChild(sprite1);
//                collection.addChild(sprite2);
//
//                collection.iterate("clear", 1, 2);
//
//                expect(sprite1.clear).toCalledWith(1, 2);
//                expect(sprite2.clear).toCalledWith(1, 2);
//            });
//        });
//    });

    describe("forEach", function () {
        it("遍历容器", function () {
            var a = 0;
            var b = 0;
            collection.addChild(1);
            collection.addChild(2);

            collection.forEach(function (ele, index) {
                a += ele;
                b += index;
            });

            expect(a).toEqual(3);
            expect(b).toEqual(1);
        });
        it("如果返回$break，则跳出遍历", function () {
            var a = 0;
            collection.addChild(1);
            collection.addChild(2);

            collection.forEach(function (ele, index) {
                a += ele;
                return $break;
            });

            expect(a).toEqual(1);
        });
        it("可设置this", function () {
            var t = [1, 2];
            var a = 0;
            collection.addChild(100);
            collection.addChild(200);

            collection.forEach(function (ele, index) {
                a += this[index];
            }, t);

            expect(a).toEqual(3);
        });
    });

    describe("map", function () {
        it("遍历容器", function () {
            var sprite1 = sandbox.createSpyObj("clear"),
                sprite2 = sandbox.createSpyObj("clear");
            collection.addChild(sprite1);
            collection.addChild(sprite2);

            collection.map("clear", [1, 2]);

            expect(sprite1.clear).toCalledWith(1, 2);
            expect(sprite2.clear).toCalledWith(1, 2);
        });
        it("方法的this指向元素", function () {
            var fakeElement1 = {
                a: 1,
                judge: function () {
                    this.a = 2;
                }
            };
            collection.addChild(fakeElement1);

            collection.map("judge", null);

            expect(fakeElement1.a).toEqual(2);
        });
    });

    describe("filter", function () {
        it("对容器进行过滤并返回", function () {
            var child1 = {a: 1},
                child2 = {a: 2},
                child3 = {a: 2};
            collection.addChilds([child1, child2, child3]);

            var result = collection.filter(function (e) {
                return e.a === 2;
            });

            expect(result.length).toEqual(2);
            expect(result).toEqual([child2, child3]);
        });
    });

});