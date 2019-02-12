module JSDatepicker.templates {
    export const years: ITemplate = {
        config: {
            name: "years",
            step: { unit: "y", count: 12 },
            headerFormat: "YYYY"
        },
        onRender: function (instance: DatePicker) {
            const amount = this.config.step!.count / 2 || 0;
            const options = instance.options;

            const unit = "y";
            const date = instance.date;
            const end = moment(date).add(amount, unit)
            const start = moment(date).add(-(amount), unit);
            const current = moment(start)
            const result = [""]

            while (current < end) {
                var item = instance.createItem(current)
                    .checkToday(unit)
                    .checkActive(unit)
                    .checkSelectable(unit);

                item.classes.push("t-year");

                result.push(`<div class="${item.classes.join(" ")}">${item.date.year()}</div>`);
                current.add(1, unit);
            }

            return `<div class="t-years">${result.join("")}</div>`;
        },
        onMounted: function (instance: DatePicker, element: JQuery) {
            const step = this.config.step;
            const picker = instance.picker;
            if (!step || !picker) return;

            const date = instance.date;
            const format = this.config.headerFormat;
            const amount = step.count / 2;
            const range = {
                end: moment(date).add(amount - 1, step.unit).format(format),
                start: moment(date).add(-(amount), step.unit).format(format)
            };

            picker.find(".t-head .t-nav .t-title").text(`${range.start} - ${range.end}`);

            const items = element.find(".t-event");
            items.on("click", (e) => {
                const target = $(e.target);
                const value = parseInt(target.text());
                instance.date.year(value);
            });
        }
    }
}