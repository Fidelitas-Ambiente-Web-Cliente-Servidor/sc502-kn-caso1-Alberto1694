const menu = [
  { nombre: 'Bruschetta Clásica',     descripcion: 'Pan tostado con tomate y albahaca fresca',   precio: 4500,  categoria: 'Entrada'       },
  { nombre: 'Tabla de Quesos',         descripcion: 'Selección de quesos importados con mermelada', precio: 7800,  categoria: 'Entrada'       },
  { nombre: 'Lomo al Vino Tinto',      descripcion: 'Lomo de res en reducción de vino tinto',      precio: 15500, categoria: 'Plato Fuerte'  },
  { nombre: 'Pasta Carbonara',         descripcion: 'Pasta con tocino, huevo y queso parmesano',    precio: 10200, categoria: 'Plato Fuerte'  },
  { nombre: 'Salmón a la Plancha',     descripcion: 'Filete de salmón con vegetales al vapor',      precio: 13800, categoria: 'Plato Fuerte'  },
  { nombre: 'Tiramisú',               descripcion: 'Postre italiano con café y mascarpone',         precio: 5200,  categoria: 'Postre'        },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá',    precio: 4800,  categoria: 'Postre'        },
];

let reservas = [];
let categoriaActual = 'Todos';

function renderMenu() {
  const contenedor = document.getElementById('contenedor-menu');
  contenedor.innerHTML = '';

  let lista = menu;

  if (categoriaActual !== 'Todos') {
    lista = menu.filter(plato => plato.categoria === categoriaActual);
  }

  lista.forEach(plato => {
    const columna = document.createElement('div');
    columna.className = 'col-md-4';

    const card = document.createElement('div');
    card.className = 'card-plato';

    const nombre = document.createElement('h3');
    nombre.textContent = plato.nombre;

    const descripcion = document.createElement('p');
    descripcion.textContent = plato.descripcion;

    const precio = document.createElement('p');
    precio.textContent = '₡' + plato.precio.toLocaleString('es-CR');

    const categoria = document.createElement('p');
    categoria.textContent = plato.categoria;

    card.appendChild(nombre);
    card.appendChild(descripcion);
    card.appendChild(precio);
    card.appendChild(categoria);
    columna.appendChild(card);
    contenedor.appendChild(columna);
  });
}

function filtrarCategoria(categoria) {
  categoriaActual = categoria;
  renderMenu();

  const botones = document.querySelectorAll('.filtros button');

  botones.forEach(boton => {
    boton.classList.remove('activo');

    if (boton.dataset.categoria === categoria) {
      boton.classList.add('activo');
    }
  });
}

function validarFormulario() {
  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const fecha = document.getElementById('fecha').value;
  const personas = document.getElementById('personas').value;
  let valido = true;

  document.getElementById('error-nombre').textContent = '';
  document.getElementById('error-correo').textContent = '';
  document.getElementById('error-fecha').textContent = '';
  document.getElementById('error-personas').textContent = '';

  if (nombre.length < 5 || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre)) {
    document.getElementById('error-nombre').textContent = 'Ingrese un nombre valido.';
    valido = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    document.getElementById('error-correo').textContent = 'Ingrese un correo valido.';
    valido = false;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaReserva = new Date(fecha + 'T00:00:00');

  if (fecha === '' || fechaReserva < hoy) {
    document.getElementById('error-fecha').textContent = 'Ingrese una fecha valida.';
    valido = false;
  }

  if (personas === '' || personas < 1 || personas > 20) {
    document.getElementById('error-personas').textContent = 'Ingrese de 1 a 20 personas.';
    valido = false;
  }

  document.getElementById('btn-enviar').disabled = !valido;
  return valido;
}

function agregarReserva() {
  if (!validarFormulario()) {
    return;
  }

  const reserva = {
    nombre: document.getElementById('nombre').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    personas: Number(document.getElementById('personas').value)
  };

  reservas.push(reserva);

  const fila = document.createElement('tr');
  fila.className = 'fila-reserva';

  if (reserva.personas >= 6) {
    fila.classList.add('grande');
  }

  fila.innerHTML = `
    <td>${reserva.nombre}</td>
    <td>${reserva.correo}</td>
    <td>${reserva.fecha}</td>
    <td>${reserva.hora}</td>
    <td>${reserva.personas}</td>
  `;

  document.getElementById('tabla-reservas').appendChild(fila);
  document.getElementById('mensaje').textContent = 'Reserva agregada correctamente.';
  document.getElementById('form-reserva').reset();
  document.getElementById('btn-enviar').disabled = true;
  actualizarResumen();
}

function actualizarResumen() {
  const resumen = document.getElementById('resumen');
  let totalPersonas = 0;
  let mayor = 0;

  reservas.forEach(reserva => {
    totalPersonas += reserva.personas;

    if (reserva.personas > mayor) {
      mayor = reserva.personas;
    }
  });

  resumen.innerHTML = `
    <p>Total de reservas registradas: ${reservas.length}</p>
    <p>Total de personas esperadas: ${totalPersonas}</p>
    <p>Reserva con mayor número de personas: ${mayor}</p>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  renderMenu();
  actualizarResumen();

  document.getElementById('form-reserva').addEventListener('submit', function (e) {
    e.preventDefault();
    agregarReserva();
  });

  document.getElementById('nombre').addEventListener('input', validarFormulario);
  document.getElementById('correo').addEventListener('input', validarFormulario);
  document.getElementById('fecha').addEventListener('input', validarFormulario);
  document.getElementById('personas').addEventListener('input', validarFormulario);

  document.querySelectorAll('.filtros button').forEach(boton => {
    boton.addEventListener('click', function () {
      filtrarCategoria(this.dataset.categoria);
    });
  });
});