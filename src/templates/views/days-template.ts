module JSDatepicker.templates {
    export const days: ITemplate = {
        config: {
            name: "days",
            step: { unit: "M", count: 1 },
            headerFormat: "MMMM YYYY"
        },
        template: `
            <div class="t-days">
                <div class="t-head">
                    <div class="t-week">
            <%
                w('<div class="t-item t-week">w</div>');

                moment.weekdaysMin().forEach(function(f) {
                    w('<div class="t-item t-weekday">'+ f +'</div>');
                });
            %>
                    </div>
                </div>
                <div class="t-body">
            <% 
                var t = {
                    date: options.date,
                    end: moment(date).endOf("month").endOf("isoWeek"),
                    start: moment(date).startOf("month").startOf("isoWeek"),
                    week: null,
                    today: moment(),
                    current: null
                };

                t.current = moment(t.start);

                function isSame(m1, m2) {
                    return moment(m1).startOf("d").isSame(moment(m2).startOf("d"));
                }

                while(t.current < t.end) {
                    if(t.week != t.current.isoWeek()) {
                        if(t.week) w('</div>');
                        w('<div class="t-week">');
                        w('<div class="t-item t-week"><%=(t.week = t.current.isoWeek())%></div>');
                    }
                    
                    var item = {
                        value: t.current.date(),
                        classes: ["t-item", "t-day"]
                    };

                    if(isSame(t.current, options.date)) item.classes.push("active");
                    if(isSame(t.current, t.today)) item.classes.push("t-today");

                    w('<div class="<%=item.classes.join(" ")%>"><%=item.value%></div>');
                    t.current.add(1, "d");
                }
            %>
                </div>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            const items = element.find(".t-body .t-item");

            items.on("click", (e) => {
                const target = $(e.target);
                const value = parseInt(target.text());
                instance.date.set("date", value);
                instance.render();
            });
        }
    }
}