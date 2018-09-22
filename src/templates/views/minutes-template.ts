module JSDatepicker.templates {
    export const minutes: ITemplate = {
        config: {
            name: "minutes",
            step: { unit: "h", count: 1 },
            headerFormat: "YYYY MMMM DD"
        },
        template: `
            <div class="t-minutes">
            <% 
                var t = {
                    date: options.date,
                    end: moment(date).endOf("h"),
                    start: moment(date).startOf("h"),
                    today: moment(),
                    current: null
                };

                t.current = moment(t.start);
               
                while(t.current <= t.end) {
                    var item = {
                        next: moment(t.current).add(5, "m"),
                        value: t.current.format("mm"),
                        classes: ["t-item", "t-minute"]
                    };

                    if(t.date.isBetween(t.current, item.next, "m", "[]")) item.classes.push("active");
                    if(t.today.isBetween(t.current, item.next, "m", "[]")) item.classes.push("t-today");
                  
                    w('<div class="<%=item.classes.join(" ")%>"><%=item.value%></div>');
                    t.current = item.next;
                }
            %>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            const items = element.find(".t-item.t-minute");

            items.on("click", (e) => {
                const target = $(e.target);
                const value = parseInt(target.text());
                instance.date.set("m", value);
                instance.render();
            });
        }

    }
}