module JSDatepicker.templates {

    export const weeks: ITemplate<IDaysTemplateConfig> = {
        config: {
            name: "weeks",
            step: { unit: "M", count: 1 },
            headerFormat: "MMMM YYYY",
            showWeeknumbers: true
        },
        onRender: function (instance: DatePicker) {
            const config = this.config;
            const options = instance.options;

            function renderWeek(text: string | number) {
                return config.showWeeknumbers ? `<div class="t-item t-event t-week">${text}</div>` : ``
            }

            function renderHead() {
                const result = [renderWeek('w')];
                moment.weekdaysMin().forEach(function (f) {
                    result.push('<div class="t-item t-weekday">' + f + '</div>');
                });
                return result.join("");
            }

            function renderBody() {
                let week = 0;
                const unit = "d";
                const date = instance.date;
                const end = moment(date).endOf("month").endOf("isoWeek");
                const start = moment(date).startOf("month").startOf("isoWeek");
                const current = moment(start);
                const result: string[] = [];

                while (current < end) {
                    if (week != current.isoWeek()) {
                        if (week) result.push('</div>');

                        result.push(current.isSame(options.date, "week")
                            ? '<div class="t-week active">'
                            : '<div class="t-week">'
                        );

                        week = current.isoWeek();
                        result.push(renderWeek(week));
                    }

                    var item = instance.createItem(current)
                        .checkToday(unit)
                        .checkOther()
                        .checkActive(unit)
                        .checkSelectable(unit);

                    item.classes.push("t-day");

                    result.push(`<div class="${item.classes.join(" ")}" data-date="${current.format('YYYY-MM-DD')}">${item.date.date()}</div>`);
                    current.add(1, unit);
                }

                return result.join("");
            }

            return `
                <div class= "t-days t-weeks">
                    <div class="t-head">
                        <div class="t-week">${renderHead()}</div>
                    </div>
                    <div class= "t-body">${renderBody()}</div>
                </div>`;
        },
        onMounted: function (instance: DatePicker, element: JQuery) {
            const items = element.find(".t-event");
            items.on("click", (e) => {
                const target = $(e.target);
                const value = target.attr("data-date") || target.next().attr("data-date");
                instance.date = moment(value).startOf("isoWeek");
            });
        }
    }
}