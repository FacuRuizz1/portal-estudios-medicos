document.getElementById('form-registro').addEventListener('submit', function (e){

    //Evitamos que el formulario haga su comportamiento normal --> (recargar la pagina y mandar los datos por URL)
    e.preventDefault();

    //Tomo los valores del input
    const nombre = document.getElementById('nombre').value.trim();
    const documento = document.getElementById('documento').value.trim();
    const password = document.getElementById('password').value;
    const passWordConfirm = document.getElementById('password_confirm').value;

    //Validacion del lado del cliente
    if (password !== passWordConfirm) {
        Swal.fire({
            icon: 'error',
            title: 'Las contraseñas no coinciden',
            text: 'Revisa que ambos campos de contraseña sean iguales'
        });
        return;
    }


    //Deshabilito el boton mienstras se procesa, para evitar doble click
     const btn = document.getElementById('btn-registro');
     btn.disabled = true;
     btn.textContent = 'Registrando...';


     //Armo el cuerpo de la peticion
     const datos = {nombre, documento, password};


     //La llamada AJAX en si: fetch() hacia nuestro enpoint PHP
     fetch('registrar.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos)
     })
     .then(response=>response.json()
     .then(data => {
        
        if(data.success){
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso',
                text: data.message,
                confirmButtonText: 'Ir a iniciar sesión'
            }).then(() => {
                window.location.href = 'index.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo registrar',
                text: data.message
            });
        }
     })
     .catch(error => {
        //Esto captura errores de red (servidor caido, etc.), no errores logicos.
        console.error('Error en la peticion:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'No se pudo conectar con el servidor. Intenta de nuevo.'
        });
     })
     .finally(() => {
        //Esto se ejecuta siempre, haya salido mal o bien
        btn.disable = false;
        btn.textContent = 'Registrarme';
     }));
});