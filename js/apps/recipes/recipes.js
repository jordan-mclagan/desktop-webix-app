recipes = {
    toolbar: function () {
        return [
            "Recipes",
            function () {
                openNewWindow("recipes");
            },
            function () {
                $$('recipes_win').hide();
                webix.html.removeCss($$("recipes_button").$view, "active");
            },
            function () {
                $$("recipes_win").config.fullscreen = !$$("recipes_win").config.fullscreen;
                $$("recipes_win").resize();

                recipes.render();
            }, function () {
                $$("toolbar").removeView("recipes_button");
                $$('recipes_win').hide();
                desktopApp.buttonCount--;
            }
        ]
    },
    body: function () {
        return {
            id: "frame",
            view: "iframe",
            src: "http://groctaurantretail.com/admin/zxy321/recipe.php", // code string
        }
    },
    events: {
        onBeforeShow: function () {
            desktopApp.beforeWinShow("recipes");
        },

    }
}