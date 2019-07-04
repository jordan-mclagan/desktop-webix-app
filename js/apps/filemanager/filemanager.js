filemanager = {
    css: "no_border ",
    toolbar: function () {
        return [
            "Filemanager",
            function () {
                openNewWindow("filemanager");
            },
            function () {
                $$('filemanager_win').hide();
                webix.html.removeCss($$("filemanager_button").$view, "active");
            },
            function () {
                $$("filemanager_win").config.fullscreen = !$$("filemanager_win").config.fullscreen;
                $$("filemanager_win").resize();

            }, function () {
                $$("toolbar").removeView("filemanager_button");
                //							$$('filemanager_win').hide();
                $$('filemanager_win').close();
                desktopApp.buttonCount--;
            }
        ]
    },
    body: function () {

        var filemanagerobject = {
            view: "filemanager",
            id: "filemanager",
            disabledHistory: true,
        }

        return filemanagerobject;
    },

    events: {
        //                    on: {
        //      onItemClick: function(id){ 
        //              console.log("success")
        //       }
        //},

        onBeforeShow: function () {
            desktopApp.beforeWinShow("filemanager");
            var actions = $$("filemanager").getMenu();
            actions.add({ id: "newFile", icon: "file", value: "Create New File" });

            $$("filemanager").load("http://ec2-18-219-87-48.us-east-2.compute.amazonaws.com:3000/loadfiles");
            $$("filemanager").attachEvent("onBeforeDeleteFile", function (id) {
                // your code
                if (id == 'recipes') {
                    return false;
                }
            });
            console.log($$('filemanager'))
            console.log($$('filemanager').$$('files'));
            //                        $$("filemanager").$$("table").attachEvent("onItemDblClick", function(id, e, node){
            //  // datatable receives a complex cell id: {row:x, column:y} 
            //  webix.message(id.column)
            //                            console.log(id.row)
            //});
            $$("filemanager").$$("table").attachEvent("onItemDblClick", function (id, e, node) {
                console.log(id.row);
                console.log(id);
                if (id.row !== undefined || id !== undefined && id !== '$segmented1' && id !== 'newFile' && !id.startsWith('$button') && !id.startsWith('$search')) {

                    if (id.row != undefined) {
                        currentfile = id.row;
                        console.log(currentfile);
                        desktopApp.wins.showApp('aceeditor', currentfile)
                        
//                        userAction(id.row);
                    } else {
                        currentfile = id;
                        console.log(currentfile)
                        desktopApp.wins.showApp('aceeditor', currentfile)
//                        userAction(id);
                    }
                }
            });
        },
        onShow: function () {

            if (!$$("filemanager").$$("tree").getSelectedId())
                $$("filemanager").$$("tree").select($$("filemanager").getFirstChildId(0));

            var actions = $$("filemanager").getMenu();
            console.log(actions);
            actions.attachEvent("onItemClick", function (id) {
                if (id == "newFile") {
                    console.log("Creating a new file");
                    filenamePopup('filemanager');
                }
            });
        },
        onItemSelect: function (id) {
            console.log(id);
        },

        onItemDblClick: function (id, value, type) {
            console.log(value, id, type);
        },

    }
}

