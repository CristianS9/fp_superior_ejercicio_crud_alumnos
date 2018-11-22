<?php
    include_once "../clases/conexion.php";
    $conexion = new conexion();

    $datos = $conexion->query("CALL `spListarAlumnos`()");

    echo json_encode($datos->fetchAll());

?>