/*
 * jQuery Mobile Framework : plugin to provide a simple Dialog widget.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * https://github.com/jtsage/jquery-mobile-simpledialog
 */
(function (a, b) {
    a.widget("mobile.simpledialog", a.mobile.widget, {
        options: {
            version: "1.0.1-2012021300",
            pickPageTheme: "b",
            pickPageInputTheme: "e",
            pickPageButtonTheme: "a",
            fullScreen: false,
            fullScreenAlways: false,
            disabled: false,
            zindex: "500",
            width: "280px",
            prompt: "Are you sure?",
            mode: "bool",
            allowReopen: true,
            useModal: true,
            forceInput: true,
            isOpen: false,
            blankMode: false,
            fullHTML: null,
            subTitle: false,
            inputPassword: false,
            cleanOnClose: false,
            animate: true,
            transition: "pop",
            clickEvent: "click",
            left: b,
            top: b,
            useDialogForceTrue: false,
            useDialogForceFalse: false,
            useDialog: false,
            isInit: false,
            sawOnce: false,
            enterToTrigger: 0,
            escToTrigger: 1,
            butObj: [],
            debug: false,
            selects: false,
            selectparent: [],
            onCreated: null,
            onOpened: null,
            onClosed: null,
            onShown: null
        },
        _eventHandler: function (c, e) {
            var d = a(this).data("simpledialog"),
                f = d.options;
            if (!c.isPropagationStopped()) {
                switch (e.method) {
                case "close":
                    d.close(e.fromCloseButton);
                    break;
                case "open":
                    d.open();
                    break;
                case "refresh":
                    d.refresh();
                    break;
                case "button":
                    f.butObj[e.index].trigger(f.clickEvent);
                    break
                }
            }
        },
        _orientChange: function (h) {
            var l = a(h.currentTarget).data("simpledialog"),
                c = l.options,
                d = a.mobile.activePage.width(),
                f = a(window).scrollTop(),
                i = a(window).height(),
                m = l.pickerContent.outerHeight(),
                j = l.pickerContent.innerWidth(),
                g = (parseFloat(c.top) + 10000) ? parseFloat(c.top) : (f + (i / 2) - (m / 2)),
                k = (parseFloat(c.left) + 10000) ? parseFloat(c.left) : ((d / 2) - (j / 2));
            if ((m + g) > a(document).height()) {
                g = a(document).height() - (m + 2)
            }
            if (g < 45) {
                g = 45
            }
            h.stopPropagation();
            if (!l.pickerContent.is(":visible") || c.useDialog === true) {
                return false
            } else {
                l.pickerContent.css({
                    top: g,
                    left: k
                })
            }
        },
        open: function () {
            // if (this.pickPage.is(":visible")) {
            //     return false
            // }
            var l = this,
                c = this.options,
                d = a.mobile.activePage.width(),
                f = a(window).scrollTop(),
                i = a(window).height(),
                m = l.pickerContent.outerHeight(),
                j = l.pickerContent.innerWidth(),
                e = a(window).scrollTop(),
                h = a(window).scrollLeft(),
                g = (parseFloat(c.top) + 10000) ? parseFloat(c.top) : (f + (i / 2) - (m / 2)),
                k = (parseFloat(c.left) + 10000) ? parseFloat(c.left) : ((d / 2) - (j / 2));

            if ((m + g) > a(document).height()) {
                g = a(document).height() - (m + 2)
            }
            if (g < 45) {
                g = 45
            }
            if (c.prompt !== false) {
                l.pickerHeader.html(c.prompt);
                l.pickPage.find(".ui-header").find(".ui-title").text(c.prompt)
            }
            l.pickerContent.find(".ui-btn-active").removeClass("ui-btn-active");
            if (c.mode === "blank") {
                l.pickerContent.delegate('[rel="close"]', c.clickEvent, function () {
                    l.close()
                })
            }
            if (!c.disabled) {
                if ((d > 400 && !c.useDialogForceTrue) || c.useDialogForceFalse || c.fullScreen) {
                    c.useDialog = false;
                    if (c.fullScreen === false) {
                        if (c.useModal === true) {
                            if (c.animate === true) {
                                //beatacao 注释： l.screen.fadeIn("slow");
                                l.screen.show();
                                
                            } else {
                                l.screen.show()
                            }
                        } else {
                            l.screen.removeClass("ui-simpledialog-hidden")
                        }
                    }
                    if (c.mode === "blank") {
                        c.selects = l.pickPage.find(".ui-selectmenu");
                        c.selects.each(function () {
                            c.selectparent.push(a(this).closest(".ui-dialog"));
                            a(this).appendTo(l.thisPage)
                        })
                    }
                    l.pickerContent.addClass("ui-overlay-shadow").css("zIndex", l.options.zindex);
                    l.pickerHeader.show();
                    if (c.fullScreenAlways || (c.fullScreen && d < 400)) {
                        l.pickerContent.css({
                            border: "0px !important",
                            position: "absolute",
                            top: e,
                            left: h,
                            height: i,
                            width: d,
                            maxWidth: d
                        }).addClass("ui-overlay-shadow in").removeClass("ui-simpledialog-hidden")
                    } else {
                        l.pickerContent.css({
                            position: "absolute",
                            top: g,
                            left: k
                        }).addClass("ui-overlay-shadow in").removeClass("ui-simpledialog-hidden")
                    }
                } else {
                    l.thisPage.unbind("pagehide.remove");
                    c.useDialog = true;
                    l.pickPageContent.append(l.pickerContent);
                    l.pickerHeader.hide();
                    l.pickerContent.removeClass("ui-overlay-shadow ui-simpledialog-hidden").css({
                        top: "auto",
                        left: "auto",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }).css("zIndex", l.options.zindex);
                    a.mobile.changePage(l.pickPage, {
                        transition: (c.animate === true) ? c.transition : "none"
                    })
                }
                this.options.isOpen = true
            }
            if (l.options.onOpened && typeof (l.options.onOpened) === "function") {
                l.options.onOpened(l)
            }
        },
        close: function (c) {
            var d = this;
            c = (typeof (c) === "undefined") ? false : c;
            if (d.options.useDialog) {
                if (c === false) {
                    a(d.pickPage).dialog("close")
                }
                if ((typeof d.thisPage.jqmData("page")) !== "undefined" && !d.thisPage.jqmData("page").options.domCache) {
                    d.thisPage.bind("pagehide.remove", function () {
                        a(d).remove()
                    })
                }
                d.pickerContent.addClass("ui-simpledialog-hidden");
                d.thisPage.append(d.pickerContent)
            } else {
                if (d.options.useModal) {
                    if (d.options.animate === true) {
                        //d.screen.fadeOut("slow")
                        d.screen.hide()
                    } else {
                        d.screen.hide()
                    }
                } else {
                    d.screen.addClass("ui-simpledialog-hidden")
                }
                d.pickerContent.addClass("ui-simpledialog-hidden").removeClass("in")
            }
            d.caller.removeClass("ui-btn-active");
            d.options.isOpen = false;
            if (d.options.cleanOnClose === true && d.options.useDialog === false) {
                d.clean()
            }
            if (d.options.onClosed && typeof (d.options.onClosed) === "function") {
                d.options.onClosed(d)
            }
        },
        clean: function () {
            var c = this;
            if (c.options.selects !== false) {
                c.options.selects.each(function () {
                    a(this).remove()
                });
                a(c.options.selectparent).each(function () {
                    a(this).remove()
                })
            }
            c.pickerContent.remove();
            c.pickPage.remove();
            c.screen.remove();
            c.caller.removeData("simpledialog");
            //beatacao添加
            //c.options.isInit = false;
        },
        _create: function () {
            var d = this,
                i = a.extend(this.options, this.element.data("options")),
                e = this.element;
            if (i.isInit && i.allowReopen) {
                d.open()
            } else {
                var h = e.closest(".ui-page"),
                    c = a("<div data-role='dialog' class='ui-simpledialog-dialog' data-theme='" + i.pickPageTheme + "' ><div data-role='header' data-backbtn='false' data-theme='a'><div class='ui-title'>" + i.prompt + "</div></div><div data-role='content'></div></div>"),
                    g = null,
                    f = null;
                if (i.mode === "blank") {
                    g = a("<div class='ui-simpledialog-container ui-overlay-shadow ui-corner-all ui-simpledialog-hidden " + ((i.animate === true) ? i.transition : "") + " ui-body-" + i.pickPageTheme + "'></div>");
                    g.html(i.fullHTML);
                    a("[data-role=content]", c).append(g)
                }
                // beatacao注释：
                c.appendTo(a.mobile.pageContainer).page().css("minHeight", "0px").css("zIndex", i.zindex);
                if (i.animate === true) {
                    c.addClass("pop")
                }
                f = c.find(".ui-content");
                //beatacao 替换为下一行：e.live("simpledialog", d._eventHandler);
                $(document).delegate(e,'simpledialog',d._eventHandler);
                c.find(".ui-header a").bind(i.clickEvent, function (j) {
                    j.preventDefault();
                    j.stopImmediatePropagation();
                    d.close(true)
                });
                if (i.prompt === false) {
                    c.find(".ui-header").find(".ui-title").html("&nbsp;")
                }
                a.extend(d, {
                    pickPage: c,
                    thisPage: h,
                    pickPageContent: f,
                    screen: screen,
                    caller: e
                });
                d._buildPage();
                d.options.isInit = true;
                a(document).bind("orientationchange", function (j) {
                    e.trigger("orientationchange")
                });
                e.bind("orientationchange", d._orientChange);

                if (d.options.onCreated && typeof (d.options.onCreated) === "function") {
                    d.options.onCreated(d)
                }
            }
        },
        _reposition: function () {
            var j = this,
                c = this.options,
                d = a.mobile.activePage.width(),
                e = a(window).scrollTop(),
                g = a(window).height(),
                k = j.pickerContent.outerHeight(),
                h = j.pickerContent.innerWidth(),
                f = (parseFloat(c.top) + 10000) ? parseFloat(c.top) : (e + (g / 2) - (k / 2)),
                i = (parseFloat(c.left) + 10000) ? parseFloat(c.left) : ((d / 2) - (h / 2));
            if ((k + f) > a(document).height()) {
                f = a(document).height() - (k + 2)
            }
            if (f < 45) {
                f = 45
            }
            j.pickerContent.css({
                position: "absolute",
                width: h,
                top: f,
                left: i
            })
        },
        refresh: function () {
            if (this.options.mode !== "blank") {
                return false
            } else {
                this.pickerContent.css("width", "auto");
                this.pickerContent.html(this.options.fullHTML);
                this.pickerContent.trigger("create");
                if (this.pickerContent.is(":visible") && this.options.useDialog === false) {
                    this._reposition()
                }
            }
        },
        _init: function () {
            if(this.options.cleanOnClose){
                this._create();
                this.open();
            }
            
            if (!this.options.sawOnce || this.options.allowReopen) {
                this.options.sawOnce = true;
                this.open()
            }
        },
        _buildPage: function () {
            var f = this,
                h = f.options,
                c = null,
                g, e, d, j = a("<div>", {
                    "class": "ui-simpledialog-container ui-overlay-shadow ui-corner-all ui-simpledialog-hidden " + ((h.animate === true) ? h.transition : "") + " ui-body-" + h.pickPageTheme
                }).css({
                    zIndex: h.zindex,
                    width: h.width
                }),
                i = a("<div class='ui-simpledialog-header'><h4></h4></div>").appendTo(j).find("h4");
            j.bind("webkitAnimationEnd", function () {
                if (f.options.onShown && typeof (f.options.onShown) === "function") {
                    f.options.onShown(f)
                }
            });
            if (h.mode !== "blank") {
                if (h.prompt !== false) {
                    i.html(h.prompt)
                } else {
                    i.parent().html()
                } if (h.subTitle !== false) {
                    a("<p class='ui-simpledialog-subtitle'>" + h.subTitle + "<p>").appendTo(j)
                }
                if (h.mode === "string") {
                    g = a("<div class='ui-simpledialog-controls'><input class='ui-simpledialog-input ui-input-text ui-shadow-inset ui-corner-all ui-body-" + h.pickPageInputTheme + "' type='" + ((h.inputPassword === true) ? "password" : "text") + "' name='pickin' /></div>").bind("keyup", function (k) {
                        if (k.keyCode === 13 && h.enterToTrigger !== false) {
                            h.butObj[h.enterToTrigger].trigger(h.clickEvent)
                        }
                        if (k.keyCode === 27 && h.escToTrigger !== false) {
                            h.butObj[h.escToTrigger].trigger(h.clickEvent)
                        }
                    }).appendTo(j)
                }
                e = a("<div>", {
                    "class": "ui-simpledialog-controls"
                }).appendTo(j);
                a.each(h.buttons, function (k, l) {
                    l = a.isFunction(l) ? {
                        click: l
                    } : l;
                    l = a.extend({
                        text: k,
                        theme: h.pickPageButtonTheme,
                        icon: "check",
                        iconpos: "left",
                        closeOnClick: true,
                        corners: true,
                        shadow: true
                    }, l);
                    c = h.butObj.push(a("<a href='#'>" + k + "</a>").appendTo(e).buttonMarkup({
                        theme: l.theme,
                        icon: l.icon,
                        iconpos: l.iconpos,
                        corners: l.corners,
                        shadow: l.shadow
                    }).unbind("vclick").unbind("click").bind(h.clickEvent, function () {
                        if (h.mode === "string") {
                            f.caller.attr("data-string", g.find("input").val())
                        }
                        var m = l.click.apply(f.element[0], arguments);
                        if (m !== false && l.closeOnClick === true) {
                            f.close()
                        }
                    }));
                    if (typeof (l.id) !== "undefined" && l.id.length > 0) {
                        h.butObj[c - 1].attr("id", l.id)
                    }
                    if (l.hidden) {
                        h.butObj[c - 1].addClass("button-hidden")
                    }
                    if (l.insertSeparator) {
                        a("<div class='buttons-separator'>").appendTo(e)
                    }
                })
            } else {
                j = f.pickPageContent.contents()
            }
            j.appendTo(f.thisPage);
            d = a("<div>", {
                "class": "ui-simpledialog-screen ui-simpledialog-hidden"
            }).css({
                "z-index": h.zindex - 1
            }).appendTo(f.thisPage).bind(h.clickEvent, function (k) {
                if (!h.forceInput) {
                    f.close();
                    if(typeof f.options.cancelCallback == 'function'){
                        f.options.cancelCallback();
                    }
                }
                k.preventDefault()
            });
            if (h.useModal) {
                d.addClass("ui-simpledialog-screen-modal")
            }
            a.extend(f, {
                pickerContent: j,
                pickerHeader: i,
                screen: d
            })
        },
        disable: function () {
            this.options.disabled = true
        },
        enable: function () {
            this.options.disabled = false
        }
    })
})(jQuery);