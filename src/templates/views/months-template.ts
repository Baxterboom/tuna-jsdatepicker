module JSDatepicker.templates {
    export const months: ITemplate = {
        config: {
            name: "months",
            step: { unit: "y", count: 1 },
            headerFormat: "YYYY"
        },
        template: `
            <%
                function renderMonths(){
                    var t = {
                        unit: "M",
                        date: options.date,
                        today: moment(),
                        current: moment(date).startOf("year")
                    };
                    
                    moment.monthsShort().forEach(function(m) {
                        var item = createItem(t.current)
                        .checkToday(t.unit)
                        .checkActive(t.unit)
                        .checkSelectable(t.unit);

                        item.classes.push("t-month");
                        item.value = m;

                        w('<div class="<%=item.classes.join(" ")%>"><%=item.value%></div>');
                        t.current.add(1, t.unit);
                    });
                }
            %>
            <div class="t-months">
            <% 
                renderMonths();
            %>
            </div>`,
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