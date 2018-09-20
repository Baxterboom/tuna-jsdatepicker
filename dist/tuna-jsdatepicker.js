"use strict";
var JSDatepicker;
(function (JSDatepicker) {
    function create(target, options) {
        return new DatePicker(target, options);
    }
    JSDatepicker.create = create;
    var DatePicker = /** @class */ (function () {
        function DatePicker(target, options) {
        }
        ;
        return DatePicker;
    }());
})(JSDatepicker || (JSDatepicker = {}));
var JSDatepicker;
(function (JSDatepicker) {
    var templates;
    (function (templates) {
        templates.days = {
            config: {
                name: "days",
                step: { unit: "m", count: 1 },
                headerFormat: "MMMMM YYYY"
            },
            content: "\n            <div class=\"t-days\">\n                <div class=\"t-head\">\n            <%\n                var headings = [\"w\"].concat(moment.weekdaysMin());\n                headings.forEach(function(f){\n                    w('<div class=\"t-item\">'+ f +'</div>');\n                });\n            %>\n                </div>\n                <div class=\"t-body\">\n            <% \n                var date = options.date;\n\n                var range = {\n                    start: moment(date).startOf(\"month\").startOf(\"isoWeek\"),\n                    end: moment(date).endOf(\"month\").endOf(\"isoWeek\")\n                };\n\n                var week = 0;\n                var current = moment(range.start);\n                while(current < range.end) {\n                    if(week != current.isoWeek())\n                    {\n                        week = current.isoWeek();\n                        w('<div class=\"t-item\">'+ week +'</div>');\n                            \n                    }\n                    var today = current.isSame(date, \"d\")  ? \"today\" : \"\";\n                    var classes = [\"t-item\", today];\n                    w('<div class=\"'+ classes.join(\" \") +'\">'+ current.date() +'</div>');\n                    current.add(1, \"d\");\n                }\n            %>\n                </div>\n            </div>"
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
                step: { unit: "Y", count: 100 },
                headerFormat: "YYYY YYYY"
            },
            content: "\n        <div class=\"t-decades\">\n        <% \n            var step = 100/2 + 9;    \n            var date = options.date;\n\n            var range = { \n                start: moment(date).add(-step, \"Y\"),\n                end: moment(date).add(step, \"Y\")\n            };\n\n            var current = moment(range.start);\n            while(current < range.end) {\n                var next = moment(current).add(10, \"y\");\n                var today = date.isBetween(current, next, \"Y\") ? \"today\" : \"\";\n                var classes = [\"t-item\", today];\n                w('<div class=\"'+ classes.join(\" \")+ '\">'+ current.year() +' - '+ next.year() + '</div>');\n                current = next;\n            }\n        %>\n        </div>"
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
                step: { unit: "M", count: 1 },
                headerFormat: "MMMMM YYYY"
            },
            content: "\n            <% \n                var date = options.date;\n            %>\n            <div class=\"t-head\">\n                <button class=\"t-prev\"></button>\n                <div class=\"t-title\"><%=date.format(config.headerFormat)%></div>\n                <button class=\"t-next\"></button>\n            </div>"
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
            content: "\n            <div class=\"t-months\">\n            <% \n                var date = options.date;\n                var current = moment().startOf(\"year\");\n                moment.monthsShort().forEach(function(month) {\n                    var today = current.isSame(date, \"M\") ? \"today\" : \"\";\n                    var classes = [\"t-item\", today];\n                    w('<div class=\"'+ classes.join(\" \") +'\">'+ month +'</div>');\n                    current.add(1, \"M\");\n                });\n            %>\n            </div>"
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
                step: { unit: "H", count: 1 },
                headerFormat: "YYYY MMMMM DD"
            },
            content: "\n            <div class=\"t-time\">\n            <% \n                var date = options.date;\n\n                var range = {\n                    start: moment(date).startOf(\"d\"),\n                    end: moment(date).endOf(\"d\")\n                };\n\n                var current = moment(range.start);\n                while(current <= range.end) {\n                    var next = moment(current).add(15, \"m\");\n                    var today = date.isBetween(current, next, \"HH:mm\") ? \"today\" : \"\";\n                    var classes = [\"t-item\", today];\n                    w('<div class=\"'+ classes.join(\" \")+ '\">'+ current.format(\"HH:mm\") +'</div>');\n                    current = next;\n                }\n            %>\n            </div>"
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
                step: { unit: "w", count: 1 },
                headerFormat: "W YYYY"
            },
            content: "\n            <div class=\"t-weeks\">\n            <% \n                var date = options.date;\n\n                var range = {\n                    start: moment(date).add(-6, config.step.unit),\n                    end: moment(date).add(6, config.step.unit)\n                };\n\n                var current = moment(range.start);\n                while(current < range.end) {\n                    var today = current.isSame(date, \"w\") ? \"today\" : \"\";\n                    var classes = [\"t-item\", today];\n                    w('<div class=\"'+ classes.join(\" \")+ '\">'+ current.isoWeek() +'</div>');\n                    current.add(1, \"w\");\n                }\n            %>\n            </div>"
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
                step: { unit: "y", count: 10 },
                headerFormat: "YYYY - YYYY"
            },
            content: "\n            <div class=\"t-years\">\n            <% \n                var date = options.date;\n                \n                var range = {\n                    start: moment(date).add(-6, config.step.unit),\n                    end: moment(date).add(6, config.step.unit)\n                };\n\n                var current = moment(range.start);\n                while(current < range.end) {\n                    var today = current.isSame(date, \"y\") ? \"today\" : \"\";\n                    var classes = [\"t-item\", today];\n                    w('<div class=\"'+ classes.join(\" \")+ '\">'+ current.year() +'</div>');\n                    current.add(1, \"y\");\n                }\n            %>\n            </div>"
        };
    })(templates = JSDatepicker.templates || (JSDatepicker.templates = {}));
})(JSDatepicker || (JSDatepicker = {}));
