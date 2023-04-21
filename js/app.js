//************************************** */
//Autenticación de firebase
//************************************** */
firebase.initializeApp({
    apiKey: "AIzaSyCKy9NxnAecRlIjD183w0v0TfVYLaRNmLI",
    authDomain: "actividad-unan-farem-chontales.firebaseapp.com",
    projectId: "actividad-unan-farem-chontales"
});



// Inicializar Firestore
var db = firebase.firestore();

btnGuardar = document.getElementById("guardar").addEventListener("click", guardar);

//************************************** */
// AGREGAR DATOS A FIREBASE
//************************************** */

function guardar() {
    var fecha = document.getElementById('fecha').value;
    var nombre = document.getElementById('nombre').value;
    var inicio = document.getElementById('inicio').value;
    var fin = document.getElementById('fin').value;
    var organ = document.getElementById('cantidad').value;
    var ca = document.getElementById('descripcion').value;
    var link = document.getElementById('materiales').value;

    db.collection("datos").add({
        fecha: moment(fecha, 'YYYY-MM-DD').format('DD/MM/yyyy'),
        nombre: nombre,
        inicio: moment(inicio, 'hh:mm').format('hh:mm a'),
        fin: moment(fin, 'hh:mm').format('hh:mm a'),
        descripcion: ca,
        cantidad: organ,
        materiales: link
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            swal("Registro guardado");
            document.getElementById('fecha').value = '';
            document.getElementById('nombre').value = '';
            document.getElementById('inicio').value = '';
            document.getElementById('fin').value = '';
            document.getElementById('descripcion').value = '';
            document.getElementById('cantidad').value = '';
            document.getElementById('materiales').value = '';
        })
        .catch(function (error) {
            swal("Error al agregar documento", error);
        });

}

//************************************** */
// LEER LOS DATOS DE FIRESTORE
//************************************** */
var tabla = document.getElementById('tabla');
db.collection("datos").onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().fecha}`);
        tabla.innerHTML += `
        <tr>
        <!-- <td>${doc.id}</td> -->
            <td>${doc.data().fecha}</td>
            <td style="font-style: italic;font-weight: bold;">${doc.data().nombre}</td>
            <td>${doc.data().inicio}</td>
            <td>${doc.data().fin}</td>
            <td>${doc.data().cantidad}</td>
            <td>${doc.data().descripcion}</td>
            <td>${doc.data().materiales}</td>
            <td>
                <button onclick="borrar('${doc.id}')"><i class="material-icons blue-text">delete</i></button>
                <button onclick="editar('${doc.id}','${doc.data().fecha}','${doc.data().nombre}','${doc.data().inicio}','${doc.data().fin}','${doc.data().cantidad}','${doc.data().descripcion}','${doc.data().materiales}')"><i class="material-icons red-text">edit</i></button>
            </td>
            
        </tr>
        `;
    });
});

//************************************** */
// BORRAR LOS DATOS DE FIRESTORE
//************************************** */

function borrar(id) {

    swal({
        title: "Esta seguro?",
        text: "Una vez eliminado, no podra recuperar el registro!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                db.collection("datos").doc(id).delete().then(function () {
                    swal("Poof! Registro eliminado!", {
                        icon: "success",
                    });
                })
            } else {
                swal("Su registro esta a salvo!");
            }
        });

    // Hacerlo de manera basica puede utilizar estas sentencias

    /*db.collection("datos").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });*/

}

//************************************** */
// EDITAR LOS DATOS DE FIRESTORE
//************************************** */


function editar(id, fe, n, i, f, c, d, m) {
    $('#modal1').modal('open');
    document.getElementById('mfecha').value = fe;
    document.getElementById('mnombre').value = n;
    document.getElementById('minicio').value = i;
    document.getElementById('mfin').value = f;
    document.getElementById('cant').value = c;
    document.getElementById('desc').value = d;
    document.getElementById('mat').value = m;
    document.getElementById('editar').addEventListener('click', edita);

    function edita() {
        var datosRef = db.collection("datos").doc(id);

        return datosRef.update({
            fecha: document.getElementById('mfecha').value,
            nombre: document.getElementById('mnombre').value,
            inicio: document.getElementById('minicio').value,
            fin: document.getElementById('mfin').value,
            cantidad: document.getElementById('cant').value,
            descripcion: document.getElementById('desc').value,
            materiales: document.getElementById('mat').value

        })
            .then(function () {
                // swal("Registro Editado");
                location.reload();
            })
            .catch(function (error) {
                swal("Error al actualizar", error);
            });

    }

}

//************************************** */
// BUSCAR LOS DATOS EN LA TABLA
//************************************** */

document.querySelector("#busqueda").onkeyup = function () {
    $filtro_tabla("#tabla", this.value);
}

$filtro_tabla = function (id, value) {
    var filas = document.querySelectorAll(id + ' tr');

    for (var i = 0; i < filas.length; i++) {
        var mostrarFila = false;

        var fila = filas[i];
        fila.style.display = 'none';

        for (var x = 0; x < fila.childElementCount; x++) {
            if (fila.children[x].textContent.toLowerCase().indexOf(value.toLowerCase().trim()) > -1) {
                mostrarFila = true;
                break;
            }
        }

        if (mostrarFila) {
            fila.style.display = null;
        }
    }
}