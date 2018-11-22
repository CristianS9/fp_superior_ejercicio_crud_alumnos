var g ={};
$(document).ready(function(){
    menuActivo();
    opcionesMenuActivas();
    anadirAlumnosActivo();
    borrarAlumnoActivo();
    modificarAlumnoActivo();
    aplicarCambiosActivo();
    notificacionActiva();
});

//Cambia el contenido segun dodnde pulses en el menu
function menuActivo() {
    $(".opcion").click(function () {
        var id = $(this).attr("id");
        $(".contenido>div").css("display", "none");
        $(".cont-" + id).css("display", "grid");
    });
}



// ALgunas opciones de menu necesitan cargar contenido para mostroar al hacer clic en ellas
function opcionesMenuActivas(){
    listadoBorrarActivo();
    listadoModificarActivo();
    listadoAlumnosActivo();
}

//Al hacer clic obtiene los datos para cargar en el formulario para elegir que usuario eliminar
function listadoBorrarActivo() {
    $("#borrar").click(function () {
        $.ajax({
            url: "ajax/index_listadoSelect.php",
            type: "GET",
            dataType: "json",
            success: function (datos) {
                listarSelect("borrar", datos);
            },
            error: function (error) {
                console.log("index_listadoSelect.php ---->");
                console.log(error);
            }
        });
    });
}

// Rellena los datos obtenidos en el opt seleccionado
function listarSelect(div, datos) {
    $("#sel-" + div).html("");
    datos.forEach(alumno => {
        var option = "<option value='" + alumno["id"] + "'>" + alumno["Nombre"] + "</option>";
        $("#sel-" + div).append(option);
    });
}

// Obtiene los datos de la base de datos para poder elegir el usuario a modificar
function listadoModificarActivo() {
    $("#modificar").click(function () {
        $.ajax({
            url: "ajax/index_listadoSelect.php",
            type: "GET",
            dataType: "json",
            success: function (datos) {
                listarSelect("modificar", datos);
            },
            error: function (error) {
                console.log("index_listadoSelect.php ---->");
                console.log(error);
            }
        });
    });
}
// Al hacer clic obtiene los datos de todos los alumnos
function listadoAlumnosActivo() {
    $("#listar").click(function () {
        $.ajax({
            url: "ajax/index_listarAlumnos.php",
            type: "GET",
            dataType: "json",
            success: function (datos) {
                listarAlumnos(datos);
            },
            error: function (error) {
                console.log("index_listarAlumnos.php ---->");
                console.log(error);
            }
        })
    });
}

// Escribe los datos de todos los alumnos obtenidos
function listarAlumnos(datos) {
    $(".cont-listar>table>tbody").html("");
    datos.forEach(alumno => {
        var nombre = "<td>" + alumno["Nombre"] + "</td>";
        var edad = "<td>" + alumno["Edad"] + "</td>";
        var curso = "<td>" + alumno["Curso"] + "</td>";
        var linea = "<tr>" + nombre + edad + curso + "</tr>";
        $(".cont-listar>table>tbody").append(linea);
    });
}
// Al clicar obtiene los datos y los introduce en la base de datos
function anadirAlumnosActivo() {
    $("#anadirAlumno").click(function () {
        var nombre = $("#addNombre").val();
        var edad = $("#addEdad").val();
        var curso = $("#addCurso").val();
        var data = { "nombre": nombre, "edad": edad, "curso": curso };
        $.ajax({
            url: "ajax/index_anadirAlumno.php",
            data: data,
            type: "POST",
            success: function () {
                notificacion("Alumno " + nombre + " añadido correctamente");
                vaciarFormulario("add");
            },
            errro: function (error) {
                console.log("index_anadirAlumno.php ---->");
                console.log(error);
            }
        });
    });
}

// vacia los campos del formulario especificado
function vaciarFormulario(prefijo) {
    $("#" + prefijo + "Nombre").val("");
    $("#" + prefijo + "Edad").val("");
    $("#" + prefijo + "Curso").val("");
}

// Al hacer clic borra el alumno seleccionado
function borrarAlumnoActivo() {
    $("#borrarAlumno").click(function () {
        var id = $("#sel-borrar").val();
        var nombre = $("#sel-borrar>option:selected").text();
        console.log(id);
        $.ajax({
            url: "ajax/index_borrarAlumno.php",
            data: {
                "id": id
            },
            type: "POST",
            success: function () {
                notificacion("Alumno " + nombre + " borrado correctamente");
                $("#anadir").click();
                $("#borrar").click();
            },
            error: function (error) {
                console.log("index_anadirAlumno.php ---->");
                console.log(error);
            }
        })
    });
}

// Al clicar muestra la pestaña con los datos a modificar del usuario seleccionado 
function modificarAlumnoActivo(){
    $("#modificarAlumno").click(function(){
        $(".contenido>div").css("display", "none");
        $(".form-modificar").css("display","grid");
        var id = $("#sel-modificar").val();
        rellenarFormularioModificar(id);
    });
};

// Rellena el formuaro con los datos del alumno seleccionado para modificar
function rellenarFormularioModificar(id){
    $.ajax({
        url: "ajax/index_datosAlumno.php",
        data: {"id":id},
        type: "POST",
        dataType: "json",
        success: function (datos) {
            $("#modNombre").val(datos["Nombre"]);
            $("#modEdad").val(datos["Edad"]);
            $("#modCurso").val(datos["Curso"]);
        },
        error: function (error) {
            console.log("index_listadoSelect.php ---->");
            console.log(error);
        }
    });
}
// Los datos modificados al hacer click los introduce en la base de datos
function aplicarCambiosActivo(){
    $("#aplicarCambios").click(function(){
        var id = $("#sel-modificar").val();
        var nombre = $("#modNombre").val();
        var edad = $("#modEdad").val();
        var curso = $("#modCurso").val();
        var data = {"id":id,"nombre": nombre, "edad": edad, "curso": curso };
        $.ajax({
            url: "ajax/index_modificarAlumno.php",
            data: data,
            type: "POST",
            success: function(){
                notificacion("Alumno " + nombre + " modificado correctamente");
                vaciarFormulario("mod");
            },
            error: function (error) {
                console.log("index_modificarAlumno.php ---->");
                console.log(error);
            }
        });
    })
}

// Muestra una notificacion con el mensaje establecido, desaparece sola despues de 5 segundos
function notificacion(texto){
    $(".notificacion").css("display","block");
    $(".notificacion").html(texto);
    setTimeout(function () {
        $(".notificacion").css("display", "none");
    }, 5000);
}
// Permite ocultar las notificaciones cuando aparecen
function notificacionActiva() {
    $(".notificacion").click(function () {
        $(this).css("display", "none");
    });
}
