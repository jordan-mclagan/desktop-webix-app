let currentfile = '';
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
					head: desktopApp.wins.ui.toolbar.apply(this, config.toolbar()),
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
			toolbar: function (title, onHide, onMinMax, onClose) {
				return {
					view: "toolbar",
					height: 28,
					css: "window-toolbar",
					cols: [
						{ view: "label", label: "<img src='img/window-icon.png' class='header-window-icon'/> " + title },
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
							$$('aceeditor_win').hide();
							webix.html.removeCss($$("aceeditor_button").$view, "active");
						},
						function () {
							$$("aceeditor_win").config.fullscreen = !$$("aceeditor_win").config.fullscreen;
							$$("aceeditor_win").resize();

							aceeditor.render();
						}, function () {
                            console.log($$('editor').getValue());
							console.log(currentfile);

//							editor.getSession().on("change", function () {
//								textarea.val(editor.getSession().getValue());
//							});

							if($$('editor').getEditor().getSession().on("change", function () {
								// textarea.val(editor.getSession().getValue())
								console.log("value changed");
							}));
                            $$('editor').setValue('');
							$$("toolbar").removeView("aceeditor_button");
							$$('aceeditor_win').hide();
							desktopApp.buttonCount--;
						}
					]
				},
				body: function (editorValue) {
					console.log("This is editor value", editorValue);
					editorValue = editorValue || "";
					return {

						id: "editor",
						view: "ace-editor",
						value: "No value",
						// value: editorValue // code string

						//						view: "dhx-gantt",
						//						id: "gantt",
						//						init: function () {
						//							//do nothing
						//						},
						//						ready: function () {
						//							gantt.parse(tasks);
						//						}
					}
				},
				events: {
					onBeforeShow: function () {
						desktopApp.beforeWinShow("aceeditor");
					},
					onKeyPress: function () {
						console.log("Key Press Occured");
						console.log($$('editor').getValue());
					},
					onclose: function () {
						console.log($$('editor').getValue());

					},
					onLiveEdit: function (state, editor, ignoreUpdate) {
						//                        webix.message("Current value: " + state.value);
						//                        console.log(state.value);
						console.log($$('editor').getValue());

					},


				}
			},

			//            var iframe = webix.ui({     
			//    view:"iframe", 
			//    id:"frame-body", 
			//    src:"//docs.webix.com/samples/80_docs/data/pageA.html"
			//});
			orders: {
				toolbar: function () {
					return [
						"Orders",
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
						//                        width: "200",
						//                        height: "200"

						//						view: "dhx-gantt",
						//						id: "gantt",
						//						init: function () {
						//							//do nothing
						//						},
						//						ready: function () {
						//							gantt.parse(tasks);
						//						}
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
						//                        width: "200",
						//                        height: "200"

						//						view: "dhx-gantt",
						//						id: "gantt",
						//						init: function () {
						//							//do nothing
						//						},
						//						ready: function () {
						//							gantt.parse(tasks);
						//						}
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
						//                        width: "200",
						//                        height: "200"

						//						view: "dhx-gantt",
						//						id: "gantt",
						//						init: function () {
						//							//do nothing
						//						},
						//						ready: function () {
						//							gantt.parse(tasks);
						//						}
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

			//            popup: {
			//				toolbar: function () {
			//					return [
			//						"Accounting",
			//						function () {
			//							$$('accounting_win').hide();
			//							webix.html.removeCss($$("accounting_button").$view, "active");
			//						},
			//						function () {
			//							$$("accounting_win").config.fullscreen = !$$("accounting_win").config.fullscreen;
			//							$$("accounting_win").resize();
			//
			//							accounting.render();
			//						}, function () {
			//							$$("toolbar").removeView("accounting_button");
			//							$$('accounting_win').hide();
			//							desktopApp.buttonCount--;
			//						}
			//					]
			//				},
			//				body: function () {
			//					return {
			//						id: "frame",
			//						view: "iframe",
			//						src: "http://groctaurantretail.com/admin/zxy321/accounting.php",
			//					}
			//				},
			//				events: {
			//					onBeforeShow: function () {
			//						desktopApp.beforeWinShow("accounting");
			//					},
			//
			//				}
			//			},


			deliveredAndRejectedOrders: {
				toolbar: function () {
					return [
						"Delivered and Rejected Orders",
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
							$$('filemanager_win').hide();
							webix.html.removeCss($$("filemanager_button").$view, "active");
						},
						function () {
							$$("filemanager_win").config.fullscreen = !$$("filemanager_win").config.fullscreen;
							$$("filemanager_win").resize();

						}, function () {
							$$("toolbar").removeView("filemanager_button");
							$$('filemanager_win').hide();
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
					onBeforeShow: function () {
						desktopApp.beforeWinShow("filemanager");
						var actions = $$("filemanager").getMenu();
						actions.add({ id: "newFile", icon: "file", value: "Create New File" });

						//						actions.attachEvent("onItemClick", function (id) {
						//							if (id == "newFile") {
						//                                desktopApp.wins.showApp("aceeditor");
						//                                $$("aceeditor").setValue("newcode");
						//
						//                        }
						//						});

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
//                            console.log($$("filemanager").$$("modes"));
                            console.log($$('filemanager').getParentView());
							if (id.row != undefined) {
								userAction(id.row);
							} else {
                                userAction(id);
                            }
						})
					},
					onShow: function () {

						if (!$$("filemanager").$$("tree").getSelectedId())
							$$("filemanager").$$("tree").select($$("filemanager").getFirstChildId(0));

						var actions = $$("filemanager").getMenu();
						console.log(actions);
						actions.attachEvent("onItemClick", function (id) {
							if (id == "newFile") {
								editor('');
							}
						});
					},
					onItemSelect: function (id) {
						//                        console.log(value, id, type);
						console.log(id);
					},

					onItemDblClick: function (id, value, type) {
						console.log(value, id, type);
					},


					//                    onItemClick : function(id) {
					//                        if (id == "newFile") {
					//                                desktopApp.wins.showApp("aceeditor");
					//                                $$("aceeditor").setValue("newcode");
					//
					//                        }
					//                    },
					// onBeforeDelete: function (id) {
					// 	//... some code here ... 
					// 	//return false to block operation
					// 	alert(this.item(id).title);
					// 	// if(id == 'chicken-biryani') {
					// 	// 	return false;
					// 	// }
					// 	// return true;
					// 	return false

					// },
				}
			}
		}
	};

let editor = function (data) {
	desktopApp.wins.showApp("aceeditor", "{new : data}");
	console.log($$("editor"));
//    let editor = $$('editor').getEditor.setValue(data)
	let editordata = $$("editor").getValue();
//	console.log(editordata)
    console.log(data)
	$$("editor").setValue(data);
	//    $$("editor").getEditor.setValue("Hellooooo")
	//    console.log($$("editor").getValue());
}


//let userAction = async function (filepath){
////	JSON.stringify(filepath);
//    let data = {'file' : filepath};
//    JSON.stringify(data);
//    console.log(data);
//		const response = await fetch('http://127.0.0.1:3000/getFile', {
//			method: 'post',
//            headers: {
//                'Content-Type': 'application/x-www-form-urlencoded',
//            },
////			body: data, // string or object
//            body: {
//                "file": "./filesystem/Recipes/APPLE CINNAMON MOUSSE.json"
//            },
//            
////			headers:{
////                'Accept': 'application/json',
////				'Content-Type': 'application/json',
//////               'Access-Control-Allow-Origin': '*',
//////               'Access-Control-Allow-Credentials' :true,
//////                'credentials': "include",
////
////			},
//			mode:"no-cors",
//		});
//    console.log(response);
//	const myJson = await response.json(); //extract JSON from the http response
//	console.log(myJson);
//}

let userAction = (filepath) => {
	let body = { 'file' : filepath};
	JSON.stringify(body);
    currentfile = filepath;
	webix.ajax().headers({
		"Accept": "application/json",
		"Content-Type": "application/json",
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Origin': '*',
	}).post('http://ec2-18-219-87-48.us-east-2.compute.amazonaws.com:3000/getFile', body)
		.then(function (data) {
			data = data.json();
			console.log(data);
			return data;
		})
		.then(function (data) {

        let modified = JSON.stringify(data, null, 4)
        console.log(modified);
        modified += ""+modified+"";
			editor(modified);

		})
}
