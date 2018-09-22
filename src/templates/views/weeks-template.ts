module JSDatepicker.templates {
    export const weeks: ITemplate = {
        config: {
            name: "weeks",
            step: { unit: "M", count: 1 },
            headerFormat: "MMMM YYYY"
        },
        template: `
            <div class="t-weeks">
            <% 
                var t = {
                    date: options.date,
                    end: moment(date).add(10, "w").startOf("M"),
                    start: moment(date).add(-11, "w").endOf("M"),
                    today: moment(),
                    current: null
                };

                t.current = moment(t.start);

                while(t.current < t.end) {
                    var item = {
                        value:  t.current.isoWeek(), 
                        classes: ["t-item", "t-week"]
                    };

                    if(t.current.isSame(t.date, "W")) item.classes.push("active");
                    if(t.current.isSame(t.today, "W")) item.classes.push("t-today");

                    w('<div class="<%=item.classes.join(" ")%>"><%=item.value%></div>');
                    t.current.add(1, "w");
                }
            %>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            const items = element.find(".t-item");

            items.on("click", (e) => {
                const target = $(e.target);
                const value = parseInt(target.text());
                instance.date = moment().day("Monday").week(value);
                instance.render();
            });
        }
    }
}