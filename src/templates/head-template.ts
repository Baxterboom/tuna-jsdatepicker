module JSDatepicker.templates {
    export const head: ITemplate = {
        config: {
            name: "head"
        },
        template: `
            <div class="t-head">
                <button class="t-prev"></button>
                <button class="t-action"><%=date.format(template.config.headerFormat)%></button>
                <button class="t-next"></button>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {

            element.find("button.t-prev, button.t-next").on("click", (e) => {
                const b = $(e.target);
                instance.step(this.config, b.hasClass("t-next"));
            });

            element.find(".t-item").on("click", (e) => {
                instance.go(navigation.back);
            });

            element.find("button.t-action").on("click", (e) => {
                instance.go(navigation.forward);
            });
        }
    }
}