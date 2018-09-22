module JSDatepicker.templates {
    export const months: ITemplate = {
        config: {
            name: "months",
            step: { unit: "y", count: 1 },
            headerFormat: "YYYY"
        },
        template: `
            <div class="t-months">
            <% 
                var t = {
                    date: options.date,
                    today: moment(),
                    current: moment(date).startOf("year")
                };
                
                moment.monthsShort().forEach(function(m) {
                    var item = {
                        value: m,
                        classes: ["t-item", "t-month"]
                    };

                    if(t.current.isSame(t.date, "M")) item.classes.push("active");
                    if(t.current.isSame(t.today, "M")) item.classes.push("t-today");

                    w('<div class="<%=item.classes.join(" ")%>"><%=item.value%></div>');
                    t.current.add(1, "M");
                });
            %>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            const items = element.find(".t-item");

            items.on("click", (e) => {
                const target = $(e.target);
                const value = target.index();
                instance.date.month(value);
                instance.render();
            });
        }
    }
}