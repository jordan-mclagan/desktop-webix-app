crm = {
    toolbar: function () {
        return [
            "CRM",
            function () {
                openNewWindow("crm");
            },
            function () {
                $$('crm_win').hide();
                webix.html.removeCss($$("crm_button").$view, "active");
            },
            function () {
                $$("crm_win").config.fullscreen = !$$("crm_win").config.fullscreen;
                $$("crm_win").resize();

                crm.render();
            }, function () {
                $$("toolbar").removeView("crm_button");
                $$('crm_win').hide();
                desktopApp.buttonCount--;
            }
        ]
    },
    body: function () {
        return {
            id: "frame",
            view: "iframe",
            src: "http://groctaurantretail.com/admin/zxy321/crm.php", // code string

        }
    },
    events: {
        onBeforeShow: function () {
            desktopApp.beforeWinShow("crm");
        },

    }
}