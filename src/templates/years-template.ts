module JSDatepicker.templates {
    export const years: ITemplate = {
        config: {
            name: "years",
            step: { unit: "y", count: 12 },
            headerFormat: "YYYY"
        },
        template: `
            <div class="t-years">
            <% 
                var amount = template.config.step.count / 2;

                var t = {
                    end: moment(date).add(amount, "Y"),
                    start: moment(date).add(-(amount), "Y"),
                    today: moment(),
                    current: null
                };

                t.current = moment(t.start);

                while(t.current < t.end) {
                    var item = {
                        value:  t.current.year(), 
                        classes: ["t-item", "t-year"]
                    };

                    if(t.current.isSame(t.today, "Y")) item.classes.push("t-today");

                    w('<div class="'+ item.classes.join(" ")+ '">'+ item.value +'</div>');
                    t.current.add(1, "y");
                }
            %>
            </div>`,
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

            picker.find(".t-action").text(`${range.start} - ${range.end}`);
        }
    }
}