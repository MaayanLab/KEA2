
function redraw() {
  svg.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
};

function updateWindow(){

    // get window size information
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    var x = w.innerWidth  || e.clientWidth || g.clientWidth  ;
    var y = w.innerHeight || e.clientHeight|| g.clientHeight ;

    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    svg.attr("width", x).attr("height", y);

    // // redraw the network when the window size is changed 
    // make_new_network(inst_network_name)

    // delay window redraw 
    setTimeout(make_new_network,500,inst_network_name);
};

 window.onresize = updateWindow;



function make_new_network( inst_network_name ) {

  // console.log(network_description[inst_network_name]['title'])
  // console.log(network_description[inst_network_name]['description'])
  // console.log(network_description[inst_network_name]['phosphosite_level'])

  // clear previous enrichment results 
  clear_enrichment();

  // hide search
  // hide_run_search()

  // remove the information panel with the node and elements 
  d3.select('#node_info_panel').transition().duration(200).style('opacity',0).transition().delay(200).style('display','none');

  // update the instructions and gene set library description 
  // 
  // update description
  d3.select('#library_description').text( network_description[inst_network_name]['description'] );

  // update instructions height, if not on the initial network 
  if (initialized_state == 1){
    // update the instruction panel height instantaneously  
    d3.select('#pop_instructions')
      .style('height', network_description[inst_network_name]['instruct_height']+'px');

    console.log(inst_network_name)
    console.log(network_description[inst_network_name]['instruct_height'])

  }

  // update instructions
  d3.select('#specific_instructions').text( network_description[inst_network_name]['instructions']);

  // set the instantaneous link statys 
  inst_link_status = network_description[inst_network_name]['link'];

  // set up gene_level or phosphosite_level labels and warnings 
  if ( inst_psite_level == 0 ){
    d3.select('#input_text_appearing').attr('placeholder', 'Enter gene list here on separate lines');
    d3.select('#not_found_modal_title').html('No input genes were found in the gene set library.');
    d3.select('#not_found_modal_instructions').html('Please enter one gene name per line (e.g. PPP1R8).');
  }
  else if ( inst_psite_level == 1){
    d3.select('#input_text_appearing').attr('placeholder', 'Enter phosphosite list here on separate lines');
    d3.select('#not_found_modal_title').html('No input phosphosites were found in the phosphosite set library.');
    d3.select('#not_found_modal_instructions').html('Please enter one phosphosite per line in the following format: gene name, underscore, phosphorylated amino acid, and amino acid position (e.g. PPP1R8_S57).'); 
  };

  // change the title of the network 
  d3.select('#name_of_network').text(network_description[inst_network_name]['title']);

  // change the dropdown state 
  // 
  // reset dropdown rows
  d3.selectAll('.li_all').classed('active',false);
  // set the current row to active 
  d3.select('#li_'+inst_network_name).classed('active',true);

  // remove old svg 
  d3.select('#force_directed_graph').select('svg').remove();

  // initialize variables 
  //
  // get window size information
  var w = window;
  var d = document;
  var e = d.documentElement;
  var g = d.getElementsByTagName('body')[0];
  var x = w.innerWidth  || e.clientWidth || g.clientWidth  ;
  var y = w.innerHeight || e.clientHeight|| g.clientHeight ;

  var width = 960;
  var height = 500;
  var color = d3.scale.category20();
  var force = d3.layout.force()
                .charge(-300)
                .linkDistance(15)
                .gravity(0.6)
                .size([x, 800])
                .alpha(0.01);

  // prevent the network from being too centered
  if (y> 1050){
    y = 1050;
  };

  // initialize svg 
  svg = d3.select("#force_directed_graph").append("svg")
      .attr("width", x)
      .attr("height", y)
      .attr('id','network_svg' )
      .append('svg:g')
        .call(d3.behavior.zoom().scaleExtent([0.25,2.0]).on("zoom", redraw))
      .append('svg:g');

  svg.append('svg:rect')
      .attr('width', 2*x)
      .attr('height', 2*y)
      .attr('x', -0.5*x)
      .attr('y', -0.5*y)
      .attr('fill', 'white');

  console.log('setting up block modal')
  // set up wait modal 
  $.blockUI({ css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .8, 
            color: '#fff' 
        } });

  d3.select('.blockMsg')
    .select('h1')
    .text('Waiting for network to load...')
    .style('color','#fff');  

  // make a new network 
  d3.json('networks/'+ inst_network_name +'.json', function(error, graph) {
    
    // save the gmt
    gmt_ini = graph.gmt;

    // capitalize the keys of the gmt 
    //
    // initialize capitalized gmt 
    gmt = {};
    // capitalize the keys 
    _.each( gmt_ini, function(element, index, list) {
      gmt[index.toUpperCase()] = element;
    });

    // initialize the G_VAR, global variable 
    G_VAR = {};

    // this initializes the global variable G_VAR
    initialize_it(gmt);

    // save the gmt to the global variable
    G_VAR.gmt = gmt ; 

    // initialize the random array, that is used in example
    G_VAR.randomArray = [];


    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    // force.tick(); 
    // force.stop();

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append('line')
        .attr("class", "link")
        .style('stroke','#999')
        .style('stroke-opacity',0.5)
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append('g')
        .attr("class", "node")
        .on('mouseover', function() {
          d3.select(this).select('text').transition().duration(50).style('opacity',1).style('font-weight','bold');
        })
        .on('mouseout', function() {

          // if the circle has not been clicked on, which can be identified by the color of the stroke
          if (d3.select(this).select('circle').attr('r') < 6.5){
            // if this is not an enriched node 
            if (d3.select(this).select('circle').attr('r') < 4.1){
              // unbold the name and set opacity to 0.15
              d3.select(this).select('text').transition().duration(200).style('opacity',0.15).style('font-weight','normal');
            }
            else {
              // unbold the name and leave opacity at 1
              d3.select(this).select('text').transition().duration(200).style('font-weight','normal');            
            }

          };

        })
        .on('click', function() {

          // first remove instructions if this has not already been done 
          d3.select('#pop_instructions').style('display','none').style('opacity',0);

          // if the node has not been clicked 
          if ( d3.select(this).attr('class') == 'node' || d3.select(this).attr('class') == 'node_enr' ) {

            // console.log(' clicking on non-selected node')

            // show the information panel with the node and elements 
            //
            // if there is an enrichment result then lower the result panel below the enrichment results 
            if (d3.select('#GSE').empty() == 1){ 
              // no enrichment results, so show panel at original position
              d3.select('#node_info_panel').style('top',node_info_panel_y_high+'px').transition().duration(500).style('display','block').style('opacity',1);
            }
            else  {
              // there are enrichment results, so show the panel at the botton 
              d3.select('#node_info_panel').style('top',node_info_panel_y_low+'px').transition().duration(500).style('display','block').style('opacity',1); 
            }

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


            // highlight node 
            // 
            // only change the node size if its not an enriched node
            if ( d3.select(this).attr('class') == 'node' ){
              // do all changes to the node
              d3.select(this).select('circle').transition().duration(150).attr('r',6.5).style('fill','#A00000');
            }
            // do not change the radius of the node if its enriched 
            else if ( d3.select(this).attr('class') == 'node_enr' ) {
              // only change the color
              d3.select(this).select('circle').transition().duration(150).style('fill','#A00000');
            }
            // make name bold 
            d3.select(this).select('text').transition().duration(10).style('font-weight','bold').style('opacity',1);

            // change the class of the node to node_select or node_select_enr 
            //
            // if the node is not enriched 
            if ( d3.select(this).attr('class') == 'node' ){
              // label it as a selected node only  
              d3.select(this).attr('class','node_select');
            }
            else if ( d3.select(this).attr('class') == 'node_enr' ){
              // label it as a selected enriched node 
              d3.select(this).attr('class','node_select_enr');
            }

            // get the node name of interest from the full name 
            inst_node_name = d3.select(this).select('full_name').text() ;

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

          // if the node has already been clicked
          else  {

            console.log('clicking on a selected node')

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

            // display instructions if there is are no enrichment results 
            if (d3.select('#GSE').empty() == 1){ 
              d3.select('#pop_instructions')
                .transition().duration(200).style('opacity',1)
                .transition().duration(200).style('display','block');
            };

          };

        });
        
    node.append('circle')
      .attr("r", 4)
      .style("fill", '#1f77b4')
      .style('stroke','#fff')
      .style('stroke-width','1.5px');

    node.append('text')
      .text(function(d) { return d.name; })
      .attr('font-family','sans-serif')
      .attr('font-size','12px')
      .attr('opacity',0.15)
      .attr('dx','6px');

    node.append("full_name")
      .text(function(d) { return d.name; });

    // make an id for the node, use the node name, but always add id_ in the front of the node name
    // so that it won't throw an error if the node name starts with a number 
    node.attr('id', function(d) {
      // construct node id 
      inst_node_id = 'id_' + d.name.replace('&','_') ;
      return inst_node_id ;
    });

    force.on("tick", function() { 

      // position the links 
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      // position the nodes 
      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    });

    // unblock the ui after the network has loaded 
    $.unblockUI();
  });



};


