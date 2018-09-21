module JSDatepicker.templates {
    export const years: ITemplate = {
        config: {
            name: "years",
            step: { unit: "y", count: 10 },
            headerFormat: "YYYY - YYYY"
        },
        content: `
            <div class="t-years">
            <% 
                var date = options.date;
                var config = template.config;
                
                var range = {
                    start: moment(date).add(-6, config.step.unit),
                    end: moment(date).add(6, config.step.unit)
                };

                var current = moment(range.start);
                while(current < range.end) {
                    var today = current.isSame(date, "y") ? "t-today" : "";
                    var classes = ["t-item", today];
                    w('<div class="'+ classes.join(" ")+ '">'+ current.year() +'</div>');
                    current.add(1, "y");
                }
            %>
            </div>`
    }
}