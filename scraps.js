	// Reset Enrichment Button
	//

	// // if you click run enrichment analysis again then reset things 
	// if (running_enrichment == 1){
	// 	// move the search network down
	// 	d3.select('#search_button').transition().duration(1000).style('top',y_ini_search_button+'px')
	// 	// move the library description down
	// 	d3.select('#style_library_description_panel').transition().duration(1000).style('top',y_ini_library_description+'px')		

	// 	// set running enrichment to 0 since you are not running an enrichment 
	// 	running_enrichment = 0;

	// 	// remove enrichment panel
	// 	d3.select('#input_panel_appearing').transition().duration(1000).style('opacity',0).transition().duration(1000).style('display','none');
	// 	d3.select('#input_text_appearing').transition().duration(1000).style('height','0px');
	// 	d3.select('#input_three_buttons_appearing').transition().duration(1000).style('opacity',0).style('top', y_ini_input_three_buttons+'px').transition().duration(1000).style('display','none');

	// };



			// d3.select('#input_text_appearing')
		// 	.transition().delay(delay_show).duration(1000).style('opacity',1)
		// 	.transition().delay(delay_show).style('height','200px')
		// 	.style('display','block');




		<?php 
// open the text file
$f = fopen('textfile.txt','w');

console.log('in php script')

// write a line
fwrite($f, 'PHP is fun!');

// close the text file 
fclose($f);

?>


starts with a number

Cacna1E_S1995 
Eif4Ebp1_T46 
Clec12B_Y7 
Kcne1_S102 
Marcks_S152


has & in the name 

Cox5B_S33
Fpr1_T339
Dact1_S237
Gga3_S538
Nde1_T246
Ppp1R3C_S33
Rbck1_S270
Drosha_S300
Mylk_S991
Itgb3_T784
Emd_Y106
Ptk2_Y615
Atf7_T112
Dok1_Y377
Tnks_T982
Adrb2_S346
Sncaip_S215
Dnmt1_S515
Hmga1_S64
Adrb2_T68
Fyb_Y595
Htt_S1159
Chat_S476
P2Rx1_S130
Gmnn_S202
Eif4Ebp1_S111
Slc9A3_S552
Grb7_Y188
Ppp1R1B_S137
Irs1_T446


has / in the name 

Cox5B_S33
Fpr1_T339
Dact1_S237
Gga3_S538
Nde1_T246
Ppp1R3C_S33
Rbck1_S270
Drosha_S300
Mylk_S991
Itgb3_T784
Emd_Y106
Ptk2_Y615
Atf7_T112
Dok1_Y377
Tnks_T982
Adrb2_S346
Sncaip_S215
Dnmt1_S515
Hmga1_S64
Adrb2_T68
Fyb_Y595
Htt_S1159
Chat_S476
P2Rx1_S130
Gmnn_S202
Eif4Ebp1_S111
Slc9A3_S552
Grb7_Y188
Ppp1R1B_S137
Irs1_T446


parkingson's





<table>
  <thead>
    <tr>
      <th width="200">Table Header</th>
      <th>Table Header</th>
      <th width="150">Table Header</th>
      <th width="150">Table Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Content Goes Here</td>
      <td>This is longer content Donec id elit non mi porta gravida at eget metus.</td>
      <td>Content Goes Here</td>
      <td>Content Goes Here</td>
    </tr>
    <tr>
      <td>Content Goes Here</td>
      <td>This is longer Content Goes Here Donec id elit non mi porta gravida at eget metus.</td>
      <td>Content Goes Here</td>
      <td>Content Goes Here</td>
    </tr>
    <tr>
      <td>Content Goes Here</td>
      <td>This is longer Content Goes Here Donec id elit non mi porta gravida at eget metus.</td>
      <td>Content Goes Here</td>
      <td>Content Goes Here</td>
    </tr>
  </tbody>
</table>




	 pubmed script

	// // make table with pubmed links 
		// if (pubmed_links == 1){

		// 	for (var i = 0; i < nodeList.length; i++){
		// 		var tableRow = baseTable.append("tr");
		// 		for (var x = 0; x < 4; x++){
		// 			if (x == 0 ){

		// 				// get pmid
		// 				term  = nodeList[i][0];
		// 				open  = term.search('\\\['); 
  //       				close = term.search('\\\]'); 
  //       				pmid  = term.substring( open+1, close );
		// 				// generate address
		// 				address = 'http://www.ncbi.nlm.nih.gov/pubmed/' + pmid ;

		// 				short_name = term.search('\\\(');

		// 				tableRow
		// 					.attr('data-tooltip','')
		// 					.attr('class', 'has-tip tip-left')
		// 					.attr('title', nodeList[i][7])
		// 					.append("td")
		// 					.append('a')
		// 					.attr('href', address)
		// 					.attr('target', '_blank')
		// 					.text(nodeList[i][x].substring(0,short_name));
		// 			}

		// 			// ! formerly 1
		// 			else if (x == 3){

		// 				tableRow
		// 					.append("td")
		// 					.style('width', '70px')
		// 					.text(nodeList[i][2]);		
		// 			}
		// 		}		
		// 	}
		// } 
		// // make table withouth pubmed links
		// else {

			// ! this is where the table script normally goes 

		// }