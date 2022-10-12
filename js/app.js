const cursos = [
    {
        id:1,
        nombre: 'Curso de crossfits',
        instructor: 'Ignacio Urrutia',
        detalle: 'Clases de 3 horas, 1 vez por semana',
        precio: 1500,
        img:'img/crosfits_640.jpg',
    },
    {
        id:2,
        nombre: 'Curso de Kickboxer',
        instructor: 'Claudia Palma',
        detalle: 'Clases de 1 hora, 2 vez por semana',
        precio: 1000,
        img:'img/kickboxer_640.jpg',
    },
    {
        id:3,
        nombre: 'Curso de box',
        instructor: 'Martin Vargas',
        detalle: 'Clases de 1 hora, 1 vez por semana',
        precio: 1500,
        img:'img/box_640.jpg',
    },
    {
        id:4,
        nombre: 'Curso de Pilates',
        instructor: 'Catalina Rodriguez Lopez',
        detalle: 'Clases de 2 hora, 1 vez por semana',
        precio: 1000,
        img:'img/pilates_640.jpg',
    },
    {
        id:5,
        nombre: 'Entrenamiento personal',
        instructor: 'Thiago Martinez',
        detalle: 'Clases de 2 horas, 1 vez por semana',
        precio: 2000,
        img:'img/personalTrainer_640.jpg',
    },
    {
        id:6,
        nombre: 'Clase yoga',
        instructor: 'Antonia Ross',
        detalle: 'Clases de 1 hora, 1 vez por semana',
        precio: 800,
        img:'img/yoga_640.jpg',
    }
];

const cursosContenedor = document.getElementById('listaCursos');

function crearCurso(curso){
    const articulo = document.createElement('div');

    articulo.innerHTML = `<div class="four columns">
    <div class="card">
        <img src="${curso.img}" class="imagen-curso u-full-width">
        <div class="info-card">
            <h4 class="nombre">${curso.nombre}</h4>
            <p>Instructor/a: ${curso.instructor}</p>
            <p class="detalle">${curso.detalle}</p>
            <p class="precio"><span class="u-pull-right ">${curso.precio}</span></p>
            <a class="u-full-width button-primary button input agregar-carrito" id=boton${curso.id} data-id="${curso.id}">Agregar Al Carrito</a>
        </div>
    </div> ` 

    cursosContenedor.appendChild(articulo);
}
cursos.forEach(crearCurso);


//Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');

const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');

const listacursos = document.querySelector('#listaCursos');

const contadorCarrito = document.getElementById('cantidad-carrito');//contador
 
let articulosCarrito = []


cargarEventListeners();
function cargarEventListeners(){
    //Cuando se agrega un curso al presionar agregar al carrito
    listacursos.addEventListener('click', agregarCurso);
   
    //Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);
    //localstorage DOm
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoRender();
    })
}

// Funciones
function agregarCurso(e){
    if(e.target.classList.contains('agregar-carrito')){

        const cursoSelecionado = e.target.parentElement.parentElement
        let curso = leerDatosCurso(cursoSelecionado); //variable para mostrar curso en toastify

            Toastify({
                text: `Agregaste "${curso.titulo}" al carrito`,
                className: "toast-agregar",
                duration: 3000,
                close: true,
                gravity: "bottom", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                style: {
                  background: "#fff",
                  color:"#000",
                }
              }).showToast();                  
    }
}
// function limpiarHTML()

// Elimina item del carrito
function eliminarCurso(e){
    console.log(e.target.classList);
    if(e.target.classList.contains('borrar-curso')){
        Toastify({
            text: "Borraste un curso de carrito",
            className: "eliminado",
            duration: 1500,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            style: {
              background: "#e44e52",
            }
          }).showToast();
        const cursoId = e.target.getAttribute('data-id');
        //elimina del arreglo
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        carritoRender(); //iterar sobre carrito y mostrar html
    }
}

// Lee el contenido html al q le dimos click y extrae la info de producto
function leerDatosCurso(curso){
    // Crear un objeto con el contenido de curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    //revisar si elemento ya existe en carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);
    if(existe){
        //actualizamos cantidad
        const cursos = articulosCarrito.map(curso => {
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso;
            }else{
                return curso; 
            }
        });
        //sumatoria 
        carritoTotal()
        articulosCarrito.push();
    }else{
    // Agrega elementos al array carrito
    articulosCarrito.push(infoCurso);
    }
    console.log(articulosCarrito);

    carritoRender();
    return infoCurso // retornar infoCurso para llamar en toastify
}


//Muestra carrito de compras en html
function carritoRender(){
    //limpiar html
    limpiarHTML();

    // Recorrer el carrito y crea html
    articulosCarrito.forEach( (curso) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${curso.imagen}" width="100"></td>
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>${curso.cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${curso.id}"> BORRAR </td>
        `;
        //agregar el html de carrito en el tbody
        contenedorCarrito.appendChild(row);
    });
    //sumatoria 
    carritoTotal()
    //contador carrito
    contadorCarrito.innerText = articulosCarrito.length
    //actualiza total carrito
    // actualizarCarritoTotal()

    //Localstorage
    sincorizarStorage();
}
//funcion localstorage
function sincorizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Eliminar los cursos del tbody
function limpiarHTML(){
    //
    contenedorCarrito.innerHTML = '';
}

function carritoTotal() {
    let total = 0;
    const cursoCantidadTotal = document.querySelector('.total');

    articulosCarrito.forEach((curso) => {
        const precio = Number(curso.precio.replace('$', ''));
        total = total + precio * curso.cantidad
    })
    cursoCantidadTotal.innerHTML = `Total $${total}`
}