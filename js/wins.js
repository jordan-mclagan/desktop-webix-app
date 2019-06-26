let currentfile;
let initialData;
let popupdata;
let newlist;
if (window.desktopApp)
	desktopApp.wins = {
		active: null,
		setActiveStyle: function (winId) {
			if (desktopApp.wins.active)
				webix.html.removeCss($$(desktopApp.wins.active).$view, "active_win");
			webix.html.addCss($$(winId).$view, "active_win", true);
			desktopApp.wins.active = winId;
		},
		forEachWindow: function (func) {
			var views = $$("toolbar").getChildViews();
			for (var i = 1; i < views.length; i++) {
				if (views[i].config.id.indexOf("_button") != -1) {
					var id = views[i].config.id.replace("button", "win");
					if ($$(id))
						func.call(this, id);
				}
			}
		},
		hideAllWindows: function () {
			this.forEachWindow(function (id) {
				if ($$(id).isVisible()) {
					$$(id).hide();
					webix.html.removeCss($$(id.replace("_win", "_button")).$view, "active");
				}
			});
		},
		getVisibleWinCount: function () {
			var count = 0;
			this.forEachWindow(function (id) {
				if ($$(id).isVisible())
					count++;
			});
			return count;
		},
		getPosition: function (state) {
			state.left = this.config.left;
			state.top = this.config.top;
			if (state.height + 40 >= state.maxHeight) {
				state.height = state.maxHeight - 40;
			}
			if (this.config.fullscreen) {
				if (!this.config.lastWindowPos)
					this.config.lastWindowPos = { top: state.top, left: state.left };
				state.top = state.left = 0;
			}
			else {
				if (this.config.lastWindowPos) {
					var last = this.config.lastWindowPos;
					delete this.config.lastWindowPos;
					state.top = last.top;
					state.left = last.left;
				}
				if (state.left + state.width > state.maxWidth) {
					state.left -= state.left + state.width - state.maxWidth;
				}
				if (state.top + state.height + 40 > state.maxHeight) {
					state.top -= state.top + state.height + 40 - state.maxHeight;
				}
			}

		},
		showEmptyApp: function (obj) {
			var winId = obj.id + "_win";

			if (!$$(winId)) {
				var c = desktopApp.wins.getVisibleWinCount();
                console.log(winId);

				webix.ui({
					view: "window",
					id: winId,
					css: "popup-window-custom " + obj.$css || "",
					position: desktopApp.wins.getPosition,
					left: document.documentElement.clientWidth / 2 - 400 + 15 * c,
					top: document.documentElement.clientHeight / 2 - 225 - 40 + 25 * c,
					move: true,
					resize: true,
					toFront: true,
					height: 450,
					width: 800,
					head: this.ui.toolbar(
						obj.value + " (Not implemented) ",
						function () {
							$$(winId).hide();
							webix.html.removeCss($$(obj.id + "_button").$view, "active");
						}, function () {
							$$(winId).config.fullscreen = !$$(winId).config.fullscreen;
							$$(winId).resize();
							$$(winId).config.left = 0;
							$$(winId).config.top = 0;
						}, function () {
							$$("toolbar").removeView(obj.id + "_button");
							$$(winId).hide();
							desktopApp.buttonCount--;
						}
					),
					body: {
						css: "empty-app",
						template: function (obj) {
							var icon = "";
							if (obj.img) {
								icon = "<img src='" + obj.img + "' align='center'>";
							}
							else if (obj.icon) {
								icon = "<span class='webix_icon mdi mdi-" + obj.icon + "'></span>";
							}
							return "<div class='empty-app-inner' style='background-color:" + obj.color + ";'>" + icon + "</div>"
						},
						data: obj
					},
					on: {
						onBeforeShow: function () {
							desktopApp.beforeWinShow(obj);
						}
					}
				})
			}
			$$(winId).show();
			$$("winmenu").hide();
			desktopApp.wins.setActiveStyle(winId);
		},
		showApp: function (name, attribute) {
			var winId = name + "_win";
			var c = desktopApp.wins.getVisibleWinCount();
			if (!$$(winId)) {
				var config = desktopApp.wins.ui[name];
				webix.ui({
					view: "window",
					id: winId,
					css: "popup-window-custom app " + config.css || "",
					position: desktopApp.wins.getPosition,
					resize: true,
					left: document.documentElement.clientWidth / 2 - 400 + 15 * c,
					top: document.documentElement.clientHeight / 2 - 225 - 40 + 25 * c,
					move: true,
					toFront: true,
					height: 450,
					width: 800,
					head: (name !== 'aceeditor' ? desktopApp.wins.ui.toolbar.apply(this, config.toolbar()) : desktopApp.wins.ui.acetoolbar.apply(this, config.toolbar())),
					body: config.body(attribute),
					on: config.events
				});

			}
			$$(winId).show();
			if (name == "scheduler" && $$("scheduler").getScheduler())
				$$("scheduler").getScheduler().updateView();
			else if (name == "gantt" && window.gantt)
				gantt.render();
			desktopApp.wins.setActiveStyle(winId);
		},
		ui: {
			toolbar: function (title, openaNewWindowControl, onHide, onMinMax, onClose) {
				return {
					view: "toolbar",
					height: 28,
					css: "window-toolbar",
					cols: [
						{ view: "label", label: "<img src='img/window-icon.png' class='header-window-icon'/> " + title },

						{
							view: "icon",
							//type: "image",
							//							image: "img/video.png",
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
			},
            acetoolbar : function (title, commitfile, savefile, openaNewWindowControl, onHide, onMinMax, onClose) {
				return {
					view: "toolbar",
					height: 28,
					css: "window-toolbar",
					cols: [
						{ view: "label", label: "<img src='img/window-icon.png' class='header-window-icon'/> " + title },
                        
                        
                        (commitValidator() == true ?  ({
							view: "button",
							type: "image",
							image: "img/camera.png",
							width: 45,
							height: 20,
							css: "hide-button",
							on: {
								onItemClick: commitfile
							}
						}) :  ({
							view: "button",
							type: "image",
							image: "img/games.png",
							width: 45,
							height: 20,
							css: "hide-button",
							on: {
								onItemClick: commitfile
							}
						}))
//                        {
//							view: "button",
//							type: "image",
//							image: "img/camera.png",
//							width: 45,
//							height: 20,
//							css: "hide-button",
//							on: {
//								onItemClick: commitfile
//							}
//						},
                         ,
                        {
							view: "button",
							type: "image",
							image: "img/music.png",
							width: 45,
							height: 20,
							css: "hide-button",
							on: {
								onItemClick: savefile
							}
						},
                        
						{
							view: "icon",
							//type: "image",
							//							image: "img/video.png",
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
			},
			scheduler: {
				css: "no_border",
				toolbar: function () {
					return [
						"DHTMlX Scheduler",
						function () {
							$$('scheduler_win').hide();
							webix.html.removeCss($$("scheduler_button").$view, "active");
						}, function () {
							$$("scheduler_win").config.fullscreen = !$$("scheduler_win").config.fullscreen;
							$$("scheduler_win").resize();

							$$("scheduler").config.fullscreen = !$$("scheduler").config.fullscreen;
							$$("scheduler").resize();
							$$("scheduler").getScheduler().updateView();
						}, function () {
							$$("toolbar").removeView("scheduler_button");
							$$('scheduler_win').hide();
							desktopApp.buttonCount--;
						}
					]
				},
				body: function () {
					return {
						view: "dhx-scheduler",
						id: "scheduler",
						date: new Date(2015, 7, 5),
						mode: "month",
						init: function () {
							this.getScheduler().config.xml_date = "%Y-%m-%d %H:%i";
							this.getScheduler().config.first_hour = 6;
							this.getScheduler().config.multi_day = false;
						},
						ready: function () {
							this.getScheduler().parse(test_data_set_2015);
						}
					}
				},
				events: {
					onBeforeShow: function () {
						desktopApp.beforeWinShow("scheduler");
					}
				}
			},
			gantt: {
				toolbar: function () {
					return [
						"DHTMlX Gantt",
						function () {
							$$('gantt_win').hide();
							webix.html.removeCss($$("gantt_button").$view, "active");
						},
						function () {
							$$("gantt_win").config.fullscreen = !$$("gantt_win").config.fullscreen;
							$$("gantt_win").resize();

							$$("gantt").config.fullscreen = !$$("scheduler").config.fullscreen;
							$$("gantt").resize();
							gantt.render();
						}, function () {
							$$("toolbar").removeView("gantt_button");
							$$('gantt_win').hide();
							desktopApp.buttonCount--;
						}
					]
				},
				body: function () {
					return {
						view: "dhx-gantt",
						id: "gantt",
						init: function () {
							//do nothing
						},
						ready: function () {
							gantt.parse(tasks);
						}
					}
				},
				events: {
					onBeforeShow: function () {
						desktopApp.beforeWinShow("gantt");
					}
				}
			},

			aceeditor: {
				toolbar: function () {
					return [
						"Ace Editor",
                        function () {
                            if(commitValidator()) {
//							openNewWindow("aceeditor");
                            getCommitMessage();
                            
                            } else {
                                webix.message("Not valid structure")
                            }
						},
                        function() {
                            let finalData = $$('editor').getValue();
							console.log(currentfile);
							if (currentfile !== undefined) {
								if (Object.is(initialData.response, finalData)) {
									console.log("No change in data");
								} else {
									console.log("Change in data");
									updateData(currentfile, finalData);
								}
							}
                            webix.message("File is not commited");
                        },
                        
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

							aceeditor.render();
						}, function () {
                            let finalData = $$('editor').getValue();
							console.log(currentfile);
                            console.log(initialData);
                            if(initialData == undefined){
                                initialData = {
                                    response : '',
                                }
                            }
							if (currentfile !== undefined) {
								if (Object.is(initialData.response, finalData)) {
									console.log("No change in data");
								} else {
									console.log("Change in data");
									updateData(currentfile, finalData);
								}
							}
                            
							

							//							if($$('editor').getEditor().getSession().on("change", function () {
							//								// textarea.val(editor.getSession().getValue())
							//								console.log("value changed");
							//							}));
							$$('editor').setValue('');
							currentfile = undefined;
							$$("toolbar").removeView("aceeditor_button");
							$$('aceeditor_win').hide();
							desktopApp.buttonCount--;
                            
//                            closingPopup();
						}
					]
				},
				body: function (editorValue) {
					console.log("This is editor value", editorValue);
					//					editorValue = editorValue || '';
					return {

						id: "editor",
						view: "ace-editor",
						value: " ",
					}
				},
				events: {
					onBeforeShow: function () {
                    
						desktopApp.beforeWinShow("aceeditor");
                        
                        let editor = $$("editor").getEditor();
                        getfilesdata();
                        console.log(popupdata);
                        let word  = '';
                        let popupWord = false;
                        
                        editor.on("change", function(e){
                            console.log(e);
                                if(e.action == 'insert' && e.lines[0] == '@') {
                                    word = '';
                                    popupWord = true;
                                    console.log("Should show dropdown");

//                                    console.log(editor.getCursorPosition())
                                        var popup = webix.ui({
                                            view:"popup",
                                            id:"my_popup",
                                            height:250,
                                            width:500,
                                            move: true,
                                            body:{
                                                view:"list",
                                                id: "popuplist",
                                                data : popupdata,
                                                template: "#value# - #id#",
//                                                    autoheight:true,
                                                select:true,
                                                
//								                onClick:{
//                                                   console.log("item clicked")
//                                                }
                                            }

                                        }).show();
                                    $$('popuplist').attachEvent("onItemClick", function(id, e, node){
                                        var item = this.getItem(id);
                                        console.log(item);
                                        editor.removeWordLeft();
                                        editor.removeWordLeft();
                                        console.log(editor.getCursorPositionScreen());
                                        editor.session.insert(editor.getCursorPosition(), ' '+ item.value)


                                        

                                    }); 
                                    console.log(popupdata);
                                }
                            

                            if(e.action == 'insert' && e.lines[0] == ' ') {
                                popupWord = false;
                                newlist = null;
                            }
                            if(popupWord == true) {
                                $$("popuplist").clearAll();
                                if(e.action == 'insert'){
//                                    var list = $$("my_popup").getPopup().getList();
//                                    popupdata = ["nice", 'list'];
//                                    $$('my_popup').close();
//                                    console.log('popup closed')
//                                    console.log(list)
                                    if(e.lines[0] !== '@') {

                                    word = word + e.lines[0];
                                    console.log(popupdata);
                                        
                                    newpopupdata(word);
//                                    $$("popuplist").add({value: "new dishes.json"});

                                    }
                                }
                                if(e.action == 'remove') {
                                    if(e.lines[0] != '@') {
                                    word  = word.substring(0, word.length-1);
                                    newlist = null;
                                    newpopupdata(word);
                                    } else {
                                        popupWord = false;
                                        $$('my_popup').close();
                                        newlist = null;
                                    }
                                }
                                console.log(word);
                            }
                        });
                        
                        
                        editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
                        
                        
//                        editor.commands.addCommand({
//                        name: "dotCommand1",
//                        bindKey: { win: ".", mac: "." },
//                        exec: function () {
//                            var pos = editor.selection.getCursor();
//                            var session = editor.session;
//
//                            var curLine = (session.getDocument().getLine(pos.row)).trim();
//                            var curTokens = curLine.slice(0, pos.column).split(/\s+/);
//                            var curCmd = curTokens[0];
//                            if (!curCmd) return;
//                            var lastToken = curTokens[curTokens.length - 1];
//
//                            editor.insert(".");                
//
//                            console.log(pos, session, curLine, curTokens, curCmd,lastToken);
//                            if (lastToken === "foo") {
//                                 var wordList = ["baar", "bar", "baz"];
//                                callback(null, wordList.map(function(word) {
//                                    return {
//                                        caption: word,
//                                        value: word,
//                                        meta: "static"
//                                    };
//                                // Add your words to the list or then insert into the editor using editor.insert()
//                            }))
//                        }
//                        }
//					});
                        

					},
                    
                    onShow : function () {

                        
//                        $$("editor").attachEvent("onKeyPress", function(code, e) {
//                                console.log(code, e);
//                        });
                        
//                          let editor = $$("editor").getEditor();
//
//                        editor.on("change", function(e){
//                                        console.log(e)
//                                        });
//                        
 
                        

                    },
                    

					onKeyPress: function () {
						console.log("Key Press Occured");
						console.log($$('editor').getValue());
					},
					onclose: function () {
						console.log($$('editor').getValue());

					},
					onLiveEdit: function (state, editor, ignoreUpdate) {
						console.log($$('editor').getValue());
					},


				}
			},

			orders: {
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
			},

			recipes: {
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
			},

			crm: {
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
			},

			merchants: {
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
			},


			accounting: {
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
			},
            
            appstore: {
				toolbar: function () {
					return [
						"App Store",
						function () {
							openNewWindow("appstore");
						},
						function () {
							$$('appstore_win').hide();
							webix.html.removeCss($$("appstore_button").$view, "active");
						},
						function () {
							$$("appstore_win").config.fullscreen = !$$("appstore_win").config.fullscreen;
							$$("appstore_win").resize();

							recipes.render();
						}, function () {
							$$("toolbar").removeView("appstore_button");
							$$('appstore_win').hide();
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
						desktopApp.beforeWinShow("appstore");
					},

				}
			},


			deliveredAndRejectedOrders: {
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
			},

			filemanager: {
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

						$$("filemanager").attachEvent("onItemClick", function (id) {
							console.log(id.row);
							console.log(id);
							if (id.row !== undefined || id !== undefined && id !== '$segmented1' && id !== 'newFile' && !id.startsWith('$button') && !id.startsWith('$search')) {

								if (id.row != undefined) {
									currentfile = id.row;
									userAction(id.row);
								} else {
									currentfile = id;
									userAction(id);
								}
							}
						});
                        

//                         $$("editor").getEditor().commands.addCommand({
//                                name: "myCommand",
//                                bindKey: { win: "@", mac: "@" },
//                                exec: function (editor) {
//                                      autocomplete();
//                                }
//                         });
//
//                          let autocomplete = function () {
//                                staticWordCompleter = {
//                                    var getWordList = function(editor, session, pos, prefix, callback, isRHSEditor) {
//                                    var wordList = ['done','nice']; // add your words to this list
//
//                                    callback(null, wordList.map(function(word) {
//                                        return {
//                                             caption: word,
//                                            value: word
//                                        };
//                                    }))}};    
//                                    editor.completers = [staticWordCompleter];
//                            
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
			},
		}
	};

let editor = function (data) {
	desktopApp.wins.showApp("aceeditor");
	let editordata = $$("editor").getValue();
	console.log('Setting this data to editor app', data)
	$$("editor").setValue(data);
}

let updateData = function (filepath, data) {
	console.log(filepath);
	console.log(data);
	currentfile = filepath;
	let body = {
		'file': filepath,
		'data': data,
	};
	JSON.stringify(body);

	webix.ajax().headers({
		"Accept": "application/json",
		"Content-Type": "application/json",
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Origin': '*',
	}).post('http://ec2-18-219-87-48.us-east-2.compute.amazonaws.com:3000/updateFile', body)
		.then(function (data) {
			data = data.json();
			console.log('Status response of update data', data);
		})
}

let userAction = (filepath) => {
	console.log("in getfile")
	let body = { 'file': filepath };
	JSON.stringify(body);
	webix.ajax().headers({
		"Accept": "application/json",
		"Content-Type": "application/json",
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Origin': '*',
	}).post('http://ec2-18-219-87-48.us-east-2.compute.amazonaws.com:3000/getFile', body)
		.then(function (data) {
			data = data.json();
			if (data.response.status != 'fail') {
				console.log('initial data response from server', data);
				initialData = data;
				//			return data;
				//            let modified = JSON.stringify(data.response, null, 4)
				//            console.log('Stringified Data',modified);
				editor(data.response);
            }
		})
	//		.then(function (data) {
	//        
	//		})
}

//ec2-18-219-87-48.us-east-2.compute.amazonaws.com

let createNewFile = (filenameentered, object) => {
//                initialData.response = "";
	console.log(filenameentered);
//	let objectType = ($$("filemanager").getCurrentFolder().split('/')[2].toLowerCase());
//	let object = {
//		'file': $$("filemanager").getCurrentFolder() + '/' + filenameentered + '.json',
//		'objectType': objectType
//	};
	console.log(object)
    currentfile = object.file;
	webix.ajax().headers({
		"Accept": "application/json",
		"Content-Type": "application/json",
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Origin': '*',
	}).post('http://ec2-18-219-87-48.us-east-2.compute.amazonaws.com:3000/createNewFile', object)
		.then(function (data) {
			data = data.json();
			console.log('Status response of update data', data);
			return data;
		})
		.then(data => {
			console.log(data.status);
			console.log(object.file)
			return data
		})
		.then((data) => {
			userAction(object.file);
			$$("filemanager").load("http://ec2-18-219-87-48.us-east-2.compute.amazonaws.com:3000/loadfiles");
			webix.message(data.status);
		})
}

let commitFile = (filepath, commitMessage) =>{
    let object = {
		'filePath': filepath,
        'commitMessage' : commitMessage,
	};
	console.log(object)
	webix.ajax().headers({
		"Accept": "application/json",
		"Content-Type": "application/json",
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Origin': '*',
	}).post('http://ec2-18-219-87-48.us-east-2.compute.amazonaws.com:3000/commitFile', object)
		.then(function (data) {
			data = data.json();
			console.log('Status response of update data', data);
			if(data.CommitId !== undefined) {
                console.log('here');
                webix.message("Successfully Commited")
            }
            return data;
            
		})
}

let commitValidator = () => {
    return true;
}

function closingPopup() {
//	return new webix.promise(function (success, fail) {
		let filenameentered;
		webix.ui({
			view: "window",
			head: "Save the file",
			id: "closing_confirmation_window",
			body: {
				view: "form",
				id: "log_form",
				width: 300,
				elements: [
					{ view: "text", label: "Do you want to save without closing?", name: "closingConfirmation", id: 'closingConfirmation' },
					{
						margin: 5, cols: [
							{
								view: "button", value: "Save File", css: "webix_primary", click: function (id) {
//									console.log($$('filename').getValue());
//									filenameentered = $$('filename').getValue();
//									$$("file_save_window").close();
//									console.log(filenameentered);
//                                    $$('closing_confirmation_window').close();
//                                     createNewFile(filenameentered);
                                    console.log(id);
								}
							},
                            {
								view: "button", value: "Close without Saving", click: function (id) {
									$$("file_save_window").close();
									$$("toolbar").removeView("aceeditor_button");
									$$('aceeditor_win').hide();
                                    $$('editor').setValue('');
									desktopApp.buttonCount--;
								}
							},
                            
							{
								view: "button", value: "Cancel", click: function (id) {
									$$("closing_confirmation_window").close();
								}
							},
						]
					}
				]
			}
		}).show();
//		success(filenameentered);
       
//	});
}

function getCommitMessage(){
    let commitmessage;
 webix.ui({
			view: "window",
			head: "Enter Commit Message",
			id: "commit_message_window",
			body: {
				view: "form",
				id: "log_form",
				width: 300,
				elements: [
					{ view: "text", label: "Message", name: "commitmessage", id: 'commitmessage' },
					{
						margin: 5, cols: 
                        [
							{
								view: "button", value: "Save", css: "webix_primary", click: function (id) {
									console.log($$('commitmessage').getValue());
									commitmessage = $$('commitmessage').getValue();
									$$("commit_message_window").close();

                                    console.log(commitmessage);
                                    makeCommit(commitmessage);
								}
							},
							{
								view: "button", value: "Cancel", click: function (id) {
									$$("file_save_window").close();
									$$("toolbar").removeView("aceeditor_button");
									$$('aceeditor_win').hide();
									desktopApp.buttonCount--;
								}
							}
						]
					}
				]
			}
		}).show();   
}

function makeCommit(commitmessage) {
    console.log(currentfile);
    console.log("We are about to commit a file");
    let finalData = $$('editor').getValue();
    console.log(currentfile);
    if (currentfile !== undefined) {
        if (Object.is(initialData.response, finalData)) {
            console.log("No change in data");
        } else {
            console.log("Change in data");
            updateData(currentfile, finalData);
        }
        commitFile(currentfile, commitmessage);
    }
}

function getfilesdata () {
    	webix.ajax().headers({
		"Accept": "application/json",
		"Content-Type": "application/json",
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Origin': '*',
	}).get('http://ec2-18-219-87-48.us-east-2.compute.amazonaws.com:3000/loadfiles')
		.then(function (data) {
			data = data.json();
			console.log(data);
            return extractFiles(data);
		})
}

function extractFiles(files) {
      var onlyfiles = [];

      getFiles(files, onlyfiles);


    //   function getFiles(files) {
    //   let onlyfiles = files.map(file => {
    //       if (file.data == undefined) {
    //           return file.value;
    //       } else {
    //           return getFiles(file.data);
    //       }
    //   });
    // //   console.log(onlyfiles)
    //   return onlyfiles;
    // }

    function getFiles(files, onlyfiles) {
        
        files.forEach(function(file){
            if (file.data == undefined) {
                console.log(file);
                onlyfiles.push({value : file.value,
                               id : file.id
                });
            } else {
                getFiles(file.data, onlyfiles);
            }
        });
      //   console.log(onlyfiles)
        // return onlyfiles;
      }
//      console.log(onlyfiles);
    popupdata = onlyfiles;
//    console.log(onlyfiles)
    return onlyfiles;
  

// }
}

function newpopupdata(word) {
    if(newlist == undefined || null) {
        newlist = popupdata;
    }
    newlist = newlist.filter(function (entry) {
  return word === entry.value.substring(0, word.length).toLowerCase();
});
//    console.log(newlist)
    newlist.forEach(entry => {
        $$("popuplist").add(entry);
    })  
    
    
//    newlist.
    
}

