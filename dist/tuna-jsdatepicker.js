"use strict";
var JSDatepicker;
(function (JSDatepicker) {
    var navigation;
    (function (navigation) {
        navigation[navigation["back"] = 0] = "back";
        navigation[navigation["forward"] = 1] = "forward";
    })(navigation = JSDatepicker.navigation || (JSDatepicker.navigation = {}));
    ;
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
    var DatePicker = /** @class */ (function () {
        function DatePicker(target, options) {
            this.options = options;
            this.cancelOutsideClickEventHandler = function () { };
            this.options = $.extend(DatePicker.options, this.options);
            this.date = moment(this.options.date);
            this.view = this.options.view || "days";
            this.input = $(target);
            this.element = JSDatepicker.templates.parse(JSDatepicker.templates.main, this);
            this.setupViews();
            this.setupElements();
        }
        ;
        DatePicker.prototype.setupElements = function () {
            var _this = this;
            this.input.after(this.element);
            this.input.addClass("t-input");
            this.input.on("click", function () { return _this.toggle(); });
            this.element.append(this.input);
        };
        DatePicker.prototype.setupViews = function () {
            var options = this.options;
            if (options.views.indexOf(options.view) < 0) {
                options.views.unshift(options.view); //if view is missing, add as start view
            }
        };
        DatePicker.prototype.go = function (nav) {
            var views = this.options.views;
            var index = views.indexOf(this.view);
            index += nav == navigation.forward ? 1 : -1;
            this.view = views[index] || this.options.view;
            this.render();
        };
        DatePicker.prototype.toggle = function (close) {
            return close || this.picker
                ? this.close()
                : this.render();
        };
        DatePicker.prototype.close = function () {
            if (this.picker) {
                this.picker.remove();
                this.picker = undefined;
            }
            this.cancelOutsideClickEventHandler();
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
        DatePicker.prototype.place = function (placement) {
            var _this = this;
            if (!this.picker)
                return;
            var offset = this.input.offset();
            var dimensions = (this.input.outerHeight() || 0) + 4;
            if (offset && !this.picker.closest(this.element).length) {
                this.picker.css({ top: offset.top + dimensions, left: offset.left });
            }
            this.cancelOutsideClickEventHandler = registerOutsideClickEventHandler(this.picker, function () { return _this.close(); });
        };
        DatePicker.prototype.render = function () {
            var _this = this;
            var target = this.options.placement ? $(this.options.placement) : this.element;
            if (!target.length)
                target = this.element;
            this.close();
            this.picker = JSDatepicker.templates.mount(JSDatepicker.templates.picker, this, target);
            this.picker.find(".t-item").on("click", function () {
                _this.notifyChange();
                if (!_this.isCurrentView())
                    _this.go(navigation.back);
            });
            this.place(target);
            return this.picker;
        };
        DatePicker.prototype.isCurrentView = function (view) {
            return this.view = view || this.options.view;
        };
        DatePicker.prototype.notifyChange = function () {
            var date = this.date;
            if (this.view === this.options.view) {
                this.options.date = date;
                this.input.val(moment(date).format(this.options.inputFormat));
                this.input.focus();
                if (this.options.onChange)
                    this.options.onChange(this.date, this.input);
                this.close();
            }
        };
        DatePicker.options = {
            view: "days",
            views: ["days", "months", "years", "decades"],
            dateFormat: moment.localeData().longDateFormat("L"),
            inputFormat: moment.localeData().longDateFormat("L"),
            showToday: true,
            showNavigator: false
        };
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
            template: "\n            <div class=\"t-foot\">\n            <%\n                if(options.showToday) w('<button class=\"t-today\">Today</button>');\n\n                if(options.showNavigator) {\n                    var items = \"\";\n\n                    options.views.forEach(function(item) {\n                        const selected = view == item ? \"selected\" : \"\";\n                        items += '<option class=\"t-nav t-view\" <%=selected%>><%=item%></option>';\n                    });  \n                    \n                    w('<select class=\"t-nav t-view\">');\n                    w(items);\n                    w('</select>');\n                }\n            %>\n            </div>",
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
                    instance.go(JSDatepicker.navigation.forward);
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
            template: "<div class=\"t-jsdatepicker\"></div>"
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
            template: "<div class=\"t-jsdatepicker-picker\"></div>",
            onMounted: function (instance, element) {
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
            template: "\n            <%\n                function renderWeekCell(text) {\n                    w(template.config.showWeeknumbers ?'<div class=\"t-item t-week\">'+ text +'</div>' : '');\n                }\n\n                function renderWeekdays() {\n                    renderWeekCell('w');\n\n                    moment.weekdaysMin().forEach(function(f) {\n                        w('<div class=\"t-item t-weekday\">'+ f +'</div>');\n                    });\n                }\n            %>\n            <div class=\"t-days\">\n                <div class=\"t-head\">\n                    <div class=\"t-week\">\n                    <%\n                        renderWeekdays();\n                    %>\n                    </div>\n                </div>\n                <div class=\"t-body\">\n                <% \n                    var t = {\n                        date: options.date,\n                        end: moment(date).endOf(\"month\").endOf(\"isoWeek\"),\n                        start: moment(date).startOf(\"month\").startOf(\"isoWeek\"),\n                        week: null,\n                        today: moment(),\n                        current: null\n                    };\n\n                    t.current = moment(t.start);\n\n                    while(t.current < t.end) {\n                        if(t.week != t.current.isoWeek()) {\n                            if(t.week) w('</div>');\n                            w('<div class=\"t-week\">');\n                            \n                            t.week = t.current.isoWeek();\n                            renderWeekCell(t.week);\n                        }\n                        \n                        var item = {\n                            value: t.current.date(),\n                            classes: [\"t-item\", \"t-day\"]\n                        };\n\n                        if(t.current.isSame(t.date, \"day\")) item.classes.push(\"active\");\n                        if(t.current.isSame(t.today, \"day\")) item.classes.push(\"t-today\");\n                        if(!t.current.isSame(date, \"month\")) item.classes.push(\"t-other\");\n                        w('<div class=\"<%=item.classes.join(\" \")%>\" data-date=\"<%=t.current.format('YYYY-MM-DD')%>\"><%=item.value%></div>');\n                        t.current.add(1, \"d\");\n                    }\n                %>\n                </div>\n            </div>",
            onMounted: function (instance, element) {
                var items = element.find(".t-body .t-day");
                items.on("click", function (e) {
                    var target = $(e.target);
                    var value = target.attr("data-date");
                    instance.date = moment(value);
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
        templates.decades = {
            config: {
                name: "decades",
                step: { unit: "y", count: 100 },
                headerFormat: "YYYY"
            },
            template: "\n            <div class=\"t-decades\">\n            <% \n                var amount = template.config.step.count / 2;\n\n                var t = { \n                    date: options.date,\n                    end: moment(date).add(amount, \"Y\"),\n                    start: moment(date).add(-(amount), \"Y\"),\n                    next: null,\n                    current: null,\n                    today: moment()\n                };\n\n                t.current = moment(t.start);\n\n                while(t.current < t.end) {\n                    var item = {\n                        value: t.current.year(),\n                        classes: [\"t-item\", \"t-year\"]\n                    };\n\n                    t.next = moment(t.current).add(10, \"y\");\n\n                    if(t.date.isBetween(t.current, t.next, \"Y\", \"[]\")) item.classes.push(\"active\");\n                    if(t.today.isBetween(t.current, t.next, \"Y\", \"[]\")) item.classes.push(\"t-today\");\n                    \n                    w('<div class=\"<%=item.classes.join(\" \")%>\"><%=item.value +' - '+ t.next.year()%></div>');\n                    t.current = t.next.add(1, \"y\");\n                }\n            %>\n            </div>",
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
                var items = element.find(".t-item");
                items.on("click", function (e) {
                    var value = 0;
                    var target = $(e.target);
                    target.text().split(" - ").forEach(function (item) {
                        value += parseInt(item);
                    });
                    instance.date.year(value / 2);
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
        templates.months = {
            config: {
                name: "months",
                step: { unit: "y", count: 1 },
                headerFormat: "YYYY"
            },
            template: "\n            <div class=\"t-months\">\n            <% \n                var t = {\n                    date: options.date,\n                    today: moment(),\n                    current: moment(date).startOf(\"year\")\n                };\n                \n                moment.monthsShort().forEach(function(m) {\n                    var item = {\n                        value: m,\n                        classes: [\"t-item\", \"t-month\"]\n                    };\n\n                    if(t.current.isSame(t.date, \"M\")) item.classes.push(\"active\");\n                    if(t.current.isSame(t.today, \"M\")) item.classes.push(\"t-today\");\n\n                    w('<div class=\"<%=item.classes.join(\" \")%>\"><%=item.value%></div>');\n                    t.current.add(1, \"M\");\n                });\n            %>\n            </div>",
            onMounted: function (instance, element) {
                var items = element.find(".t-item");
                items.on("click", function (e) {
                    var target = $(e.target);
                    var value = target.index();
                    instance.date.month(value);
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
        templates.weeks = {
            config: {
                name: "weeks",
                step: { unit: "M", count: 1 },
                headerFormat: "MMMM YYYY",
                showWeeknumbers: true
            },
            template: "\n            <%\n                function renderWeekCell(text) {\n                    w(template.config.showWeeknumbers ?'<div class=\"t-item t-week\">'+ text +'</div>' : '');\n                }\n\n                function renderWeekdays() {\n                    renderWeekCell('w');\n\n                    moment.weekdaysMin().forEach(function(f) {\n                        w('<div class=\"t-item t-weekday\">'+ f +'</div>');\n                    });\n                }\n            %>\n            <div class=\"t-days t-weeks\">\n                <div class=\"t-head\">\n                    <div class=\"t-week\">\n                    <%\n                        renderWeekdays();\n                    %>\n                    </div>\n                </div>\n                <div class=\"t-body\">\n                <% \n                    var t = {\n                        date: options.date,\n                        end: moment(date).endOf(\"month\").endOf(\"isoWeek\"),\n                        start: moment(date).startOf(\"month\").startOf(\"isoWeek\"),\n                        week: null,\n                        today: moment(),\n                        current: null\n                    };\n\n                    t.current = moment(t.start);\n\n                    while(t.current < t.end) {\n                        if(t.week != t.current.isoWeek()) {\n                            if(t.week) w('</div>');\n\n                            w(t.current.isSame(options.date, \"week\") \n                                ? '<div class=\"t-week active\">'\n                                : '<div class=\"t-week\">'\n                            );\n\n                            t.week = t.current.isoWeek();\n                            renderWeekCell(t.week);\n                        }\n                        \n                        var item = {\n                            value: t.current.date(),\n                            classes: [\"t-item\", \"t-day\"]\n                        };\n\n                        if(t.current.isSame(t.date, \"day\")) item.classes.push(\"active\");\n                        if(t.current.isSame(t.today, \"day\")) item.classes.push(\"t-today\");\n                        if(!t.current.isSame(date, \"month\")) item.classes.push(\"t-other\");\n                        w('<div class=\"<%=item.classes.join(\" \")%>\" data-date=\"<%=t.current.format('YYYY-MM-DD')%>\"><%=item.value%></div>');\n                        t.current.add(1, \"d\");\n                    }\n                %>\n                </div>\n            </div>",
            onMounted: function (instance, element) {
                var items = element.find(".t-body .t-day");
                items.on("click", function (e) {
                    var target = $(e.target);
                    var value = target.attr("data-date");
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
            template: "\n            <div class=\"t-years\">\n            <% \n                var amount = template.config.step.count / 2;\n\n                var t = {\n                    date: options.date,\n                    end: moment(date).add(amount, \"Y\"),\n                    start: moment(date).add(-(amount), \"Y\"),\n                    today: moment(),\n                    current: null\n                };\n\n                t.current = moment(t.start);\n\n                while(t.current < t.end) {\n                    var item = {\n                        value:  t.current.year(), \n                        classes: [\"t-item\", \"t-year\"]\n                    };\n\n                    if(t.current.isSame(t.date, \"d\")) item.classes.push(\"active\");\n                    if(t.current.isSame(t.today, \"Y\")) item.classes.push(\"t-today\");\n\n                    w('<div class=\"<%=item.classes.join(\" \")%>\"><%=item.value%></div>');\n                    t.current.add(1, \"y\");\n                }\n            %>\n            </div>",
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
                var items = element.find(".t-item");
                items.on("click", function (e) {
                    var target = $(e.target);
                    var value = parseInt(target.text());
                    instance.date.year(value);
                    instance.render();
                });
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
