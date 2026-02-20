function registrarUsuario(){
    let nombre = prompt("Ingrese su nombre:")
    let apellido = prompt("Ingrese su apellido:")       
    let edad = prompt("Ingrese su edad:")
    if(!nombre || !apellido || isNaN(edad)){
        alert("Datos Invalidos. Intente nuevamente")
        return null
    }
    let usuario = {
        nombre: nombre,
        apellido: apellido,
        edad: edad
    };
    console.log("Usuario Registrado Correctamente");
    console.log("Nombre: "+ usuario.nombre);
    console.log("Apellido: "+ usuario.apellido);
    console.log("Edad: "+ usuario.edad);
    alert("Bienvenido " + usuario.nombre + " " + usuario.apellido + "!");
    return usuario
  
}
let usuario = registrarUsuario()
if (usuario){
    let continuar = true 
    let carrito = []
    function agregarProducto(nombre, precio){
        carrito.push({nombre: nombre, precio: precio})
        console.log("Añadiste un "+ nombre);
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
            console.log(i +" - "+ carrito[i].nombre + " $"+ carrito[i].precio);
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

    }

    while(continuar){

    let eleccion = prompt("Ingrese alguna de las siguientes opciones para comprar: \n 1)Capacitor $10000 \n 2)Enchufe 220V $20800 \n 3)Multimetro $17300 \n 4)Protoboard $2600 \n 5)Diodo LED $88 \n 6)Circuito Integrado $1700 \n 7)Soldador $17000 \n 8)Estaño \n 9)Ver total \n 10)Vaciar carrito \n 11)Finalizar compra \n 12)Eliminar Producto \n 13)Salir")

    switch(eleccion){
        case '1':
            agregarProducto("Capacitor", 10000 )
            break

        case '2':
            agregarProducto("Enchufe 220V", 20800 )
            break

        case '3':
            agregarProducto("Multimetro", 17300 )
            break

        case '4':
            agregarProducto("Protoboard", 2600 )
            break
        case '5':
            agregarProducto("Diodo LED", 88 )
            break
        case '6':
            agregarProducto("Circuito Integrado", 1700 )
            break
        case '7':
            agregarProducto("Soldador", 17000 )
            break
        case '8':
            let tipo = prompt("¿De que tipo?(rollo/tubo)")
            if (tipo == "rollo"){
                agregarProducto("Estaño", 4300 )
                console.log("Agregaste estaño en rollo");
            }else if (tipo == "tubo"){
                agregarProducto("Estaño", 6000 )
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
}else{
    alert("ACCESO DENEGADO.")
}