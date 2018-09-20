declare module JSDatepicker {
    interface IRange<T> {
        start: T;
        end: T;
    }
    interface IDateRange extends IRange<moment.Moment> {
    }
    interface IOptions {
        date?: Date | moment.Moment;
    }
    interface IConfig {
        name: string;
        step: {
            unit: string;
            count: number;
        };
        headerFormat: string;
    }
    function create(target: any, options: IOptions): DatePicker;
    class DatePicker {
        constructor(target: any, options: IOptions);
    }
}
declare module JSDatepicker.templates {
    const days: ITemplate;
}
declare module JSDatepicker.templates {
    const decades: ITemplate;
}
declare module JSDatepicker.templates {
    const head: ITemplate;
}
declare module JSDatepicker.templates {
    const months: ITemplate;
}
declare module JSDatepicker.templates {
    interface ITemplate {
        config: IConfig;
        content: string;
    }
}
declare module JSDatepicker.templates {
    const time: ITemplate;
}
declare module JSDatepicker.templates {
    const weeks: ITemplate;
}
declare module JSDatepicker.templates {
    const years: ITemplate;
}
