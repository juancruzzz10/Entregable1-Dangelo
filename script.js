class Usuario {
    constructor(nombre, email, edad) {
        this.nombre = nombre
        this.email = email
        this.edad = edad
    }
}

const loginContenedor = document.getElementById("login-contenedor")
const app = document.getElementById("app")
const mensajeLogin = document.getElementById("mensaje-login")
const mensaje = document.getElementById("mensaje")

const inputNombre = document.getElementById("nombre")
const inputEmail = document.getElementById("email")
const inputEdad = document.getElementById("edad")

document.getElementById("btn-login").addEventListener("click", () => {
    let nombre = inputNombre.value
    let email = inputEmail.value
    let edad = inputEdad.value
    if (!nombre || !email || isNaN(edad)) {
        mensajeLogin.innerText = "Datos inválidos"
        return
    }
    let usuario = new Usuario(nombre, email, edad)
    localStorage.setItem("usuario", JSON.stringify(usuario))
    mensajeLogin.innerText = ""

    loginContenedor.classList.add("oculta")
    app.classList.remove("oculta")
    iniciarApp()
})

const productos = [
    {id: 1, nombre: "Capacitor", precio: 10000, tipo: "Componente"},
    {id: 2, nombre: "Enchufe 220V", precio: 20800, tipo: "Conector"},
    {id: 3, nombre: "Multimetro", precio: 17300, tipo: "Herramienta"},
    {id: 4, nombre: "Protoboard", precio: 2600, tipo: "Herramienta"},
    {id: 5, nombre: "Diodo LED", precio: 88, tipo: "Componente"},
    {id: 6, nombre: "Circuito Integrado", precio: 1700, tipo: "Componente"},
    {id: 7, nombre: "Soldador", precio: 17000, tipo: "Herramienta"},
    {id: 8, nombre: "Estaño en tubo", precio: 4300, tipo: "Material"},
    {id: 9, nombre: "Estaño en rollo", precio: 6000, tipo: "Material"}
]


let carrito = JSON.parse(localStorage.getItem("carrito")) || []

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito))
}


const contenedor = document.getElementById("productos")
const listaCarrito = document.getElementById("lista-carrito")
const totalHTML = document.getElementById("total")

function iniciarApp() {
    renderProductos()
    renderCarrito()
}


function renderProductos() {
    contenedor.innerHTML = ""

    productos.forEach((p, index) => {
        let div = document.createElement("div")
        div.classList.add("card")

        div.innerHTML = `
            <h3>${p.nombre}</h3>
            <p>${p.tipo}</p>
            <p>$${p.precio}</p>
        `

        let boton = document.createElement("button")
        boton.innerText = "Agregar"

        boton.addEventListener("click", () => {
            agregarProducto(index)
        })

        div.appendChild(boton)
        contenedor.appendChild(div)
    })
}


function agregarProducto(index) {
    let producto = productos[index]
    carrito.push(producto)
    guardarCarrito()
    renderCarrito()
    mensaje.innerText = `Agregaste ${producto.nombre} al carrito`
}


function renderCarrito() {
    listaCarrito.innerHTML = ""
    let total = 0

    carrito.forEach((p, i) => {
        total += p.precio

        let div = document.createElement("div")
        div.classList.add("item")

        let texto = document.createElement("span")
        texto.innerText = `${p.nombre} ($${p.precio})`

        let boton = document.createElement("button")
        boton.innerText = "X"

        boton.addEventListener("click", () => {
            eliminarProducto(i)
        })

        div.appendChild(texto)
        div.appendChild(boton)
        listaCarrito.appendChild(div)
    })

    totalHTML.innerText = "Total: $" + total
}


function eliminarProducto(index) {
    carrito.splice(index, 1)
    guardarCarrito()
    renderCarrito()
    mensaje.innerText = "Producto eliminado"
}


function vaciarCarrito() {
    carrito = []
    guardarCarrito()
    renderCarrito()
    mensaje.innerText = "Carrito vaciado"
}


function finalizarCompra() {
    if (carrito.length === 0) {
        mensaje.innerText = "El carrito está vacío"
        return
    }

    let total = carrito.reduce((acc, p) => acc + p.precio, 0)

    let metodo = document.createElement("select")

    metodo.innerHTML = `
    <option value>Seleccionar método de pago</option>
    <option value="debito">Debito (10% descuento)</option>
    <option value="credito">Credito (15% descuento)</option>
    <option value="transferencia">Transferencia (5% descuento)</option>
    <option value="otro">Otro (sin descuento)</option>
    `
    let botonConfirmar = document.createElement("button")
    botonConfirmar.innerText = "Confirmar Compra"


    mensaje.innerText = ""
    mensaje.appendChild(metodo)
    mensaje.appendChild(botonConfirmar)

    botonConfirmar.addEventListener("click", () => {
        let opcion = metodo.value  
        let descuento = 0  
        if (opcion === "debito") {
            descuento = total *0.1
        }
        else if (opcion === "credito") {
            descuento = total * 0.15
        }
        else if (opcion === "transferencia") {
            descuento = total * 0.05
        }
        let totalFinal = total - descuento
        mensaje.innerText = "Compra realizada\n"+
        "Total: $" + total + "\nDescuento: $" + descuento + "\nTotal a pagar: $" + totalFinal

        carrito = []
        guardarCarrito()
        renderCarrito()
        })

}


document.getElementById("vaciar").addEventListener("click", vaciarCarrito)
document.getElementById("comprar").addEventListener("click", finalizarCompra)

let usuarioGuardado = JSON.parse(localStorage.getItem("usuario"))
if (usuarioGuardado) {
    loginContenedor.classList.add("oculta")
    app.classList.remove("oculta")
    iniciarApp()

}