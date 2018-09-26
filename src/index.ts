module JSDatepicker {
    export enum navigation { back, forward };
    export type view = "minutes" | "hours" | "days" | "weeks" | "months" | "years" | "decades" | undefined;

    export interface IRange<T> { start: T; end: T; }
    export interface IDateRange extends IRange<moment.Moment> { }

    export interface IOptions {
        view: view;
        views: view[],
        date?: string | moment.Moment | Date;
        dateFormat?: string
        inputFormat?: string;
        showToday: boolean;
        showNavigator: boolean;
        placement?: JQuery;

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

    export function registerOutsideClickEventHandler(selector: any, callback: () => void) {
        const outsideClickListener = (event: any) => {
            const inside = $(event.target).closest(selector).length;
            if (inside) return;
            cancel();
            callback();
        }

        setTimeout(() => document.addEventListener('click', outsideClickListener));
        const cancel = () => document.removeEventListener('click', outsideClickListener);
        return cancel;
    }

    export class DatePicker {
        date: moment.Moment;
        view: view;
        input: JQuery;
        picker?: JQuery;
        element: JQuery;
        trigger: JQuery;
        placment: JQuery;

        private cancelOutsideClickEventHandler = () => { };

        static options: IOptions = {
            view: "days",
            views: ["days", "months", "years", "decades"],
            dateFormat: moment.localeData().longDateFormat("L"),
            inputFormat: moment.localeData().longDateFormat("L"),
            showToday: true,
            showNavigator: false
        };

        constructor(target: JQuery, public options: IOptions) {
            this.options = $.extend({}, DatePicker.options, this.options);
            this.date = moment(this.options.date);
            this.view = this.options.view as view || "days";

            this.input = $(target);
            this.element = templates.parse(templates.main, this);
            this.trigger = this.element.find(".t-trigger");
            this.placment = $(this.options.placement || this.element);

            this.setupViews();
            this.setupElements();
        };

        setupElements() {
            this.input.after(this.element);
            this.input.addClass("t-input");
            this.element.append(this.input);
            this.trigger.on("click", () => this.toggle());
        }

        setupViews() {
            const options = this.options;
            if (options.views.indexOf(options.view) < 0) {
                options.views.unshift(options.view); //if view is missing, add as start view
            }
        }

        go(nav: navigation) {
            const views = this.options.views;

            let index = views.indexOf(this.view);
            index += nav == navigation.forward ? 1 : -1;

            this.view = views[index] || this.options.view as view;
            this.render();
        }

        toggle(close?: boolean) {
            return close || this.picker
                ? this.close()
                : this.render();
        }

        remove() {
            if (this.picker) {
                this.picker.remove();
                this.picker = undefined;
            }
            this.cancelOutsideClickEventHandler();
        }

        close() {
            this.remove();
            this.view = this.options.view
        }

        step(config: IConfig, forward: boolean): void {
            if (!config.step) return;
            const step = config.step;
            const count = step.count;
            const amount: any = forward ? count : -(count);
            this.date = moment(this.date).add(amount, step.unit);
            this.render();
        }

        place() {
            if (!this.picker) return;
            const offset = this.input.offset();
            const dimensions = (this.input.outerHeight() || 0) + 4;

            if (offset && !this.picker.closest(this.element).length) {
                this.picker.css({ top: offset.top + dimensions, left: offset.left });
            }

            this.cancelOutsideClickEventHandler = registerOutsideClickEventHandler(this.picker, () => this.close());
        }

        render() {
            this.remove();
            this.picker = templates.mount(templates.picker, this, this.placment);
            this.picker.find(".t-item").on("click", () => {
                this.notifyChange();
                this.go(navigation.back);
            });

            this.place();
            return this.picker;
        }

        notifyChange() {
            const date = this.date;
            if (this.view === this.options.view) {

                this.input.val(moment(date).format(this.options.inputFormat));
                this.input.focus();
                this.options.date = date;
                this.close();

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