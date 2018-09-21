module JSDatepicker.templates {
    export const days: ITemplate = {
        config: {
            name: "days",
            step: { unit: "m", count: 1 },
            headerFormat: "MMMMM YYYY"
        },
        content: `
            <div class="t-days">
                <div class="t-head">
            <%
                w('<div class="t-item t-week">w</div>');

                moment.weekdaysMin().forEach(function(f){
                    w('<div class="t-item">'+ f +'</div>');
                });
            %>
                </div>
                <div class="t-body">
            <% 
                var date = options.date;

                var range = {
                    start: moment(date).startOf("month").startOf("isoWeek"),
                    end: moment(date).endOf("month").endOf("isoWeek")
                };

                var week = 0;
                var current = moment(range.start);
                while(current < range.end) {
                    if(week != current.isoWeek())
                    {
                        w('<div class="t-item t-week">'+ (week = current.isoWeek()) +'</div>');
                    }
                    
                    var today = current.isSame(date, "d")  ? "t-today" : "";
                    var classes = ["t-item", today];
                    w('<div class="'+ classes.join(" ") +'">'+ current.date() +'</div>');
                    current.add(1, "d");
                }
            %>
                </div>
            </div>`
    }
}