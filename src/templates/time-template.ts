module JSDatepicker.templates {
    export const time: ITemplate = {
        config: {
            name: "time",
            step: { unit: "h", count: 1 },
            headerFormat: "YYYY MMMM DD"
        },
        template: `
            <div class="t-time">
            <% 
                var t = {
                    end: moment(date).endOf("d"),
                    start: moment(date).startOf("d"),
                    today: moment(),
                    current: null
                };

                t.current = moment(t.start);
               
                while(t.current <= t.end) {
                    var item = {
                        next: moment(t.current).add(15, "m"),
                        value: t.current.format("HH:mm"),
                        classes: ["t-item", "t-hours"]
                    };

                    if(t.today.isBetween(t.current, item.next, "HH:mm", "[]")) item.classes.push("t-today");
                  
                    w('<div class="'+ item.classes.join(" ")+ '">'+ item.value +'</div>');
                    t.current = item.next;
                }
            %>
            </div>`
    }
}