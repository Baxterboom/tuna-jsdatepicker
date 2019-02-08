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
            this.options = $.extend({}, DatePicker.options, options);
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
                        _this.date = moment(_this.input.val(), format);
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
                var teak = { top: -12, left: -22 };
                var width = this.picker.width() || 0;
                var heigth = (this.input.outerHeight() || 0) + teak.top;
                this.picker.css({ top: offset.top + heigth, left: offset.left - width - teak.left });
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
            var data = $.extend({}, instance, { template: template });
            return $(JSTemplate.parse(template.template, data, true));
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
            template: "\n            <%\n                function renderToday(){\n                    if(options.showToday) w('<button class=\"t-nav t-today\">Today</button>');\n                }\n\n                function renderViews(){\n                    if(options.showNavigator) {\n                        var items = \"\";\n    \n                        options.views.forEach(function(item) {\n                            const selected = view == item ? \"selected\" : \"\";\n                            items += '<option class=\"t-nav t-view\" <%=selected%>><%=item%></option>';\n                        });  \n                        \n                        w('<select class=\"t-nav t-view\">');\n                        w(items);\n                        w('</select>');\n                    }\n                }\n            %>\n            <div class=\"t-foot\">\n            <%\n                renderToday();\n                renderViews();\n            %>\n            </div>",
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
            template: "\n            <div class=\"t-head\">\n                <% if(template.config.step) w('<button class=\"t-nav t-prev\"></button>'); %>\n                <button class=\"t-nav t-title\"><%=date.format(template.config.headerFormat)%></button>\n                <% if(template.config.step) w('<button class=\"t-nav t-next\"></button>'); %>\n            </div>\n            ",
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
            template: "\n            <div class=\"t-jsdp\">\n                <div class=\"t-trigger\"></div>\n            </div>"
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
            template: "<div class=\"t-jsdp-picker\"></div>",
            onMounted: function (instance, element) {
                instance.picker = element; //need to set this here since templates might need it
                var t = templates;
                var view = instance.view;
                var template = t[view];
                var head = $.extend({}, templates.head);
                $.extend(head.config, template.config, head.config);
                var foot = templates.foot;
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
            template: "\n            <%\n                function renderWeekCell(text) {\n                    if(!template.config.showWeeknumbers) return;\n                    w('<div class=\"t-item t-week\">'+ text +'</div>');\n                }\n\n                function renderHead() {\n                    renderWeekCell('w');\n                    moment.weekdaysMin().forEach(function(f) {\n                        w('<div class=\"t-item t-weekday\">'+ f +'</div>');\n                    });\n                }\n\n                function renderBody(){\n                    var t = {\n                        unit: \"d\",\n                        date: options.date,\n                        end: moment(date).endOf(\"month\").endOf(\"isoWeek\"),\n                        start: moment(date).startOf(\"month\").startOf(\"isoWeek\"),\n                        week: null,\n                        today: moment(),\n                        current: null\n                    };\n\n                    t.current = moment(t.start);\n\n                    while(t.current < t.end) {\n                        if(t.week != t.current.isoWeek()) {\n                            if(t.week) w('</div>');\n                            w('<div class=\"t-week\">');\n                            \n                            t.week = t.current.isoWeek();\n                            renderWeekCell(t.week);\n                        }\n                        \n                        var item = createItem(t.current)\n                            .checkOther(t.unit)    \n                            .checkToday(t.unit)\n                            .checkActive(t.unit)\n                            .checkSelectable(t.unit);\n\n                        item.classes.push(\"t-day\");\n                        item.value = item.date.date();\n\n                        w('<div class=\"<%=item.classes.join(\" \")%>\" data-date=\"<%=t.current.format('YYYY-MM-DD')%>\"><%=item.value%></div>');\n                        t.current.add(1, t.unit);\n                    }\n                }\n            %>\n            <div class=\"t-days\">\n                <div class=\"t-head\">\n                    <div class=\"t-week\">\n                    <%\n                        renderHead();\n                    %>\n                    </div>\n                </div>\n                <div class=\"t-body\">\n                <% \n                    renderBody();\n                %>\n                </div>\n            </div>",
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
            template: "\n            <%\n                function renderDecades(){\n                    var amount = template.config.step.count / 2;\n\n                    var t = { \n                        unit: \"y\",\n                        date: options.date,\n                        end: moment(date).add(amount, \"Y\"),\n                        start: moment(date).add(-(amount), \"Y\"),\n                        next: null,\n                        current: null,\n                        today: moment()\n                    };\n    \n                    t.current = moment(t.start);\n\n                    while(t.current < t.end) {\n                        var item = createItem(t.current);\n                        item.value = t.current.year();\n                        item.classes.push(\"t-decade\");\n                    \n                        t.next = moment(t.current).add(10, \"y\");\n                        \n                        while(item.date <= t.next){\n                            item.checkToday(t.unit)\n                                .checkActive(t.unit)\n                                .checkSelectable(t.unit);\n                            item.date.add(1, t.unit);\n                        }\n\n                        item.classes =  resloveClasses(item.classes);\n\n                        w('<div class=\"<%=item.classes.join(\" \")%>\"><%=item.value +' - '+ t.next.year()%></div>');\n                        t.current = t.next.add(1, t.unit);\n                    }\n\n                    function resloveClasses(array){\n                        var hasEvent = array.indexOf(\"t-event\") > -1;\n                        return array.reduce(function (prev, curr) {\n                            if(hasEvent && curr == \"disabled\") return prev;\n                            return prev.indexOf(curr) < 0 ? prev.concat([curr]) : prev;\n                        }, []);\n                    }\n                }\n            %>\n            <div class=\"t-decades\">\n            <% \n                renderDecades();\n            %>\n            </div>",
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
            template: "\n            <%\n                function renderMonths(){\n                    var t = {\n                        unit: \"M\",\n                        date: options.date,\n                        today: moment(),\n                        current: moment(date).startOf(\"year\")\n                    };\n                    \n                    moment.monthsShort().forEach(function(m) {\n                        var item = createItem(t.current)\n                        .checkToday(t.unit)\n                        .checkActive(t.unit)\n                        .checkSelectable(t.unit);\n\n                        item.classes.push(\"t-month\");\n                        item.value = m;\n\n                        w('<div class=\"<%=item.classes.join(\" \")%>\"><%=item.value%></div>');\n                        t.current.add(1, t.unit);\n                    });\n                }\n            %>\n            <div class=\"t-months\">\n            <% \n                renderMonths();\n            %>\n            </div>",
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
            template: "\n            <%\n                function renderWeek(text) {\n                    if(!template.config.showWeeknumbers) return;\n                    w('<div class=\"t-item t-event t-week\">'+ text +'</div>');\n                }\n\n                function renderHead() {\n                    renderWeek('w');\n                    moment.weekdaysMin().forEach(function(f) {\n                        w('<div class=\"t-item t-weekday\">'+ f +'</div>');\n                    });\n                }\n\n                function renderBody() {\n                    var t = {\n                        unit: \"d\",\n                        date: options.date,\n                        end: moment(date).endOf(\"month\").endOf(\"isoWeek\"),\n                        start: moment(date).startOf(\"month\").startOf(\"isoWeek\"),\n                        week: null,\n                        today: moment(),\n                        current: null\n                    };\n\n                    t.current = moment(t.start);\n\n                    while(t.current < t.end) {\n                        if(t.week != t.current.isoWeek()) {\n                            if(t.week) w('</div>');\n\n                            w(t.current.isSame(options.date, \"week\") \n                                ? '<div class=\"t-week active\">'\n                                : '<div class=\"t-week\">'\n                            );\n\n                            t.week = t.current.isoWeek();\n                            renderWeek(t.week);\n                        }\n                        \n                        var item = createItem(t.current)\n                            .checkToday()\n                            .checkOther()\n                            .checkActive()\n                            .checkSelectable();\n\n                        item.classes.push(\"t-day\");\n                        item.value = item.date.date();\n\n                        w('<div class=\"<%=item.classes.join(\" \")%>\" data-date=\"<%=t.current.format('YYYY-MM-DD')%>\"><%=item.value%></div>');\n                        t.current.add(1, t.unit);\n                    }\n                }\n            %>\n            <div class=\"t-days t-weeks\">\n                <div class=\"t-head\">\n                    <div class=\"t-week\">\n                    <%\n                        renderHead();\n                    %>\n                    </div>\n                </div>\n                <div class=\"t-body\">\n                <% \n                    renderBody();\n                %>\n                </div>\n            </div>",
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
            template: "\n            <%\n                function renderYears(){\n                    var amount = template.config.step.count / 2;\n\n                    var t = {\n                        unit: \"y\",\n                        date: options.date,\n                        end: moment(date).add(amount, \"Y\"),\n                        start: moment(date).add(-(amount), \"Y\"),\n                        today: moment(),\n                        current: null\n                    };\n\n                    t.current = moment(t.start);\n\n                    while(t.current < t.end) {\n                        var item = createItem(t.current)\n                            .checkToday(t.unit)\n                            .checkActive(t.unit)\n                            .checkSelectable(t.unit);\n\n                        item.classes.push(\"t-year\");\n                        item.value = item.date.year();\n\n                        w('<div class=\"<%=item.classes.join(\" \")%>\"><%=item.value%></div>');\n                        t.current.add(1, t.unit);\n                    }\n                }\n            %>\n            <div class=\"t-years\">\n            <% \n                renderYears();\n            %>\n            </div>",
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
