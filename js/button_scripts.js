
// initialize running enrichment as zero 
running_enrichment = 0;
running_search = 0;

// y positions for buttons on left side 
//
// initial positions
y_ini_search_button = 190 ;
y_ini_library_description = 200 ;
// final
y_fin_search_button = 470 ;
y_fin_library_description = 470 ;

// input buttons initial position 
y_ini_input_three_buttons = 200;
y_fin_input_three_buttons = 420;

// search toggle buttons
y_fin_search_toggle = 222;

// search buttons initial and final positions
y_ini_three_search_buttons = 240;
y_fin_three_search_buttons = 485;



function open_enrichment_panel(){

	// Open Enrichment Panel 
	// 
	// open enrichment analysis if not running search 
	if (running_enrichment == 0 && running_search == 0){
		// show run enrichment with no delay
		show_run_enrichment(0);
	}
	// open enrichment analysis if running search 
	else if (running_enrichment == 0 && running_search == 1){
		// first hide search 
		hide_run_search();
		// then open enrichment after a delay 
		show_run_enrichment(1000);
	}
	// if you click run enrichment analysis again then reset things 
	else if (running_enrichment == 1){
		// hide run enrichment
		hide_run_enrichment();
	};

};

  
function open_search_panel(){

	// Open Search Panel 
	//
	// open search panel if not running enrichment 
	if (running_search == 0 && running_enrichment == 0){
		// show run search with no delay 
		show_run_search(0);
		console.log('open search')
	}
	// oen search panel if running search
	else if (running_search == 0 && running_enrichment == 1){
		// first hide enrichment
		hide_run_enrichment();
		// then open search after a delay 
		show_run_search(1000);
	}

	else if (running_search == 1) {

		// hide run search
		hide_run_search();

	};

};



// define the show_run_enrichment
function show_run_enrichment(delay_show){
	// set running enrichment to 1 since you are running an enrichment analysis 
		running_enrichment = 1;

		// move the search network down
		d3.select('#search_button')
			.transition().delay(delay_show).duration(1000).style('top',y_fin_search_button+'px')
		// move the library description down
		d3.select('#library_description_panel')
			.transition().delay(delay_show).duration(1000).style('top',y_fin_library_description+'px')

		// show the input panel
		d3.select('#input_panel_appearing')
			.transition().delay(delay_show).delay(300+delay_show).style('opacity',1).style('display','block');

		// show input text 
		d3.select('#input_text_appearing')
			.transition().delay(delay_show).duration(1000)
			.style('display','block')
			.style('opacity',1)
			.style('height','230px');

		// show the input buttons 
		d3.select('#input_three_buttons_appearing')
			.transition().delay(delay_show).duration(1000).style('display','block')
			.style('top', y_fin_input_three_buttons+'px').style('opacity',1);


};


// define hide_run_enrichment
function hide_run_enrichment(){
		// set running enrichment to 0 since you are not running an enrichment 
		running_enrichment = 0;

		// move the search network down
		d3.select('#search_button')
			.transition().duration(1000).style('top',y_ini_search_button+'px')
		// move the library description down
		d3.select('#library_description_panel')
			.transition().duration(1000).style('top',y_ini_library_description+'px')		

		// remove enrichment panel
		d3.select('#input_panel_appearing')
			.transition().duration(500).style('opacity',0)
		
		// remove input text box	
		d3.select('#input_text_appearing')
			.transition().duration(500).style('height','0px')
			.transition().duration(100).style('display','none');

		// remove three buttons
		d3.select('#input_three_buttons_appearing')
		.transition().duration(500).style('opacity',0)
		.style('top', y_ini_input_three_buttons+'px')
		.transition().duration(500).style('display','none');

};


// define show_run_search
function show_run_search(delay_show) {

		// show the toggle search button 
		d3.select('#search_toggle_appearing')
			.style('opacity',0)
			// .style('top', y_ini_search_toggle)
			.transition().delay(delay_show).duration(1000)
			.style('display','block')
			.style('top', y_fin_search_toggle+'px')
			.style('opacity',1);

		// Show Term Search 
		// 
		d3.select('#search_terms_input_appearing')
			.transition().delay(delay_show).duration(1000)
			.style('display','block')
			.style('opacity',1)
			.style('height','200px');

		d3.select('#search_terms_buttons_appearing')
			.transition().delay(delay_show).duration(1000)
			.style('top', y_fin_three_search_buttons+'px')
			.style('opacity',1)
			.style('display','block');

		// only show search elements if the element toggle switch is active 
		if (d3.select('#toggle_element_switch').attr('class') == 'active'){

			// Show Elements Search 
			// 
			d3.select('#search_elements_input_appearing')
				.transition().delay(delay_show).duration(1000)
				.style('display','block')
				.style('opacity',1)
				.style('height','200px');

			d3.select('#search_elements_buttons_appearing')
				.transition().delay(delay_show).duration(1000)
				.style('top', y_fin_three_search_buttons+'px')
				.style('opacity',1)
				.style('display','block');
			};

		// move the library description down
		d3.select('#library_description_panel')
			.transition().delay(delay_show).duration(1000).style('top',y_fin_library_description+'px');

		// set running_search to 1, since a search is being run 
		running_search = 1;
};

// define hide_run_search
function hide_run_search() {

		// hide saerch toggle 
		d3.select('#search_toggle_appearing')
			.transition().duration(500)
			.style('opacity',0)
			.transition().duration(500)
			.style('display','none');

		// Hide Search Terms 
		//
		// display search terms 
		d3.select('#search_terms_input_appearing')
			.transition().duration(500)
			.style('opacity',0)
			.style('height','0px')
			.transition().duration(500).style('display','none');

		// hide search buttons
		d3.select('#search_terms_buttons_appearing')
			.transition().duration(500)
			.style('opacity',0)
			.style('top', y_ini_three_search_buttons+'px')
			.transition().duration(500)
			.style('display','none');

		// Hide Search Elements
		//
		// display search terms 
		d3.select('#search_elements_input_appearing')
			.transition().duration(500)
			.style('opacity',0)
			.style('height','0px')
			.transition().duration(500).style('display','none');

		// hide search buttons
		d3.select('#search_elements_buttons_appearing')
			.transition().duration(500)
			.style('opacity',0)
			.style('top', y_ini_three_search_buttons+'px')
			.transition().duration(500)
			.style('display','none');

		// move the library description down
		d3.select('#library_description_panel')
			.transition().duration(500).style('top',y_ini_library_description+'px');

		// set running_search to 0, since a search is being run 
		running_search = 0;
};

function show_search_element(){

	// Show Elements Search 
	// 
	d3.select('#search_elements_input_appearing')
		// .transition().duration(1000)
		.style('display','block')
		.style('opacity',1)
		.style('height','200px');

	d3.select('#search_elements_buttons_appearing')
		// .transition().duration(1000)
		.style('top', y_fin_three_search_buttons+'px')
		.style('opacity',1)
		.style('display','block');

};

