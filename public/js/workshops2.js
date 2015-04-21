	
	var run = function(className) {
	
	//var className = "." + className;
	
	jQuery(className).empty();
	
	//jQuery(className).append('Loading...');
	
	//Get variables from html data attributes.
	var cmdata = jQuery(className).data();
					
	var type = cmdata.type;
	
	var user = cmdata.user;
	
	var size = cmdata.size;
	
	var sort_by = cmdata.sort_by;
	
	var limit = cmdata.limit;
	
	var curation = cmdata.curation;
	
	var date_range = cmdata.daterange;
	
	var start_date = date_range.substr(0, date_range.indexOf(','));
	
	start_date = moment(start_date).unix() * 1000;
	
	var end_date = date_range.substr(date_range.indexOf(',') + 1);
	
	end_date = moment(end_date).unix() * 1000;
	
	var itemName = cmdata.name;
	
	var results;
	/*
	
		console.log('type = ' + type);
		
		console.log('curation = ' + curation);
		
		console.log('user = ' + user);
		
		console.log('sort_by = ' + sort_by); 
		
		console.log('date_range = ' + date_range);
		
		console.log('limit = ' + limit);*/
	
	
	//Function to pull down data from JSON file
	function getInfo(callback) {
            jQuery.getJSON('/wp-content/plugins/spotkin_contraptions/public/js/workshop.json', callback); 
    }

	//Insert the JSON data into a Loki database and query the database based on shortcode arguments
    getInfo(function(json) {
        	
    	var db = new loki('workshops');
    	
    	var collection = db.addCollection('workshops');
        
        //Insert JSON data into Loki DB.
    	for (var i in json.workshops) {
    		
        	collection.insert(json.workshops[i]); 
        	
    	}   
    	        
        //Building the query.
        var query = [];
        
        if (type != 'all') query.push({'itemType': type});
        
        
        //Handle curation type
        if (curation == 'editorschoice') query.push({'editorschoice': true});
        
		else if (curation == 'recent') {
			
			var thirtyDaysAgo = moment().subtract(30, 'days');
			
			query.push({'creationDate': { $gt: thirtyDaysAgo} });
			
		}
		else if (curation == 'specific') {
			
			if (itemName != '') query.push({'name': itemName});
			else {
				alert('A name needs to be added to the Contraptions shortcode when using "specific" as the curation type');
			}
			
		}
		
		//Handle user
		if (user != 'any') {
			
			query.push({'ownerName': user});
			
		}
		
		//Handle start/end dates
		if (date_range != '') {
			
			query.push({'creationDate': {$gt: start_date}});
			
			query.push({'creationDate': {$lt: end_date}});
			
		}
		
		db.save();
		
		//console.log(query);
		
		var contraptions = collection.addDynamicView('contraptions');
		
		//Query the DB based on shortcode arguments       
        contraptions.applyFind(
        	{
        		$and: query
        	}
        );
        
        //Sort the DB based on shortcode arguments
        if (curation == 'popular') {
			
			contraptions.applySimpleSort("rating", -1);
			
		}
		else if (curation == 'featured') {
			
			//Do something??
			
		}
		else if (sort_by == 'date') {
			contraptions.applySimpleSort("creationDate", -1);
		}
		else if (sort_by == 'user') {
			contraptions.applySimpleSort("ownerName");
		}
		else if (sort_by == 'name') {
			contraptions.applySimpleSort("name");
		}
        
        //console.log(contraptions);
        var displayResults = function() {
        	
        	results = contraptions.data();
        	
        	//Display results
	        for (var i in results) {
	        	
	        	result = results[i];
	        	
	         	var name = result.name;
	        	
	        	if(name.length > 20) name = name.substring(0,20);
	        	
	        	var date = new Date(result.creationDate);
	        	
	        	jQuery(className).append('<li class=blog-thumbs-view-entry><div class=blog-thumb><img width=185 height=117 src=' + result.imageUrl + ' class=attachment-my-thumbnail wp-post-image alt=collage-resized /></a></div><div class=group-box-bottom><div class=blog-thumb-title>' + name + '</div>' + result.ownerName + '<br> Rating: ' + result.rating + '<div class=group-box-details><ul class=post-categories><li><a href=# rel=category tag>' + result.itemType + '</a></li></ul> <br>' + date.toDateString() + '</div></div></li>');
	        	
	        	if (i >= limit-1) {
	        		return false;
	        	}          
	       	}
	       		       	
	       	if (results.length == 0) {
	       		jQuery(className).empty();
	       		jQuery(className).append('No contraptions found.');
	       	}	
        }
        
        //Clear the loading message and display results.
        jQuery(className).empty();
        displayResults();
    });
    
}