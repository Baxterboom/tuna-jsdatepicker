module JSDatepicker.templates {
    export const weeks: ITemplate = {
        config: {
            name: "weeks",
            step: { unit: "M", count: 1 },
            headerFormat: "W MMMM YYYY"
        },
        template: `
            <div class="t-weeks">
            <% 
                var t = {
                    end: moment(date).add(8, "w"),
                    start: moment(date).add(-8, "w"),
                    today: moment(),
                    current: null
                };

                t.current = moment(t.start);

                while(t.current < t.end) {
                    var item = {
                        value:  t.current.isoWeek(), 
                        classes: ["t-item", "t-week"]
                    };

                    if(t.current.isSame(t.today, "W")) item.classes.push("t-today");

                    w('<div class="'+ item.classes.join(" ")+ '">'+ item.value +'</div>');
                    t.current.add(1, "w");
                }
            %>
            </div>`
    }
}