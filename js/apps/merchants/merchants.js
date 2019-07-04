merchants = {
    toolbar: function () {
        return [
            "Merchants",
            function () {
                openNewWindow("merchants");
            },
            function () {
                $$('merchants_win').hide();
                webix.html.removeCss($$("merchants_button").$view, "active");
            },
            function () {
                $$("merchants_win").config.fullscreen = !$$("merchants_win").config.fullscreen;
                $$("merchants_win").resize();

                merchants.render();
            }, function () {
                $$("toolbar").removeView("merchants_button");
                $$('merchants_win').hide();
                desktopApp.buttonCount--;
            }
        ]
    },
    body: function () {
        return {
            id: "frame",
            view: "iframe",
            src: "http://groctaurantretail.com/admin/zxy321/merchant.php", // code string
        }
    },
    events: {
        onBeforeShow: function () {
            desktopApp.beforeWinShow("merchants");
        },

    }
}