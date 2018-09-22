module JSDatepicker.templates {
    export const head: ITemplate = {
        config: {
            name: "head"
        },
        template: `
            <div class="t-head">
                <% if(template.config.step) w('<button class="t-nav t-prev"></button>'); %>
                <button class="t-nav t-title"><%=date.format(template.config.headerFormat)%></button>
                <% if(template.config.step) w('<button class="t-nav t-next"></button>'); %>
            </div>
            <div class="t-head t-hidden1">
                <select class="t-nav t-view">
            <%
                options.views.forEach(function(item) {
                    const selected = view == item ? "selected" : "";
                    w('<option class="t-nav t-view" <%=selected%>><%=item%></option>');
                });  
            %>
                </select>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            const navs = element.find("button.t-prev, button.t-next");
            navs.toggle(this.config.step != null);

            navs.on("click", (e) => {
                const b = $(e.target);
                instance.step(this.config, b.hasClass("t-next"));
            });

            element.find("button.t-title").on("click", (e) => {
                instance.go(navigation.forward);
            });

            element.find(".t-view").on("change", (e) => {
                instance.view = $(e.target).val() as view;
                instance.render();
            });
        }
    }
}