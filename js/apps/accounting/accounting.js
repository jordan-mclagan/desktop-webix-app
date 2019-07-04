accounting = {
    toolbar: function () {
        return [
            "Accounting",
            function () {
                openNewWindow("accounting");
            },
            function () {
                $$('accounting_win').hide();
                webix.html.removeCss($$("accounting_button").$view, "active");
            },
            function () {
                $$("accounting_win").config.fullscreen = !$$("accounting_win").config.fullscreen;
                $$("accounting_win").resize();

                accounting.render();
            }, function () {
                $$("toolbar").removeView("accounting_button");
                $$('accounting_win').hide();
                desktopApp.buttonCount--;
            }
        ]
    },
    body: function () {
        return {
            id: "frame",
            view: "iframe",
            src: "http://groctaurantretail.com/admin/zxy321/accounting.php",
        }
    },
    events: {
        onBeforeShow: function () {
            desktopApp.beforeWinShow("accounting");
        },

    }
}