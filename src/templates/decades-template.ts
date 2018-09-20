module JSDatepicker.templates {
    export const decades: ITemplate = {
        config: {
            name: "decades",
            step: { unit: "Y", count: 100 },
            headerFormat: "YYYY YYYY"
        },
        content: `
        <div class="t-decades">
        <% 
            var step = 100/2 + 9;    
            var date = options.date;

            var range = { 
                start: moment(date).add(-step, "Y"),
                end: moment(date).add(step, "Y")
            };

            var current = moment(range.start);
            while(current < range.end) {
                var next = moment(current).add(10, "y");
                var today = date.isBetween(current, next, "Y") ? "today" : "";
                var classes = ["t-item", today];
                w('<div class="'+ classes.join(" ")+ '">'+ current.year() +' - '+ next.year() + '</div>');
                current = next;
            }
        %>
        </div>`
    }
}