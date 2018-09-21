module JSDatepicker.templates {
    export const months: ITemplate = {
        config: {
            name: "months",
            step: { unit: "y", count: 1 },
            headerFormat: "YYYY"
        },
        template: `
            <div class="t-months">
            <% 
                var t = {
                    today: moment(),
                    current: moment(date).startOf("year")
                };
                
                moment.monthsShort().forEach(function(m) {
                    var item = {
                        value: m,
                        classes: ["t-item", "t-month"]
                    };

                    if(t.current.isSame(t.today, "M")) item.classes.push("t-today");

                    w('<div class="'+ item.classes.join(" ") +'">'+ item.value +'</div>');
                    t.current.add(1, "M");
                });
            %>
            </div>`
    }
}