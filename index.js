const provincias = ["Córdoba", "Buenos Aires", "Corrientes", "Entre Ríos", "Chubut", "Río Negro", "Tierra del Fuego", "Santa Cruz", "Catamarca", "San Luis", "San Juan", "Santa Fé", "Chaco", "Misiones", "Formosa", "Santiago del Estero", "Tucumán", "Salta", "Jujuy", "La Rioja", "La Pampa", "Neuquén", "Mendoza"];
const container = document.getElementById("productos_container");
const form = document.getElementById('form');
const anioActual = new Date().getFullYear();
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const template = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragmento = document.createDocumentFragment();
const seleccionProvincia = document.getElementById("seleccionProvincia");
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
    data();
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
        mostrarCarrito();
    }

});

container.addEventListener("click", e =>{
    agregarAlCarrito(e)
});

items.addEventListener("click", e =>{
    accionDeLosBotones(e)
});

const data = async () => {
    try {
        const response = await fetch("productos.json");
        const productos = await response.json();  
        crearTarjetas(productos);
    } catch (reject) {
        console.log(reject); 
    }

};

const crearTarjetas = productos => {
    productos.forEach(producto => {
        template.querySelector("h4").textContent = producto.nombre;
        template.querySelector("h6").textContent = producto.descripcion;
        template.querySelector("p").textContent =  producto.precio;
        template.querySelector("img").setAttribute("src", producto.img);
        template.querySelector("small").textContent = producto.talles;
        template.querySelector(".botonAgregar").dataset.id = producto.id;

        const clon = template.cloneNode(true);
        fragmento.appendChild(clon)
    });
    container.appendChild(fragmento);
    
};

const agregarAlCarrito = e => {

    if (e.target.classList.contains("botonAgregar")){
        definirCarrito( e.target.parentElement);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Añadido al carrito',
            showConfirmButton: false,
            timer: 900
          });

    };
    e.stopPropagation();
};

const definirCarrito = objeto => {
    const producto = {
        nombre: objeto.querySelector("h4").textContent,
        precio: objeto.querySelector("p").textContent,
        id: objeto.querySelector(".botonAgregar").dataset.id,
        cantidad: 1
    };

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
        
    };

    carrito[producto.id] = {...producto};
    mostrarCarrito();
};

const mostrarCarrito = () => {
    items.innerHTML = " ";
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelector(".title").textContent = producto.nombre;
        templateCarrito.querySelector(".cant").textContent = producto.cantidad;
        templateCarrito.querySelector(".mas").dataset.id = producto.id;
        templateCarrito.querySelector(".menos").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;

        const clon = templateCarrito.cloneNode(true);
        fragmento.appendChild(clon);
    });

    items.appendChild(fragmento);

    crearFooter();

    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const crearFooter = () => {
    footer.innerHTML = " ";

    if (Object.keys(carrito).length === 0) {
            
            footer.innerHTML = `<th scope="row" colspan="5">El carrito se encuentra vacío - vamos a comprar!</th>`;
            return
    };

    const cantidadTotal =  Object.values(carrito).reduce((acumulador, {cantidad})=> acumulador + cantidad,0);
    const precioFinal = Object.values(carrito).reduce((acumulador, {cantidad, precio}) => acumulador + cantidad * precio,0);
    
    
    templateFooter.querySelector(".cantidadTotal").textContent = cantidadTotal;
    templateFooter.querySelector(".precioFinal").textContent = precioFinal;
    
    const clon = templateFooter.cloneNode(true);
    fragmento.appendChild(clon);
    footer.appendChild(fragmento);
    
    const pintarTotal = document.getElementById("total");
    const comprar = document.getElementById("botonComprar");

    comprar.addEventListener ("click", () => {
        pintarTotal.innerHTML = `Total: $${precioFinal}`;

    });

    const vaciar = document.getElementById("vaciarCarrito");
    vaciar.addEventListener("click", () => {
        carrito = {};
        mostrarCarrito();
    });
};


const accionDeLosBotones = (e) => {
    
    if (e.target.classList.contains("mas")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = {...producto}
        mostrarCarrito();
    };

    if (e.target.classList.contains("menos")){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        };
        mostrarCarrito();

    }

    e.stopPropagation();
};

for (const provincia of provincias) {
    let opcion = document.createElement("option");
    opcion.value = provincia;
    opcion.innerText = provincia;
    seleccionProvincia.appendChild(opcion)
}

// AUTOMATIZAMOS LA CREACION DE LOS MESES EN LOS OPTION DE MES
for (let i = 1; i <= 12; i++) {
    let opcion = document.createElement("option");
    opcion.value = i;
    opcion.innerText = i;
    form.seleccionMes.appendChild(opcion);
    
};

// AUTOMATIZAMOS LA CREACION DE LOS AÑOS EN LOS OPTION DE AÑO

for (let i = anioActual; i < anioActual + 12; i++) {
    let opcion = document.createElement("option");
    opcion.value = i;
    opcion.innerText = i;
    form.seleccionAnio.appendChild(opcion);
    
};

const btn = document.getElementById('button');

 form.addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Procesando...';

   const serviceID = 'default_service';
   const templateID = 'template_9uf5327';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Pagar';
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Compra realizada con éxito',
        showConfirmButton: false,
        timer: 2000
      });
    }, (err) => {
      btn.value = 'Pagar';
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `${JSON.stringify(err)}`,
        showConfirmButton: false,
        timer: 5000
      });
    });

    carrito = {};
    mostrarCarrito();

});