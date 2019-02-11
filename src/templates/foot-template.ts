module JSDatepicker.templates {
    export const foot: ITemplate = {
        config: {
            name: "foot"
        },
        onRender: (instance: DatePicker) => {
            const options = instance.options;

            function renderToday() {
                return options.showToday ? `<button class="t-nav t-today">Today</button>` : ``
            }

            function renderViews() {
                if (!options.showNavigator) return "";
                const items: string[] = [];
                const view = options.view;

                options.views.forEach(function (item) {
                    const selected = view == item ? "selected" : "";
                    items.push(`<option class="t-nav t-view" ${selected}>${item}</option>`);
                });

                return `<select class="t-nav t-view">${items}</select>`;
            }

            return `<div class="t-foot">${renderToday()}${renderViews()}</div>`;
        },
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