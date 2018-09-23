module JSDatepicker.templates {
    export const picker: ITemplate = {
        config: {
            name: "picker"
        },
        template: `<div class="t-jsdatepicker-picker"></div>`,
        onMounted: (instance: DatePicker, element: JQuery) => {
            if (instance.picker) instance.picker.remove();

            instance.picker = element;
            const t: any = templates;
            const view = instance.view as string;
            const template = t[view];

            const head = $.extend({}, templates.head);
            $.extend(head.config, template.config, head.config);

            const foot = templates.foot;

            templates.mount(head, instance, element);
            templates.mount(template, instance, element);
            templates.mount(foot, instance, element);
        }
    }
}