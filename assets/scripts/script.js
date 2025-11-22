const productos = [
    {
        code: '001',
        name: 'iPhone 12 Pro 128GB',
        description: 'Excelente estado, con caja original y accesorios. Batería al 95%.',
        price: 450000,
        image: 'assets/images/iPhone 12 Pro 128GB.webp',
    },
    {
        code: '002',
        name: 'Bicicleta de Montaña Trek',
        description: 'Bicicleta en perfecto estado, poco uso, ideal para aventuras.',
        price: 90000,
        image: 'assets/images/Bicicleta de Montaña Trek.jpg',
    },
    {
        code: '003',
        name: 'MacBook Air M1 2021',
        description: 'Como nuevo, con garantía extendida hasta 2025.',
        price: 850000,
        image: 'assets/images/MacBook Air M1 2021.jpg',
    },
    {
        code: '004',
        name: 'Sofá 3 Cuerpos',
        description: 'Sofá cómodo y en buen estado, ideal para living.',
        price: 120000,
        image: 'assets/images/Sofá 3 Cuerpos.webp',
    },
    {
        code: '005',
        name: 'Cámara Canon EOS R6',
        description: 'Cámara profesional con lente 24-105mm incluido.',
        price: 1200000,
        image: 'assets/images/Cámara Canon EOS R6.jpg',
    },
    {
        code: '006',
        name: 'Guitarra Eléctrica Fender',
        description: 'Stratocaster americana, sonido increíble.',
        price: 65000,
        image: 'assets/images/Guitarra Eléctrica Fender.webp',
    },
    {
        code: '007',
        name: 'Tablet Samsung Galaxy Tab S8',
        description: 'Tablet de alta gama con S Pen incluido, ideal para trabajo y entretenimiento.',
        price: 420000,
        image: 'assets/images/Tablet Samsung Galaxy Tab S8.webp',
    },
    {
        code: '008',
        name: 'PlayStation 5 Digital',
        description: 'Consola nueva generación, incluye 2 controles y 3 juegos.',
        price: 380000,
        image: 'assets/images/PlayStation 5 Digital.webp',
    },
    {
        code: '009',
        name: 'Monitor Gaming 27" 144Hz',
        description: 'Monitor gamer con alta frecuencia de actualización, perfecto para esports.',
        price: 280000,
        image: 'assets/images/Monitor Gaming 27 144Hz.webp',
    },
    {
        code: '010',
        name: 'Drone DJI Mini 3 Pro',
        description: 'Drone compacto con cámara 4K, ideal para fotografía aérea profesional.',
        price: 520000,
        image: 'assets/images/Drone DJI Mini 3 Pro.jpg',
    }
];

// Array para el carrito de compras
let carrito = [];

// Datos de solo lectura para los cálculos
const TASA_IVA = 0.19;
const TASA_DESPACHO = 0.05;
const UMBRAL_DESPACHO = 100000;

// Variables para datos del cliente
let datosCliente = {};

// Variables para nombre del usuario
let nombreUsuario = '';
let apellidoUsuario = '';

// Array para productos filtrados
let productosFiltrados = [...productos];

// Función para formatear precios en formato chileno
function formatearPrecio(precio) {
    return `$${precio.toLocaleString('es-CL')}`;
}

// Función para renderizar productos
function renderizarProductos() {
    const contenedorProductos = document.querySelector('.products-grid');
    contenedorProductos.innerHTML = '';

    if (productosFiltrados.length === 0) {
        contenedorProductos.innerHTML = '<p class="text-center text-muted w-100">No se encontraron productos que coincidan con tu búsqueda.</p>';
        return;
    }

    productosFiltrados.forEach(producto => {
        const tarjetaProducto = document.createElement('article');
        tarjetaProducto.className = 'product-card';
        
        tarjetaProducto.innerHTML = `
            <img src="${producto.image}" alt="${producto.name}" class="product-card__image">
            <h3 class="product-card__title">
                <a href="#">${producto.name}</a>
            </h3>
            <p class="product-card__description">${producto.description}</p>
            <div class="product-card__price">${formatearPrecio(producto.price)}</div>
            <div class="product-card__footer">
                <div class="input-group mb-3">
                    <div class="input-group-text">
                        <input class="form-check-input mt-0 checkbox-producto"
                               type="checkbox"
                               data-codigo="${producto.code}"
                               data-bs-toggle="tooltip"
                               data-bs-placement="top"
                               title="Selecciona este producto">
                    </div>
                    <input type="number"
                           class="form-control input-cantidad"
                           min="1"
                           value="0"
                           data-codigo="${producto.code}"
                           data-bs-toggle="tooltip"
                           data-bs-placement="top"
                           title="Cantidad a agregar">
                </div>
                <button class="btn btn-primary btn-sm btn-agregar"
                        data-codigo="${producto.code}"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Agregar al carrito">
                    <i class="fa-solid fa-cart-plus me-1"></i>Agregar
                </button>
            </div>
        `;
        
        contenedorProductos.appendChild(tarjetaProducto);
    });

    agregarEventos();
    inicializarTooltips();
}

// Función para inicializar tooltips de Bootstrap
function inicializarTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Función para filtrar productos
function filtrarProductos(textoBusqueda) {
    const busqueda = textoBusqueda.toLowerCase().trim();

    if (busqueda === '') {
        productosFiltrados = [...productos];
    } else {
        productosFiltrados = productos.filter(producto =>
            producto.name.toLowerCase().includes(busqueda) ||
            producto.description.toLowerCase().includes(busqueda)
        );
    }

    renderizarProductos();
}

// Función para agregar eventos
function agregarEventos() {
    // Botones agregar al carrito
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', function() {
            const codigo = this.getAttribute('data-codigo');
            const checkbox = document.querySelector(`input[data-codigo="${codigo}"]`);
            const inputCantidad = document.querySelector(`.input-cantidad[data-codigo="${codigo}"]`);
            
            if (checkbox.checked) {
                const cantidad = parseInt(inputCantidad.value);
                if (cantidad > 0) {
                    agregarAlCarrito(codigo, cantidad);
                }
            } else {
                alert('Por favor selecciona el producto marcando la casilla.');
            }
        });
    });

    // Eventos de checkbox para feedback visual
    document.querySelectorAll('.checkbox-producto').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const codigo = this.getAttribute('data-codigo');
            const inputCantidad = document.querySelector(`.input-cantidad[data-codigo="${codigo}"]`);
            
            if (this.checked) {
                inputCantidad.style.backgroundColor = '#e7f3ff';
            } else {
                inputCantidad.style.backgroundColor = '';
            }
        });
    });

    // Evento para el formulario de datos del cliente
    const formDatosCliente = document.getElementById('form-datos-cliente');
    if (formDatosCliente) {
        formDatosCliente.addEventListener('submit', function(e) {
            e.preventDefault();
            procesarCompra();
        });
    }

    // Evento para el filtro de productos
    const inputFiltro = document.getElementById('filtro-productos');
    if (inputFiltro) {
        inputFiltro.addEventListener('input', function(e) {
            filtrarProductos(e.target.value);
        });
    }
}

// Función para agregar productos al carrito
function agregarAlCarrito(codigo, cantidad) {
    const producto = productos.find(p => p.code === codigo);
    if (!producto) return;

    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.codigo === codigo);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            codigo: producto.code,
            nombre: producto.name,
            precio: producto.price,
            cantidad: cantidad
        });
    }

    actualizarMostrarCarrito();
    actualizarContadorCarrito();
    
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(codigo) {
    carrito = carrito.filter(item => item.codigo !== codigo);
    actualizarMostrarCarrito();
    actualizarContadorCarrito();
}

// Función para actualizar contador del carrito en navbar
function actualizarContadorCarrito() {
    const badgeCarrito = document.getElementById('badge-carrito');
    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);

    if (totalItems > 0) {
        badgeCarrito.textContent = totalItems;
        badgeCarrito.style.display = 'inline-block';
    } else {
        badgeCarrito.style.display = 'none';
    }
}

// Función para calcular totales
function calcularTotales() {
    const subtotal = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
    const iva = subtotal * TASA_IVA;
    const neto = subtotal - iva;
    
    // Calcular cargo por despacho si aplica
    let despacho = 0;
    if (subtotal < UMBRAL_DESPACHO && subtotal > 0) {
        despacho = subtotal * TASA_DESPACHO;
    }
    
    const total = subtotal + despacho;
    
    return {
        neto,
        iva,
        subtotal,
        despacho,
        total,
    };
}

// Función para actualizar display del carrito
function actualizarMostrarCarrito() {
    let contenedorCarrito = document.getElementById('contenedor-carrito');
    
    // Crear contenedor si no existe
    if (!contenedorCarrito) {
        contenedorCarrito = document.createElement('div');
        contenedorCarrito.id = 'contenedor-carrito';
        contenedorCarrito.className = 'contenedor-carrito mt-4';
        
        const container = document.querySelector('.container');
        container.appendChild(contenedorCarrito);
    }

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '';
        return;
    }

    const totales = calcularTotales();
    
    contenedorCarrito.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Resumen de Compra</h3>
            </div>
            <div class="card-body">
                <div class="items-carrito">
                    ${carrito.map(item => `
                        <div class="item-carrito d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                            <div>
                                <strong>${item.nombre}</strong><br>
                                <small>Código: ${item.codigo} | Cantidad: ${item.cantidad}</small>
                            </div>
                            <div class="text-end">
                                <div>${formatearPrecio(item.precio * item.cantidad)}</div>
                                <button class="btn btn-danger btn-sm mt-1" onclick="eliminarDelCarrito('${item.codigo}')">
                                    <i class="fa-solid fa-trash"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="totales-carrito mt-3 p-3 bg-light rounded">
                    <div class="row">
                        <div class="col-6"><strong>Valor Neto:</strong></div>
                        <div class="col-6 text-end">${formatearPrecio(totales.neto)}</div>
                    </div>
                    <div class="row">
                        <div class="col-6"><strong>IVA (19%):</strong></div>
                        <div class="col-6 text-end">${formatearPrecio(totales.iva)}</div>
                    </div>
                    <div class="row">
                        <div class="col-6"><strong>Subtotal:</strong></div>
                        <div class="col-6 text-end">${formatearPrecio(totales.subtotal)}</div>
                    </div>
                    ${totales.despacho > 0 ? `
                    <div class="row text-warning">
                        <div class="col-6"><strong>Despacho (5%):</strong></div>
                        <div class="col-6 text-end">${formatearPrecio(totales.despacho)}</div>
                    </div>
                    ` : ''}
                    <hr>
                    <div class="row">
                        <div class="col-6"><h5>Total Final:</h5></div>
                        <div class="col-6 text-end"><h5 class="text-primary">${formatearPrecio(totales.total)}</h5></div>
                    </div>
                    ${totales.despacho === 0 && totales.subtotal > 0 ? '<small class="text-success">¡Envío gratis por compra superior a $100.000!</small>' : ''}

                    <div class="text-center mt-3 d-flex gap-2 justify-content-center">
                        <button class="btn btn-primary btn-lg"
                                onclick="mostrarFormularioCliente()"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Proceder con la compra">
                            <i class="fa-solid fa-credit-card me-2"></i>Confirmar Compra
                        </button>
                        <button class="btn btn-danger btn-lg"
                                onclick="vaciarCarrito()"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Eliminar todos los productos">
                            <i class="fa-solid fa-trash me-2"></i>Vaciar Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    inicializarTooltips();
}

// Función para mostrar el formulario de datos del cliente
function mostrarFormularioCliente() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    // Ocultar productos y carrito
    document.getElementById('productos').classList.add('d-none');
    document.getElementById('contenedor-carrito').classList.add('d-none');
    
    // Mostrar formulario
    document.getElementById('formulario-cliente').classList.remove('d-none');
    
    // Scroll hacia el formulario
    document.getElementById('formulario-cliente').scrollIntoView({ behavior: 'smooth' });
}

// Función para volver al carrito
function volverAlCarrito() {
    // Mostrar productos y carrito
    document.getElementById('productos').classList.remove('d-none');
    document.getElementById('contenedor-carrito').classList.remove('d-none');
    
    // Ocultar formulario
    document.getElementById('formulario-cliente').classList.add('d-none');
    
    // Scroll hacia el carrito
    document.getElementById('contenedor-carrito').scrollIntoView({ behavior: 'smooth' });
}

// Función para procesar la compra
function procesarCompra() {
    // Obtener datos del formulario
    datosCliente = {
        email: document.getElementById('email').value,
        nombreReceptor: document.getElementById('nombre-receptor').value,
        direccion: document.getElementById('direccion').value,
        comuna: document.getElementById('comuna').value,
        region: document.getElementById('region').value
    };

    // Validar que todos los campos estén llenos
    if (!datosCliente.email || !datosCliente.nombreReceptor || !datosCliente.direccion || 
        !datosCliente.comuna || !datosCliente.region) {
        alert('Por favor completa todos los campos');
        return;
    }

    // Mostrar boleta final
    mostrarBoletaFinal();
}

// Función para mostrar la boleta final
function mostrarBoletaFinal() {
    // Ocultar formulario
    document.getElementById('formulario-cliente').classList.add('d-none');
    
    // Mostrar boleta
    document.getElementById('boleta-final').classList.remove('d-none');
    
    // Llenar datos de la boleta
    llenarDatosBoleta();
    
    // Scroll hacia la boleta
    document.getElementById('boleta-final').scrollIntoView({ behavior: 'smooth' });
}

// Función para llenar los datos de la boleta
function llenarDatosBoleta() {
    const totales = calcularTotales();
    
    // Email de confirmación
    document.getElementById('email-confirmacion').textContent = datosCliente.email;
    
    // Detalle de productos
    const tablaProductos = document.getElementById('tabla-productos-boleta');
    tablaProductos.innerHTML = carrito.map(item => `
        <tr>
            <td>${item.codigo}</td>
            <td>${item.nombre}</td>
            <td>${formatearPrecio(item.precio)}</td>
            <td>${item.cantidad}</td>
            <td><strong>${formatearPrecio(item.precio * item.cantidad)}</strong></td>
        </tr>
    `).join('');
    
    // Resumen de compra
    document.getElementById('boleta-neto').textContent = formatearPrecio(totales.neto);
    document.getElementById('boleta-iva').textContent = formatearPrecio(totales.iva);
    document.getElementById('boleta-bruto').textContent = formatearPrecio(totales.subtotal);
    
    // Mostrar despacho si aplica
    if (totales.despacho > 0) {
        document.getElementById('fila-despacho').classList.remove('d-none');
        document.getElementById('boleta-despacho').textContent = formatearPrecio(totales.despacho);
    } else {
        document.getElementById('fila-despacho').classList.add('d-none');
    }
    
    document.getElementById('boleta-total').textContent = formatearPrecio(totales.total);
    
    // Datos de despacho
    document.getElementById('boleta-nombre').textContent = datosCliente.nombreReceptor;
    document.getElementById('boleta-direccion').textContent = datosCliente.direccion;
    document.getElementById('boleta-comuna').textContent = datosCliente.comuna;
    document.getElementById('boleta-region').textContent = datosCliente.region;
    document.getElementById('boleta-email').textContent = datosCliente.email;
}

// Función para realizar una nueva compra
function nuevaCompra() {
    // Limpiar carrito
    carrito = [];
    datosCliente = {};

    // Limpiar formulario
    document.getElementById('form-datos-cliente').reset();

    // Ocultar boleta
    document.getElementById('boleta-final').classList.add('d-none');

    // Mostrar productos
    document.getElementById('productos').classList.remove('d-none');

    // Actualizar contador carrito
    actualizarContadorCarrito();

    // Scroll hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Limpiar checkboxes y inputs
    document.querySelectorAll('.checkbox-producto').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.querySelectorAll('.input-cantidad').forEach(input => {
        input.value = 0;
        input.style.backgroundColor = '';
    });
}

// Función para vaciar el carrito completo
function vaciarCarrito() {
    if (carrito.length === 0) {
        alert('El carrito ya está vacío');
        return;
    }

    if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
        carrito = [];
        actualizarMostrarCarrito();
        actualizarContadorCarrito();

        // Limpiar checkboxes y inputs
        document.querySelectorAll('.checkbox-producto').forEach(checkbox => {
            checkbox.checked = false;
        });

        document.querySelectorAll('.input-cantidad').forEach(input => {
            input.value = 0;
            input.style.backgroundColor = '';
        });

        alert('El carrito ha sido vaciado');
    }
}

// Función para mostrar el modal de bienvenida
function mostrarModalBienvenida() {
    const modal = new bootstrap.Modal(document.getElementById('modalBienvenida'));
    modal.show();
}

// Función para guardar datos del usuario
function guardarDatosUsuario(nombre, apellido) {
    nombreUsuario = nombre;
    apellidoUsuario = apellido;

    // Actualizar el navbar con el nombre del usuario
    const nombreUsuarioSpan = document.getElementById('nombre-usuario');
    if (nombreUsuarioSpan) {
        nombreUsuarioSpan.textContent = `${nombre} ${apellido}`;
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar modal de bienvenida
    mostrarModalBienvenida();

    // Evento para el formulario de bienvenida
    const formBienvenida = document.getElementById('form-bienvenida');
    if (formBienvenida) {
        formBienvenida.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('input-nombre').value.trim();
            const apellido = document.getElementById('input-apellido').value.trim();

            if (nombre && apellido) {
                guardarDatosUsuario(nombre, apellido);

                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalBienvenida'));
                modal.hide();

                // Mensaje de bienvenida
                setTimeout(() => {
                    alert(`¡Bienvenido/a ${nombre} ${apellido}! Disfruta de tus compras.`);
                }, 500);
            }
        });
    }

    renderizarProductos();
    inicializarTooltips();
});