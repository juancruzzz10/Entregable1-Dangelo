
class Usuario {
    constructor(nombre, email, fechaNacimiento) {
        this.nombre = nombre;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
        this.edad = calcularEdad(fechaNacimiento);
    }
}

function calcularEdad(fecha) {
    const hoy = new Date();
    const nac = new Date(fecha);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
}


let productosBase = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let categoriaActual = "Todos";
let textoBusqueda = "";
let sortActual = "";
let carritoVisible = false;
let productoModalActual = null;
let metodoPagoSeleccionado = "";
let contadorClicksLogo = 0;

// --- ELEMENTOS DEL DOM ---
const app             = document.getElementById("app");
const loginPantalla   = document.getElementById("login-pantalla");
const contProductos   = document.getElementById("productos");
const contSimilares   = document.getElementById("productos-similares");
const seccionSimilares= document.getElementById("seccion-similares");
const listaCarrito    = document.getElementById("lista-carrito");
const totalHTML       = document.getElementById("total");
const contadorCarrito = document.getElementById("contador-carrito");
const sidebarCarrito  = document.getElementById("sidebar-carrito");
const overlay         = document.getElementById("modal-overlay");
const modalPago       = document.getElementById("modal-pago");
const modalPerfil     = document.getElementById("modal-perfil");
const modalProducto   = document.getElementById("modal-producto");


//SISTEMA DE TOASTS (React-Toastify style + Anime.js)

const Toast = (() => {
    const container = document.getElementById("toast-container");
    let toastId = 0;

    const ICONS = {
        success: '<i class="fa-solid fa-circle-check"></i>',
        error:   '<i class="fa-solid fa-circle-xmark"></i>',
        info:    '<i class="fa-solid fa-circle-info"></i>',
        warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
    };

    function show(mensaje, tipo = 'info', duracion = 3500) {
        const id = ++toastId;
        const toast = document.createElement("div");
        toast.className = `toast toast-${tipo}`;
        toast.dataset.id = id;

        toast.innerHTML = `
            <div class="toast-icon">${ICONS[tipo] || ICONS.info}</div>
            <div class="toast-content">
                <span class="toast-tipo">${tipo.toUpperCase()}</span>
                <span class="toast-mensaje">${mensaje}</span>
            </div>
            <button class="toast-close" onclick="Toast.dismiss(${id})">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="toast-progress">
                <div class="toast-progress-bar"></div>
            </div>
        `;

        container.appendChild(toast);

        
        anime({
            targets: toast,
            translateX: [120, 0],
            opacity:    [0, 1],
            easing:     'easeOutExpo',
            duration:   420,
        });

        
        const bar = toast.querySelector('.toast-progress-bar');
        anime({
            targets:  bar,
            width:   ['100%', '0%'],
            easing:   'linear',
            duration: duracion,
        });

        
        let timeoutId;
        const start = () => {
            timeoutId = setTimeout(() => Toast.dismiss(id), duracion);
        };
        const pause = () => clearTimeout(timeoutId);
        toast.addEventListener('mouseenter', pause);
        toast.addEventListener('mouseleave', start);
        start();

        return id;
    }

    function dismiss(id) {
        const toast = container.querySelector(`[data-id="${id}"]`);
        if (!toast) return;
        anime({
            targets:     toast,
            translateX:  [0, 120],
            opacity:     [1, 0],
            easing:      'easeInExpo',
            duration:    350,
            complete:    () => toast.remove(),
        });
    }

    return {
        show,
        dismiss,
        success: (msg, dur) => show(msg, 'success', dur),
        error:   (msg, dur) => show(msg, 'error',   dur),
        info:    (msg, dur) => show(msg, 'info',     dur),
        warning: (msg, dur) => show(msg, 'warning',  dur),
    };
})();



function iniciarMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01アイウエオカキクケコABCDEF0123456789';
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(11, 15, 25, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f3ff';
        ctx.font = `${fontSize}px Share Tech Mono`;

        drops.forEach((y, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = Math.random() > 0.95
                ? '#bc13fe'
                : `rgba(0,243,255,${Math.random() * 0.8 + 0.2})`;
            ctx.fillText(char, i * fontSize, y * fontSize);
            if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }

    setInterval(draw, 50);
    window.addEventListener('resize', () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}


//LOGIN & VALIDACIÓN

document.getElementById("btn-login").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();
    const email  = document.getElementById("email").value.trim();
    const fecha  = document.getElementById("fecha-nacimiento").value;

    // Validar nombre
    if (!nombre || nombre.length < 2) {
        Toast.error("Ingresá un nombre válido (mínimo 2 caracteres)");
        agitarLogin(); return;
    }

    // Validar email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        Toast.error("El email debe contener '@' y un dominio válido");
        agitarLogin(); return;
    }

    // Validar fecha de nacimiento
    if (!fecha) {
        Toast.error("Seleccioná tu fecha de nacimiento");
        agitarLogin(); return;
    }

    const edad = calcularEdad(fecha);
    if (edad < 13) {
        Toast.error("Debés tener al menos 13 años para ingresar");
        agitarLogin(); return;
    }
    if (edad > 110) {
        Toast.error("Fecha de nacimiento inválida");
        agitarLogin(); return;
    }

    const usuario = new Usuario(nombre, email, fecha);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    Toast.success(`¡Bienvenido/a, ${nombre}!`);
    iniciarTransicionApp();
});

function agitarLogin() {
    anime({
        targets: '#login-contenedor',
        translateX: [{ value: -12 }, { value: 12 }, { value: -8 }, { value: 8 }, { value: 0 }],
        duration: 450,
        easing: 'easeInOutSine',
    });
}



function iniciarTransicionApp() {
    anime({
        targets: '#login-pantalla',
        opacity:  0,
        scale:    0.92,
        duration: 700,
        easing:   'easeInOutQuad',
        complete: () => {
            loginPantalla.classList.add("oculta");
            app.classList.remove("oculta");
            anime({
                targets:  'header, .contenedor',
                translateY: [-30, 0],
                opacity:  [0, 1],
                delay:    anime.stagger(120),
                duration: 700,
                easing:   'easeOutExpo',
            });
            iniciarApp();
        }
    });
}

function iniciarApp() {
    cargarProductos();
    renderCarrito();
    iniciarEasterEgg();
    iniciarSortPills();
    iniciarContactoObserver();
}


function iniciarContactoObserver() {
    const seccion = document.getElementById("seccion-contacto");
    if (!seccion) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets:    '.contacto-card',
                    translateY: [50, 0],
                    opacity:    [0, 1],
                    scale:      [0.93, 1],
                    delay:      anime.stagger(90),
                    duration:   560,
                    easing:     'easeOutExpo',
                });
                anime({
                    targets:  '.cf-item',
                    translateX: [-24, 0],
                    opacity:  [0, 1],
                    delay:    anime.stagger(110, { start: 350 }),
                    duration: 480,
                    easing:   'easeOutExpo',
                });
                anime({
                    targets:  '.contacto-titulo',
                    opacity:  [0, 1],
                    translateY: [20, 0],
                    duration: 700,
                    easing:   'easeOutExpo',
                });
                obs.unobserve(seccion);
            }
        });
    }, { threshold: 0.1 });
    obs.observe(seccion);
}


//CARGA Y FILTROS

const cargarProductos = async () => {
    try {
        const response = await fetch('productos.json');
        if (!response.ok) throw new Error('Error al cargar el catálogo.');
        productosBase = await response.json();
        cargarFiltrosChips();
        filtrarYRenderizar();
    } catch (error) {
        Toast.error(`Fallo al cargar catálogo: ${error.message}`);
        contProductos.innerHTML = `<p style="color:var(--danger);text-align:center;">Crea el archivo productos.json.</p>`;
    }
};

function cargarFiltrosChips() {
    const track  = document.getElementById("categorias-track");
    const cats   = [...new Set(productosBase.map(p => p.tipo))];
    const iconos = {
        Componente: 'fa-microchip',
        Conector:   'fa-plug',
        Herramienta:'fa-wrench',
        Material:   'fa-flask',
        Modulo:     'fa-cubes',
        Accesorio:  'fa-star',
    };

    cats.forEach(cat => {
        const btn = document.createElement("button");
        btn.className  = "cat-chip";
        btn.dataset.cat = cat;
        btn.innerHTML  = `<i class="fa-solid ${iconos[cat] || 'fa-tag'}"></i> ${cat}`;
        track.appendChild(btn);
    });

    track.querySelectorAll('.cat-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.cat;
            categoriaActual = cat;
            track.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('activa'));
            btn.classList.add('activa');

           
            anime({
                targets: btn,
                scale:   [1, 1.15, 1],
                duration: 300,
                easing:  'easeOutBack',
            });

            filtrarYRenderizar();
        });
    });

   
    anime({
        targets:  '#categorias-track .cat-chip',
        translateY: [20, 0],
        opacity:  [0, 1],
        delay:    anime.stagger(60),
        duration: 500,
        easing:   'easeOutSine',
    });
}

document.getElementById("buscador").addEventListener("input", (e) => {
    textoBusqueda = e.target.value.toLowerCase();
    filtrarYRenderizar();
});

// ---- Sort Pills animados ----
function iniciarSortPills() {
    const pills = document.querySelectorAll('.sort-pill');
    const indicator = document.createElement('div');
    indicator.className = 'sort-indicator';
    document.getElementById('sort-pills').appendChild(indicator);

    function moverIndicador(pill) {
        const pillRect = pill.getBoundingClientRect();
        const trackRect = document.getElementById('sort-pills').getBoundingClientRect();
        anime({
            targets: indicator,
            left:    pill.offsetLeft,
            width:   pill.offsetWidth,
            duration: 320,
            easing:  'easeOutExpo',
        });
    }

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('activo'));
            pill.classList.add('activo');
            sortActual = pill.dataset.sort;
            moverIndicador(pill);

            
            anime({
                targets:  pill,
                scale:    [1, 1.1, 1],
                duration: 280,
                easing:   'easeOutBack',
            });

            
            anime({
                targets:  '#resultado-count',
                color:    ['#00f3ff', '#cdd6f4'],
                duration: 600,
                easing:   'easeOutExpo',
            });

            filtrarYRenderizar();
        });
    });

    
    const activa = document.querySelector('.sort-pill.activo');
    if (activa) {
        indicator.style.left  = activa.offsetLeft + 'px';
        indicator.style.width = activa.offsetWidth + 'px';
    }
}

// Botón Contacto
document.getElementById("btn-contacto").addEventListener("click", () => {
    const seccion = document.getElementById("seccion-contacto");
    seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Animación de entrada de las cards al llegar
    setTimeout(() => {
        anime({
            targets:    '.contacto-card',
            translateY: [40, 0],
            opacity:    [0, 1],
            scale:      [0.95, 1],
            delay:      anime.stagger(80),
            duration:   500,
            easing:     'easeOutExpo',
        });
        anime({
            targets:  '.cf-item',
            translateX: [-30, 0],
            opacity:  [0, 1],
            delay:    anime.stagger(100, { start: 400 }),
            duration: 450,
            easing:   'easeOutExpo',
        });
    }, 400);
});

function filtrarYRenderizar() {
    let filtrados = productosBase.filter(p => {
        const coincideTexto = p.nombre.toLowerCase().includes(textoBusqueda) ||
                              p.descripcion?.toLowerCase().includes(textoBusqueda);
        const coincideCat   = categoriaActual === "Todos" || p.tipo === categoriaActual;
        return coincideTexto && coincideCat;
    });

    if (sortActual === 'precio-asc')  filtrados.sort((a, b) => a.precio - b.precio);
    if (sortActual === 'precio-desc') filtrados.sort((a, b) => b.precio - a.precio);
    if (sortActual === 'nombre-asc')  filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

    const countEl = document.getElementById("resultado-count");
    countEl.textContent = `${filtrados.length} producto${filtrados.length !== 1 ? 's' : ''}`;

    renderProductos(filtrados, contProductos);
}


//RENDER DE PRODUCTOS

function renderProductos(arrayProductos, contenedorHTML) {
    contenedorHTML.innerHTML = "";

    if (arrayProductos.length === 0) {
        contenedorHTML.innerHTML = `
            <div class="no-resultados">
                <i class="fa-solid fa-satellite-dish"></i>
                <p>Sin señal... No hay resultados.</p>
            </div>`;
        return;
    }

    arrayProductos.forEach((p) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.dataset.id = p.id;

        div.innerHTML = `
            <div class="card-img-wrap">
                <img src="${p.imagen}" class="card-img" alt="${p.nombre}" loading="lazy">
                <span class="card-tipo-badge">${p.tipo}</span>
                <div class="card-overlay">
                    <button class="btn-ver-mas" onclick="abrirModalProducto(${p.id})">
                        <i class="fa-solid fa-magnifying-glass"></i> Ver detalle
                    </button>
                </div>
            </div>
            <div class="card-info">
                <div>
                    <h3>${p.nombre}</h3>
                    <p class="card-desc-corta">${p.descripcion ? p.descripcion.substring(0, 60) + '...' : ''}</p>
                </div>
                <p class="precio-tag">$${p.precio.toLocaleString()}</p>
                <button class="btn-neon btn-agregar" onclick="agregarAlCarrito(${p.id})">
                    <i class="fa-solid fa-cart-plus"></i> Agregar
                </button>
            </div>
        `;
        contenedorHTML.appendChild(div);
    });

   
    anime({
        targets:    contenedorHTML.querySelectorAll('.card'),
        translateY: [40, 0],
        opacity:    [0, 1],
        scale:      [0.95, 1],
        delay:      anime.stagger(55),
        duration:   550,
        easing:     'easeOutExpo',
    });
}


//MODAL DE PRODUCTO

window.abrirModalProducto = (id) => {
    const p = productosBase.find(x => x.id === id);
    if (!p) return;
    productoModalActual = p;

    document.getElementById("modal-prod-nombre").textContent = p.nombre;
    document.getElementById("modal-prod-img").src = p.imagen;
    document.getElementById("modal-prod-img").alt = p.nombre;
    document.getElementById("modal-prod-tipo").textContent = p.tipo;
    document.getElementById("modal-prod-desc").textContent = p.descripcion || "Sin descripción.";
    document.getElementById("modal-prod-precio").textContent = `$${p.precio.toLocaleString()}`;
    document.getElementById("modal-btn-agregar").onclick = () => {
        agregarAlCarrito(p.id);
        cerrarModales();
    };

    abrirModal(modalProducto);
};


//CARRITO


const carritoBackdrop = (() => {
    const el = document.createElement('div');
    el.id = 'carrito-backdrop';
    document.body.appendChild(el);
    el.addEventListener('click', () => { if (carritoVisible) toggleCarrito(); });
    return el;
})();

document.getElementById("btn-toggle-carrito").addEventListener("click", toggleCarrito);
document.getElementById("btn-cerrar-carrito").addEventListener("click", toggleCarrito);

function toggleCarrito() {
    carritoVisible = !carritoVisible;
    if (carritoVisible) {
        sidebarCarrito.classList.remove("oculta");
        carritoBackdrop.classList.add("visible");
        anime({
            targets:    '#sidebar-carrito',
            translateX: ['100%', '0%'],
            opacity:    [0, 1],
            duration:   420,
            easing:     'easeOutExpo',
        });
    } else {
        carritoBackdrop.classList.remove("visible");
        anime({
            targets:    '#sidebar-carrito',
            translateX: ['0%', '100%'],
            opacity:    [1, 0],
            duration:   320,
            easing:     'easeInExpo',
            complete:   () => sidebarCarrito.classList.add("oculta"),
        });
    }
}

window.agregarAlCarrito = (id) => {
    const prod = productosBase.find(p => p.id === id);
    const existe = carrito.find(p => p.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...prod, cantidad: 1 });
    }

    guardarYRenderizarCarrito();
    Toast.success(`¡${prod.nombre} agregado al carrito!`);
    mostrarSimilares(prod.tipo, id);

    // Pulso en ícono del carrito
    anime({
        targets:  '#btn-toggle-carrito',
        scale:    [1, 1.35, 1],
        duration: 450,
        easing:   'easeOutBack',
    });

    
    if (!carritoVisible) toggleCarrito();
};

window.modificarCantidad = (id, delta) => {
    const item = carrito.find(p => p.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== id);
        Toast.info("Producto removido del carrito");
    }
    guardarYRenderizarCarrito();
};

function guardarYRenderizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
}

function renderCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;
    let cantTotal = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `
            <div class="carrito-vacio">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Tu carrito está vacío</p>
            </div>`;
    }

    carrito.forEach(p => {
        total    += p.precio * p.cantidad;
        cantTotal += p.cantidad;

        const div = document.createElement("div");
        div.classList.add("item-carrito");
        div.innerHTML = `
            <div class="item-info">
                <strong>${p.nombre}</strong>
                <small>$${p.precio.toLocaleString()} c/u</small>
            </div>
            <div class="contador-control">
                <button class="btn-qty" onclick="modificarCantidad(${p.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                <span class="qty-num">${p.cantidad}</span>
                <button class="btn-qty" onclick="modificarCantidad(${p.id}, 1)"><i class="fa-solid fa-plus"></i></button>
            </div>
            <strong class="item-subtotal">$${(p.precio * p.cantidad).toLocaleString()}</strong>
        `;
        listaCarrito.appendChild(div);
    });

    totalHTML.innerText = `Total: $${total.toLocaleString()}`;
    contadorCarrito.innerText = cantTotal;

    
    if (cantTotal > 0) {
        document.querySelector('.cart-pulse')?.classList.add('active');
    } else {
        document.querySelector('.cart-pulse')?.classList.remove('active');
    }
}


//SIMILARES

function mostrarSimilares(tipo, idExcluido) {
    const similares = productosBase.filter(p => p.tipo === tipo && p.id !== idExcluido).slice(0, 4);
    if (similares.length > 0) {
        seccionSimilares.classList.remove("oculta");
        renderProductos(similares, contSimilares);
        setTimeout(() => {
            seccionSimilares.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 200);
    }
}


//MODALES

function abrirModal(elemento) {
    overlay.classList.remove("oculta");
    elemento.classList.remove("oculta");
    anime({
        targets:  elemento,
        scale:    [0.82, 1],
        opacity:  [0, 1],
        duration: 380,
        easing:   'easeOutBack',
    });
}

function cerrarModales() {
    anime({
        targets:  '.modal',
        scale:    [1, 0.85],
        opacity:  [1, 0],
        duration: 280,
        easing:   'easeInBack',
        complete: () => {
            overlay.classList.add("oculta");
            document.querySelectorAll('.modal').forEach(m => m.classList.add("oculta"));
        },
    });
}
window.cerrarModales = cerrarModales;

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) cerrarModales();
});


//MÉTODOS DE PAGO ANIMADOS

document.querySelectorAll('.metodo-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.metodo-card').forEach(c => c.classList.remove('seleccionado'));
        card.classList.add('seleccionado');
        metodoPagoSeleccionado = card.dataset.value;
        document.getElementById("metodo-pago").value = metodoPagoSeleccionado;

        anime({
            targets:  card,
            scale:    [1, 1.06, 1],
            duration: 350,
            easing:   'easeOutBack',
        });

        // Calcular precio con descuento
        const descuentos = { debito: 0.10, credito: 0.15, transferencia: 0.05, cripto: 0.20 };
        const desc  = descuentos[metodoPagoSeleccionado] || 0;
        const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
        const final = total * (1 - desc);

        const displayEl = document.getElementById("precio-final-display");
        document.getElementById("precio-con-descuento").textContent = `$${Math.round(final).toLocaleString()}`;
        displayEl.classList.remove("oculta");

        anime({
            targets:  '#precio-final-display',
            translateY: [15, 0],
            opacity:  [0, 1],
            duration: 400,
            easing:   'easeOutExpo',
        });
    });
});

// Abrir modal de pago
document.getElementById("comprar").addEventListener("click", () => {
    if (carrito.length === 0) return Toast.warning("Tu carrito está vacío");
    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    document.getElementById("resumen-pago").innerText = `Subtotal: $${total.toLocaleString()}`;
    document.querySelectorAll('.metodo-card').forEach(c => c.classList.remove('seleccionado'));
    document.getElementById("metodo-pago").value = '';
    document.getElementById("precio-final-display").classList.add("oculta");
    metodoPagoSeleccionado = '';
    abrirModal(modalPago);
});

document.getElementById("confirmar-pago").addEventListener("click", () => {
    if (!metodoPagoSeleccionado) return Toast.warning("Seleccioná un método de pago");

    const btn = document.getElementById("confirmar-pago");
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
    btn.disabled  = true;

    new Promise(resolve => setTimeout(resolve, 2000))
        .then(() => {
            carrito = [];
            guardarYRenderizarCarrito();
            cerrarModales();
            Toast.success("¡Compra aprobada! Revisá tu email 🎉", 5000);

           
            anime({
                targets:  '.contenedor',
                translateY: [0, -8, 0],
                duration: 600,
                easing:   'easeInOutSine',
            });

            
            lanzarParticulas();
        })
        .finally(() => {
            btn.innerHTML = 'Confirmar <i class="fa-solid fa-check"></i>';
            btn.disabled  = false;
        });
});

document.getElementById("cancelar-pago").addEventListener("click", cerrarModales);

document.getElementById("vaciar").addEventListener("click", () => {
    if (carrito.length === 0) return Toast.info("El carrito ya está vacío");
    carrito = [];
    guardarYRenderizarCarrito();
    Toast.info("Carrito vaciado");
});


//PERFIL

document.getElementById("btn-perfil").addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (!user) return;
    const fechaFormateada = user.fechaNacimiento
        ? new Date(user.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'No registrada';

    document.getElementById("datos-perfil").innerHTML = `
        <div class="perfil-avatar">
            <i class="fa-solid fa-user-astronaut"></i>
        </div>
        <div class="perfil-datos">
            <p><i class="fa-solid fa-user"></i> <strong>Nombre:</strong> ${user.nombre}</p>
            <p><i class="fa-solid fa-envelope"></i> <strong>Email:</strong> ${user.email}</p>
            <p><i class="fa-solid fa-calendar"></i> <strong>Nacimiento:</strong> ${fechaFormateada}</p>
            <p><i class="fa-solid fa-id-badge"></i> <strong>Edad:</strong> ${user.edad} años</p>
        </div>
    `;
    abrirModal(modalPerfil);
});

document.getElementById("cerrar-perfil").addEventListener("click", cerrarModales);
document.getElementById("cerrar-sesion").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    Toast.info("Sesión cerrada. ¡Hasta pronto!");
    setTimeout(() => location.reload(), 1500);
});


//PARTÍCULAS DE CELEBRACIÓN

function lanzarParticulas() {
    const colores = ['#00f3ff', '#bc13fe', '#00e676', '#ff1744', '#ffd740'];
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particula';
        p.style.cssText = `
            position: fixed;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colores[Math.floor(Math.random() * colores.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            left: ${Math.random() * 100}vw;
            top: 50vh;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(p);

        anime({
            targets:    p,
            translateY: [0, -(Math.random() * 400 + 100)],
            translateX: [(Math.random() - 0.5) * 300],
            opacity:    [1, 0],
            rotate:     Math.random() * 720,
            duration:   Math.random() * 1200 + 800,
            easing:     'easeOutExpo',
            complete:   () => p.remove(),
        });
    }
}


//EASTER EGG ROBOT

function iniciarEasterEgg() {
    const logo = document.querySelector('.logo');
    const bot  = document.getElementById('easter-egg-bot');
    if (!logo || !bot) return;

    const frases = [
        "¡Hola, humano! 🤖",
        "Resistencia = Voltaje / Corriente",
        "// TODO: mejorar código",
        "404: Estaño not found",
        "¡Soldá con cuidado!",
        "I2C > SPI (unpopular opinion)",
        "El 555 lo puede todo.",
        "Stack Overflow me salvó la vida",
    ];

    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
        contadorClicksLogo++;

        if (contadorClicksLogo >= 5) {
            contadorClicksLogo = 0;
            bot.classList.remove('oculta');

            anime({
                targets:  '#easter-egg-bot',
                translateY: [80, 0],
                opacity:  [0, 1],
                duration: 600,
                easing:   'easeOutBounce',
            });

            
            anime({
                targets:  '.bot-eye',
                scaleY:   [1, 0.1, 1],
                delay:    anime.stagger(100),
                loop:     3,
                duration: 200,
                easing:   'easeInOutQuad',
            });

            // Mostrar frase
            const speech = document.getElementById('bot-speech');
            speech.textContent = frases[Math.floor(Math.random() * frases.length)];
            speech.classList.remove('oculta');
            anime({
                targets:  '#bot-speech',
                scale:    [0.5, 1],
                opacity:  [0, 1],
                duration: 400,
                easing:   'easeOutBack',
            });

            setTimeout(() => {
                anime({
                    targets:  '#easter-egg-bot',
                    translateY: [0, 80],
                    opacity:  [1, 0],
                    duration: 500,
                    easing:   'easeInExpo',
                    complete: () => bot.classList.add('oculta'),
                });
            }, 3500);

            Toast.info("🤖 ¡Encontraste al bot! Hacé clic 5 veces en el logo.");
        } else if (contadorClicksLogo === 3) {
            Toast.info(`${5 - contadorClicksLogo} clics más para la sorpresa... 👀`);
        }
    });
}


//INICIALIZACIÓN

iniciarMatrix();

const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
if (usuarioGuardado) {
    loginPantalla.classList.add("oculta");
    app.classList.remove("oculta");
    iniciarApp();
}