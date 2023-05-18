// DATOS CAPTURADOS DEL DOM

const contenedorProd = document.getElementById("contenedorProductos");
const abrirCarrito = document.getElementById("abrirCarrito");
const modalContainer = document.getElementById("modalContainer");
const formBuscador = document.getElementById("formBuscador");

/// BASE DE DATOS DE LOS PRODUCTOS

const productos = [
  {
    id: 1,
    nombre: "Remera",
    precio: 3000,
    img: "https://media.solodeportes.com.ar/media/catalog/product/cache/7c4f9b393f0b8cb75f2b74fe5e9e52aa/1/1/111020dh3703001-11.jpg",
    cantidad: 1,
  },
  {
    id: 2,
    nombre: "Pantalon",
    precio: 3500,
    img: "https://sporting.vtexassets.com/arquivos/ids/207885-800-800?v=637285413836770000&width=800&height=800&aspect=true",
    cantidad: 1,
  },
  {
    id: 3,
    nombre: "Short",
    precio: 4500,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_oUbSF75d3PYqtiwCkW908VTWOa06UyJv2Q&usqp=CAU",
    cantidad: 1,
  },
  {
    id: 4,
    nombre: "Medias",
    precio: 1000,
    img: "https://10burpees.com/imagenes/calcetines-largos.jpg",
    cantidad: 1,
  },
  {
    id: 5,
    nombre: "Muñequeras",
    precio: 800,
    img: "https://cbdeportes.com/wp-content/uploads/2018/04/mu%C3%B1equera.balboa.negro-rosa.jpg",
    cantidad: 1,
  },
  {
    id: 6,
    nombre: "Rodilleras",
    precio: 4000,
    img: "https://www.suplementosnutricionalessalta.com.ar/public/images/productos/754-rodillera-negra-7-mm-x-unidad-talle-l.jpeg",
    cantidad: 1,
  },
  {
    id: 7,
    nombre: "Zapatillas",
    precio: 35000,
    img: "https://intersport.com.au/wp-content/uploads/M_DO9328_100_V1-1-550x550.jpg",
    cantidad: 1,
  },
  {
    id: 8,
    nombre: "Cinturon",
    precio: 2000,
    img: "https://d3ugyf2ht6aenh.cloudfront.net/stores/898/402/products/whatsapp-image-2021-07-05-at-12-50-27-11-32c85b25432d86ec9216256700728933-640-0.webp",
    cantidad: 1,
  },
];

//////////// CARRITO INICIALIZADO COMO AQUELLO QUE ENCUENTRE EN EL LOCAL //////////
//////////// OR(||) UN ARRAY VACIO EN CASO DE NO HABER NADA //////////

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/////////// CREANDO CONTAINER PARA LOS PRODUCTOS ///////////
/////////// Y PINTANDOLOS EN EL DOM  ///////////////////////

productos.forEach((producto) => {
  let contenido = document.createElement("div");
  contenido.className = "card";
  contenido.innerHTML = `
        <img src="${producto.img}">
        <h3>${producto.nombre}</h3>
        <p class="parrafo-precio">$${producto.precio}</p>
    `;
  contenedorProd.append(contenido);

  let botonComprar = document.createElement("button");
  botonComprar.innerHTML = `Añadir al carrito <i class="bi bi-bag-check"></i>`;
  botonComprar.className = "btn btn-dark";

  contenido.append(botonComprar);

  ///// FUNCION PARA SUMAR CANTIDADES ///////
  ///// Detecta si el producto existe en carrito(true/false)
  ///// si existe cantidad++ sino lo pushea.

  botonComprar.addEventListener("click", () => {
    const repetido = carrito.some(
      (productoRepetido) => productoRepetido.id === producto.id
    );

    if (repetido) {
      carrito.map((productoCarrito) => {
        if (productoCarrito.id === producto.id) {
          productoCarrito.cantidad++;
        }
      });
    } else {
      carrito.push({
        id: producto.id,
        img: producto.img,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: producto.cantidad,
      });
    }
    guardarEnLocal();

  });
});

/////////////// FUNCION PINTAR CARRITO ////////////

const productosEnCarrito = () => {

  ///INICIALIZAR EL MODAL COMO UN INNER HTML VACIO PARA QUE NO REPITA EL PROCESO DE CREACION CADA VEZ QUE SE CLICKEE
  // CADA VEZ QUE CLICKEA BORRA TODO Y CREA TODO DE NUEVO Y LE DA DISPLAY FLEX PARA QUITAR EL DISPLAY NONE.

  modalContainer.innerHTML = "";
  modalContainer.style.display = "flex   ";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header light bg-light";
  modalHeader.innerHTML = `
    <h2 class="modal-header-title">Carrito</h2>
    `;
  modalContainer.append(modalHeader);

  //// CREANDO BOTON PARA CERRAR ("X") QUE LE DA DISPLAY NONE AL MODAL AL CLICKEAR.

  const modalBotonCerrar = document.createElement("h1");
  modalBotonCerrar.innerHTML = `<i class="bi bi-x-lg"></i>`;
  modalBotonCerrar.className = "modal-header-button";

  modalBotonCerrar.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });

  modalContainer.append(modalBotonCerrar);

  ////// CON forEach CREO EL CONTENIDO DEL MODAL POR CADA PRODUCTO AGREGADO AL CARRITO.

  carrito.forEach((producto) => {
    let carritoContenido = document.createElement("div");
    carritoContenido.className = "modal-contenido";
    carritoContenido.innerHTML = `
      <img src="${producto.img}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <p> Cantidad: ${producto.cantidad}</p>
      <p> Subtotal: ${producto.precio * producto.cantidad}</p>
      <span class="boton-eliminar"> ❌</span>
    `;

    modalContainer.append(carritoContenido);

    ////// AL TOCAR EL BOTON ELIMINAR DEL CARRITO ELIMINA EL PRODUCTO BUSCANDOLO POR EL ID
    ////// Y ACTUALIZA EL CARRITO Y EL STORAGE

    let botonEliminar = carritoContenido.querySelector(".boton-eliminar");
    botonEliminar.addEventListener("click", () => {
      eliminarProducto(producto.id);
      guardarEnLocal();
    });
  });

  ////// REDUCE PARA CALCULAR EL TOTAL DE LOS VALORES DE CADA PRODUCTO X LA CANTIDAD.

  const totalCarrito = carrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );

  ////// CREANDO EL FOOTER DEL CARRITO, CON BOTON VACIAR CARRITO Y FINALIZAR COMPRA.
  ///// botonVaciarCarrito ACTUALIZA EL CONTENIDO DEL CARRITO Y EL LOCALSTORAGE

  const carritoFooter = document.createElement("div");
  carritoFooter.className = "carrito-footer";
  carritoFooter.innerHTML = `
    Total: $${totalCarrito}
  `;

  modalContainer.append(carritoFooter);

  const botonVaciarCarrito = document.createElement("button");
  botonVaciarCarrito.innerHTML = `Vaciar Carrito <i class="bi bi-trash"></i>`;
  botonVaciarCarrito.className = "boton-vaciar btn btn-light";

  carritoFooter.append(botonVaciarCarrito);

  botonVaciarCarrito.addEventListener("click", () => {
    vaciarCarrito();
    productosEnCarrito();
    guardarEnLocal();
  });

  /////// botonFinalizarCompra CREA UN DIV AL FINAL DEL FOOTER CON UN FORMULARIO PARA INGRESO DE DATOS.

  const botonFinalizarCompra = document.createElement("button");
  botonFinalizarCompra.innerHTML = `Finalizar compra <i class="bi bi-cart-check"></i>`;
  botonFinalizarCompra.className = "btn btn-light py-2 mb-1";

  carritoFooter.append(botonFinalizarCompra);

  /////// TOMA EL DATO DE LA CLASE FORMULARIO. SI NO EXISTE LO CREA.
  ///////// DE ESTA MANERA EVITE  EL LOOP DE CREAR INFINITAS VECES EL FORM.

  botonFinalizarCompra.addEventListener("click", () => {
    const formularioExistente = document.querySelector(".formulario");

    if (!formularioExistente) {
      const flecha = document.createElement("span");
      flecha.innerHTML = `
      <span> <i class="flecha bi bi-arrow-down"></i></span>
      `;
      carritoFooter.append(flecha);

      const formulario = document.createElement("div");
      formulario.className =
        "formulario d-flex flex-column justify-content-center align-items-center";
      formulario.innerHTML = `

        <h3 class="text-center pt-3"> Finalice su compra </h3>
        <form>
            <div class="row g-3 pt-3 pb-2">
                <div class="col">
                    <input type="text" class="form-control" placeholder="Nombre" aria-label="First name">
                </div>
                <div class="col">
                    <input type="email" class="form-control" placeholder="Email" aria-label="Email">
                </div>
            </div>
            <div class="col-12 pb-4">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value=""  aria-describedby="invalidCheck3Feedback" required>
                    <label class="form-check-label" for="invalidCheck3">
                        Agree to terms and conditions
                    </label>
                </div>
             </div>
            
        
        </form>
        <button class="boton-comprar btn btn-dark mb-5"> Comprar <i class="bi bi-check2"></i> </button>
    
    `;

      carritoFooter.append(formulario);
    }
    const botonComprar = document.querySelector(".boton-comprar");
    console.log(botonComprar);
    botonComprar.addEventListener("click", () => {
      Swal.fire({
        icon: "success",
        title: "Su compra ha sido exitosa",
        showConfirmButton: false,
        timer: 2000,
      });
    });
  });
};

abrirCarrito.addEventListener("click", productosEnCarrito);

/////////////FUNCION ELIMINAR PRODUCTO ////////////////////
///// BUSCA EL ID DEL PRODUCTO QUE COINCIDA CON EL ID INGRESADO
///// Y FILTRA EL CARRITO PARA DEVOLVER TODOS LOS PRODUCTOS EXCEPTO ESE

const eliminarProducto = (id) => {
  const encontrarProducto = carrito.find((producto) => producto.id === id);

  carrito = carrito.filter((productoId) => {
    return productoId !== encontrarProducto;
  });


  productosEnCarrito();
};

//////////////// FUNCION VACIAR CARRITO /////////////
///// REINICIA TODO

const vaciarCarrito = () => {
  carrito = [];
  totalCarrito = 0;
};

/////- FUNCION PARA GUARDAR EN LOCAL STORAGE -/////

const guardarEnLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

//// RECUPERAR DATOS DEL LOCAL STORAGE ////

JSON.parse(localStorage.getItem("carrito"));
