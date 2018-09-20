module JSDatepicker.templates {
    export const time: ITemplate = {
        config: {
            name: "times",
            step: { unit: "H", count: 1 },
            headerFormat: "YYYY MMMMM DD"
        },
        content: `
            <div class="t-times">
            <% 
                var date = options.date;

                var range = {
                    start: moment(date).startOf("d"),
                    end: moment(date).endOf("d")
                };

                var current = moment(range.start);
                while(current <= range.end) {
                    var next = moment(current).add(15, "m");
                    var today = date.isBetween(current, next, "HH:mm") ? "today" : "";
                    var classes = ["t-item", today];
                    w('<div class="'+ classes.join(" ")+ '">'+ current.format("HH:mm") +'</div>');
                    current = next;
                }
            %>
            </div>`
    }
}