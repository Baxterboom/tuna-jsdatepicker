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
            <%
                w('<div class="t-item t-week">w</div>');

                moment.weekdaysMin().forEach(function(f) {
                    w('<div class="t-item t-weekday">'+ f +'</div>');
                });
            %>
                </div>
                <div class="t-body">
            <% 
                var t = {
                    end: moment(date).endOf("month").endOf("isoWeek"),
                    start: moment(date).startOf("month").startOf("isoWeek"),
                    week: null,
                    today: moment(),
                    current: null
                };

                t.current = moment(t.start);

                while(t.current < t.end) {
                    if(t.week != t.current.isoWeek()) {
                        w('<div class="t-item t-week">'+ (t.week = t.current.isoWeek()) +'</div>');
                    }
                    
                    var item = {
                        value: t.current.date(),
                        classes: ["t-item", "t-day"]
                    };

                    if(t.current.isSame(t.today, "d")) item.classes.push("t-today");

                    w('<div class="'+ item.classes.join(" ") +'">'+ item.value +'</div>');
                    t.current.add(1, "d");
                }
            %>
                </div>
            </div>`
    }
}