module JSDatepicker.templates {

    export const weeks: ITemplate<IDaysTemplateConfig> = {
        config: {
            name: "weeks",
            step: { unit: "M", count: 1 },
            headerFormat: "MMMM YYYY",
            showWeeknumbers: true
        },
        template: `
            <%
                function renderWeek(text) {
                    if(!template.config.showWeeknumbers) return;
                    w('<div class="t-item t-event t-week">'+ text +'</div>');
                }

                function renderHead() {
                    renderWeek('w');
                    moment.weekdaysMin().forEach(function(f) {
                        w('<div class="t-item t-weekday">'+ f +'</div>');
                    });
                }

                function renderBody() {
                    var t = {
                        unit: "d",
                        date: options.date,
                        end: moment(date).endOf("month").endOf("isoWeek"),
                        start: moment(date).startOf("month").startOf("isoWeek"),
                        week: null,
                        today: moment(),
                        current: null
                    };

                    t.current = moment(t.start);

                    while(t.current < t.end) {
                        if(t.week != t.current.isoWeek()) {
                            if(t.week) w('</div>');

                            w(t.current.isSame(options.date, "week") 
                                ? '<div class="t-week active">'
                                : '<div class="t-week">'
                            );

                            t.week = t.current.isoWeek();
                            renderWeek(t.week);
                        }
                        
                        var item = createItem(t.current)
                            .checkToday(t.unit)
                            .checkOther(t.unit)
                            .checkActive(t.unit)
                            .checkSelectable(t.unit);

                        item.classes.push("t-day");
                        item.value = item.date.date();

                        w('<div class="<%=item.classes.join(" ")%>" data-date="<%=t.current.format('YYYY-MM-DD')%>"><%=item.value%></div>');
                        t.current.add(1, t.unit);
                    }
                }
            %>
            <div class="t-days t-weeks">
                <div class="t-head">
                    <div class="t-week">
                    <%
                        renderHead();
                    %>
                    </div>
                </div>
                <div class="t-body">
                <% 
                    renderBody();
                %>
                </div>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            const items = element.find(".t-event");
            items.on("click", (e) => {
                const target = $(e.target);
                const value = target.attr("data-date") || target.next().attr("data-date");
                instance.date = moment(value).startOf("isoWeek");
            });
        }
    }
}