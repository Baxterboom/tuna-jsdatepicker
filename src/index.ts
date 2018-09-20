module JSDatepicker {
    export interface IRange<T> { start: T; end: T; }
    export interface IDateRange extends IRange<moment.Moment> { }

    export interface IOptions {
        date?: Date | moment.Moment;
    }

    export interface IConfig {
        name: string;
        step: { unit: string, count: number }
        headerFormat: string;
    }

    export function create(target: any, options: IOptions) {
        return new DatePicker(target, options);
    }

    class DatePicker {
        constructor(target: any, options: IOptions) { };
    }
}