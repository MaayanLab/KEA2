<?php
    header('Content-Type: application/download');
    header('Content-Disposition: attachment; filename="enrichment_results.txt"');
    header("Content-Length: " . filesize("enrichment_results.txt"));

    $fp = fopen("enrichment_results.txt", "r");
    fpassthru($fp);
    fclose($fp);
?>
