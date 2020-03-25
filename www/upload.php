<?php
$target_dir = "/upload/";
if (!empty($_FILES) ) {
    $tempFile   = $_FILES['file_to_upload']['tmp_name'];
    $uploadDir  = $_SERVER['DOCUMENT_ROOT'] . $target_dir;
    $targetFile = $uploadDir . $_FILES['file_to_upload']['name'];

    // Save the file
    move_uploaded_file($tempFile, $targetFile);
    echo 1;
}
?>