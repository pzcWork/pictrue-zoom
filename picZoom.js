/**
 * Created by yzh on 2017/9/5.
 */
//参数传入图片DOM对象
function picZoom(picDom, minH, maxH) {
    /*绑定事件*/
    function addEvent(obj, sType, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(sType, fn, false);
        } else {
            obj.attachEvent('on' + sType, fn);
        }
    };
    function removeEvent(obj, sType, fn) {
        if (obj.removeEventListener) {
            obj.removeEventListener(sType, fn, false);
        } else {
            obj.detachEvent('on' + sType, fn);
        }
    };
    function prEvent(ev) {
        var oEvent = ev || window.event;
        if (oEvent.preventDefault) {
            oEvent.preventDefault();
        }
        return oEvent;
    }

    /*添加滑轮事件*/
    function addWheelEvent(obj, callback) {
        if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
            addEvent(obj, 'DOMMouseScroll', wheel);
        } else {
            addEvent(obj, 'mousewheel', wheel);
        }
        function wheel(ev) {
            var oEvent = prEvent(ev),
                delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0;
            callback && callback.call(oEvent, delta);
            return false;
        }
    };


    /*页面载入后*/


    picDom.style.left = '18.2291667%';
        /*拖拽功能*/
        (function () {
            addEvent(picDom, 'mousedown', function (ev) {
                var oEvent = prEvent(ev),
                    oParent = picDom.parentNode,
                    disX = oEvent.clientX - picDom.offsetLeft,
                    disY = oEvent.clientY - picDom.offsetTop,
                    startMove = function (ev) {
                        if (oParent.setCapture) {
                            oParent.setCapture();
                        }
                        var oEvent = ev || window.event,
                            l = oEvent.clientX - disX,
                            t = oEvent.clientY - disY;
                        picDom.style.left = l + 'px';
                        picDom.style.top = t + 'px';
                        oParent.onselectstart = function () {
                            return false;
                        }
                    }, endMove = function (ev) {
                        if (oParent.releaseCapture) {
                            oParent.releaseCapture();
                        }
                        oParent.onselectstart = null;
                        removeEvent(oParent, 'mousemove', startMove);
                        removeEvent(oParent, 'mouseup', endMove);
                    };
                addEvent(oParent, 'mousemove', startMove);
                addEvent(oParent, 'mouseup', endMove);
                return false;
            });
        })();
        /*以鼠标位置为中心的滑轮放大功能*/
        (function () {
            addWheelEvent(picDom, function (delta) {
                //console.log(picDom.style.height);
                //滚轮上滚delta = true，图片缩小
                //console.log(delta);
                var picDomH = parseInt(picDom.style.height);
                //定义图片缩放范围
                //图片宽度小于minH时，取消滚轮上滚，只允许下滚放大图片
                if (picDomH < minH) {
                    if (delta) {
                        return
                    } else {
                        var ratioDelta = 1 + 0.1;
                    }

                    var ratioL = (this.clientX - picDom.offsetLeft) / picDom.offsetWidth;
                    var ratioT = (this.clientY - picDom.offsetTop) / picDom.offsetHeight;
                    var w = parseInt(picDom.offsetWidth * ratioDelta);
                    var h = parseInt(picDom.offsetHeight * ratioDelta);
                    var l = Math.round(this.clientX - (w * ratioL));
                    var t = Math.round(this.clientY - (h * ratioT));
                    with (picDom.style) {
                        width = w + 'px';
                        height = h + 'px';
                        left = l + 'px';
                        top = t + 'px';
                    }
                    ;
                    return;
                    //图片高度大于maxH时，取消滚轮下滚，只允许下滚缩小图片
                } else if (picDomH > maxH) {
                    if (delta) {
                        var ratioDelta = 1 - 0.1;
                    } else {
                        return;
                    }
                    var ratioL = (this.clientX - picDom.offsetLeft) / picDom.offsetWidth;
                    var ratioT = (this.clientY - picDom.offsetTop) / picDom.offsetHeight;
                    var w = parseInt(picDom.offsetWidth * ratioDelta);
                    var h = parseInt(picDom.offsetHeight * ratioDelta);
                    var l = Math.round(this.clientX - (w * ratioL));
                    var t = Math.round(this.clientY - (h * ratioT));
                    with (picDom.style) {
                        width = w + 'px';
                        height = h + 'px';
                        left = l + 'px';
                        top = t + 'px';
                    }
                    return;
                }
                var ratioL = (this.clientX - picDom.offsetLeft) / picDom.offsetWidth;
                var ratioT = (this.clientY - picDom.offsetTop) / picDom.offsetHeight;
                var ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1;
                var w = parseInt(picDom.offsetWidth * ratioDelta);
                var h = parseInt(picDom.offsetHeight * ratioDelta);
                var l = Math.round(this.clientX - (w * ratioL));
                var t = Math.round(this.clientY - (h * ratioT));
                with (picDom.style) {
                    width = w + 'px';
                    height = h + 'px';
                    left = l + 'px';
                    top = t + 'px';
                }
                //console.log(ratioDelta)

            });
        })();

    }

