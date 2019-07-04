orders= {
    toolbar: function () {
        return [
            "Orders",
            function () {
                openNewWindow("orders");
            },
            function () {
                $$('orders_win').hide();
                webix.html.removeCss($$("orders_button").$view, "active");
            },
            function () {
                $$("orders_win").config.fullscreen = !$$("orders_win").config.fullscreen;
                $$("orders_win").resize();

                orders.render();
            }, function () {
                $$("toolbar").removeView("orders_button");
                $$('orders_win').hide();
                desktopApp.buttonCount--;
            }
        ]
    },
    body: function () {
        return {
            id: "frame",
            view: "iframe",
            src: "http://groctaurantretail.com/admin/zxy321/orders.php", // code string
        }
    },
    events: {
        onBeforeShow: function () {
            desktopApp.beforeWinShow("orders");
        },

    }
}