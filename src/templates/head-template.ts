module JSDatepicker.templates {
    export const head: ITemplate = {
        config: {
            name: "head"
        },
        template: `
            <div class="t-head">
                <button class="t-nav t-prev"></button>
                <button class="t-nav t-title"><%=date.format(template.config.headerFormat)%></button>
                <button class="t-nav t-next"></button>
            </div>
            <div class="t-head t-hidden1">
            <%
                options.views.forEach(function(item) {
                    var classes = ["t-nav"];
                    if(view == item) return;
                    w('<button class="t-nav t-view">'+ item + '</button>');
                });  
            %>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {

            element.find("button.t-title").on("click", (e) => {
                instance.go(navigation.forward);
            });

            element.find("button.t-prev, button.t-next").on("click", (e) => {
                const b = $(e.target);
                instance.step(this.config, b.hasClass("t-next"));
            });

            element.find("button.t-view").on("click", (e) => {
                instance.view = $(e.target).text() as view;
                instance.render();
            });
        }
    }
}