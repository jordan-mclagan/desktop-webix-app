toolbar = function (title, openaNewWindowControl, onHide, onMinMax, onClose) {
    return {
        view: "toolbar",
        height: 28,
        css: "window-toolbar",
        cols: [
            { view: "label", label: "<img src='img/window-icon.png' class='header-window-icon'/> " + title },

            {
                view: "icon",
                icon: "fas fa-external-link-alt",
                width: 45,
                height: 20,
                css: "hide-button",
                on: {
                    onItemClick: openaNewWindowControl
                }
            },
            {
                view: "button",
                type: "image",
                image: "img/hide_button.png",
                width: 45,
                height: 20,
                css: "hide-button",
                on: {
                    onItemClick: onHide
                }
            },
            {
                view: "button",
                type: "image",
                image: "img/resize_button.png",
                width: 45,
                height: 20,
                css: "resize-button",
                on: {
                    onItemClick: onMinMax
                }
            },
            {
                view: "button",
                type: "image",
                image: "img/close_button.png",
                width: 45,
                height: 20,
                css: "close-button",
                on: {
                    onItemClick: onClose
                }
            }
        ]
    };
}