// Menú Interactivo.

const botonMenu = document.getElementById("botonMenu");
const menu = document.getElementById("menu");

botonMenu.addEventListener("click", function () {
  menu.classList.toggle("activo");
});

// Modo Oscuro

const botonTema = document.getElementById("botonTema");

botonTema.addEventListener("click", function () {
  document.body.classList.toggle("oscuro");

  if (document.body.classList.contains("oscuro")) {
    botonTema.textContent = "Modo claro";
  } else {
    botonTema.textContent = "Modo oscuro";
  }
});

// Contador de la mochila

const botonesAgregar = document.querySelectorAll(".boton-agregar");
const contador = document.getElementById("contadorMochila");
const botonVaciar = document.getElementById("botonVaciar");

let elementos = 0;

botonesAgregar.forEach(function (boton) {
  boton.addEventListener("click", function () {
    elementos = elementos + 1;
    contador.textContent = elementos;
  });
});

botonVaciar.addEventListener("click", function () {
  elementos = 0;
  contador.textContent = elementos;
});

// Validación del formulario
const formulario = document.getElementById("formularioReporte");
const mensaje = document.getElementById("mensajeFormulario");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const zona = document.getElementById("zona").value;
  const nivel = document.getElementById("nivel").value;

  if (nombre === "" || zona === "" || nivel === "") {
    mensaje.textContent = "Debes completar todos los campos obligatorios.";
    mensaje.className = "mensaje mensaje-error";
  } else {
    mensaje.textContent = "Reporte enviado. Gracias, " + nombre + ".";
    mensaje.className = "mensaje mensaje-ok";
    formulario.reset();
  }
});

// niveles de peligro con color
const botonesNivel = document.querySelectorAll(".boton-nivel");
const detalle = document.getElementById("detalleNivel");

botonesNivel.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const nivel = boton.dataset.nivel;

    if (nivel === "verde") {
      detalle.innerHTML = "<h3>Nivel verde</h3><p>Zona despejada. Se permite el desplazamiento en grupos de dos personas y las salidas de recolección durante el día.</p>";
    } else if (nivel === "amarillo") {
      detalle.innerHTML = "<h3>Nivel amarillo</h3><p>Actividad detectada en las últimas 24 horas. Salir solo si es necesario, siempre acompañado y con ruta de escape definida.</p>";
    } else {
      detalle.innerHTML = "<h3>Nivel rojo</h3><p>Presencia confirmada. Prohibido salir del refugio. Mantener silencio, luces apagadas y accesos bloqueados.</p>";
    }
  });
});