module JSDatepicker.templates {
    export const main: ITemplate = {
        config: {
            name: "main"
        },
        onRender: function (instance: DatePicker) {
            return `<div class="t-jsdp"><div class="t-trigger"></div></div>`;
        }
    }
}