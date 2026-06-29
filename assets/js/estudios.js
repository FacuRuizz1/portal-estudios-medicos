const tabla = document.getElementById('tabla-estudios');
const buscador = document.getElementById('buscador');
const nombreUsuario = document.getElementById('nombre-usuario');
const btnLogout = document.getElementById('btn-logout');

//Funcion para pedir los estudios al servidor
function cargarEstudios(busqueda = '') {

    const url = 'estudios.php?busqueda=' + encodeURIComponent(busqueda);

    fetch(url)
    .then(response => response.json())
    .then(data => {

        if(!data.success) {
            //Si no hay session activa (401) u otro error
            //Mandamos el usuario de vuelta al login
            Swal.fire({
                icon:'warning',
                title: 'Sesion finalizada',
                text: data.message
            }).then(() => {
                window.location.href = 'index.html';
            });
            return;
        }

        nombreUsuario.textContent = data.usuario_nombre;
        renderizarTabla(data.estudios);
        
    })
    .catch(error => {
        console.log('Error al cargar estudios', error);
        tabla.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger py-4">
                        No se pudieron cargar los estudios.
                    </td>
                </tr>`;
    });
}


// Función: pintar las filas de la tabla
function renderizarTabla(estudios) {
 
    if (estudios.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    No se encontraron estudios.
                </td>
            </tr>`;
        return;
    }
 
    // Armamos el HTML de todas las filas y lo insertamos de una sola vez
    // (más eficiente que ir agregando fila por fila)
    tabla.innerHTML = estudios.map(estudio => `
        <tr>
            <td>${estudio.numero_estudio}</td>
            <td>${formatearFecha(estudio.fecha)}</td>
            <td>${estudio.tipo_estudio}</td>
            <td>${badgeEstado(estudio.estado)}</td>
        </tr>
    `).join('');
}

// Función: convertir 'YYYY-MM-DD' a 'DD/MM/YYYY'
function formatearFecha(fechaISO) {
    const [anio, mes, dia] = fechaISO.split('-');
    return `${dia}/${mes}/${anio}`;
}

// Función: devolver el badge de Bootstrap según el estado
function badgeEstado(estado) {
    let clase = 'secondary'; // color por defecto
 
    if (estado === 'Disponible') clase = 'success';
    if (estado === 'Pendiente')  clase = 'warning';
    if (estado === 'En Proceso') clase = 'info';
 
    return `<span class="badge bg-${clase}">${estado}</span>`;
}

// Búsqueda en vivo, con debounce
/* El debounce evita disparar un fetch() en CADA tecla.
 Esperamos a que el usuario deje de escribir por 400ms
 antes de mandar la petición
*/
let temporizador;
 
buscador.addEventListener('input', function () {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
        cargarEstudios(buscador.value.trim());
    }, 400);
});

//Logout
btnLogout.addEventListener('click', function () {
    fetch('logout.php')
        .then(() => {
            window.location.href = 'index.html';
        });
});

//Carga inicial al entrar la pagina
cargarEstudios();