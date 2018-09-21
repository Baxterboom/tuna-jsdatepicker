module JSDatepicker {
    export interface IRange<T> { start: T; end: T; }
    export interface IDateRange extends IRange<moment.Moment> { }

    export interface IOptions {
        date?: Date | moment.Moment;
        view: string;
        element: JQuery;
        pickerElement: JQuery;
        inputElement: JQuery;
        inputFormat: string;

        onChange: (e: HTMLElement, date: moment.Moment) => void;
    }

    export interface IConfig {
        name: string;
        step?: { unit: string, count: number }
        headerFormat?: string;
    }

    export class DatePicker {

        constructor(target: any, public options: IOptions) {
            this.options.inputElement = $(target);
            this.setup();
        };

        private setup() {
            const main = this.options.element = $(templates.parse(templates.main, this));
            this.options.inputElement
                .after(main)
                .addClass("t-input")
                .appendTo(main);

            const picker = $(templates.parse(templates.picker, this));
            this.options.element.append(picker);
        }
    }

    export function create(target: any, options: IOptions) {
        return new DatePicker(target, options);
    }
}

module JSDatepicker.templates {
    export function parse(template: ITemplate, instance: DatePicker) {
        return JSTemplate.parse(template.content, $.extend({}, instance, { template }));
    }
}