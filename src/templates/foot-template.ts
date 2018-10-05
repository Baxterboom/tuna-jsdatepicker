module JSDatepicker.templates {
    export const foot: ITemplate = {
        config: {
            name: "foot"
        },
        template: `
            <div class="t-foot">
            <%
                if(options.showToday) w('<button class="t-nav t-today">Today</button>');

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