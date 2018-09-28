var fnRender = JSDatepicker.DatePicker.prototype.render;
JSDatepicker.DatePicker.prototype.render = function () {
    console.time("render")
    $(".t-debug").remove();
    JSDatepicker.templates.mount(JSDatepicker.templates.debug, this, this.placment);
    console.log(new Error().stack);
    const result = fnRender.call(this);
    console.timeEnd("render")
    return result;
};

module JSDatepicker.templates {
    export const debug: ITemplate = {
        config: {
            name: "debug"
        },
        template: `
          <div class="t-debug">
            <textarea style="width:100%;height:400px";></textarea>
          </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            $(".t-debug textarea").val(
                JSDatepicker.templates.json(instance, undefined, 4) +
                JSDatepicker.templates.json(instance.options, undefined, 4)
            );
        }
    };

    export function json(obj: any, replacer: any, indent: any) {
        var keys: any[] = [];
        var items: any[] = [];

        function replacerTransformer(key: any, value: any) {
            if (items.length > 2000) { // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
                return 'object too long';
            }
            var index = 0;
            items.forEach(function (o, i) {
                if (o === value) index = i;
            });

            if (key == '') { //root element
                items.push(obj);
                keys.push("root");
                return value;
            }

            if (index + "" != "false" && typeof (value) == "object") {
                return (keys[index] == "root")
                    ? "#pointer to root"
                    : "#see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase() : typeof (value)) + " with key " + keys[index];
            }

            var qualifiedKey = key || "#empty key";
            items.push(value);
            keys.push(qualifiedKey);
            return replacer ? replacer(key, value) : value;
        }
        return JSON.stringify(obj, replacerTransformer, indent);
    };
}