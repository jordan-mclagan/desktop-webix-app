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

			toolbar : toolbar,
			acetoolbar : acetoolbar,
			
			aceeditor : aceeditor,
			orders : orders,
			recipes : recipes,
			crm : crm,
			merchants : merchants,
			accounting : accounting,
			deliveredAndRejectedOrders : pastOrders,

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


			

			filemanager: filemanager,
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

let commitFile = (filepath, commitMessage) => {
	let object = {
		'filePath': filepath,
		'commitMessage': commitMessage,
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
			if (data.CommitId !== undefined) {
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

function getCommitMessage() {
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

function getfilesdata() {
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

		files.forEach(function (file) {
			if (file.data == undefined) {
				console.log(file);
				onlyfiles.push({
					value: file.value,
					id: file.id
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
	if (newlist == undefined || null) {
		newlist = popupdata;
	}
	newlist = newlist.filter(function (entry) {
		return entry.value.toLowerCase().includes(word)
		//  return word === entry.value.substring(0, word.length).toLowerCase();
		//        entry.value.includes(word)

		//        e.lines[0].includes('@')
	});
	//    console.log(newlist)
	newlist.forEach(entry => {
		$$("popuplist").add(entry);
	})


	//    newlist.

}

