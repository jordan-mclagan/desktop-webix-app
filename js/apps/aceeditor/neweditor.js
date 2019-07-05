function startEditor(filepath){
    webix.ui({
        view:"iframe",
//        id:"my_win",
//        head:"My Window",
        width: 200,
        height: 200,
        left:90,
        top:130,
//        position: fixed,
        move:true,
        src: "http://127.0.0.1:33525/editor.html" + (filepath == '' ? '' : '?file=' + filepath),
//
//        body:{
//            template:"Some text"
//        }
    }).show()
//    $$('my_win').show();
}