module JSDatepicker.templates {
    export const picker: ITemplate = {
        config: {
            name: "picker"
        },
        template: `<div class="t-jsdp-picker"></div>`,
        onMounted: (instance: DatePicker, element: JQuery) => {
            instance.picker = element; //need to set this here since templates might need it

            const t: any = templates;
            const view = instance.view as string;
            const template = t[view] as ITemplate;

            const head = $.extend({}, templates.head);
            $.extend(head.config, template.config, head.config);

            const foot = templates.foot;

            templates.mount(head, instance, element);
            templates.mount(template, instance, element);
            templates.mount(foot, instance, element);
        }
    }
}