//aceeditor = {
//    toolbar: function () {
//        return [
//            "Ace Editor",
//            function () {
//                if (commitValidator()) {
//                    //							openNewWindow("aceeditor");
//                    getCommitMessage();
//
//                } else {
//                    webix.message("Not valid structure")
//                }
//            },
//            function () {
//                let finalData = $$('editor').getValue();
//                console.log(currentfile);
//                if (currentfile !== undefined) {
//                    if (Object.is(initialData.response, finalData)) {
//                        console.log("No change in data");
//                    } else {
//                        console.log("Change in data");
//                        updateData(currentfile, finalData);
//                    }
//                }
//                webix.message("File is not commited");
//            },
//
//            function () {
//                openNewWindow("aceeditor");
//            },
//            function () {
//                $$('aceeditor_win').hide();
//                webix.html.removeCss($$("aceeditor_button").$view, "active");
//            },
//            function () {
//                $$("aceeditor_win").config.fullscreen = !$$("aceeditor_win").config.fullscreen;
//                $$("aceeditor_win").resize();
//
//                aceeditor.render();
//            }, function () {
//                let finalData = $$('editor').getValue();
//                console.log(currentfile);
//                console.log(initialData);
//                if (initialData == undefined) {
//                    initialData = {
//                        response: '',
//                    }
//                }
//                if (currentfile !== undefined) {
//                    if (Object.is(initialData.response, finalData)) {
//                        console.log("No change in data");
//                    } else {
//                        console.log("Change in data");
//                        updateData(currentfile, finalData);
//                    }
//                }
//                
//                //							if($$('editor').getEditor().getSession().on("change", function () {
//                //								// textarea.val(editor.getSession().getValue())
//                //								console.log("value changed");
//                //							}));
//                $$('editor').setValue('');
//                currentfile = undefined;
//
//                $$("toolbar").removeView("aceeditor_button");
//                $$('aceeditor_win').hide();
//                desktopApp.buttonCount--;
//
//                //                            closingPopup();
//            }
//        ]
//    },
//    body: function (editorValue) {
//        console.log("This is editor value", editorValue);
//        //					editorValue = editorValue || '';
//        return {
//
//            id: "editor",
//            view: "ace-editor",
//            value: " ",
//        }
//    },
//    events: {
//        onBeforeShow: function () {
//            desktopApp.beforeWinShow("aceeditor");
//            let editor = $$("editor").getEditor();
//            getfilesdata();
//            console.log(popupdata);
//            let word = '';
//            let popupWord = false;
//            console.log(editor);
//            editor.on("change", function (e) {
//                console.log(e);
//                if (e.action == 'insert' && e.lines[0] == '@') {
//                    word = '';
//                    popupWord = true;
//                    console.log("Should show dropdown");
//                    //                                    console.log(editor.getCursorPosition())
//                    var popup = webix.ui({
//                        view: "popup",
//                        id: "my_popup",
//                        height: 250,
//                        width: 500,
//                        move: true,
//                        body: {
//                            view: "list",
//                            id: "popuplist",
//                            data: popupdata,
//                            template: "#value# - #id#",
//                            //                                                    autoheight:true,
//                            select: true,
//                        },
//
//                    }).show();
//                    $$('popuplist').attachEvent("onItemClick", function (id, e, node) {
//                        //                                        popup.hide();
//                        popupWord = false;
//                        //                                        $$('my_popup').close();
//                        popup.hide();
//
//                        console.log("item clicked")
//                        var item = this.getItem(id);
//                        console.log(item);
//                        editor.removeWordLeft();
//                        console.log(editor.removeWordLeft());
//                        console.log(editor.getCursorPositionScreen());
//                        editor.session.insert(editor.getCursorPosition(), ' ' + item.value);
//
//                    });
//                    console.log(popupdata);
//                }
//
//
//                if (e.action == 'insert' && (e.lines[0] == ' ' || (e.lines.length == 2 && e.lines[0] == '' && e.lines[1] == ''))) {
//                    popupWord = false;
//                    newlist = null;
//                }
//                if (popupWord == true) {
//                    $$("popuplist").clearAll();
//                    //                                $$("popuplist").hide();
//                    //                                $$('my_popup').close();
//                    if (e.action == 'insert') {
//                        if (e.lines[0] !== '@') {
//                            word = word + e.lines[0];
//                            console.log(popupdata);
//                            newpopupdata(word);
//                        }
//                    }
//                    if (e.action == 'remove') {
//                        if (e.lines[0] != '@' || !e.lines[0].includes('@')) {
//                            word = word.substring(0, word.length - 1);
//                            newlist = null;
//                            newpopupdata(word);
//                        } else {
//                            popupWord = false;
//                            //                                        $$('my_popup').close();
//                            $$('my_popup').close();
//                            newlist = null;
//                        }
//                    }
//                    console.log(word);
//                }
//            });
//
//            editor.setOptions({
//                enableBasicAutocompletion: true,
//                enableSnippets: true,
//                enableLiveAutocompletion: true
//            });
//
//        },
//
//        onShow: function () {
//
//            let editor = $$("editor").getEditor();
//            getfilesdata();
//            console.log(popupdata);
//            let word = '';
//            let popupWord = false;
//            console.log(editor);
//            editor.on("change", function (e) {
//                console.log(e);
//                if (e.action == 'insert' && e.lines[0] == '@') {
//                    word = '';
//                    popupWord = true;
//                    console.log("Should show dropdown");
//
//                    //                                    console.log(editor.getCursorPosition())
//                    var popup = webix.ui({
//                        view: "popup",
//                        id: "my_popup",
//                        height: 250,
//                        width: 500,
//                        move: true,
//                        body: {
//                            view: "list",
//                            id: "popuplist",
//                            data: popupdata,
//                            template: "#value# - #id#",
//                            //                                                    autoheight:true,
//                            select: true,
//
//                        },
//
//                    }).show();
//                    $$('popuplist').attachEvent("onItemClick", function (id, e, node) {
//                        var item = this.getItem(id);
//                        console.log(item);
//                        editor.removeWordLeft();
//                        editor.removeWordLeft();
//                        console.log(editor.getCursorPositionScreen());
//                        editor.session.insert(editor.getCursorPosition(), ' ' + item.value);
//                        $$('my_popup').close();
//                        popupWord = false;
//
//                    });
//                    console.log(popupdata);
//                }
//
//
//                if (e.action == 'insert' && (e.lines[0] == ' ' || (e.lines.length == 2 && e.lines[0] == '' && e.lines[1] == ''))) {
//                    popupWord = false;
//                    newlist = null;
//                }
//                if (popupWord == true) {
//                    $$("popuplist").clearAll();
//                    //                                $$('my_popup').close();
//                    if (e.action == 'insert') {
//                        //                                    var list = $$("my_popup").getPopup().getList();
//                        //                                    popupdata = ["nice", 'list'];
//                        //                                    $$('my_popup').close();
//                        //                                    console.log('popup closed')
//                        //                                    console.log(list)
//                        if (e.lines[0] !== '@') {
//
//                            word = word + e.lines[0];
//                            console.log(popupdata);
//
//                            newpopupdata(word);
//                            //                                    $$("popuplist").add({value: "new dishes.json"});
//
//                        }
//                    }
//                    if (e.action == 'remove') {
//                        if (e.lines[0] != '@' || !e.lines[0].includes('@')) {
//                            word = word.substring(0, word.length - 1);
//                            newlist = null;
//                            newpopupdata(word);
//                        } else {
//                            popupWord = false;
//                            $$('my_popup').close();
//                            newlist = null;
//                        }
//                    }
//                    console.log(word);
//                }
//            });
//
//
//            editor.setOptions({
//                enableBasicAutocompletion: true,
//                enableSnippets: true,
//                enableLiveAutocompletion: true
//            });
//            editor.commands.addCommand({
//                name: "showKeyboardShortcuts",
//                bindKey: { win: "Tab", mac: "Command-Alt-h" },
//                exec: function (editor) {
//                    ace.config.loadModule("ace/ext/keybinding_menu", function (module) {
//                        module.init(editor);
//                        console.log("tab pressed")
//                    })
//                }
//            })
//        },
//
//        onKeyPress: function () {
//            console.log("Key Press Occured");
//            console.log($$('editor').getValue());
//        },
//        onclose: function () {
//            console.log($$('editor').getValue());
//
//        },
//        onLiveEdit: function (state, editor, ignoreUpdate) {
//            console.log($$('editor').getValue());
//        },
//
//    }
//}
//
acetoolbar = function (title, /*commitfile, savefile,*/ openaNewWindowControl, onHide, onMinMax, onClose) {
    return {
        view: "toolbar",
        height: 28,
        css: "window-toolbar",
        cols: [
            { view: "label", label: "<img src='img/window-icon.png' class='header-window-icon'/> " + title },
//            (commitValidator() == true ? ({
//                view: "button",
//                type: "image",
//                image: "img/camera.png",
//                width: 45,
//                height: 20,
//                css: "hide-button",
//                on: {
//                    onItemClick: commitfile
//                }
//            }) : ({
//                view: "button",
//                type: "image",
//                image: "img/games.png",
//                width: 45,
//                height: 20,
//                css: "hide-button",
//                on: {
//                    onItemClick: commitfile
//                }
//            })),
//            {
//                view: "button",
//                type: "image",
//                image: "img/music.png",
//                width: 45,
//                height: 20,
//                css: "hide-button",
//                on: {
//                    onItemClick: savefile
//                }
//            },

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

aceeditor = {
    toolbar: function () {
        return [
            "Ace Editor",
            function () {
                openNewWindow("aceeditor");
            },
            function () {
                $$('aceeditor_win').hide();
                webix.html.removeCss($$("aceeditor_button").$view, "active");
            },
            function () {
                $$("aceeditor_win").config.fullscreen = !$$("aceeditor_win").config.fullscreen;
                $$("aceeditor_win").resize();

                orders.render();
            }, function () {
                $$("toolbar").removeView("aceeditor_button");
                $$('aceeditor_win').hide();
                desktopApp.buttonCount--;
            }
        ]
    },
    body: function (filepath) {
    console.log("Inside the ace editor object")
        filepath = filepath || '';
        if(filepath == "[object MouseEvent]"){
            filepath = ''
        }
        console.log(filepath)
        return {
            id: "frame",
            view: "iframe",
            src: "http://dailykit.org/aceeditor/" + (filepath == '' ? '' : '?file=' + filepath),
        }
    },
    events: {
        onBeforeShow: function () {
            desktopApp.beforeWinShow("aceeditor");
        },

    }
}

function changeFileInEditor(filepath) {
    $$("frame").load("http://dailykit.org/aceeditor/" + (filepath == '' ? '' : '?file=' + filepath));
}

