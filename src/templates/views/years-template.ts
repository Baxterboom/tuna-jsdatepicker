module JSDatepicker.templates {
    export const years: ITemplate = {
        config: {
            name: "years",
            step: { unit: "y", count: 12 },
            headerFormat: "YYYY"
        },
        template: `
            <%
                function renderYears(){
                    var amount = template.config.step.count / 2;

                    var t = {
                        date: options.date,
                        end: moment(date).add(amount, "Y"),
                        start: moment(date).add(-(amount), "Y"),
                        today: moment(),
                        current: null
                    };

                    t.current = moment(t.start);

                    while(t.current < t.end) {
                        var item = createItem(t.current)
                            .checkToday()
                            .checkActive()
                            .checkSelectable();

                        item.classes.push("t-year");

                        w('<div class="<%=item.classes.join(" ")%>"><%=item.date.year()%></div>');
                        t.current.add(1, "y");
                    }
                }
            %>
            <div class="t-years">
            <% 
                renderYears();
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