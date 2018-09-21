module JSDatepicker.templates {
    export const months: ITemplate = {
        config: {
            name: "months",
            step: { unit: "y", count: 1 },
            headerFormat: "YYYY"
        },
        content: `
            <div class="t-months">
            <% 
                var date = options.date;
                var current = moment().startOf("year");
                moment.monthsShort().forEach(function(month) {
                    var today = current.isSame(date, "M") ? "t-today" : "";
                    var classes = ["t-item", today];
                    w('<div class="'+ classes.join(" ") +'">'+ month +'</div>');
                    current.add(1, "M");
                });
            %>
            </div>`
    }
}