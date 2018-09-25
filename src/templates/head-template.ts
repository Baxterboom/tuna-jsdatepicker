module JSDatepicker.templates {
    export const head: ITemplate = {
        config: {
            name: "head",
            step: { count: 1, unit: "M" },
            headerFormat: "DD MMMM YYYY"
        },
        template: `
            <div class="t-head">
                <% if(template.config.step) w('<button class="t-nav t-prev"></button>'); %>
                <button class="t-nav t-title"><%=date.format(template.config.headerFormat)%></button>
                <% if(template.config.step) w('<button class="t-nav t-next"></button>'); %>
            </div>
            `,
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
        }
    }
}