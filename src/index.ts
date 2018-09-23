module JSDatepicker {
    export enum navigation { back, forward };
    export type view = "minutes" | "hours" | "days" | "weeks" | "months" | "years" | "decades" | undefined;

    export interface IRange<T> { start: T; end: T; }
    export interface IDateRange extends IRange<moment.Moment> { }

    export interface IOptions {
        view: string;
        views: view[],
        date?: string | moment.Moment | Date;
        dateFormat?: string
        inputFormat?: string;
        showToday: boolean;
        showNavigator: boolean;

        onChange?: (date: moment.Moment, element: JQuery) => void;
    }

    export interface IConfig {
        name: string;
        step?: { unit: moment.DurationInputArg2, count: number }
        headerFormat?: string;
    }

    export interface ITemplate<T=IConfig> {
        config: T;
        template: string;
        onMounted?: (instance: DatePicker, element: JQuery) => void;
    }

    export class DatePicker {
        date: moment.Moment;
        view: view;
        input: JQuery;
        picker?: JQuery;
        element: JQuery;

        static options: IOptions = {
            view: "days",
            views: ["days", "months", "years", "decades"],
            dateFormat: moment.localeData().longDateFormat("L"),
            inputFormat: moment.localeData().longDateFormat("L"),
            showToday: true,
            showNavigator: false
        };

        constructor(target: any, public options: IOptions) {
            this.options = $.extend(DatePicker.options, this.options);
            this.date = moment(this.options.date);
            this.view = this.options.view as view || "days";

            this.element = templates.parse(templates.main, this);

            this.input = $(target);
            this.input.after(this.element);
            this.input.addClass("t-input");
            //this.input.on("click", () => this.render());

            this.element.append(this.input);
            this.render();
        };

        go(nav: navigation) {
            const views = this.options.views;

            let index = views.indexOf(this.view);
            index += nav == navigation.forward ? 1 : -1;

            this.view = views[index] || this.options.view as view;
            this.render();
        }

        step(config: IConfig, forward: boolean): void {
            if (!config.step) return;
            const step = config.step;
            const count = step.count;
            const amount: any = forward ? count : -(count);
            this.date = moment(this.date).add(amount, step.unit);
            this.render();
        }

        render(): void {
            console.time("render");

            templates.mount(templates.picker, this, this.element)
                .find(".t-item").on("click", () => {
                    this.notifyChange();
                    this.go(navigation.back);
                });

            console.timeEnd("render");
        }

        notifyChange() {
            const date = this.date;
            if (this.view === this.options.view) {
                this.options.date = date;
                this.input.val(moment(date).format(this.options.inputFormat));
                if (this.options.onChange) this.options.onChange(this.date, this.input);
            }
        }
    }

    export function create(target: any, options: IOptions) {
        return new DatePicker(target, options);
    }
}

module JSDatepicker.templates {
    export function parse(template: ITemplate, instance: DatePicker) {
        const data = $.extend({}, instance, { template });
        return $(JSTemplate.parse(template.template, data, true));
    }

    export function mount(template: ITemplate, instance: DatePicker, parent: JQuery) {
        const element = parse(template, instance);
        parent.append(element);
        if (template.onMounted) template.onMounted(instance, element);
        return element;
    }
}