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
            this.options = $.extend(DatePicker.options, this.options);
            this.date = moment(this.options.date);
            this.view = this.options.view as view || "days";

            this.input = $(target);
            this.element = templates.parse(templates.main, this);

            this.setupViews();
            this.setupElements();
        };

        setupElements() {
            this.input.after(this.element);
            this.input.addClass("t-input");
            this.input.on("click", () => this.toggle());
            this.element.append(this.input);
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

        close() {
            if (this.picker) {
                this.picker.remove();
                this.picker = undefined;
            }

            this.cancelOutsideClickEventHandler();
        }

        step(config: IConfig, forward: boolean): void {
            if (!config.step) return;
            const step = config.step;
            const count = step.count;
            const amount: any = forward ? count : -(count);
            this.date = moment(this.date).add(amount, step.unit);
            this.render();
        }

        place(placement: JQuery) {
            if (!this.picker) return;
            const offset = this.input.offset();
            const dimensions = (this.input.outerHeight() || 0) + 4;

            if (offset && !this.picker.closest(this.element).length) {
                this.picker.css({ top: offset.top + dimensions, left: offset.left });
            }
            this.cancelOutsideClickEventHandler = registerOutsideClickEventHandler(this.picker, () => this.close());
        }

        render() {
            let target = this.options.placement ? $(this.options.placement) : this.element;
            if (!target.length) target = this.element;

            this.close();

            this.picker = templates.mount(templates.picker, this, target);
            this.picker.find(".t-item").on("click", () => {
                this.notifyChange();
                if (!this.isCurrentView()) this.go(navigation.back);
            });

            this.place(target);

            return this.picker;
        }

        isCurrentView(view?: view) {
            return this.view = view || this.options.view;
        }

        notifyChange() {
            const date = this.date;
            if (this.view === this.options.view) {
                this.options.date = date;
                this.input.val(moment(date).format(this.options.inputFormat));
                this.input.focus();
                if (this.options.onChange) this.options.onChange(this.date, this.input);
                this.close();
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