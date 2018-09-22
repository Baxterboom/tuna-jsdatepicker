module JSDatepicker.templates {
    export const foot: ITemplate = {
        config: {
            name: "foot"
        },
        template: `
            <div class="t-foot">
                <button class="t-today">Today</button>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {

            element.find("button.t-today").on("click", (e) => {
                instance.view = instance.options.view as view;
                instance.date = moment();
                instance.render();
            });
        }
    }
}