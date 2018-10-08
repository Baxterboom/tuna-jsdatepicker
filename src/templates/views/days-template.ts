module JSDatepicker.templates {

    export interface IDaysTemplateConfig extends IConfig {
        showWeeknumbers: boolean;
    }

    export const days: ITemplate<IDaysTemplateConfig> = {
        config: {
            name: "days",
            step: { unit: "M", count: 1 },
            headerFormat: "MMMM YYYY",
            showWeeknumbers: true
        },
        template: `
            <%
                function renderWeekCell(text) {
                    if(!template.config.showWeeknumbers) return;
                    w('<div class="t-item t-week">'+ text +'</div>');
                }

                function renderHead() {
                    renderWeekCell('w');
                    moment.weekdaysMin().forEach(function(f) {
                        w('<div class="t-item t-weekday">'+ f +'</div>');
                    });
                }

                function renderBody(){
                    var t = {
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
                            w('<div class="t-week">');
                            
                            t.week = t.current.isoWeek();
                            renderWeekCell(t.week);
                        }
                        
                        var item = createItem(t.current)
                            .checkToday()
                            .checkOther()
                            .checkActive()
                            .checkSelectable();

                        item.classes.push("t-day");

                        w('<div class="<%=item.classes.join(" ")%>" data-date="<%=t.current.format('YYYY-MM-DD')%>"><%=item.date.date()%></div>');
                        t.current.add(1, "d");
                    }
                }
            %>
            <div class="t-days">
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
                const value = target.attr("data-date");
                instance.date = moment(value);
            });
        }
    }
}