"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var JSDatepicker;
(function (JSDatepicker) {
    function registerOutsideClickEventHandler(selector, callback) {
        var outsideClickListener = function (event) {
            var inside = $(event.target).closest(selector).length;
            if (inside)
                return;
            cancel();
            callback();
        };
        setTimeout(function () { return document.addEventListener('click', outsideClickListener); });
        var cancel = function () { return document.removeEventListener('click', outsideClickListener); };
        return cancel;
    }
    JSDatepicker.registerOutsideClickEventHandler = registerOutsideClickEventHandler;
    var Item = /** @class */ (function () {
        function Item(date, instance) {
            this.date = date;
            this.instance = instance;
            this.classes = ["t-item"];
        }
        Item.prototype.checkToday = function (unit) {
            if (unit === void 0) { unit = "day"; }
            if (this.date.isSame(moment(), unit))
                this.classes.push("t-today");
            return this;
        };
        Item.prototype.checkActive = function (unit) {
            if (unit === void 0) { unit = "day"; }
            if (this.date.isSame(this.instance.date, unit))
                this.classes.push("active");
            return this;
        };
        Item.prototype.checkOther = function () {
            if (!this.date.isSame(this.instance.date, "month"))
                this.classes.push("t-other");
            return this;
        };
        Item.prototype.checkSelectable = function (unit) {
            if (unit === void 0) { unit = "day"; }
            var result = this.isSelectable(this.date, unit) ? "t-event" : "disabled";
            this.classes.push(result);
            return this;
        };
        Item.prototype.isSelectable = function (date, unit) {
            if (unit === void 0) { unit = "day"; }
            var ranges = this.instance.options.ranges || [];
            for (var i = 0; i < ranges.length; i++) {
                var range = __assign({ from: moment.min, to: moment.max }, ranges[i]);
                if (date.isBetween(range.from, range.to, unit, "[]"))
                    return range.selectable;
            }
            return true;
        };
        return Item;
    }());
    JSDatepicker.Item = Item;
    var DatePicker = /** @class */ (function () {
        function DatePicker(target, options) {
            this.cancelOutsideClickEventHandler = function () { };
            this.options = __assign({}, DatePicker.options, options);
            this.date = moment(this.options.date);
            this.view = this.options.view || "days";
            this.input = $(target);
            this.element = JSDatepicker.templates.parse(JSDatepicker.templates.main, this);
            this.trigger = this.element.find(".t-trigger");
            this.placment = $(this.options.placement || this.element);
            this.setupViews();
            this.setupInput();
            this.setupElements();
        }
        ;
        DatePicker.prototype.setupElements = function () {
            var _this = this;
            this.input.after(this.element);
            this.input.addClass("t-input");
            this.element.append(this.input);
            this.trigger.on("click", function () { return _this.toggle(); });
        };
        DatePicker.prototype.setupInput = function () {
            var _this = this;
            this.input.on("keydown", function (e) {
                var char = e.which || e.keyCode;
                switch (char) {
                    case 9:
                    case 13:
                        var format = _this.options.inputFormat;
                        var date = moment(_this.input.val(), format);
                        if (!date.isValid())
                            return;
                        _this.date = date;
                        return _this.invokeOnChange();
                }
            });
        };
        DatePicker.prototype.setupViews = function () {
            var options = this.options;
            if (options.views.indexOf(options.view) < 0) {
                options.views.unshift(options.view); //if view is missing, add as start view
            }
        };
        DatePicker.prototype.navigate = function (nav) {
            var views = this.options.views;
            var index = views.indexOf(this.view);
            index += nav == "up" ? 1 : -1;
            this.view = views[index] || this.options.view;
            this.render();
        };
        DatePicker.prototype.toggle = function (close) {
            return close || this.picker
                ? this.close()
                : this.render();
        };
        DatePicker.prototype.remove = function () {
            if (this.picker) {
                this.picker.remove();
                this.picker = undefined;
            }
            this.cancelOutsideClickEventHandler();
        };
        DatePicker.prototype.close = function () {
            this.remove();
            this.view = this.options.view;
        };
        DatePicker.prototype.step = function (config, forward) {
            if (!config.step)
                return;
            var step = config.step;
            var count = step.count;
            var amount = forward ? count : -(count);
            this.date = moment(this.date).add(amount, step.unit);
            this.render();
        };
        DatePicker.prototype.place = function () {
            var _this = this;
            if (!this.picker)
                return;
            var offset = this.trigger.offset();
            if (offset && !this.picker.closest(this.element).length) {
                var tweak = { top: -12, left: -22 };
                var width = this.picker.width() || 0;
                var heigth = (this.input.outerHeight() || 0) + tweak.top;
                this.picker.css({ top: offset.top + heigth, left: offset.left - width - tweak.left });
            }
            this.cancelOutsideClickEventHandler = registerOutsideClickEventHandler(this.picker, function () { return _this.close(); });
        };
        DatePicker.prototype.render = function () {
            var _this = this;
            this.remove();
            this.picker = JSDatepicker.templates.mount(JSDatepicker.templates.picker, this, this.placment);
            this.picker.find(".t-event").on("click", function () {
                if (!_this.invokeOnChange())
                    _this.navigate("down");
            });
            this.place();
            return this.picker;
        };
        DatePicker.prototype.invokeOnChange = function () {
            var date = this.date;
            var options = this.options;
            if (this.view != options.view)
                return false;
            options.date = date;
            this.input.val(moment(date).format(options.inputFormat));
            this.input.focus();
            this.close();
            if (options.onChange)
                options.onChange(this.date, this.input);
            return true;
        };
        DatePicker.prototype.createItem = function (date) {
            var item = new Item(date, this);
            return item;
        };
        DatePicker.options = Object.freeze({
            view: "days",
            views: ["days", "months", "years", "decades"],
            ranges: [],
            inputFormat: moment.localeData().longDateFormat("L"),
            showToday: true,
            showNavigator: false
        });
        return DatePicker;
    }());
    JSDatepicker.DatePicker = DatePicker;
    function create(target, options) {
        return new DatePicker(target, options);
    }
    JSDatepicker.create = create;
})(JSDatepicker || (JSDatepicker = {}));
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        function parse(template, instance) {
            return $(template.onRender(instance));
        }
        templates.parse = parse;
        function mount(template, instance, parent) {
            var element = parse(template, instance);
            parent.append(element);
            if (template.onMounted)
                template.onMounted(instance, element);
            return element;
        }
        templates.mount = mount;
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.foot = {
            config: {
                name: "foot"
            },
            onRender: function (instance) {
                var options = instance.options;
                function renderToday() {
                    return options.showToday ? "<button class=\"t-nav t-today\">Today</button>" : "";
                }
                function renderViews() {
                    if (!options.showNavigator)
                        return "";
                    var items = [];
                    var view = options.view;
                    options.views.forEach(function (item) {
                        var selected = view == item ? "selected" : "";
                        items.push("<option class=\"t-nav t-view\" " + selected + ">" + item + "</option>");
                    });
                    return "<select class=\"t-nav t-view\">" + items + "</select>";
                }
                return "<div class=\"t-foot\">" + renderToday() + renderViews() + "</div>";
            },
            onMounted: function (instance, element) {
                element.find("button.t-today").on("click", function (e) {
                    instance.view = instance.options.view;
                    instance.date = moment();
                    instance.render();
                });
                element.find(".t-view").on("change", function (e) {
                    instance.view = $(e.target).val();
                    instance.render();
                });
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.head = {
            config: {
                name: "head",
                step: { count: 1, unit: "M" },
                headerFormat: "DD MMMM YYYY"
            },
            onRender: function (instance) {
                var date = moment(instance.date);
                var config = this.config;
                return "<div class=\"t-head\">\n                        " + (config.step ? '<button class="t-nav t-prev"></button>' : '') + "\n                        <button class=\"t-nav t-title\">" + date.format(config.headerFormat) + "</button>\n                        " + (config.step ? '<button class="t-nav t-next"></button>' : '') + "\n                    </div>";
            },
            onMounted: function (instance, element) {
                var _this = this;
                var navs = element.find("button.t-prev, button.t-next");
                navs.toggle(this.config.step != null);
                navs.on("click", function (e) {
                    var b = $(e.target);
                    instance.step(_this.config, b.hasClass("t-next"));
                });
                element.find("button.t-title").on("click", function (e) {
                    instance.navigate("up");
                });
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.main = {
            config: {
                name: "main"
            },
            onRender: function (instance) {
                return "<div class=\"t-jsdp\"><div class=\"t-trigger\"></div></div>";
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.picker = {
            config: {
                name: "picker"
            },
            onRender: function (instance) {
                return "<div class=\"t-jsdp-picker\"></div>";
            },
            onMounted: function (instance, element) {
                instance.picker = element; //need to set this here since templates might need it
                var t = templates;
                var view = instance.view;
                var template = t[view];
                var foot = templates.foot;
                var head = $.extend({}, templates.head);
                $.extend(head.config, template.config, head.config);
                templates.mount(head, instance, element);
                templates.mount(template, instance, element);
                templates.mount(foot, instance, element);
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.days = {
            config: {
                name: "days",
                step: { unit: "M", count: 1 },
                headerFormat: "MMMM YYYY",
                showWeeknumbers: true
            },
            onRender: function (instance) {
                var config = this.config;
                function renderWeekCell(text) {
                    return config.showWeeknumbers ? "<div class=\"t-item t-week\">" + text + "</div>" : "";
                }
                function renderHead() {
                    var result = [renderWeekCell('w')];
                    moment.weekdaysMin().forEach(function (f) {
                        result.push("<div class=\"t-item t-weekday\">" + f + "</div>");
                    });
                    return result.join("");
                }
                function renderBody() {
                    var unit = "d";
                    var date = instance.date;
                    var end = moment(date).endOf("month").endOf("isoWeek");
                    var start = moment(date).startOf("month").startOf("isoWeek");
                    var week = 0;
                    var current = moment(start);
                    var result = [];
                    while (current < end) {
                        if (week != current.isoWeek()) {
                            if (week)
                                result.push('</div>');
                            result.push('<div class="t-week">');
                            week = current.isoWeek();
                            result.push(renderWeekCell(week));
                        }
                        var item = instance.createItem(current)
                            .checkOther()
                            .checkToday(unit)
                            .checkActive(unit)
                            .checkSelectable(unit);
                        item.classes.push("t-day");
                        result.push("<div class=\"" + item.classes.join(" ") + "\" data-date=\"" + current.format('YYYY-MM-DD') + "\">" + item.date.date() + "</div>");
                        current.add(1, unit);
                    }
                    return result.join("");
                }
                return "<div class=\"t-days\">\n                        <div class=\"t-head\">\n                            <div class=\"t-week\">" + renderHead() + "</div>\n                        </div>\n                        <div class=\"t-body\">" + renderBody() + "</div>\n                    </div>";
            },
            onMounted: function (instance, element) {
                var items = element.find(".t-event");
                items.on("click", function (e) {
                    var target = $(e.target);
                    var value = target.attr("data-date");
                    instance.date = moment(value);
                });
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.decades = {
            config: {
                name: "decades",
                step: { unit: "y", count: 100 },
                headerFormat: "YYYY"
            },
            onRender: function (instance) {
                var config = this.config;
                function renderDecades() {
                    var amount = config.step.count / 2;
                    var unit = "y";
                    var date = instance.date;
                    var end = moment(date).add(amount, unit);
                    var start = moment(date).add(-(amount), unit);
                    var next = null;
                    var current = moment(start);
                    var result = [];
                    while (current < end) {
                        var item = instance.createItem(current);
                        item.classes.push("t-decade");
                        next = moment(current).add(10, unit);
                        while (item.date <= next) {
                            item.checkToday(unit)
                                .checkActive(unit)
                                .checkSelectable(unit);
                            item.date.add(1, unit);
                        }
                        item.classes = resolveClasses(item.classes);
                        result.push("<div class=\"" + item.classes.join(" ") + "\">" + current.year() + " - " + next.year() + "</div>");
                        current = next.add(1, unit);
                    }
                    function resolveClasses(array) {
                        var hasEvent = array.indexOf("t-event") > -1;
                        return array.reduce(function (prev, curr) {
                            if (hasEvent && curr == "disabled")
                                return prev;
                            return prev.indexOf(curr) < 0 ? prev.concat([curr]) : prev;
                        }, []);
                    }
                    return result.join("");
                }
                return "<div class=\"t-decades\" >" + renderDecades() + "</div>";
            },
            onMounted: function (instance, element) {
                var step = this.config.step;
                var picker = instance.picker;
                if (!step || !picker)
                    return;
                var date = instance.date;
                var format = this.config.headerFormat;
                var amount = step.count / 2;
                var range = {
                    start: moment(date).add(-(amount), step.unit).format(format),
                    end: moment(date).add(amount + 9, step.unit).format(format)
                };
                picker.find(".t-nav.t-title").text(range.start + " - " + range.end);
                var items = element.find(".t-event");
                items.on("click", function (e) {
                    var value = 0;
                    $(e.target).text().split(" - ").forEach(function (item) {
                        value += parseInt(item);
                    });
                    instance.date.year(value / 2);
                });
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.months = {
            config: {
                name: "months",
                step: { unit: "y", count: 1 },
                headerFormat: "YYYY"
            },
            onRender: function (instance) {
                var unit = "M";
                var date = instance.date;
                var current = moment(date).startOf("year");
                var result = [];
                moment.monthsShort().forEach(function (m) {
                    var item = instance.createItem(current)
                        .checkToday(unit)
                        .checkActive(unit)
                        .checkSelectable(unit);
                    item.classes.push("t-month");
                    result.push("<div class=\"" + item.classes.join(" ") + "\">" + m + "</div>");
                    current.add(1, unit);
                });
                return "<div class=\"t-months\">" + result.join("") + "</div>";
            },
            onMounted: function (instance, element) {
                var items = element.find(".t-event");
                items.on("click", function (e) {
                    var target = $(e.target);
                    var value = target.index();
                    instance.date.month(value);
                });
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.weeks = {
            config: {
                name: "weeks",
                step: { unit: "M", count: 1 },
                headerFormat: "MMMM YYYY",
                showWeeknumbers: true
            },
            onRender: function (instance) {
                var config = this.config;
                var options = instance.options;
                function renderWeek(text) {
                    return config.showWeeknumbers ? "<div class=\"t-item t-event t-week\">" + text + "</div>" : "";
                }
                function renderHead() {
                    var result = [renderWeek('w')];
                    moment.weekdaysMin().forEach(function (f) {
                        result.push('<div class="t-item t-weekday">' + f + '</div>');
                    });
                    return result.join("");
                }
                function renderBody() {
                    var week = 0;
                    var unit = "d";
                    var date = instance.date;
                    var end = moment(date).endOf("month").endOf("isoWeek");
                    var start = moment(date).startOf("month").startOf("isoWeek");
                    var current = moment(start);
                    var result = [];
                    while (current < end) {
                        if (week != current.isoWeek()) {
                            if (week)
                                result.push('</div>');
                            result.push(current.isSame(options.date, "week")
                                ? '<div class="t-week active">'
                                : '<div class="t-week">');
                            week = current.isoWeek();
                            result.push(renderWeek(week));
                        }
                        var item = instance.createItem(current)
                            .checkToday(unit)
                            .checkOther()
                            .checkActive(unit)
                            .checkSelectable(unit);
                        item.classes.push("t-day");
                        result.push("<div class=\"" + item.classes.join(" ") + "\" data-date=\"" + current.format('YYYY-MM-DD') + "\">" + item.date.date() + "</div>");
                        current.add(1, unit);
                    }
                    return result.join("");
                }
                return "\n                <div class= \"t-days t-weeks\">\n                    <div class=\"t-head\">\n                        <div class=\"t-week\">" + renderHead() + "</div>\n                    </div>\n                    <div class= \"t-body\">" + renderBody() + "</div>\n                </div>";
            },
            onMounted: function (instance, element) {
                var items = element.find(".t-event");
                items.on("click", function (e) {
                    var target = $(e.target);
                    var value = target.attr("data-date") || target.next().attr("data-date");
                    instance.date = moment(value).startOf("isoWeek");
                });
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.years = {
            config: {
                name: "years",
                step: { unit: "y", count: 12 },
                headerFormat: "YYYY"
            },
            onRender: function (instance) {
                var amount = this.config.step.count / 2 || 0;
                var options = instance.options;
                var unit = "y";
                var date = instance.date;
                var end = moment(date).add(amount, unit);
                var start = moment(date).add(-(amount), unit);
                var current = moment(start);
                var result = [""];
                while (current < end) {
                    var item = instance.createItem(current)
                        .checkToday(unit)
                        .checkActive(unit)
                        .checkSelectable(unit);
                    item.classes.push("t-year");
                    result.push("<div class=\"" + item.classes.join(" ") + "\">" + item.date.year() + "</div>");
                    current.add(1, unit);
                }
                return "<div class=\"t-years\">" + result.join("") + "</div>";
            },
            onMounted: function (instance, element) {
                var step = this.config.step;
                var picker = instance.picker;
                if (!step || !picker)
                    return;
                var date = instance.date;
                var format = this.config.headerFormat;
                var amount = step.count / 2;
                var range = {
                    end: moment(date).add(amount - 1, step.unit).format(format),
                    start: moment(date).add(-(amount), step.unit).format(format)
                };
                picker.find(".t-head .t-nav .t-title").text(range.start + " - " + range.end);
                var items = element.find(".t-event");
                items.on("click", function (e) {
                    var target = $(e.target);
                    var value = parseInt(target.text());
                    instance.date.year(value);
                });
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
