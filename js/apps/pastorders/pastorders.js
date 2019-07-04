pastOrders = {
    toolbar: function () {
        return [
            "Delivered and Rejected Orders",
            function () {
                openNewWindow("deliveredAndRejectedOrders");
            },
            function () {
                $$('deliveredAndRejectedOrders_win').hide();
                webix.html.removeCss($$("deliveredAndRejectedOrders_button").$view, "active");
            },
            function () {
                $$("deliveredAndRejectedOrders_win").config.fullscreen = !$$("deliveredAndRejectedOrders_win").config.fullscreen;
                $$("deliveredAndRejectedOrders_win").resize();

                deliveredAndRejectedOrders.render();
            }, function () {
                $$("toolbar").removeView("deliveredAndRejectedOrders_button");
                $$('deliveredAndRejectedOrders_win').hide();
                desktopApp.buttonCount--;
            }
        ]
    },
    body: function () {
        return {
            id: "frame",
            view: "iframe",
            src: "http://groctaurantretail.com/admin/zxy321/ordersproccessed.php",
        }
    },
    events: {
        onBeforeShow: function () {
            desktopApp.beforeWinShow("deliveredAndRejectedOrders");
        },

    }
}