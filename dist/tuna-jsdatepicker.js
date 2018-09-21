"use strict";
var JSDatepicker;
(function (JSDatepicker) {
    var navigation;
    (function (navigation) {
        navigation[navigation["back"] = 0] = "back";
        navigation[navigation["forward"] = 1] = "forward";
    })(navigation = JSDatepicker.navigation || (JSDatepicker.navigation = {}));
    ;
    var DatePicker = /** @class */ (function () {
        function DatePicker(target, options) {
            this.options = options;
            this.options = $.extend(this.options, DatePicker.options, options);
            this.date = moment(this.options.date);
            this.view = this.options.view || "days";
            this.input = $(target);
            this.input.wrap(JSDatepicker.templates.parse(JSDatepicker.templates.main, this));
            this.element = JSDatepicker.templates.mount(JSDatepicker.templates.main, this, this.input.parent());
            this.input.addClass("t-input").appendTo(this.element);
            this.render();
        }
        ;
        DatePicker.prototype.step = function (config, forward) {
            if (!config.step)
                return;
            var step = config.step;
            var count = step.count;
            var amount = forward ? count : -(count);
            this.date = moment(this.date).add(amount, step.unit);
            this.render();
        };
        DatePicker.prototype.go = function (nav) {
            var views = this.options.views;
            var index = views.indexOf(this.view);
            index += nav == navigation.forward ? 1 : -1;
            this.view = views[index] || this.options.view;
            this.render();
        };
        DatePicker.prototype.render = function () {
            var _this = this;
            console.time("render");
            JSDatepicker.templates.mount(JSDatepicker.templates.picker, this, this.element)
                .find(".t-item").on("click", function () {
                _this.notifyChange();
                _this.go(navigation.back);
            });
            console.timeEnd("render");
        };
        DatePicker.prototype.notifyChange = function () {
            var date = this.date;
            this.options.date = date;
            this.input.val(moment(date).format(this.options.inputFormat));
            if (this.view != this.options.view || !this.options.onChange)
                return;
            this.options.onChange(this.date, this.input);
        };
        DatePicker.options = {
            view: "days",
            views: ["time", "days", "weeks", "months", "years", "decades"],
            dateFormat: moment.localeData().longDateFormat("L"),
            inputFormat: moment.localeData().longDateFormat("L")
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
        templates.days = {
            config: {
                name: "days",
                step: { unit: "M", count: 1 },
                headerFormat: "MMMM YYYY"
            },
            template: "\n            <div class=\"t-days\">\n                <div class=\"t-head\">\n            <%\n                w('<div class=\"t-item t-week\">w</div>');\n\n                moment.weekdaysMin().forEach(function(f) {\n                    w('<div class=\"t-item t-weekday\">'+ f +'</div>');\n                });\n            %>\n                </div>\n                <div class=\"t-body\">\n            <% \n                var t = {\n                    end: moment(date).endOf(\"month\").endOf(\"isoWeek\"),\n                    start: moment(date).startOf(\"month\").startOf(\"isoWeek\"),\n                    week: null,\n                    today: moment(),\n                    current: null\n                };\n\n                t.current = moment(t.start);\n\n                while(t.current < t.end) {\n                    if(t.week != t.current.isoWeek()) {\n                        w('<div class=\"t-item t-week\">'+ (t.week = t.current.isoWeek()) +'</div>');\n                    }\n                    \n                    var item = {\n                        value: t.current.date(),\n                        classes: [\"t-item\", \"t-day\"]\n                    };\n\n                    if(t.current.isSame(t.today, \"d\")) item.classes.push(\"t-today\");\n\n                    w('<div class=\"'+ item.classes.join(\" \") +'\">'+ item.value +'</div>');\n                    t.current.add(1, \"d\");\n                }\n            %>\n                </div>\n            </div>"
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
            template: "\n            <div class=\"t-decades\">\n            <% \n                var amount = template.config.step.count / 2;\n\n                var t = { \n                    end: moment(date).add(amount, \"Y\"),\n                    start: moment(date).add(-(amount), \"Y\"),\n                    next: null,\n                    current: null,\n                    today: moment()\n                };\n\n                t.current = moment(t.start);\n\n                while(t.current < t.end) {\n                    var item = {\n                        value: t.current.year(),\n                        classes: [\"t-item\", \"t-year\"]\n                    };\n\n                    t.next = moment(t.current).add(11, \"y\");\n                    if(t.today.isBetween(t.current, t.next, \"Y\", \"[]\")) item.classes.push(\"t-today\");\n                    \n                    w('<div class=\"'+ item.classes.join(\" \")+ '\">'+ item.value +' - '+ t.next.year() + '</div>');\n                    t.current = t.next;\n                }\n            %>\n            </div>",
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
                    end: moment(date).add(amount, step.unit).format(format)
                };
                picker.find(".t-action").text(range.start + " - " + range.end);
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
                name: "head"
            },
            template: "\n            <div class=\"t-head\">\n                <button class=\"t-prev\"></button>\n                <button class=\"t-action\"><%=date.format(template.config.headerFormat)%></button>\n                <button class=\"t-next\"></button>\n            </div>",
            onMounted: function (instance, element) {
                var _this = this;
                element.find("button.t-prev, button.t-next").on("click", function (e) {
                    var b = $(e.target);
                    instance.step(_this.config, b.hasClass("t-next"));
                });
                element.find(".t-item").on("click", function (e) {
                    instance.go(JSDatepicker.navigation.back);
                });
                element.find("button.t-action").on("click", function (e) {
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
        templates.months = {
            config: {
                name: "months",
                step: { unit: "y", count: 1 },
                headerFormat: "YYYY"
            },
            template: "\n            <div class=\"t-months\">\n            <% \n                var t = {\n                    today: moment(),\n                    current: moment(date).startOf(\"year\")\n                };\n                \n                moment.monthsShort().forEach(function(m) {\n                    var item = {\n                        value: m,\n                        classes: [\"t-item\", \"t-month\"]\n                    };\n\n                    if(t.current.isSame(t.today, \"M\")) item.classes.push(\"t-today\");\n\n                    w('<div class=\"'+ item.classes.join(\" \") +'\">'+ item.value +'</div>');\n                    t.current.add(1, \"M\");\n                });\n            %>\n            </div>"
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
            template: "<div class=\"t-jsdatepicker t-picker\"></div>",
            onMounted: function (instance, element) {
                if (instance.picker)
                    instance.picker.remove();
                instance.picker = element;
                var t = templates;
                var view = instance.view;
                var template = t[view];
                var head = $.extend({}, templates.head);
                $.extend(head.config, template.config, head.config);
                templates.mount(head, instance, element);
                templates.mount(template, instance, element);
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.time = {
            config: {
                name: "time",
                step: { unit: "h", count: 1 },
                headerFormat: "YYYY MMMM DD"
            },
            template: "\n            <div class=\"t-time\">\n            <% \n                var t = {\n                    end: moment(date).endOf(\"d\"),\n                    start: moment(date).startOf(\"d\"),\n                    today: moment(),\n                    current: null\n                };\n\n                t.current = moment(t.start);\n               \n                while(t.current <= t.end) {\n                    var item = {\n                        next: moment(t.current).add(15, \"m\"),\n                        value: t.current.format(\"HH:mm\"),\n                        classes: [\"t-item\", \"t-hours\"]\n                    };\n\n                    if(t.today.isBetween(t.current, item.next, \"HH:mm\", \"[]\")) item.classes.push(\"t-today\");\n                  \n                    w('<div class=\"'+ item.classes.join(\" \")+ '\">'+ item.value +'</div>');\n                    t.current = item.next;\n                }\n            %>\n            </div>"
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
                headerFormat: "W MMMM YYYY"
            },
            template: "\n            <div class=\"t-weeks\">\n            <% \n                var t = {\n                    end: moment(date).add(8, \"w\"),\n                    start: moment(date).add(-8, \"w\"),\n                    today: moment(),\n                    current: null\n                };\n\n                t.current = moment(t.start);\n\n                while(t.current < t.end) {\n                    var item = {\n                        value:  t.current.isoWeek(), \n                        classes: [\"t-item\", \"t-week\"]\n                    };\n\n                    if(t.current.isSame(t.today, \"W\")) item.classes.push(\"t-today\");\n\n                    w('<div class=\"'+ item.classes.join(\" \")+ '\">'+ item.value +'</div>');\n                    t.current.add(1, \"w\");\n                }\n            %>\n            </div>"
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
            template: "\n            <div class=\"t-years\">\n            <% \n                var amount = template.config.step.count / 2;\n\n                var t = {\n                    end: moment(date).add(amount, \"Y\"),\n                    start: moment(date).add(-(amount), \"Y\"),\n                    today: moment(),\n                    current: null\n                };\n\n                t.current = moment(t.start);\n\n                while(t.current < t.end) {\n                    var item = {\n                        value:  t.current.year(), \n                        classes: [\"t-item\", \"t-year\"]\n                    };\n\n                    if(t.current.isSame(t.today, \"Y\")) item.classes.push(\"t-today\");\n\n                    w('<div class=\"'+ item.classes.join(\" \")+ '\">'+ item.value +'</div>');\n                    t.current.add(1, \"y\");\n                }\n            %>\n            </div>",
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
                picker.find(".t-action").text(range.start + " - " + range.end);
            }
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
