module JSDatepicker.templates {
    export const months: ITemplate = {
        config: {
            name: "months",
            step: { unit: "y", count: 1 },
            headerFormat: "YYYY"
        },
        onRender: function (instance: DatePicker) {
            const unit = "M";
            const date = instance.date;
            const current = moment(date).startOf("year");
            const result: string[] = [];

            moment.monthsShort().forEach(function (m) {
                var item = instance.createItem(current)
                    .checkToday(unit)
                    .checkActive(unit)
                    .checkSelectable(unit);

                item.classes.push("t-month");

                result.push(`<div class="${item.classes.join(" ")}">${m}</div>`);
                current.add(1, unit);
            });

            return `<div class="t-months">${result.join("")}</div>`;
        },
        onMounted: function (instance: DatePicker, element: JQuery) {
            const items = element.find(".t-event");
            items.on("click", (e) => {
                const target = $(e.target);
                const value = target.index();
                instance.date.month(value);
            });
        }
    }
}