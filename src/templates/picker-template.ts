module JSDatepicker.templates {
    export const picker: ITemplate = {
        config: {
            name: "picker"
        },
        content: `
            <div class="t-jsdatepicker t-picker">
                <%
                    var t = JSDatepicker.templates;

                    var template = {
                        head: t.head,
                        view: t[options.view || "days"]
                    };

                    w(t.parse(template.head, this));
                    w(t.parse(template.view, this));
                %>
            </div>
            `
    }
}