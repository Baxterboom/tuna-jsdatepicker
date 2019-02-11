module JSDatepicker.templates {
    export const decades: ITemplate = {
        config: {
            name: "decades",
            step: { unit: "y", count: 100 },
            headerFormat: "YYYY"
        },
        onRender: function (instance: DatePicker) {
            const config = this.config;

            function renderDecades() {
                const amount = config.step!.count / 2;
                const unit = "y";
                const date = instance.date;
                const end = moment(date).add(amount, unit);
                const start = moment(date).add(-(amount), unit);
                let next = null;
                let current = moment(start);
                const result: string[] = [];

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

                    result.push(`<div class="${item.classes.join(" ")}">${current.year()} - ${next.year()}</div>`);
                    current = next.add(1, unit);
                }

                function resolveClasses(array: any[]) {
                    var hasEvent = array.indexOf("t-event") > -1;
                    return array.reduce(function (prev, curr) {
                        if (hasEvent && curr == "disabled") return prev;
                        return prev.indexOf(curr) < 0 ? prev.concat([curr]) : prev;
                    }, []);
                }

                return result.join("");
            }

            return `<div class="t-decades" >${renderDecades()}</div>`;
        },
        onMounted: function (instance: DatePicker, element: JQuery) {
            const step = this.config.step;
            const picker = instance.picker;
            if (!step || !picker) return;

            const date = instance.date;
            const format = this.config.headerFormat;
            const amount = step.count / 2;
            const range = {
                start: moment(date).add(-(amount), step.unit).format(format),
                end: moment(date).add(amount + 9, step.unit).format(format)
            };

            picker.find(".t-nav.t-title").text(`${range.start} - ${range.end}`);

            const items = element.find(".t-event");
            items.on("click", (e) => {
                let value = 0;

                $(e.target).text().split(" - ").forEach(item => {
                    value += parseInt(item);
                });

                instance.date.year(value / 2);
            });
        }
    }
}