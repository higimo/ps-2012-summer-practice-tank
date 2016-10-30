<?php
    function getMainConfig( $file )
    {
        $fileContent = file_get_contents( $file );
        return json_decode( $fileContent, true );
    }
?>