module JSDatepicker.templates {
    export const weeks: ITemplate = {
        config: {
            name: "weeks",
            step: { unit: "w", count: 1 },
            headerFormat: "W YYYY"
        },
        content: `
            <div class="t-weeks">
            <% 
                var date = options.date;
                var config = template.config;

                var range = {
                    start: moment(date).add(-6, config.step.unit),
                    end: moment(date).add(6, config.step.unit)
                };

                var current = moment(range.start);
                while(current < range.end) {
                    var today = current.isSame(date, "w") ? "t-today" : "";
                    var classes = ["t-item", today];
                    w('<div class="'+ classes.join(" ")+ '">'+ current.isoWeek() +'</div>');
                    current.add(1, "w");
                }
            %>
            </div>`
    }
}