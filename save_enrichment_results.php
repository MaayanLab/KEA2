<?php
    $filename = 'enrichment_results_' . $_POST['rand'] . '.txt';
    $fp = fopen($filename, 'w');
    fwrite($fp, $_POST['data']);
    fclose($fp);
?>
