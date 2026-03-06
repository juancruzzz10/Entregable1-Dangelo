 class Usuario{
        constructor(nombre, email, edad){
        this.nombre = nombre
        this.email = email
        this.edad = edad
        }
    };

function registrarUsuario(){
    let nombre = prompt("Ingrese su nombre:")
    let email = prompt("Ingrese su email:")       
    let edad = prompt("Ingrese su edad:")
    if(!nombre || !email || isNaN(edad)){
        alert("Datos Invalidos. Intente nuevamente")
        return null
    }
    if(!email.includes("@")){
    alert("Email invalido")
    return null
}
    let usuario = new Usuario(nombre, email, edad)
    localStorage.setItem("usuario", JSON.stringify(usuario))
   
    console.log("Usuario Registrado Correctamente");
    console.log("Nombre: "+ usuario.nombre);
    console.log("email: "+ usuario.email);
    console.log("Edad: "+ usuario.edad);
    return usuario
  
}
let usuarioGuardado = JSON.parse(localStorage.getItem("usuario"))
if (usuarioGuardado){
    console.log("Usuario recuperado: "+ usuarioGuardado.nombre);
}
let usuario = registrarUsuario()
if (usuario){
    let continuar = true 
    let carrito = []
    function agregarProducto(producto){
        carrito.push(producto)
        console.log("Añadiste "+ producto.nombre);
    }

    function calcularTotal(){
        let total = 0
        for (let producto of carrito){
            total += producto.precio
        }
        return total

    }
    function mostrarCarrito(){
        if(carrito.length === 0){
            console.log("El carrito esta vacio");
            return
        }
        for(let i=0; i < carrito.length; i++){
            console.log(i +" - "+ carrito[i].nombre + " Tipo: " + carrito[i].tipo + " $"+ carrito[i].precio);
        }
        console.log("Total: $"+ calcularTotal());
        
    }
    function eliminarProducto(){
        if(carrito.length === 0){
            alert("El carrito esta vacio")
            return
        }
        mostrarCarrito()

        let indice = parseInt(prompt("Ingrese el numero del producto que desea eliminar:"))
        if(indice >= 0  && indice < carrito.length){
            console.log("Eliminaste "+ carrito[indice].nombre);
            carrito.splice(indice, 1)            
        }else{
            console.log("Indice invalido");
            
        }

    }
    
    function finalizarCompra(){
        if (carrito.length === 0){
            alert("El carrito esta vacio.")
            return
        }
        let total = calcularTotal()
        let metodoPago = prompt("Metodo de pago:\n 1)Efectivo (10% Descuento)\n 2)Transferencia (5% Descuento)\n 3)Otro (Sin Descuento)")
        let descuento = 0;
        if(metodoPago == '1'){
            descuento = total * 0.10
        }else if(metodoPago == '2'){
            descuento = total * 0.05
        }
        let totalFinal = total - descuento

        let confirmar = confirm("Total: $" + total + "\nDescuento: $" + descuento + "\nTotal a pagar: $" + totalFinal + "\n\n¿Desea confirmar la compra?")
        if(confirmar){
            alert("Compra realizada con Exito. \nTotal abonado: $"+ totalFinal)
            carrito = []
        }else{
            alert("Compra cancelada.")
        }
        let seguir = confirm("¿Desea seguir comprando?")
        if (!seguir){
            alert("Saliste de la pagina")
            continuar = false
        }
    }
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
    while(continuar){

    let eleccion = prompt("Ingrese alguna de las siguientes opciones para comprar: \n 1)Capacitor - $10000 \n 2)Enchufe 220V- $20800 \n 3)Multimetro - $17300 \n 4)Protoboard - $2600 \n 5)Diodo LED - $88 \n 6)Circuito Integrado - $1700 \n 7)Soldador - $17000 \n 8)Estaño \n 9)Ver total \n 10)Vaciar carrito \n 11)Finalizar compra \n 12)Eliminar Producto \n 13)Salir")

    switch(eleccion){
        case '1':
            agregarProducto(productos[0])
            break

        case '2':
            agregarProducto(productos[1] )
            break

        case '3':
            agregarProducto(productos[2])
            break

        case '4':
            agregarProducto(productos[3])
            break
        case '5':
            agregarProducto(productos[4])
            break
        case '6':
            agregarProducto(productos[5])
            break
        case '7':
            agregarProducto(productos[6])
            break
        case '8':
            let tipo = prompt("¿De que tipo?(rollo $4300/tubo $6000)")
            if (tipo == "rollo"){
                agregarProducto(productos[7])
                console.log("Agregaste estaño en rollo");
            }else if (tipo == "tubo"){
                agregarProducto(productos[8])
                console.log("Agregaste estaño en tubo");
            }else{
                console.log("Opcion invalida");
                
            }
            break
        
        case '9':
            console.log("El total es $"+ calcularTotal());
            break
        case '10':
            carrito = []
            console.log("Vaciaste el carrito");
            break

        case '11':
            finalizarCompra();
            break
            
        case '12':
            eliminarProducto()
            break            
        case '13':
            console.log("Gracias por utilizar nuestro servicio WEB \n ¡Nos vemos!");
            alert("Saliste de la pagina")
            continuar = false
            break
            
        default:
            console.log("Opcion no valida"); 
            break
    }
        
        
    }
}