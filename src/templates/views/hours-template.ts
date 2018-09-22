module JSDatepicker.templates {
    export const hours: ITemplate = {
        config: {
            name: "hours",
            headerFormat: "YYYY MMMM DD"
        },
        template: `
            <div class="t-hours">
            <% 
                var t = {
                    date: options.date,
                    end: moment(date).endOf("d"),
                    start: moment(date).startOf("d"),
                    today: moment(),
                    current: null
                };

                t.current = moment(t.start);
               
                while(t.current <= t.end) {
                    var item = {
                        next: moment(t.current).add(1, "H"),
                        value: t.current.format("HH"),
                        classes: ["t-item", "t-hour"]
                    };

                    if(t.date.isBetween(t.current, item.next, "H", "[]")) item.classes.push("active");
                    if(t.today.isBetween(t.current, item.next, "H", "[]")) item.classes.push("t-today");
                  
                    w('<div class="<%=item.classes.join(" ")%>"><%=item.value%></div>');
                    t.current = item.next;
                }
            %>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            const items = element.find(".t-item.t-hour");

            items.on("click", (e) => {
                const target = $(e.target);
                const value = parseInt(target.text());
                instance.date.set("h", value);
                instance.render();
            });
        }
    }
}