module JSDatepicker.templates {
    export const head: ITemplate = {
        config: {
            name: "head",
            step: { unit: "M", count: 1 },
            headerFormat: "MMMMM YYYY"
        },
        content: `
            <% 
                var date = options.date;
            %>
            <div class="t-head">
                <button class="t-prev"></button>
                <div class="t-title"><%=date.format(config.headerFormat)%></div>
                <button class="t-next"></button>
            </div>`
    }
}