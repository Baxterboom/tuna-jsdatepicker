module JSDatepicker.templates {
    export const foot: ITemplate = {
        config: {
            name: "foot"
        },
        template: `
            <%
                function renderToday(){
                    if(options.showToday) w('<button class="t-nav t-today">Today</button>');
                }

                function renderViews(){
                    if(options.showNavigator) {
                        var items = "";
    
                        options.views.forEach(function(item) {
                            const selected = view == item ? "selected" : "";
                            items += '<option class="t-nav t-view" <%=selected%>><%=item%></option>';
                        });  
                        
                        w('<select class="t-nav t-view">');
                        w(items);
                        w('</select>');
                    }
                }
            %>
            <div class="t-foot">
            <%
                renderToday();
                renderViews();
            %>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            element.find("button.t-today").on("click", (e) => {
                instance.view = instance.options.view as view;
                instance.date = moment();
                instance.render();
            });

            element.find(".t-view").on("change", (e) => {
                instance.view = $(e.target).val() as view;
                instance.render();
            });
        }
    }
}