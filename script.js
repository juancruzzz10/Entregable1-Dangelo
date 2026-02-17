let UsuarioGuardado = "admin";
let password = "123";


function HacerLogIn(){
    let nombre = prompt("Ingrese un nombre de Usuario:")
    let passw = prompt("Ingrese una contraseña")
    if (nombre.toLowerCase() === UsuarioGuardado.toLowerCase() && passw === password){
        console.log("Se ha ingresado correctamente");
        return true;       
    }else{
        console.log("Usuario o contraseña incorrecta");
        return false;
    }
}
let acceso = HacerLogIn()
if (acceso){
    let continuar = true 
    let carrito = 0
    function agregarProducto(nombre, precio){
        carrito += precio
        console.log("Añadiste un "+ nombre);
    }

    function finalizarCompra(){
        if (carrito === 0){
            alert("El carrito esta vacio.")
            return
        }
        let confirmar = confirm("¿Desea realizar la compra?")
        if(confirmar){
            alert("Compra realizada con Exito. \nTotal a pagar: $"+ carrito)
            carrito = 0
        }else{
            alert("Compra cancelada.")
        }

    }

    while(continuar){

    let eleccion = prompt("Ingrese alguna de las siguientes opciones para comprar: \n 1)Capacitor \n 2)Enchufe 220V \n 3)Multimetro \n 4)Protoboard \n 5)Diodo LED \n 6)Circuito Integrado \n 7)Soldador \n 8)Estaño \n 9)Ver total \n 10)Vaciar carrito \n 11)Finalizar compra \n 12)Salir")

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
            console.log("El total es $"+ carrito);
            break
        case '10':
            carrito = 0
            console.log("Vaciaste el carrito");
            break

        case '11':
            finalizarCompra();
            break
        case '12':
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