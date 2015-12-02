<?php
    header('Content-Disposition: attachment; filename="enrichment_results.txt"');
    header('Content-Type: text/h323');

    $random_number = $_GET["q"];
    $filename = "enrichment_results_" . $random_number . ".txt" ;

    $fp = fopen($filename, "r");
    fpassthru($fp);
    fclose($fp);
    // delete the file 
    unlink($filename);
?>