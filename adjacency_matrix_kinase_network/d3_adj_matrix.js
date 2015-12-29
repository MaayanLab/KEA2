
// select the adjacency matrix 
// d3.select('#network').on('change', function() {

function change_matrix(matrix_name) {

  // find the index of the network  
  // inst_net = network_names.indexOf(this.value);
  inst_net = network_names.indexOf(matrix_name);

  console.log('select the adjacency matrix');
  
  d3.select('.main_svg').remove() ;

  generate_adj_matrix(matrix_name);
  // generate_adj_matrix(this.value);

  d3.select('#network_title').text( network_titles[inst_net] );
  d3.select('#specific_description').text( network_descriptions[inst_net] );
  $('#order').val('group').attr('selected','selected');
  // end select adjacency matrix 

  // remove the cluster information if there's any 
  d3.select('#kinase_bar_graph').remove();
  d3.select('#term_bar_graph').remove();
  d3.select('#bar_title_holder').remove();
  d3.select('#cluster_title').remove();
  d3.select('#other_bar_graph').remove();
  d3.select('#other_bar_title').remove();


  // switch back to the network info pane 
  d3.select('#network_info_div').style('display','block');
  d3.select('#bar_graph_div').style('display','none');    

  // switchf the pane colors 
  d3.select('#network_info').style('background-color','#909090');
  d3.select('#cluster_info').style('background-color','#C8C8C8');  

  // add back the cluster info instructions 
  // but first remove it if its already there 
  d3.select('#cluster_instructions').remove();
  d3.select('#bar_graph_div')
    .append('text').text('Click on a cluster or kinase label.')
    .style('margin-left','20px')
    .attr('id','cluster_instructions');

};
// );



function generate_adj_matrix(network_name){

// console.log(network_name);
// console.log('running generate_adj_matrix function ');

// margin and height
var margin = {top: 50, right: 0, bottom: 10, left: 50},
    width  = 700,
    height = 700;

// define the colum label margins 
var col_margin = {top:50, right:0, bottom: 10, left:50};

// define the row label margins 
var row_margin = {top:50, right:0, bottom: 10, left:50};

// // scaling functions 
// // sets the scale function for the svg, width means the width of the svg
// var x = d3.scale.ordinal().rangeBands([0, width]),
//     z = d3.scale.linear().domain([0, 1]).clamp(true),
//     c = d3.scale.category10().domain(d3.range(10));

// define the zoom function 
function zoomed() {

  // matrix
  svg.attr("transform", "translate(" + [d3.event.translate[0] + margin.left, d3.event.translate[1] + margin.top ] 
    + ") scale(" + d3.event.scale + ")");

  // column labels
  d3.select('.col_labels')
  .attr("transform", "translate(" + [col_margin.left + d3.event.translate[0], col_margin.top + (d3.event.scale-1)*6.5] 
    + ") scale(" + d3.event.scale + ")");
  
  // row labels 
  d3.select('.row_labels')
  .attr("transform", "translate(" + [row_margin.left + (d3.event.scale-1)*6.5 , row_margin.top+ d3.event.translate[1] ] 
    + ") scale(" + d3.event.scale + ")");

}

var zoom = d3.behavior.zoom().scaleExtent([1,12]).on('zoom',zoomed);


// Make SVG
var svg = d3.select("#svg_div").append("svg")
    .attr('class', 'main_svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('border',1)
    .style("margin-left", -margin.left + "px")
    .call( zoom ) 
    .append("g")
    .attr('class', 'adj_mat')
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

// reset zoom on double click
d3.select('.main_svg')
  .on('dblclick', function() { 
    // reset adj zoom 
    d3.select('.adj_mat')
      .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");
    // reset column label zoom 
    d3.select('.col_labels')
      .attr("transform", "translate(" + col_margin.left + "," + col_margin.top + ")");
    // reset row label zoom 
    d3.select('.row_labels')
      .attr("transform", "translate(" + row_margin.left + "," + row_margin.top + ")");
    // use Qiaonan method to reset zoom 
    zoom.scale(1).translate([0,0]);
  } );

// White Rects to cover the svg
d3.select('.main_svg')
  .append('rect')
  .attr('fill', 'white')
  .attr('width', '500px')
  .attr('height', '2000px')
  .attr('transform', 'translate(-450,0)')
  ;

d3.select('.main_svg')
  .append('rect')
  .attr('fill', 'white')
  .attr('height', '500px')
  .attr('width', '2000px')
  .attr('transform', 'translate(0,-450)');

// make groups for row and column labels 
// row group 
d3.select('.main_svg')
  .append("g")
  .attr('class', 'row_labels')
  .attr("transform", "translate(" + row_margin.left + "," + row_margin.top + ")");
// column group
d3.select('.main_svg')
  .append("g")
  .attr('class', 'col_labels')
  .attr("transform", "translate(" + col_margin.left + "," + col_margin.top + ")");


// White Rects to cover the excess labels 
d3.select('.main_svg')
  .append('rect')
  .attr('fill', 'white')
  .attr('width',  '100px')
  .attr('height', '100px')
  .attr('transform', 'translate(-50,-50)')

$.blockUI({ css: { 
          border: 'none', 
          padding: '15px', 
          backgroundColor: '#000', 
          '-webkit-border-radius': '10px', 
          '-moz-border-radius': '10px', 
          opacity: .8, 
          color: '#fff' 
      } });

d3.select('.blockMsg').select('h1').text('Waiting for matrix to load...');

// load the adjacency matrix in json format
d3.json('networks/' + network_name+'.json', function(sim_matrix) {

  console.log('modifying d3 code');

  tmp_links = sim_matrix.links;
  tmp_arr = [];

  // gather link data into an array 
  for (i =0; i<tmp_links.length; i++){

    // if the link has a value of 1 set it to 0
    if (tmp_links[i].value == 1){
      tmp_arr[i] = 0;
    } 

    // otherwise keep the value
    else{
      tmp_arr[i] = tmp_links[i].value;
    }    
  }
  
  // find the maximum value in the array 
  max_link_value = Math.max.apply(null,tmp_arr);

  // define scaling functions 
  //
  // sets the scale function for the svg, width means the width of the svg
  var x = d3.scale.ordinal().rangeBands([0, width]),
      z = d3.scale.linear().domain([0, max_link_value/10]).clamp(true),
      c = d3.scale.category10().domain(d3.range(10));


  console.log(network_name);


  // console.log(sim_matrix.gmt['TNK2']);

  // initialize variables 
  var matrix = [],
    // gather node information 
    nodes     = sim_matrix.nodes,
    // gather the gmt information 
    gmt       = sim_matrix.gmt,
    // gather group information
    groups    = sim_matrix.groups,
    num_nodes = nodes.length;

  

  // Assign and index to the nodes and
  nodes.forEach( function(tmp, i) {
    // map applies the next operator to the specified way
    matrix[i] = d3.range(num_nodes).map(function(j) { return {x: j, y: i, z: 0, g: 0}; });
    nodes[i].count = 0
  });


  // I want to add group information into the matrix 
  // I'll add toy group information first : all groups will be 1

  // Finish generating matrix: fill in z values 
  sim_matrix.links.forEach(function(link) {
    // transfer link information to the new adj matrix
    matrix[link.source][link.target].z += link.value;
    matrix[link.target][link.source].z += link.value;

    // console.log(link.value)

    // transfer group information to the adj matrix 
    matrix[link.source][link.target].g = 1;
    matrix[link.target][link.source].g = 1;


    // nodes[ link.source ].count = 0;
    // nodes[ link.target ].count = 0;

    // count the number of links that a node has 
    nodes[ link.source ].count += link.value;
    nodes[ link.target ].count += link.value;

    // console.log(nodes[ link.source ].count += link.value);
    // console.log( link.value );

  });


  // // view finished matrix 
  // console.log(matrix);

  // Precompute the orders: store in a json element
  var orders = {
    name:  d3.range(num_nodes).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
    count: d3.range(num_nodes).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
    // group: d3.range(num_nodes).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
    group: d3.range(num_nodes).sort(function(a, b) { return nodes[b].sort - nodes[a].sort; })
  };
    
  // Assign the default sort order.
  x.domain(orders.group);

  // Add the background - one large rect 
  d3.select('.adj_mat').append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

  // generate the rows 
  var row = svg.selectAll(".row")
      .data(matrix)
    .enter().append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .each(row);

  // generate and position the row labels
  var row_label = d3.select('.row_labels').selectAll('.row_label_text')
      .data(matrix)
    .enter().append('g')
      .attr('class','row_label_text')
      .attr('transform', function(d, i) { return "translate(0," + x(i) + ")"; })
      .on('click', click_label)
      ;

  // append rects to the row labels for highlighting purposes 
  row_label.append('rect')
    .attr('width', 6)
    .attr('height', x.rangeBand())
    .attr('fill', 'white')
    .attr('transform', function(d, i) { return "translate(-12,0)"; })
    ;

  row_label.append('text')
      .attr('x',-6)
      .attr('y', x.rangeBand() / 2)
      .attr('dy', '.32em')
      .attr('text-anchor','end')
      .text(function(d, i) { return nodes[i].name; } )      
      ;


  // select all colums 

  var col_label = d3.select('.col_labels').selectAll(".col_label_text")
      .data(matrix)
    .enter().append("g")
      .attr("class", "col_label_text")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ") rotate(-90)"; })
      .on('click', click_label)
      ;

  // append rects to the row labels for highlighting purposes 
  col_label.append('rect')
    .attr('width', 6)
    .attr('height', x.rangeBand())
    .attr('fill', 'white')
    .attr('transform', function(d, i) { return "translate(6,0)"; })
    ;

  col_label.append("text")
      .attr("x", 6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return nodes[i].name; })
      ;

  function row(row) {
    // select everything with the class cell 
    var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) { return d.z; }))
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("height", x.rangeBand())
        .style("fill-opacity", function(d) { return z(d.z); })
        // .style('fill-opacity',1)
        .style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group && nodes[d.x].group != 0 && nodes[d.y].group != 0 ? c(nodes[d.x].group) : null; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on('click', click_group )
        ;
  }


function click_cluster_kinase(d,i){

  // Highlight terms from the current network 
  // 

  // reset the kinase terms and then highlight the current kinase 
  d3.selectAll('.cluster_kinases').select('rect').attr('fill', '#03A89E')
  d3.select(this).select('rect').attr('fill', '#009ACD')

  // reset the color of the terms 
  d3.selectAll('.cluster_terms').select('rect').attr('fill','#03A89E');

  // return the text from the current selection - the kinase of interest
  inst_kinase = d3.select(this).select('text').text() ;
  console.log( 'inst_kinase: ' + inst_kinase ); 

  // gather the terms associated with the kinase of interest 
  inst_terms = gmt[ inst_kinase ]; 

  // find the terms in the term bar graph 
  // (cluster_terms is the class given to the g elements that hold the bar and text) 
  d3.selectAll('.cluster_terms').filter( function(d,i) {
    return _.contains(inst_terms, d3.select(this).select('text').text() ); 
  } )
  // highlight the terms 
  .select('rect').attr('fill', '#00E5EE');

  // highlight the row and column labels 
  //

  // reset all the rect colors to white
  d3.selectAll('.row_label_text').select('rect').attr('fill','white') ;
  d3.selectAll('.col_label_text').select('rect').attr('fill','white') ;
  
  // highlight the kinase row and column labels
  d3.selectAll('.row_label_text').filter( function() { 
      return inst_kinase == d3.select(this).select('text').text() 
  } ).select('rect').attr('fill', '#009ACD');

  d3.selectAll('.col_label_text').filter( function() { 
    return inst_kinase == d3.select(this).select('text').text() 
  } ).select('rect').attr('fill', '#009ACD');


  // Highlight terms from the other network 
  //
  // gather the terms assocaited with the mini_gmt (from the other network)
  inst_mini_terms = mini_gmt[ inst_kinase ];

  // reset the color of the other terms 
  d3.selectAll('.other_cluster_terms').select('rect').attr('fill','#03A89E');

  // find the terms in the bar graph 
  // the class other_cluster_terms is the class fiven to the g elements
  // that hold the bar and text 
  d3.selectAll('.other_cluster_terms').filter( function(d,i) {
    return _.contains(inst_mini_terms, d3.select(this).select('text').text() );
  })
  // highlight the terms 
  .select('rect').attr('fill', '#00E5EE');

}


function click_label(d,i){

  // switch the panes 
  d3.select('#network_info_div').style('display','none');
  d3.select('#bar_graph_div').style('display','block');

  // switch the pane colors 
  d3.select('#network_info').style('background-color','#C8C8C8');
  d3.select('#cluster_info').style('background-color','#909090');  

  // remove the cluster and bar graph instructions 
  d3.select('#cluster_instructions').style('display','none');
  d3.select('#bar_graph_instructions').style('display','none');

  // remove the other bar graphs
  d3.select('#other_bar_graph').remove();

  ini_color = d3.select(this).select('rect').attr('fill');

  // reset all the rect colors to white
  d3.selectAll('.row_label_text').select('rect').attr('fill','white') ;
  d3.selectAll('.col_label_text').select('rect').attr('fill','white') ;
  
  if (ini_color == 'white') {

    // get the kinase name
    var inst_term = d3.select(this).text();

    // highlight the kinase row and column labels
    d3.selectAll('.row_label_text').filter( function() { 
        return inst_term == d3.select(this).select('text').text() 
    } ).select('rect').attr('fill', '#03A89E');

    d3.selectAll('.col_label_text').filter( function() { 
      return inst_term == d3.select(this).select('text').text() 
    } ).select('rect').attr('fill', '#03A89E');


    // plot the terms from the kinase 
    // 
    // remove the old bar graph 
    d3.select('#kinase_bar_graph').remove();
    d3.select('#term_bar_graph').remove();
    d3.select('#bar_title_holder').remove();
    d3.select('#cluster_title').remove();

    // put a new bar graph with the kinase information 
    // 

    // bar graph variables
    var h_line = 20 ;
    var offset = 12 ;
    var bar_height = 16 ;

    // make title
    d3.select('#bar_graph_div')
      .append('div')
      // .style('display','block')
      .attr('id','cluster_title')
      .text(nodes[i].name)
      .style('margin-left','20px')
      .style('margin-top','30px')
      ;

    var tmp_length = gmt[nodes[i].name];

    // initialize bar graph
    svg_bar_kinase = d3.select('#bar_graph_div')
            .append('div')
            .style('display','inline-block')
            .attr('id','kinase_bar_graph')
            .append('svg')
            .attr('width',100)
            .attr('height', tmp_length.length*h_line)
            .style('margin-left','20px')

            ;

    var svg_g = svg_bar_kinase.selectAll('g')
              .data( gmt[nodes[i].name] )
              .enter()
              .append('g')
              .attr('class', 'bar_graph_g');

    // kinase bars
    svg_g
      .append('rect')
      .attr('y', function(d, i) {return i * h_line; })
      .attr('fill', '#03A89E') 
      .attr('height', bar_height)
      .attr('width', 90)
      ;

    svg_g
      .append('text')
      .text(function(d) { return d;})
      .attr('y', function(d, i) {return i * h_line + offset ; })
      .attr('x', 5)
      .attr('class', 'bar_graph_text')
      ;

  }

}

function click_group(d){

  // switch the panes 
  d3.select('#network_info_div').style('display','none');
  d3.select('#bar_graph_div').style('display','block');

  // switch the pane colors 
  d3.select('#network_info').style('background-color','#C8C8C8');
  d3.select('#cluster_info').style('background-color','#909090');  

  // remove the cluster instructions 
  d3.select('#cluster_instructions').style('display','none');

  console.log('click on group')

  // reset the row and column labels to white
  d3.selectAll('.row_label_text').select('rect').attr('fill','white') ;
  d3.selectAll('.col_label_text').select('rect').attr('fill','white') ;



  // if x and y groups are the same, then inst_group is given by nodes[d.x].group
  // if the x and y groups are not the same then inst_group is 0 
  // condition ? value-if-true : value-if-false
  inst_group = nodes[d.x].group == nodes[d.y].group ? nodes[d.x].group : 0 ;

  console.log(inst_group);

  // only bring up group information if they 
  // are clicking in the group cluster 
  if (inst_group != 0){

    // bar graph variables
    var h_line = 20 ;
    var offset = 12 ;
    var bar_height = 16 ;

    // define the linear scaling function
    scale_x = d3.scale
                .linear()
                //.domain([0, max_x ])
                .range([0, 100]);
    scale_x.domain([0, 1]);  

    // remove the old bar graph 
    d3.select('#kinase_bar_graph').remove();
    d3.select('#term_bar_graph').remove();
    d3.select('#bar_title_holder').remove();
    d3.select('#cluster_title').remove();

    d3.select('#bar_graph_div')
      .append('div')
      .style('display','block')
      .attr('id','cluster_title')
      .text('Cluster Data');

    d3.select('#bar_graph_div')
    .append('div')
    .style('display','block')
    .attr('id','bar_title_holder');
    
    d3.select('#bar_title_holder')
    .append('text')
    .text('Kinases')
    .attr('id', 'kinase_bar_title');

    d3.select('#bar_title_holder')
    .append('text')
    .text('Terms')
    .attr('id', 'term_bar_title');


    // collect kinase data 
    var data = [] ;
    inst_kinases = groups[inst_group-1].kinases ;

    // sort the terms based on decreasing weight
    inst_kinases.sort(function(a, b){
        var a1= a.weight, b1= b.weight;
        if(a1== b1) return 0;
        return a1< b1? 1: -1;
    });

    // transfer to data
    for (i = 0; i<inst_kinases.length; i++){
      // add the names to the name array
      var obj = {};
      obj.kinase = inst_kinases[i].kinase; 
      // add the data to the data array
      obj.weight = inst_kinases[i].weight;
      data.push(obj);
    }

    console.log(' the length of data: ' + data.length ); 

    console.log(data[0].kinase);

    // highlight the row and column labels 
    //
    // reset all the rect colors to white
    d3.selectAll('.row_label_text').select('rect').attr('fill','white') ;
    d3.selectAll('.col_label_text').select('rect').attr('fill','white') ;
    // highlight the kinases
    for (i=0; i<data.length; i++){
      
      // highlight the kinase row and column labels
      d3.selectAll('.row_label_text').filter( function() { 
          return data[i].kinase == d3.select(this).select('text').text() 
      } ).select('rect').attr('fill', '#009ACD');

      d3.selectAll('.col_label_text').filter( function() { 
        return data[i].kinase == d3.select(this).select('text').text() 
      } ).select('rect').attr('fill', '#009ACD');
    }


    // initialize bar graph div
    svg_bar_kinase = d3.select('#bar_graph_div')
            .append('div')
            .style('display','inline-block')
            .attr('id','kinase_bar_graph')
            .append('svg')
            .attr('width',100)
            .attr('height', data.length * h_line );

    var svg_g = svg_bar_kinase.selectAll('g')
              .data(data)
              .enter()
              .append('g')
              .attr('class', 'cluster_kinases')
              .on('click', click_cluster_kinase )
              ;

    // kinase bars 
    svg_g
      .append('rect')
      .attr('y', function(d, i) {return i * h_line; })
      .attr('fill', '#B0B0B0') // #B0B0B0  #03A89E
      .attr('height', bar_height)
      .attr('width', function(d) {return scale_x(d.weight);})
      ;

    svg_g
      .append('text')
      .text(function(d) { return d.kinase;})
      .attr('y', function(d, i) {return i * h_line + offset ; })
      .attr('x', 5)
      .attr('class', 'bar_graph_text')
      ;


    // collect term data 
    var data = [] ;
    inst_terms = groups[inst_group-1].terms ;

    // // checking ability to access object information
    // console.log(' ACCESSING OBJECT INFO:');
    // console.log(groups[inst_group-1].terms);
    // console.log(groups[inst_group-1]['terms']);


    // sort the terms based on decreasing weight
    inst_terms.sort(function(a, b){
        var a1= a.weight, b1= b.weight;
        if(a1== b1) return 0;
        return a1< b1? 1: -1;
    });

    // transfer to data
    for (i = 0; i<inst_terms.length; i++){
      // add the names to the name array
      var obj = {};
      obj.term = inst_terms[i].term; 
      // add the data to the data array
      obj.weight = inst_terms[i].weight;
      data.push(obj);
    }

    // initialize term bar graph
    svg_bar_terms = d3.select('#bar_graph_div')
            .append('div')
            .style('display','inline-block')
            .attr('id','term_bar_graph')
            .append('svg')
            .attr('width',225)
            .attr('height', data.length * h_line );

    var svg_g = svg_bar_terms.selectAll('g')
              .data(data)
              .enter()
              .append('g')
              .attr('class','cluster_terms')
              ;

    // term bars 
    svg_g
      .append('rect')
      .attr('y', function(d, i) {return i * h_line; })
      .attr('fill', '#00B26B' ) // #00FF99 //'#03A89E'
      .attr('height', bar_height)
      .attr('width', function(d) {return scale_x(d.weight);})
      ;

    svg_g
      .append('text')
      .text(function(d) { return d.term;})
      .attr('y', function(d, i) {return i * h_line + offset ; })
      .attr('x', 5)
      .attr('class', 'bar_graph_text')
      ;

    d3.select('#bar_graph_instructions').remove();

    d3.select('#bar_graph_div')
      .append('div')
      .append('p')
      .text('Click on a kinase to see associated terms.')
      .attr('id','bar_graph_instructions');
      
    name_other_network = 'kinase_substrate' ; 

    // bring up information from other networks for this group 
    // by running the other_info function (only do this if you are
    // clicking a group)
    other_info(inst_group, data, name_other_network);

    // copy the other network data to a global variable other_data
    // these variables need to float around as global variables in order to 
    // be used by the dropdown menu 
    other_data = data ; 

  // end if clicking in group statement 
  }

// end click_group function 
}



function simple() {

  var key = this.selectedIndex ; 

  // // working 
  // console.log('this') ;
  // console.log(this) ;
  // console.log( d3.select(this[key]).text() ) ;
  // console.log( d3.select(this[key]).attr('value') ) ;

  // redefine name_other_network 
  name_other_network = d3.select(this[key]).attr('value') ;

  console.log('running simple function');
  other_info(inst_group, other_data, name_other_network);


  // using Jquery 
  $("#other_network").prop('selectedIndex',key)

  // the same does not work with d3
  // d3.select('#other_network').attr('selectedIndex', key)

};


// load information about the current group from the other networks 
function other_info(inst_group, data, name_other_network) {

  

  console.log(' running other_info with inst_group: ' + inst_group);

  // load the other terms (at first load the same domain terms)
  var other_terms = groups[inst_group-1]['terms_' + name_other_network] ;
  // create a global variable called mini_gmt that is global because 
  // it will be used by the click_cluster_kinase function to search for 
  // overlapping terms 
  mini_gmt = groups[inst_group-1]['mini_gmt_' + name_other_network] ;


  //
  // Generate other term graph 
  //


  // remove the old cluster bar graph 
  d3.select('#other_bar_title').remove();
  d3.select('#other_bar_graph').remove();
  
  // put a new bar graph with the kinase information 
  // 

  // bar graph variables
  var h_line = 20 ;
  var offset = 12 ;
  var bar_height = 16 ;

  // intitialize data 
  var data = [] ;

  // the term data is in other_terms 

  // // gather term data
  // var inst_terms = clusters[inst_cluster].terms ;

  // sort the terms based on decreasing weight
  other_terms.sort(function(a, b){
      var a1= a.w, b1= b.w;
      if(a1== b1) return 0;
      return a1< b1? 1: -1;
  });


  // transfer to data
  for (i = 0; i< other_terms.length; i++){
    // create temporary object that will be appended to the data structure 
    var obj = {};
    obj.terms = other_terms[i].t; 
    // add the data to the data array
    obj.weight = other_terms[i].w;
    data.push(obj);
  }

  // console.log('data');
  // console.log(data);

  // append div 
  d3.select('#bar_graph_div')
    .append('div')
    .attr('id','other_bar_title')
    .text('Load Kinase-Cluster Information from other Networks')
    .style('font-size', '12px')
    .style('margin-left','0px')
    .style('margin-top','5px')
    // append dropdown menu
    //
    .append('select')
    .on('change', simple)
    .attr('id','other_network')
    // .attr('onchange', "console.log('changing other info');" )
    // .attr('onchange', simple )
    ;

    // Dropdown Menu Options 
    // 
    // Protein Domains 
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_domains')
    .text('Protein Domains');

    // Substrate
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_substrate')
    .attr('selected','selected')
    .text('Kinase Substrates');

    // protein binding partners
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_gene_ppi')
    .text('Protein Binding Partners');

    // Co-precipitated NURSA
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_ip_nursa')
    .text('Co-precipitated Proteins (NURSA)');

    // Differentially Expressed Genes 
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_gene_l1000')
    .text('Differentially Expressed Genes L1000');

    // Regulatory Transcription Factors 
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_tf')
    .text('Regulatory Transcription Factors');

    // Cell line fitness following kinase knockdown (Achilles)
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_cl_achilles')
    .text('Cell Line Fitness Following Kinase Knockdown (Achilles)');

    // Kinase Expression in Cancer Cell Lines (CCLE)
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_cl_ccle')
    .text('Kinase Expression in Cancer Cell Lines (CCLE)');

    // Kinase Copy Number Varation Across Cancer Cell Lines (COSMIC)
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_cl_cosmiccnv')
    .text('Kinase Copy Number Vatiation Across Cancer Cell Lines (COSMIC)')

    // Kinase Mutation Across Cancer Cell Lines (COSMIC)
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_cl_cosmicmut')
    .text('Kinase Mutation Across Cancer Cell Lines (COSMIC)');

    // Kinase Abundance in Cell Lines/Tissues (ProteomicsDB)
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_cl_proteomicsdb')
    .text('Kinase Abundance in Cell Lines/Tissues (ProteomicsDB)');

    // Kinase Association with Disease (OMIM)
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_disease_omim')
    .text('Kinase Association with Disease');

    // Associated Phenotypes in Mice (MGIMPO)
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_phenotype_mgimpo')
    .text('Associated Phenotypes in Mice');

    // Drugs Targeting Kinases (Drugbank)
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_drug_drugbank')
    .text('Drugs Trageting Kinases (DrugBank)');

    // Drugs that Inhibit Kinase by >90% (KinomeScan)
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_drug_kinomescan')
    .text('Drugs that Inhitib Kinase by >90% (KinomeScan)');

    // Membership in Biological Pathways
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_pathway')
    .text('Membership in Biological Pathways');

    // Gene Ontology Terms
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_annot_go')
    .text('Gene Ontoloty Terms');

    // GeneRIF Term 
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_word_generif')
    .text('GeneRIF Terms');

    // Associated Terms from Text Mining 
    d3.select('#other_network')
    .append('option')
    .attr('value','kinase_word_textmining')
    .text('Associated Terms from Text Mining')







  // initialize bar graph
  svg_other_bar = d3.select('#bar_graph_div')
        .append('div')
        .style('display','inline-block')
        .attr('id','other_bar_graph')
        .append('svg')
        .attr('width',330)
        .attr('height',data.length*h_line)
        ;

  // data join 
  var svg_g = svg_other_bar.selectAll('g')
            // .data( gmt[nodes[i].name] )
            .data( data )
            .enter()
            .append('g')
            .attr('class', 'other_cluster_terms');

  // other terms bars
  svg_g
    .append('rect')
    .attr('y', function(d, i) {return i * h_line; })
    .attr('fill', '#5495D6') // '#A9A9FF' '#03A89E'
    .attr('height', bar_height)
    .attr('width', function(d) {return scale_x(d.weight)} )
    ;

  svg_g
    .append('text')
    .text(function(d) { return d.terms;})
    .attr('y', function(d, i) {return i * h_line + offset ; })
    .attr('x', 5)
    .attr('class', 'bar_graph_text')
    ;

};

// function that loads information from other networks 
function tmp(){
  console.log('running the tmp function');
}



function mouseover(p) {
  d3.selectAll(".row_label_text text").classed("active", function(d, i) { return i == p.y; });
  d3.selectAll(".col_label_text text").classed("active", function(d, i) { return i == p.x; });
}

function mouseout() {
  d3.selectAll("text").classed("active", false);
}

// select the order dropdown using the id
d3.select("#order").on("change", function() {
  order(this.value);
});

// define the network names 
network_names = [
  'kinase_domains', 
  'kinase_annot_go', 
  'kinase_cl_achilles', 
  'kinase_cl_ccle',
  'kinase_cl_cosmiccnv',
  'kinase_cl_cosmicmut',
  'kinase_cl_proteomicsdb',
  'kinase_disease_omim',
  'kinase_drug_drugbank',
  'kinase_drug_kinomescan',
  'kinase_gene_resource_gtex',
  'kinase_gene_l1000',
  'kinase_gene_ppi',
  'kinase_ip_nursa',
  'kinase_pathway',
  'kinase_phenotype_mgimpo',
  'kinase_seq',
  'kinase_substrate',
  'kinase_tf',
  'kinase_word_generif',
  'kinase_word_textmining'
];

// define the network titles and descriptions 
network_titles = [
  'Protein Domains', 
  'Gene Ontology Terms',
  'Cell Line Fitness following Kinase Knockdown (Achilles)',
  'Kinase Expression in Cancer Cell Lines (CCLE)',
  'Kinase Copy Number Variation Across Cancer Cell Lines(COSMIC)',
  'Kinase Mutation Across Cancer Cell Lines (COSMIC)',
  'Kinase Abundance in Cell Lines/Tissues (ProteomicsDB)',
  'Kinase Association with Disease (OMIM)',
  'Drugs Targeting Kinases (DrugBank)',
  'Drugs that Inhibit Kinase by >90% (KinomeScan)',
  'Expression Quantitative Trait Loci Possibly regulating Kinase Expression (GTEx)',
  'Differentially Expressed Genes Following Kinase Knockdown (L1000)',
  'Protein Binding Partners',
  'Co-precipiatated Proteins (NURSA)',
  'Membership in Biological Pathways',
  'Associated phenotypes in Mice (MGIMPO)',
  'Kinase Domain Sequence Similarity',
  'Kinase Substrate Similarity',
  'Regulatory Transcription Factors',
  'GeneRIF Term Similarity',
  'Similarity of Associated Terms from Text Mining'
  ];

network_descriptions = [
  // Protein Domains
  'We obtained protein domain data for all human kinases using the Universal Protein Resource (Uniprot) (The Uniprot Consortium, Nucleic Acids Research, 2014), which has domain annotations from Pfam (Punta, Nucleic Acids Research, 2014) and Simple Modular Architecture Tool (SMART) (Letunic, 2012, Nucleic Acids Research). We used the Jaccard index to generate a kinase similarity network based on shared protein domain.',
  // Gene Ontology Terms 
  'The Gene Ontology (GO) is a gene annotation project (Gene Ontology Consortium, Nucleic Acids Research, 2013). GO annotates genes with biological terms selected from a structured vocabulary.  We created a set library with kinases labeling sets of biological terms extracted from GO and computed a kinase similarity network based on Jaccard similarity of sets of GO terms.',

  // Cell Line Fitness following Kinase Knockdown (Achilles)
  'The Cancer Target Discovery and Development (CTD2) Network is a cancer phenotyping project that seeks to identify novel cancer drug targets and novel biomarkers for diagnosis of cancer and prediction of drug response (CTD2 Network, Nature Biotechnology, 2010). Achilles is a CTD2 project that performed shRNA-mediated gene knockdown followed by proliferation rate quantification to assess the essentiality of genes for cell proliferation in a panel of cell lines (Cheung, PNAS, 2011). We filtered the data for kinase knockdowns and used the Jaccard index to calculate a kinase similarity network based on cell lines had high or low fitness after kinase knockdown.',

  // Kinase Expression in Cancer Cell Lines (CCLE)
  'The Cancer Cell Line Encyclopedia (CCLE) is a database of gene expression, genotype, and drug sensitivity data for human cancer cell lines (Barretina, Nature, 2012). We used the Jaccard Index to generate a kinase similarity network based on differential expression of kinases across cancer cell lines.',

  // Kinase Copy Number Variation Across Cancer Cell Lines(COSMIC)
  'The Catalogue of Somatic Mutations in Cancer (COSMIC) is a database of information about somatic mutations in cancer obtained from curation of relevant literature and from high-throughput sequencing data generated by the Cancer Genome Project and other cancer profiling projects such as The Cancer Genome Atlas (Forbes, Nucleic Acids Research, 2011). We downloaded copy number variation data for 1011 cell lines from COSMIC and used the Jaccard index to generate a kinase similarity network based on copy number variation across cancer cell lines.',

  // Kinase Mutation Across Cancer Cell Lines (COSMIC)
  'The Catalogue of Somatic Mutations in Cancer (COSMIC) is a database of information about somatic mutations in cancer obtained from curation of relevant literature and from high-throughput sequencing data generated by the Cancer Genome Project and other cancer profiling projects such as The Cancer Genome Atlas (Forbes, Nucleic Acids Research, 2011). We downloaded mutation data for 1011 cell lines from COSMIC and used the Jaccard index to generate a kinase similarity network based on kinase mutation status across cancer cell lines.',

  // Kinase Abundance in Cell Lines/Tissues (ProteomicsDB)
  'The Proteomics Database hosts the results of a recently published study that profiled protein abundance in high-throughput across a range of cell lines and tissues (Wilhelm, Nature, 2014). We used the Jaccard index to generate a kinase similarity network based on protein abundance across cell-lines/tissues.',

  // Kinase Association with Disease (OMIM)
  'Online Mendelian Inheritance in Man (OMIM) is a database of human phenotypes (e.g. diseases) with known genetic basis (Amberger, Human Mutation, 2011). We downloaded and parsed the data to genrate a list connecting genes to diseases. We used the Jaccard index to create a kinase similarity network based on association with disease.',

  // Drugs Targeting Kinases (DrugBank)
  'DrugBank is manually curated database of information about drugs and their targets (Knox, Nucleic Acids Research, 2011). We used the Jaccard index to generate a kinase similarity network based on drugs targeting kinases.',

  // Drugs that Inhibit Kinase by >90% (KinomeScan)
  'KinomeScan is a Library of Integrated Network-based Cellular Signatures (LINCS) project that is profiling the activity of drugs against kinases (Fabian, Nature Biotechnology, 2005). We downloaded and converted their inhibition data into a binary matrix connecting kinases to drugs by thresholding at 90% inhibition. We used the Jaccard index to generate a kinase similarity network based on inihbitory drugs.',

  // Expression Quantitative Trait Loci Possibly regulating Kinase Expression (GTEx)
  // this network is not being used.
  'The Genotype-Tissue Expression (GTEx) project is a genome mapping project that seeks to discover expression quantitative trait loci in the human genome (GTEx Consortium, Nature Genetics, 2013).',

  // Differentially Expressed Genes Following Kinase Knockdown (L1000)
  'The L1000 Connectivity Map (L1000 Cmap) is a Library of Integrated Network-based Cellular Signatures (LINCS) project that is profiling gene expression changes following pharmacologic or genetic (knockdown or over-expression) perturbation of cell lines in high-throughput (approximately 20000 compounds, 4500 knockdowns, and 3000 over-expressions) (Duan, Nucleic Acids Research, 2014).  The majority of the knockdown perturbations were applied to a core set of 8 cell lines, A375, A549, HA1E, HCC515, HEPG2, HT29, MCF7, and PC3, and most gene expression profiles were measured 96 hours after knockdown. We searched the L1000 Cmap and GEO databases for gene expression profiles of cell lines in control conditions and after knockdown of a kinase. We applied the Characteristic Direction to paired sets of control and perturbed gene expression profiles to obtain signatures of differentially expressed genes for kinase knockdowns in a variety of conditions. After thresholding differential expression of the genes, we used the Jaccard index to generate a kinase similarity matrix based on differentially expressed genes after kinase knockdown.',

  // Protein Binding Partners
  'The Biological General Repository for Interaction Datasets (BioGRID) (Chatr-Aryamontri, Nucleic Acids Research, 2013), the Human Protein Reference Database (HPRD) (Keshava Prasad, Nucleic Acids Research, 2009), the Molecular Interaction Database (MINT) (Licata, Nucleic Acids Research, 2012), and IntAct (Kerrien, Nucleic Acids Research, 2012) are databases of protein-protein interactions. We processed the data from each PPI database separately, combined the PPIs from BioGRID, HPRD, MINT, and IntAct into a single resource, and also computed a consensus PPI resource, retaining only PPIs reported in at least 2 of the four databases just mentioned. We used the Jaccard index to generate a kinase similarity network based on binding partners.',

  // Co-precipiatated Proteins (NURSA)
  'The Human Endogenous Complexome (HEC) is a high content proteomics dataset hosted by the Nuclear Receptor Signaling Atlas (NURSA) consisting of 3000 immuno-precipitations followed by mass spectrometry (Malovannaya, Cell, 2011). The HEC dataset is essentially a gene-set library where each term is a pulled-down protein, which is associated with a set of co-precipitated proteins. We used the Jaccard index to generate a kinase similarity network based on associated IPs.',

  // Membership in Biological Pathways
  'WikiPathways (Kelder, Nucleic Acids Research, 2012), BioCarta, Kyoto Encyclopedia of Genes and Genomes (KEGG) (Kanehisa, Nucleic Acids Research, 2014), and Reactome (Croft, Nucleic Acids Research, 2014) contain databases of biomolecular pathways.  Each pathway consists of a sub-network of molecules that interact to perform a defined cellular function or process. We downloaded and parsed the pathways from each pathways database to create a binary matrix connecting genes to pathways in which the genes have membership. We combined the data and used the Jaccard index to generate a kinase similarity network based on kinase membership in biological pathways.',

  // Associated phenotypes in Mice (MGIMPO)
  'The Mammalian Phenotype Ontology (MPO) developed by Mouse Genome Informatics (MGI) at the Jackson Labs is a controlled vocabulary of mouse phenotype terms that are related to each other in a hierarchical network. Each phenotype is annotated with the genotypes of the mice that display the phenotype. We downloaded and parsed a file from MGI listing associations between genes and high level phenotype terms from the MGO to create a binary matrix connecting genes to phenotypes. We used the Jaccard index to generate a kinase similarity network based on associated phenotypes in mouse caused by kinase knockdown or mutation.',

  // Kinase Domain Sequence Similarity
  'We obtained the amino acid sequences of the kinase domains of human kinases from Manning et al. (Science, 2002) and uploaded these sequences to the ClustalW2 sequence alignment tool to obtain a matrix of kinase similarity scores based on pairwise sequence alignment.',

  // Kinase Substrate Similarity
  'Kinase Enrichment Analysis (KEA) is a gene-set enrichment analysis tool tailored to test if query gene-sets are enriched with genes known to interact with kinases (Lachmann, Bioinformatics, 2009). KEA utilizes a gene-set library with kinases labeling sets of interacting proteins. Many of the interacting proteins are known substrates of the kinases, and many of the kinase-substrate interactions are annotated with phosphosite-level detail (the specific phosphorylated amino acid residue(s) are indicated). Phospho.ELM (Dinkel, Nucleic Acids Research, 2011) and PhosphoSitePlus (Hornbeck, Nucleic Acids Research, 2012) are additional resources that have curated from high-throughput and low-throughput phosphoproteomic experiments lists of phosphorylation sites and kinases known to act on those sites. We combined the data from these resources and used the Jaccard index to generate a kinase network based on substrates.',

  // Regulatory Transcription Factors
  'Chromatin immuno-precipitation followed by sequencing (ChIP-Seq) is a method for identifying transcription factor binding sites that involves isolation and sequencing of short strands of DNA to which an immuno-precipitated transcription factor was bound. Subsequently, target genes of transcription factors can be inferred based on the proximity of transcription factor binding sites to transcription start sites of genes. The Encyclopedia of DNA Elements (ENCODE) is a genome mapping project that seeks to annotate the human genome with information about genes and elements that regulate gene transcription, such as transcription factor binding sites (ENCODE Consortium, Science, 2004). We processed the latest data from ENCODE and mapped every transcription factor binding site to its closest gene. We used the Jaccard index to generate a kinase network based on putative regulatory transcription factors.',

  // GeneRIF Term Similarity
  'Gene Reference Into Function (GeneRIF) is a gene annotation project of the National Library of Medicine, available through the Entrez Gene website of the National Center for Biotechnology Information (Mitchell, AMIA Annu Symp Proc, 2003). A GeneRIF is a short (425 characters or less) statement describing a function of a gene. Each GeneRIF is tagged with the Entrez Gene ID of the described gene and the PubMed ID of the reference supporting the asserted function. There are currently over 900000 GeneRIFs. We downloaded the GeneRIF file and converted it to a set library with genes labeling sets of terms parsed from the GeneRIF sentences and discarded the most frequently appearing (greater than 5%) terms. We used the Jaccard index to generate a kinase similarity network based on associated GeneRIF terms.',

  // Similarity of Associated Terms from Text Mining
  'We used our database of over 12,000 phosphosites and PubMed IDs, obtained from our collaborators at Cell Signaling Technology and the Kinase Enrichment Analysis database, to associate biological information with specific phosphosites through text-mining. We manually extracted over 900 biological terms that appear in 1-5% of abstracts describing phosphosites. We filtered this list to retain only terms associated with phosphorylated kinases. We used the Jaccard index to generate a kinase similarity network based on associated terms from text mining.'

];



// The order function 
function order(value) {

  x.domain(orders[value]);

  // define the t variable as the transition function with 
  // a transition time of 2500 miliseconds 
  var t = svg.transition().duration(2500);

  // run the translation 
  //
  // move the cells vertically
  t.selectAll(".row")
      // .delay(function(d, i) { return x(i) * 4; })
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
    .selectAll(".cell")
      // move the cells horizontally 
      // .delay(function(d) { return x(d.x) * 4; })
      .attr("x", function(d) { return x(d.x); });

  d3.select('.row_labels').selectAll('.row_label_text')
      .transition().duration(2500)
      .attr('transform', function(d, i) { return 'translate(0,' + x(i) + ')'; });


  // t.selectAll(".column")
  d3.select('.col_labels').selectAll(".col_label_text")
      .transition().duration(2500)
      // move the column titles 
      .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
// end order function 
}

 $.unblockUI();

});


};