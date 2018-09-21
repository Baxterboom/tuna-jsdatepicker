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
                var title = date.format(template.config.headerFormat);

                $(".t-head button").on("click", function() {    
                    console.log(1);
                });
            %>
            <div class="t-head">
                <button class="t-prev"></button>
                <button class="t-action"><%=title%></button>
                <button class="t-next"></button>
            </div>`
    }
}