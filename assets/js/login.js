document.getElementById('form-login').addEventListener('submit', function (e){

    e.preventDefault();

    const documento = document.getElementById('documento').value.trim();
    const password = document.getElementById('password').value;

    if(documento === '' || password === ''){
        Swal.fire({
            icon: 'error',
            title: 'Faltan datos',
            tet: 'Completa documento y contraseña.'
        });
        return;
    }

    const btn = document.getElementById('btn-login');
    btn.disabled = true;
    btn.textContent = 'Ingresando...';

    const datos = {documento, password};

    fetch('login.php', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
       
        if(data.success) {
            window.location.href = 'estudios.html';
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo iniciar sesión',
                text: data.message
            });
        }
    })
    .catch(error => {
        console.error('Error en la peticion: ', error);
        Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'No se pudo conectar con el servidor. Intenta de nuevo.'
        });

    })
    .finally(() => {
        btn.disable = false;
        btn.textContent = 'Iniciar Sesión';
    });
});