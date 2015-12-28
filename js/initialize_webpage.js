
function run_initialize_webpage( callback_make_new_network ) {

	// generate the json with titles and descriptions for the networks 
	network_description = {

		"kinase_psite":{
			"title":"Literature Based Kinase-Substrate Gene Set Library with Phosphosites",
			"description":"This library was made by manual curation of kinase-substrate interactions in the literature. The library terms are kinases and the elements are substrates with phosphosites.",
			"instructions":"Run kinase enrichment analysis at the phosphosite level or search the kinase network by clicking the buttons on the left.",
			"instruct_height":235,
			"phosphosite_level":1,
			"link":"none"
		},

		"kinase_gene":{
			"title":"Literature Based Kinase-Substrate Gene Set Library",
			"description":"This library was made by manual curation of kinase-substrate interactions in the literature. The library terms are kinases and the elements are substrates without phosphosites.",
			"instructions":"Run kinase enrichment analysis at the protein/gene level or search the kinase network by clicking the buttons on the left.",
			"instruct_height":235,
			"phosphosite_level":0,
			"link":"none"
		},

		"term_psite":{
			"title":"Biological Terms Associated with Phosphosites from Literature Mining",
			"description":"This library was made by text mining abstracts from papers that describe specific phosphosites on protein substrates. The library terms are biological terms that are associated with specific phosposites.",
			"instructions":"Run biological term enrichment analysis at the phosphosite level or search the biological term network by clicking the buttons on the left.",
			"instruct_height":260,
			"phosphosite_level":1,
			"link":"none"
		},	

		"term_gene":{
			"title":"Biological Terms Associated with Phosphorylated Proteins from Literature Mining",
			"description":"This library was made by text mining abstracts from papers that describe specific phosphosites on protein substrates. The terms are biological terms that are associated with specific protein substrates.",
			"instructions":"Run biological term enrichment analysis at the protein/gene level or search the kinase network by clicking the buttons on the left.",
			"instruct_height":260,
			"phosphosite_level":0,
			"link":"none"
		},	

		"silac_gene":{
			"title":"SILAC Experiment Gene Set Library",
			"description":"This library was made by gathering phosphorylation substrates at the gene level from Stable Isotope Labeling by Amino acids in Cell culture (SILAC) phosphoproteomics experiments. The terms are SILAC experiments and the elements are protein substrates. Click on experiment terms to be redirected to the publication's pubmed page.",
			"instructions":"Calculate enrichment for SILAC phosphoproteomics data at the protein level or search the SILAC experiment network by clicking the buttons on the left.",
			"instruct_height":275,
			"phosphosite_level":0,
			"link":"pubmed"
		},	

		"geo_up_gene":{
			"title":"Up-regulated Genes following Kinase Perturbation from GEO",
			"description":"This library was made by finding genes that were up-regulated after kinase perturbation from the Gene Expression Omnibus (GEO). The terms are kinase perturbation experiments and the elements are up-regulated genes.",
			"instructions":"Calculate enrichment for up-regulated genes after kinase perturbation from the Gene Expression Omnibus (GEO) or search the GEO experiment network by clicking the buttons on the left.",
			"instruct_height":295,
			"phosphosite_level":0,
			"link":"geo"
		},	

		"geo_down_gene":{
			"title":"Down-regulated Genes following Kinase Perturbation from GEO",
			"description":"This library was made by finding genes that were down-regulated after kinase perturbation from the Gene Expression Omnibus (GEO). The terms are kinase perturbation experiments and the elements are down-regulated genes.",
			"instructions":"Calculate enrichment for down-regulated genes after kinase perturbation from the Gene Expression Omnibus (GEO) or search the GEO experiment network by clicking the buttons on the left.",
			"instruct_height":295,
			"phosphosite_level":0,
			"link":"geo"
		},	

		"l1000_up_gene":{
			"title":"Up-regulated Genes following Kinase Perturbation from the L1000 Connectivity Map",
			"description":"This library was made by finding genes that were up-regulated after kinase perturbation from the Library of Integrated Network based Cellular Signatures (LINCS) Connectivity Map. The terms are kinase perturbation experiments and the elements are up-regulated genes.",
			"instructions":"Calculate enrichment for up-regulated genes after kinase perturbation from the L1000 connecivity map or search the L1000 experiment network by clicking the buttons on the left.",
			"instruct_height":275,
			"phosphosite_level":0,
			"link":"none"
		},	

		"l1000_down_gene":{
			"title":"Down-regulated Genes following Kinase Perturbation from the L1000 Connectivity Map",
			"description":"This library was made by finding genes that were down-regulated after kinase perturbationfrom the Library of Integrated Network based Cellular Signatures (LINCS) Connectivity Map. The terms are kinase perturbation experiments and the elements are down-regulated genes.",
			"instructions":"Calculate enrichment for down-regulated genes after kinase perturbation from the L1000 connectivity map or search the L1000 experiment network by clicking the buttons on the left.",
			"instruct_height":275,
			"phosphosite_level":0,
			"link":"none"
		},	
	};

	// initialize the webpage at the kinase phosphosite level network 
	inst_network_name = 'kinase_psite';

	// initialize storeFact
	storeFact = [0,0];

	// initialize the random number for saving enrichment results 
	random_number = Math.floor(Math.random()*10000001);

	// initialize with no pubmed links
	pubmed_links = 0 ;

	// initialize with short term names 
	long_term_names = 0 ;

	// initialize at the phosphosite level 
	phospho_level = 1 ;

	// initialize click_index (for removable click highlighting)
	click_index = [] ;

	// give initial instructions on how to use webpage 
	d3.select('body')
		.append('div')
		.attr('class', 'panel callout')
		.attr('id', 'pop_instructions')
		.append('div').attr('id','pop_instructions_text')

	d3.select('#pop_instructions_text')
		.append('p').text('Instructions')
		.attr('class','style_library_description_title');

	d3.select('#pop_instructions_text')
		.append('p')
		.text(network_description[inst_network_name]['instructions'])
		.attr('class','style_library_description_text')
		.attr('id','specific_instructions')

	d3.select('#pop_instructions_text')
		.append('p')
		.text('Choose from other gene set libraries to use for enrichment analysis using the dropdown menu above.')
		.attr('class','style_library_description_text')


	d3.select('#pop_instructions_text')
		.style('opacity',0)
		.style('height','0px')
		.transition().delay(2700).duration(1000).style('opacity',1)

	d3.select('#pop_instructions')
		.style('opacity',0)
		.transition().delay(2000).duration(200).style('opacity',1)
		.transition().duration(1000).style('height', network_description[inst_network_name]['instruct_height']+'px')

	setTimeout(click_enr, 1000);

	function click_enr(){

		$('#enrichment_button').trigger('click');

		// highlight library dropdown 
		d3.select('#library_dropdown')
			.transition().duration(500)
			.style('background', '#008cba');
	}

	// vertical positions for the node_info_panel
	node_info_panel_y_high = 130;
	node_info_panel_y_low  = 640;


	// set the title, description and other paramters 
	inst_title       = network_description['kinase_gene']['title'];
	inst_description = network_description['kinase_gene']['description'];
	inst_links       = network_description['kinase_gene']['link'];
	inst_psite_level = network_description['kinase_gene']['phosphosite_level']

	// initialize initialize_state
	initialized_state = 0;

	// make the initial network 
	callback_make_new_network(inst_network_name);

	// update
	initialized_state = 1;

};
