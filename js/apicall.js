function postCall(path, body) {
    console.log(path, body);
return (webix.ajax().headers({
		"Accept": "application/json",
		"Content-Type": "application/json",
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Origin': '*',
	}).post('http://ec2-18-219-87-48.us-east-2.compute.amazonaws.com:3000/'+path, body)
		.then(function (data) {
			data = data.json();
			console.log('Status response of update data',data);
	       return data;	
    }))
}
        
        