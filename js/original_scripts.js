
function initialize_it(gmt){

	// Main function.	
	G_VAR = {	
				// names: textArray,
				nodes: [],  // nodes Container
				width: 1, //Math.sqrt(weights.length),
				canvasSize: 275,
				scale: 1,
				canvasRGB : 	[0, 255, 255],
				indicatorColor: [255, 255, 255],
				avgWeight : 0,
				scaleZoom: 1,
				translateZoom: [0,0], 
				gmt_flip: {},
				gmt: {},
				randomArray: []
			};

	G_VAR.nodes = _.keys(gmt);

	return G_VAR;
};

function gmt_flipper(gmt){

	// flips the gmt to make a element associated with a list of terms gmt 
	// console.log('running gmt_flipper');
	
	// initialize gmt_flip
	gmt_flip = {};

	// loop through the terms of the gmt 
	for (var term in gmt){

		// gather the elements associated with this term 
		elements = gmt[term];

		// loop through the elements 
		for (var i = 0; i < elements.length; i++){

			// if the element is alrady present in the gmt_flip then push the new term 
			// into the gmt_flip object 
			if ( elements[i].toUpperCase() in gmt_flip ){

				gmt_flip[ elements[i].toUpperCase() ].push( term );

			// if the term is not present then make a new key-value pair in the object 
			} else {
				gmt_flip[ elements[i].toUpperCase() ] = [term];
			} 
		}
	}

	return gmt_flip;
};

function clear_text_area(textArea, callback){

	textArea.value = "";
	textArea.onfocus = "";

	// remove radio buttons when clear button is pressed
	d3.select('#choiceView').style('display','none');

	// remove the enrichment results table when the clear button is pressed
	d3.select('#enrichment_results').style('display','none');
};

function clear_search_only(textArea){

	// clear text area of current text-box 
	textArea.value = "";
	textArea.onfocus = "";
};

function example_random(gmt, randomArray, x){
	// Generates a random set of genes from the infoArray file.
	// The default number of genes is set to 20 and can be modified
	// in the HTML File.
	var count = 0;
	var wait = self.setInterval(function(){
			
		if (is_empty(G_VAR.gmt) == false){
            //console.log('not stuck here')
			clearInterval(wait);
			gmt = G_VAR.gmt;
			if (randomArray == false){
				var u = create_unique_array(gmt)   
				randomArray = u[1];
				G_VAR.randomArray = randomArray;
			}
				for (var i = 1; i <=x ; i++){
					q = Math.floor(Math.random() * randomArray.length)
					swap = randomArray[randomArray.length - i];
					randomArray[randomArray.length - i] = randomArray[q];
					randomArray[q] = swap;
				}

				document.getElementById("input_text_appearing").value = randomArray.slice(randomArray.length - x).join('\n');

		} else {
			please_wait(count, "genes", "value");
			count += 1;
		}										
	} , 100);
};

function please_wait(count, target, attribute){
	if (count%4 == 0){
		dots =" ";
	} else if (count%4 == 1 ) {
		dots = " .";
	} else if (count%4 == 2) { 
		dots = " . .";
	} else {
		dots = " . . .";
	}
	
	if (attribute == "value"){
		document.getElementById(target).value = "Getting GMT File. Please wait" + dots; 
	} else if (attribute == "innerHTML") {
		document.getElementById(target).innerHTML = "Getting GMT File. Please wait" + dots; 
	}
};


	
function create_XMLhttp(){
	var xmlhttp;
	if (window.XMLHttpRequest) {
	  	xmlhttp=new XMLHttpRequest();
	} else {
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xmlhttp;
};



function save_enrichment_results(enrichment_string){

  //   // JQuery post command
  //   random_number = Math.floor(Math.random()*10000001);

		// $.post('save_enrichment_results.php', {data: enrichment_string, rand: random_number}, function() {
		// 		window.location="force_download.php?q=" + random_number;
		// 	}
		// );
  //   console.log('the random number that is appended to the document');
  //   console.log(random_number);

};



function get_JSON(json, canvasRGB, indicatorColor){
  
	G_VAR = initializeIt(json); 
};

function clear_enrichment(){

	console.log('run clear_enrichment')

	// remove enrichment 
	d3.select('#style_download_enrichment_results').remove();
	d3.select('#style_svg_download').remove();
	d3.select("#GSE").remove();
	d3.select('#force_download_link').style('display','none');
	d3.select('#enrichment_panel').transition().duration(200).style('opacity',0).transition().delay(200).style('display','none');


	// reset the class of the enriched nodes 
	d3.selectAll('.node_enr')
		.attr('class','node');

  // first reset all nodes that are not enriched, enriched nodes have a different class
  d3.selectAll('.node')
  	.select('circle')
		.transition().duration(10)
		.attr('r',4)
		.style('fill','#1f77b4')
		.style('opacity',0.5);

  // first reset font-weight 
  d3.selectAll('.node')
  	.select('text')
		.transition().duration(10)
		.style('font-weight','normal')
		.style('opacity',0.2);

	// if node information panel is present, then move it up 
	if (d3.select('#node_info_panel').style('display') == 'block'){
		// re-position the panel at the top of the right side 
		d3.select('#node_info_panel')
			.transition().duration(1000)
			.style('top',node_info_panel_y_high+'px');
	}; 

	// if there is no node information panel and the instructions are not shown then show the instrutions again 
	if (d3.select('#node_info_panel').style('display') == 'none' && d3.select('#pop_instructions').style('display') == 'none' ) {
		
		d3.select('#pop_instructions').style('opacity',0)
			.transition().duration(500).style('opacity',1)
			.transition().delay(400).style('display','block');
	};
};

function highlight_search_terms(nodes, search_terms, RGB, width){

	// split the search terms into a capitalized list 
	var search_terms_list = search_terms.toUpperCase().replace(/ /g, '').replace(/,/g, '').replace(/\t/g, '\n').split("\n");

	console.log(search_terms_list)

	// find the search terms that are in the list of nodes 
	found_terms = _.intersection(G_VAR.nodes, search_terms_list);
	
	// console.log('found search terms' + found_terms)

	// tell the user that no search terms matched
	if (found_terms.length == 0){
		console.log('did not match any search terms');
		$('#no_matched_terms').foundation('reveal', 'open'); 
	};

	

	// run the append highlight rects function 
	add_node_highlights(found_terms);
};

function highlight_search_elements_detailed( query_elements ){


	var checkList = {};
	var nodeNames = [];
	associated_terms = [];


	console.log('query_elements: ' + query_elements);

	// loop through the query_elements and find their assocaited terms 
	for (var i = 0; i < query_elements.length; i++){

		// console.log('detailed query_elements: ' + query_elements[i])

		// only search for associated terms if there is an input element 
		if (query_elements[i].length > 0){

			// get the inst_assocaited_terms 
			inst_assocaited_terms = G_VAR.gmt_flip[ query_elements[i] ];

			if (typeof inst_assocaited_terms != 'undefined') {	
				// grab the terms associated with this element 
				associated_terms = associated_terms.concat( inst_assocaited_terms );
			};
		};
	};


	// find the unique associated terms 
	associated_terms = _.uniq(associated_terms);

	global_associated_terms = associated_terms ;

	// console.log('associated_terms: ', associated_terms )

	// check that there were associated terms found 
	if (associated_terms.length == 0) {
		console.log('no associated terms')
		$('#no_matched_elements').foundation('reveal', 'open'); 
	};


	// run the append highlight rects function 
	add_node_highlights(associated_terms);
};
		
function highlight_search_elements( query_elements ){

	// console.log('number query_elements: ' + query_elements.length);
	// console.log(query_elements)

	// run if there are search terms 
	if ( query_elements.length > 0 ){

		// generate an array from the query_elements
		var query_elements = query_elements.toUpperCase().replace(/ /g, '').replace(/,/g, '').replace(/\t/g, '\n').split("\n");

		// calculate the flipped gmt 
		G_VAR.gmt_flip = gmt_flipper(G_VAR.gmt);

		// the gmt and flipped gmt should always be defined 
		highlight_search_elements_detailed( query_elements );

	} else {
		// no query elements were found in the library 
		console.log('there were no search terms');
		$('#no_matched_elements').foundation('reveal', 'open'); 
	};
}; 

function is_empty(obj){
	for (var i in obj){
		if (obj.hasOwnProperty(i)){ return false; };
	}
		return true;
};

function count_keys(obj){
	var count = 0, key;
	for (var key in obj){
		if (obj.hasOwnProperty(key)){
			count += 1;
		}
	}
	return count;
};

function create_unique_array(array){
	var uniqueDict = {} , uniqueArray = [];
	for (index in array){
		elements = array[index];
		for ( i in elements){
			uniqueDict[elements[i]] = 1;
		}
	}
	for (element in uniqueDict){
		uniqueArray.push(element);
	}
	return [uniqueDict, uniqueArray];
};

function calculate_gene_fill(nodes, elements, hexCode, gmt_flip, gmt){
	
	var contA, contB, contC, contD;
	nodeList = [];		// Stores Fisher Test Results
	var listDownload = [];			
	var rawList = elements.toUpperCase().replace(/ /g, '').replace(/,/g, '').replace(/\t/g, '\n').split("\n"); 
	var elementAssoc = {};
	var checkList = {};
	var query_elements = [];

	// replace all commas or semicolons with white space 
	rawList = rawList.map(function(x) {return x.replace(/[,]+/g,' ')});
	rawList = rawList.map(function(x) {return x.replace(/[;]+/g,' ')});
	// strip the white space from the string names
	rawList = rawList.map(function(x) {return x.trim(); });


	if (is_empty(gmt_flip)){
			G_VAR.gmt_flip = gmt_flipper(gmt);
			gmt_flip = G_VAR.gmt_flip;
	}
	
	for (var index in rawList){ //remove duplicates
			elementAssoc[rawList[index].toUpperCase()] = 1;
		}
 
		
	for (var key in elementAssoc){ //remove non-mapped entries
		if (key in gmt_flip){
			query_elements.push(key);
		}
	}


	G_VAR.query_elements = query_elements ;

	// Create contigency table for Fisher Test
	var totalGeneCount    = count_keys(gmt_flip);				
	var totalElementCount = query_elements.length;

	// Calculate pvalue using FisherTest
	for (var key in gmt){
		var info = gmt[key];
		var contigencyTable = []; 
		var genesIntersect  = [];
		contA = 0;

		checkList = {};
		var contC = 0;
		for (var index in info){
			if (!(info[index].toUpperCase() in checkList)){   //Remove effect of any duplicate genes in the info line.
				contC += 1
				checkList[info[index].toUpperCase()] = 1;
				if ((info[index].toUpperCase() in elementAssoc)){ //Get intersection
					contA += 1;
					genesIntersect.push(info[index]);
				}
			}
		}

		if (contA !== 0){
			var contB = totalElementCount - contA;
			var contD = totalGeneCount - contC;
			var pvalue = fisher_exact(contA, contB, contC, contD)
			nodeList.push([key.toUpperCase(), pvalue, pvalue, pvalue, contC, query_elements.length, contA, genesIntersect.join(",\t")])
			listDownload.push([key.toUpperCase(),pvalue])	
		}
	}


	// sort by ascending p-value
	nodeList.sort(function(a,b){return a[1]-b[1]});


	// BH correction for p-values.
	raw_pvalues = _.map(nodeList,function(item){return parseFloat(item[1]);});
	raw_pvalues_reverse = raw_pvalues.reverse();
	corrected_pvalues = []; 

	var currentListCount = raw_pvalues.length;
	var totalListCount = raw_pvalues.length;
	var previousValue = 1;
	var adjustedPvalue = 0;


	// the pvalues are given in decreasing order
	// each subsequent corrected p-value should be less than the previous one:
	// monotonically decreasing corrected p-values
	for (var i = 0; i < totalListCount; i++){
		adjustedPvalue = raw_pvalues_reverse[i] *  totalListCount / currentListCount; 	

		//Preserve Monotonicity
		corrected_pvalues[i] = (adjustedPvalue < previousValue) ? adjustedPvalue : previousValue; 
		previousValue = corrected_pvalues[i]

		// lower the current list count 
		currentListCount -= 1;
	}

	//corrected_pvalues_str = _.map(corrected_pvalues,function(item){return item.toExponential(3);});
	corrected_pvalues_str = _.map(corrected_pvalues, function(item){
																		if (item < 0.01) {
																			return item.toExponential(3);
																		} else {
																			return item.toPrecision(3);
																		}
																	});
	corrected_pvalues_str = corrected_pvalues_str.reverse();


	// transfer the corrected pvalue to the nodelist 
	for (var i = 0; i < totalListCount; i++){

		// save the BH corrected p-value
		nodeList[i][1] = corrected_pvalues_str[i];

		// correct with Bonferroni
		nodeList[i][2] = nodeList[i][3] * nodeList.length;



		// console.log('nodeList.length: ', nodeList.length)
	}


	// the nodelist does not need to be resorted, its already sorted
	// nodeList.sort(function(a,b){return a[1]-b[1]});

	nodeTextFile = [["Node Name", 
					 "Corrected P-value with Benjamini-Hochberg", 
					 "Corrected P-Value with Bonferroni",
					 "Original P-Value", 
					 "Total Genes in Gene Set", 
					 "Total Genes in Input", 
					 "Total Genes Intersected", 
					 "Intersecting Genes"].join('\t')];			
	nodeNames =[];
	dictNode = {};
	
	for (var i = 0; i < nodeList.length; i++){
		// hacking Chris's code to get original p-values without correction
		if (i < 20){
			dictNode[nodeList[i][0].toUpperCase()] = nodeList[i][1]
			nodeNames.push(nodeList[i][0].toUpperCase())
			nodeTextFile.push([nodeList[i].join('\t')])
		} 
	}

	nodeList = nodeList.slice(0,20);
	nodeNames = nodeNames.slice(0,20);
	G_VAR.nodeList = nodeList
	G_VAR.nodeNames = nodeNames
	

	// Only run this if there are input genes that are found in the library
	if (G_VAR.nodeNames.length > 0) {

		d3.select('#totalGenesFound').style('display', 'block');
		if (phospho_level == 1){
			d3.select('#totalGenesFound').html([ 'Found '+ G_VAR.query_elements.length.toString() + ' phosphosites in the library']); 
		} else {
			d3.select('#totalGenesFound').html([ 'Found '+ G_VAR.query_elements.length.toString() + ' genes in the library']); 
		};

    // gather the pvals 
		logpval = [];
    for (i = 0; i<nodeList.length; i++){
      logpval.push(-Math.log(nodeList[i][1]));
    }; 

    // find the maximum logpval
    max_logpval = d3.max(logpval);

		// Highlight the enriched terms in the network 
		//
		// define a scale for the opacity of the circles 
		scale_radius = d3.scale
										.linear()
										.domain([0, max_logpval])
										.range([4.1,30]);
		// define a scale for the stroke width of the outline of the circle
		scale_stroke = d3.scale
										.linear()
										.domain([0, max_logpval])
										.range([1.5,2]);
		

		///////////////////////////////////////////////////
		// highlight the enriched terms in the network 
		///////////////////////////////////////////////////
		// reset the class of the previously enriched nodes 
		d3.selectAll('.node_enr').attr('class','node');

		for (inst = 0; inst < nodeList.length; inst++ ){
			// get the node name
			inst_node_name = nodeList[inst][0];
			// get the -log pval (its the third column)
			inst_log_pval = -Math.log(nodeList[inst][1]);

			// make other nodes less visible 
			d3.selectAll('.node')
				.select('circle')
				.style('opacity',0.1);

			d3.selectAll('.node')
				.select('text')
				.style('opacity',0.1);

	    // highlight the selected node and increase the node size
	    //
	    // highlight node
	    d3.select('#id_'+inst_node_name.replace('&','') )
	    	.select('circle')
	    	// .transition().duration(150).style('stroke-width', 1.5)
	    	.transition().duration(150)
	    	.attr('r', scale_radius(inst_log_pval))
	    	.style('opacity',0.5);

	    // make name bold 
	    d3.select('#id_'+inst_node_name.replace('&','') )
	    	.select('text')
	    	.transition().duration(10)
	    	.style('opacity',1)
	    	// !!! increase font-size of enriched terms 
	    	.style('font-size','15px')
	    	.style('font-weight',900);

	    // change the class of the node
	    d3.select('#id_'+inst_node_name.replace('&','') ).attr('class','node_enr');
	    
		};

		// make_svg_circle(nodes, 275 / Math.sqrt(G_VAR.nodes.length));	
		query_elements.sort();
		
		// Creates the Enrichment result table 
		//
		// console.log('		making enrichment results table')
		var GSE = d3.select("#enrichment_results").append("div").attr("id", "GSE");
	  
		baseTable = GSE.append("table")
			.attr("id", "GSEElement")
			.attr("width", "100%")
			.attr("class", "style_results_table");

		header_title = ['Term', 'P-Value']
		var tableHead = baseTable.append('thead').append('tr');

		// write the two header titles 
		for (var x = 0; x < 3; x++){
				if (x==0)
					tableHead.append('th')
						.text(header_title[x])
						.attr('width','160px')
						.attr('font-size', '12px');
				else if (x==1)
					tableHead.append('th')
						.text(header_title[x])
						.attr('width','70px')
						.attr('font-size', '12px');
		};
	

		for (var i = 0; i < nodeList.length; i++){
			var tableRow = baseTable.append('tbody').append('tr');

			for (var x = 0; x < 4; x++){
				// column 1
				if (x == 0 ){
					// construct the table 
					tableRow
						.attr('data-tooltip','')
						.attr('class', 'has-tip tip-left')
						.attr('title', nodeList[i][7])
						.append("td")
						.style('table-layout','fixed')
						.style('word-break','break-all')
						.text(nodeList[i][x])
						// click table and get information on enriched term
						.on('click', function(){

							// get the name of the term from the enriched table 
							inst_term = d3.select(this).text();

							// click on a row to highlight the entry in the network 
							//
			        // if the node has not been clicked 
			        if (d3.select('#id_'+inst_term.replace('&','') ).attr('class') == 'node_enr' ) {

			          // show the information panel with the node and elements 
			          // if there is an enrichment result then lower the result panel below the enrichment results 
			          if (d3.select('#GSE').empty() == 1){           
			            // no enrichment results, so show panel at original position
			            d3.select('#node_info_panel').style('top',node_info_panel_y_high+'px').transition().duration(500).style('display','block').style('opacity',1);
			          }
			          else  {
			            // there are enrichment results, so show the panel at the botton 
			            d3.select('#node_info_panel').style('top',node_info_panel_y_low+'px').transition().duration(500).style('display','block').style('opacity',1); 
			          };

			          // reset all nodes 
			          //
			          // first reset the class of the previously selected node - reset normal and enriched nodes
			          d3.selectAll('.node_select').attr('class','node');
			          d3.selectAll('.node_select_enr').attr('class','node_enr'); 
			          // not enriched nodes
			          //
			          // first reset all nodes that are not enriched, enriched nodes have a different class
			          d3.selectAll('.node').select('circle').transition().duration(10).attr('r',4).style('fill','#1f77b4');

			          // first reset font-weight 
			          d3.selectAll('.node').select('text').transition().duration(10).style('font-weight','normal').style('opacity',0.2);
			          // enriched nodes
			          //
			          // first reset all nodes that are not enriched, enriched nodes have a different class
			          d3.selectAll('.node_enr').select('circle').transition().duration(10).style('fill','#1f77b4');
			          // first reset font-weight 
			          d3.selectAll('.node_enr').select('text').transition().duration(10).style('font-weight','normal');
			          

			          // highlight node and change class 
			          // 
                // label it as a selected enriched node 
		            d3.select('#id_'+inst_term.replace('&','')).attr('class','node_select_enr');
		            // only change the color
		            d3.select('#id_'+inst_term.replace('&','')).select('circle').transition().duration(150).style('fill','#A00000');

		            console.log('clicking row')


			          // get the node of interest
			          inst_node_name = d3.select('#id_'+inst_term.replace('&','')).select('text').text() ;

			          // show node and element information in the pop-up panel 
			          d3.select('#nodeName')
			          	.style('display','block')
			          	.text( inst_node_name )
			          	.on('click', function(){

			          		console.log('clicking on node title')
						        // add links to pubmed or geo if applicable 
						        if (inst_link_status == 'pubmed'){

											// get the name of the term from the enriched table 
											inst_term = d3.select(this).text();

											// get the inst_pubmed
											//
											// split by underscore
											var inst_term_split = inst_term.split('_');
											// grab the last part
											var inst_pubmed = inst_term_split[inst_term_split.length-1];

						          // open the pubmed link if the network is SILAC 
						          //
						          // define web address
						          web_address = 'http://www.ncbi.nlm.nih.gov/pubmed/' + inst_pubmed;
						          window.open(web_address, '_blank')
						        	
						        }
						        else if (inst_link_status == 'geo'){

											// get the name of the term from the enriched table 
											inst_term = d3.select(this).text();

											// get the inst_geo 
											//
											// split by underscore
											var inst_term_split = inst_term.split('_');
											// grab the last part
											var inst_geo = inst_term_split[inst_term_split.length-1];

						          // open the geo link if the network is SILAC 
						          //
						          // define web address
						          // web_address = 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=' + inst_geo;
						          web_address = 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=' + inst_geo;
						          window.open(web_address, '_blank')

						        	// http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=
						        }; 
			          	});

			          d3.select('#additionalInfo').style('display','block').text( G_VAR.gmt[ inst_node_name ].join(', ') );
			        }

			        // if the node has been clicked
			        else {

			          // remove the information panel with the node and elements 
			          d3.select('#node_info_panel').transition().duration(200).style('opacity',0).transition().delay(200).style('display','none');

			          // reset all nodes 
			          //
			          // first reset the class of the previously selected node - reset normal and enriched nodes
			          d3.selectAll('.node_select').attr('class','node');
			          d3.selectAll('.node_select_enr').attr('class','node_enr'); 
			          // not enriched nodes
			          //
			          // first reset all nodes that are not enriched, enriched nodes have a different class
			          d3.selectAll('.node').select('circle').transition().duration(10).attr('r',4).style('fill','#1f77b4');
			          // first reset font-weight 
			          d3.selectAll('.node').select('text').transition().duration(10).style('font-weight','normal').style('opacity',0.2);
			          // enriched nodes
			          //
			          // first reset all nodes that are not enriched, enriched nodes have a different class
			          d3.selectAll('.node_enr').select('circle').transition().duration(10).style('fill','#1f77b4');
			          // first reset font-weight 
			          d3.selectAll('.node_enr').select('text').transition().duration(10).style('font-weight','normal');

			        }

			        // add links to pubmed or geo if applicable 
			        if (inst_link_status == 'pubmed'){

								// get the name of the term from the enriched table 
								inst_term = d3.select(this).text();

								// get the inst_pubmed
								//
								// split by underscore
								var inst_term_split = inst_term.split('_');
								// grab the last part
								var inst_pubmed = inst_term_split[inst_term_split.length-1];

			          // open the pubmed link if the network is SILAC 
			          //
			          // define web address
			          web_address = 'http://www.ncbi.nlm.nih.gov/pubmed/' + inst_pubmed;
			          window.open(web_address, '_blank')
			        	
			        }
			        else if (inst_link_status == 'geo'){

								// get the name of the term from the enriched table 
								inst_term = d3.select(this).text();

								// get the inst_geo 
								//
								// split by underscore
								var inst_term_split = inst_term.split('_');
								// grab the last part
								var inst_geo = inst_term_split[inst_term_split.length-1];

			          // open the geo link if the network is SILAC 
			          //
			          // define web address
			          // web_address = 'http://www.ncbi.nlm.nih.gov/sites/GDSbrowser?acc=' + inst_geo;
			          web_address = 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=' + inst_geo;
			          window.open(web_address, '_blank')

			        	// http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=
			        };
			          						  
						});
				}
				// column 2 
				else if (x == 3){
					tableRow
						.append("td")
						.text( nodeList[i][x].toExponential(2) );
				}
			}			
		}

		d3.selectAll("#textdownload").remove();
		d3.selectAll("#toggleC 	hart").remove();


		//Builds the Network View
		d3.selectAll("#NetworkView").remove();
		var w = 275;
		
		// Make download file 
    // use d3 to make the link that will generate the file, download, and delete it
    // console.log('CREATING THE TEXT FILE')
    file_string = nodeTextFile.join('\n') ; 
    random_number = 1 ;

    // this link will be added to the div with the id force_download_link
    d3.select("#force_download_link")
    	.attr("class", "text-center add_top_margin style_force_download_link")
    	.append('a')
    	.attr('id','style_download_enrichment_results')
    	.text('Download Enrichment Results')
			.attr('download','enrichment_results.txt');

		// d3.select('#force_download_link')
		// 	.append('a')
		// 	.attr('id','programatically')
		// 	.attr('download','enrichment_results.txt')
		// 	.text('click-here');

		$("a#style_download_enrichment_results").click(function(){
		  // var now = new Date().toString();
		  var now = file_string;
		  this.href = "data:text/plain;charset=UTF-8,"  + encodeURIComponent(now);
		});


    d3.select("#force_download_link")
    	.attr("class", "text-center add_top_margin style_force_download_link")
    	.append('div')
    	.attr('id','style_svg_download')
    	.append('a')
    	.text('Download Network SVG')
    	.on('click', function(){
	    	console.log('trying to download svg');
	    	svg_download();
    	});

    	// .html("<a onclick='save_enrichment_results(file_string);'>Download Enrichment Results</a>")
    	// .text('Download Network SVG')
    	// .on('click', function(){
    	// 	console.log('trying to download svg')
    	// });

		d3.select('#downloadSVG').style('display', 'none'); 

		}

		// if there are no input genes
		else 
		{

			// if no input genes 
			console.log('none of the input genes were found in the library'); 
			$('#no_matched_genes').foundation('reveal', 'open'); 

			// don't display the radio buttons if there are no results 
			d3.select('#choiceView').style('display','none');
		}
};

function gene_fill(nodes, elements, hexCode, gmt_flip, gmt, random_number){
	// Calculates the enrichment of a node for a user-inputed set of elements.
	// Outputs a p-value based on the Fisher's Exact Test.
	// Calculates the manhattan distance between those nodes.
	// Creates a bar graph and a table that shows the most significant results of the analysis.
	// Creates a text file containing the full table.

	console.log('Calc Enr in gene_fill')

	// remove previous enrichment download buttons
	d3.select('#style_download_enrichment_results').remove();
	d3.select('#style_svg_download').remove();

	// reset the class of the enriched nodes 
	d3.selectAll('.node_enr').attr('class','node');
  // first reset all nodes that are not enriched, enriched nodes have a different class
  d3.selectAll('.node')
  	.select('circle')
  	.transition().duration(10)
  	.attr('r',4)
  	.style('fill','#1f77b4');

  // first reset font-weight 
  d3.selectAll('.node')
  	.select('text')
  	.transition().duration(10)
  	.style('font-weight','normal')
  	.style('opacity',0.2);

  // first remove instructions if this has not already been done 
  d3.select('#pop_instructions').style('display','none').style('opacity',0);

  // initialize the delay to zero
  delay_enrichment_results = 0;

	// if node information panel is present, then move it down
	if (d3.select('#node_info_panel').style('display') == 'block'){
		// re-position the panel to the bottom right
		d3.select('#node_info_panel').transition().duration(1000).style('top',node_info_panel_y_low+'px');
		delay_enrichment_results = 500;
	}; 

	// clear the results if you have already ran an enrichment analysis 
	d3.select('#GSE').remove();


	var count = 0;

	// console.log('nodes	', nodes)

	// toggle the choiceView radio buttons 
	d3.select('#choiceView').style('display','block');
	
	gmt = G_VAR.gmt;
	G_VAR.gmt_flip = gmt_flipper(gmt);
	// document.getElementById("selectionDisplay3").innerHTML = "";
	calculate_gene_fill(nodes, elements, hexCode, gmt_flip, gmt, random_number);
			
	// show enrichment results 
	d3.select('#enrichment_panel')
		.style('display','none')

	d3.select('#enrichment_results')
		.transition().delay(delay_enrichment_results)
		.duration(1000).style('opacity',1)
		.style('display','block');

	// show the enrichment panel 
	d3.select('#enrichment_panel')
		.transition().duration(500).style('opacity',1)
		.style('height','500px') // 576px looks good
		.style('display','block');

	// show enrichment download link
	d3.select('#force_download_link').transition().delay(500).style('display','block');

  // console.log('finished enrichment calculation')	
};

function factorial_log(x){

	if (storeFact[x] !== undefined){
		return storeFact[x];
	} else {
		var start = storeFact.length;
		for (i = start; i <= x; i++){
			storeFact.push(storeFact[i-1] + Math.log(i));
		}
	}
	return storeFact[x];
};

function fisher_exact(contA, contB, contC, contD){
	
	//Calculate RIGHT-SIDED FISHER EXACT
	var numerator, denominator, p = 0;
	var min = (contC < contB) ? contC : contB;

	// console.log('contA: ', contA)
	// console.log('contB: ', contB)
	// console.log('contC: ', contC)
	// console.log('contD: ', contD)

	for (var q = 0; q < min + 1; q++){ 

		numerator = factorial_log(contA + contB)   + factorial_log(contC + contD) 
							  + factorial_log(contA + contC) + factorial_log(contB + contD);

		denominator = factorial_log(contA)   + factorial_log(contB) + factorial_log(contC) 
							    + factorial_log(contD) + factorial_log(contA + contB + contC + contD);

		p += Math.exp(numerator - denominator);

		contA += 1
		contB -= 1
		contC -= 1
		contD += 1
	
	}
	return p;
};

function tmp_function(){
	console.log('running tmp_function')
};



function change_canvas(value){

  if (value == 'kinases_p'){

    clear_enrichment(G_VAR.nodes);

    var json = d3.json("canvases/gmt_1_kinases_p.json", function(data) { get_JSON(data, [0, 255, 255], [255, 255, 255]); });
    var json = d3.json("canvases/infos_1_kinases_p.json", function(data) { G_VAR.gmt = data; });
    
    d3.select('#name_of_canvas').html('Kinase-Substrate Gene Set Library with Phosphosites');
    document.getElementById("library_description").innerHTML="This library was made by manual curation of kinase-substrate interactions in the literature. The library terms are kinases and the elements are substrates with phosphosites.";

    pubmed_links = 0 ;
    phospho_level = 1 ;
    long_term_names = 0 ;
    phosphosite_level_labels();
  } 
  else if (value == 'kinases_g') { 

  	// clear enrichment results 
    clear_enrichment(G_VAR.nodes)
    
    // load data
    var json = d3.json("canvases/gmt_2_kinases_g.json", function(data) { get_JSON(data, [0, 255, 255], [255, 255, 255]); });
    var json = d3.json("canvases/infos_2_kinases_g.json", function(data) { G_VAR.gmt = data; });

    // rename 
    d3.select('#name_of_canvas').html('Kinase-Substrate Gene Set Library');
    d3.select('library_description').text("This library was made by manual curation of kinase-substrate interactions in the literature. The library terms are kinases and the elements are substrates without phosphosites.")

    pubmed_links = 0 ;
    phospho_level = 0 ;
    long_term_names = 0 ;
    gene_level_labels();
  }
  else if (value == 'terms_p') { 

    clear_enrichment(G_VAR.nodes)
    
    var json = d3.json("canvases/gmt_3_terms_p.json", function(data) { get_JSON(data, [0, 255, 255], [255, 255, 255]); });
    var json = d3.json("canvases/infos_3_terms_p.json", function(data) { G_VAR.gmt = data; });
    d3.select('#name_of_canvas').html('Biological Terms Associated with Phosphosites from Literature Mining');
    document.getElementById("library_description").innerHTML="This library was made by text mining abstracts from papers that describe specific phosphosites on protein substrates. The library terms are biological terms that are associated with specific phosposites.";

    pubmed_links = 0 ;
    phospho_level = 1 ;
    long_term_names = 0 ;
    phosphosite_level_labels();
  }
  else if (value == 'terms_g') { 

    clear_enrichment(G_VAR.nodes)
    
    var json = d3.json("canvases/gmt_4_terms_g.json", function(data) { get_JSON(data, [0, 255, 255], [255, 255, 255]); });
    var json = d3.json("canvases/infos_4_terms_g.json", function(data) { G_VAR.gmt = data; });

    d3.select('#name_of_canvas').html('Biological Terms Associated with Phosphorylated Proteins from Literature Mining');
    document.getElementById("library_description").innerHTML="This library was made by text mining abstracts from papers that describe specific phosphosites on protein substrates. The terms are biological terms that are associated with specific protein substrates.";

    pubmed_links = 0 ;
    phospho_level = 0 ;
    long_term_names = 0 ;
    gene_level_labels();
  }
  else if (value == 'SILAC_g') { 

    clear_enrichment(G_VAR.nodes)
    
    var json = d3.json("canvases/gmt_5_SILAC_g.json", function(data) { get_JSON(data, [0, 255, 255], [255, 255, 255]); });
    var json = d3.json("canvases/infos_5_SILAC_g.json", function(data) { G_VAR.gmt = data; });
    d3.select('#name_of_canvas').html('SILAC Experiment Gene Set Library');
    document.getElementById("library_description").innerHTML="This library was made by gathering phosphorylation substrates at the gene level from Stable Isotope Labeling by Amino acids in Cell culture (SILAC) phosphoproteomics experiments. The terms are SILAC experiments and the elements are protein substrates. Click on experiment terms to be redirected to the publication's pubmed page.";

    pubmed_links = 1 ;
    phospho_level = 0 ;
    long_term_names = 1 ;
    gene_level_labels();
  }
  else if (value == 'GEO_up') { 

    clear_enrichment(G_VAR.nodes)

    var json = d3.json("canvases/gmt_6_GEO_up.json", function(data) { get_JSON(data, [0, 255, 255], [255, 255, 255]); });
    var json = d3.json("canvases/infos_6_GEO_up.json", function(data) { G_VAR.gmt = data; });
    d3.select('#name_of_canvas').html('Up-regulated Genes following Kinase Perturbation from GEO');
    document.getElementById("library_description").innerHTML="This library was made by finding genes that were up-regulated after kinase perturbation from the Gene Expression Omnibus (GEO). The terms are kinase perturbation experiments and the elements are up-regulated genes.";

    pubmed_links = 0 ;
    phospho_level = 0 ;
    long_term_names = 1 ;
    gene_level_labels();
  }
  else if (value == 'GEO_down') { 

    clear_enrichment(G_VAR.nodes)
  
    var json = d3.json("canvases/gmt_7_GEO_down.json", function(data) { get_JSON(data, [0, 255, 255], [255, 255, 255]); });
    var json = d3.json("canvases/infos_7_GEO_down.json", function(data) { G_VAR.gmt = data; });
  	d3.select('#name_of_canvas').html('Down-regulated Genes following Kinase Perturbation from GEO');
    document.getElementById("library_description").innerHTML="This library was made by finding genes that were down-regulated after kinase perturbation from the Gene Expression Omnibus (GEO). The terms are kinase perturbation experiments and the elements are down-regulated genes.";

  	pubmed_links = 0 ;
  	phospho_level = 0 ;
  	long_term_names = 1 ;
  	gene_level_labels();
  }
  else if (value == 'Lincs_up') { 

    clear_enrichment(G_VAR.nodes)

    var json = d3.json("canvases/gmt_8_Lincs_up.json", function(data) { get_JSON(data, [0, 255, 255], [255, 255, 255]); });
    var json = d3.json("canvases/infos_8_Lincs_up.json", function(data) { G_VAR.gmt = data; });
  	d3.select('#name_of_canvas').html('Up-regulated Genes following Kinase Perturbation from the LINCS Connectivity Map');
    document.getElementById("library_description").innerHTML="This library was made by finding genes that were up-regulated after kinase perturbationfrom the Library of Integrated Network based Cellular Signatures (LINCS) Connectivity Map. The terms are kinase perturbation experiments and the elements are up-regulated genes.";

  	pubmed_links = 0 ;
  	phospho_level = 0 ;
  	long_term_names = 1 ;
  	gene_level_labels();
  }
  else if (value == 'Lincs_down') { 

    clear_enrichment(G_VAR.nodes)
   
    var json = d3.json("canvases/gmt_9_Lincs_down.json", function(data) { get_JSON(data, [0, 255, 255], [255, 255, 255]); });
    var json = d3.json("canvases/infos_9_Lincs_down.json", function(data) { G_VAR.gmt = data; });
  	d3.select('#name_of_canvas').html('Down-regulated Genes following Kinase Perturbation from the LINCS Connectivity Map');
    document.getElementById("library_description").innerHTML="This library was made by finding genes that were down-regulated after kinase perturbationfrom the Library of Integrated Network based Cellular Signatures (LINCS) Connectivity Map. The terms are kinase perturbation experiments and the elements are down-regulated genes.";

  	pubmed_links = 0 ;
  	phospho_level = 0 ;
  	long_term_names = 1 ;
  	gene_level_labels();
  };


 	return;
};

function enlarge_network_view(links, w, indicatorColor){
	
	console.log('enlarging network view')
	
	// this gives the class Enlarge_network_view to the div element 
	// with id NetworkView
	d3.select('#NetworkView'   ).attr('class', 'Enlarge_network_view');
	d3.select('#chartContainer').attr('class', 'Enlarge_network_view');
	d3.select('#choiceView').style('display', 'none');

	d3.select('#enlargeNetwork').style('display','none');
	d3.select('#shrinkNetwork').style('display','inline');
};

function shrink_network_view(){
	d3.select('#NetworkView').attr('class','');
	d3.select('#shrinkNetwork').style('display','none');
	d3.select('#enlargeNetwork').style('display','inline');
	d3.select('#choiceView').style('display', 'block');

	d3.select('#chartContainer').attr('class', 'center_canvas');
	//zoom.scale(1);
	zoom.translate([0,0]);
	d3.select('#networkView g g').attr('transform', 'translate(' + zoom.translate() + ') scale(' + zoom.scale() + ')');
};

function add_node_highlights(found_terms){

	// reset all strokes
	d3.selectAll('.node')
		.select('circle')
		.style('stroke','white')
		.style('stroke-width','1.5px');
	d3.selectAll('.node_enr').select('circle').style('stroke','white').style('stroke-width','1.5px');
	d3.selectAll('.node_select_enr').select('circle').style('stroke','white').style('stroke-width','1.5px');

	for (var i = 0; i < found_terms.length; i++){

		// get the inst node 
		inst_node = found_terms[i];
		// // read out the found nodes	
		// console.log(inst_node);


		// highlight the node with an orange stroke 
		d3.select('#id_'+inst_node.replace('&','')).select('circle').style('stroke','orange').style('stroke-width','3px');
	};
};

function remove_highlighted_nodes(){
	// reset all strokes
	d3.selectAll('.node').select('circle').style('stroke','white').style('stroke-width','1.5px');
	d3.selectAll('.node_enr').select('circle').style('stroke','white').style('stroke-width','1.5px');
	d3.selectAll('.node_select').select('circle').style('stroke','white').style('stroke-width','1.5px');
	d3.selectAll('.node_select_enr').select('circle').style('stroke','white').style('stroke-width','1.5px');
};



//--------------------------
// Download Link 
//--------------------------
function svg_download(){
	// Allows downloading and printing of the current canvas view
	var selector;

	console.log('var h')
    var html = d3.select('svg').attr("xmlns", "http://www.w3.org/2000/svg").node()
		.parentNode.innerHTML;
	var newWindow=window.open("data:image/svg+xml;base64,"+ btoa(html), " ", 'location=yes');
	newWindow.print();
}