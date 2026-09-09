// Menú Interactivo

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

// Mochila

const botonesAgregar = document.querySelectorAll(".boton-agregar");
const contador = document.getElementById("contadorMochila");
const listaMochila = document.getElementById("listaMochila");
const botonVaciar = document.getElementById("botonVaciar");

// Aquí se guardan los nombres de los recursos que llevamos.
let mochila = [];

// Dibuja la lista y actualiza el número de elementos.
function mostrarMochila() {
  listaMochila.innerHTML = "";

  if (mochila.length === 0) {
    const vacia = document.createElement("li");
    vacia.className = "vacia";
    vacia.textContent = "La mochila está vacía.";
    listaMochila.appendChild(vacia);
  } else {
    mochila.forEach(function (recurso) {
      const item = document.createElement("li");
      item.textContent = recurso;
      listaMochila.appendChild(item);
    });
  }

  contador.textContent = mochila.length;
}

botonesAgregar.forEach(function (boton) {
  boton.addEventListener("click", function () {
    // El nombre del recurso es el título de su propia tarjeta.
    const recurso = boton.closest(".tarjeta-cuerpo").querySelector("h3").textContent;
    const posicion = mochila.indexOf(recurso);

    // Si todavía no está lo agrega, y si ya está lo quita.
    if (posicion === -1) {
      mochila.push(recurso);
      boton.textContent = "Quitar";
      boton.classList.add("activo");
    } else {
      mochila.splice(posicion, 1);
      boton.textContent = "Agregar";
      boton.classList.remove("activo");
    }

    mostrarMochila();
  });
});

botonVaciar.addEventListener("click", function () {
  mochila = [];

  botonesAgregar.forEach(function (boton) {
    boton.textContent = "Agregar";
    boton.classList.remove("activo");
  });

  mostrarMochila();
});

mostrarMochila();

// Niveles de peligro

const botonesNivel = document.querySelectorAll(".boton-nivel");
const detalle = document.getElementById("detalleNivel");

botonesNivel.forEach(function (boton) {
  boton.addEventListener("click", function () {
    const nivel = boton.dataset.nivel;

    if (nivel === "verde") {
      detalle.innerHTML = `
        <h3>Nivel verde</h3>
        <p>Zona despejada. Se permite el desplazamiento en grupos de dos personas y las salidas de recolección durante el día.</p>
      `;
    } else if (nivel === "amarillo") {
      detalle.innerHTML = `
        <h3>Nivel amarillo</h3>
        <p>Actividad detectada en las últimas 24 horas. Salir solo si es necesario, siempre acompañado y con ruta de escape definida.</p>
      `;
    } else {
      detalle.innerHTML = `
        <h3>Nivel rojo</h3>
        <p>Presencia confirmada. Prohibido salir del refugio. Mantener silencio, luces apagadas y accesos bloqueados.</p>
      `;
    }
  });
});

// Zonas Nuevas (Formulario)

const formulario = document.getElementById("formularioReporte");
const mensaje = document.getElementById("mensajeFormulario");
const listaZonas = document.getElementById("listaZonas");
const sinZonas = document.getElementById("sinZonas");
const inputFoto = document.getElementById("foto");
const contenedorPreview = document.getElementById("contenedorPreview");
const vistaPreviaFoto = document.getElementById("vistaPreviaFoto");

const CLAVE_ZONAS = "umbrella_zonas_nuevas";

// Lee las zonas nuevas guardadas en el navegador.
function obtenerZonas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_ZONAS)) || [];
  } catch (error) {
    return [];
  }
}

// Guarda las zonas nuevas en el navegador.
function guardarZonas(zonas) {
  localStorage.setItem(CLAVE_ZONAS, JSON.stringify(zonas));
}

// Devuelve los textos visuales correspondientes al nivel.
function datosNivel(nivel) {
  const datos = {
    verde: {
      clase: "etiqueta-verde",
      texto: "Riesgo bajo"
    },
    amarillo: {
      clase: "etiqueta-amarilla",
      texto: "Riesgo medio"
    },
    rojo: {
      clase: "etiqueta-roja",
      texto: "Riesgo alto"
    }
  };

  return datos[nivel] || datos.verde;
}

// Comprime la fotografía para evitar ocupar demasiado espacio en localStorage.
function convertirFoto(file) {
  return new Promise(function (resolve, reject) {
    if (!file) {
      resolve("");
      return;
    }

    const lector = new FileReader();

    lector.onload = function (evento) {
      const imagen = new Image();

      imagen.onload = function () {
        const maximo = 1000;
        let ancho = imagen.width;
        let alto = imagen.height;

        if (ancho > maximo || alto > maximo) {
          const escala = Math.min(maximo / ancho, maximo / alto);
          ancho = Math.round(ancho * escala);
          alto = Math.round(alto * escala);
        }

        const canvas = document.createElement("canvas");
        canvas.width = ancho;
        canvas.height = alto;

        const contexto = canvas.getContext("2d");
        contexto.drawImage(imagen, 0, 0, ancho, alto);

        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };

      imagen.onerror = reject;
      imagen.src = evento.target.result;
    };

    lector.onerror = reject;
    lector.readAsDataURL(file);
  });
}

// Crea visualmente una tarjeta para una zona nueva.
function crearTarjetaZona(zona) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta tarjeta-nueva";

  if (zona.foto) {
    const imagen = document.createElement("img");
    imagen.className = "foto-zona-nueva";
    imagen.src = zona.foto;
    imagen.alt = "Fotografía de " + zona.nombre;
    tarjeta.appendChild(imagen);
  } else {
    const sinFoto = document.createElement("div");
    sinFoto.className = "sin-foto";
    sinFoto.textContent = "Sin fotografía";
    tarjeta.appendChild(sinFoto);
  }

  const cuerpo = document.createElement("div");
  cuerpo.className = "tarjeta-cuerpo";

  const titulo = document.createElement("h3");
  titulo.textContent = zona.nombre;

  const observacion = document.createElement("p");
  observacion.className = "observacion";
  observacion.textContent = zona.observaciones;

  const nivel = datosNivel(zona.nivel);
  const etiqueta = document.createElement("span");
  etiqueta.className = "etiqueta " + nivel.clase;
  etiqueta.textContent = nivel.texto;

  const autor = document.createElement("p");
  autor.className = "info-reporte";
  autor.textContent = "Reportado por: " + zona.explorador;

  const botonEliminar = document.createElement("button");
  botonEliminar.className = "boton-eliminar-zona";
  botonEliminar.type = "button";
  botonEliminar.textContent = "Eliminar zona";
  botonEliminar.addEventListener("click", function () {
    eliminarZona(zona.id);
  });

  cuerpo.appendChild(titulo);
  cuerpo.appendChild(observacion);
  cuerpo.appendChild(etiqueta);
  cuerpo.appendChild(autor);
  cuerpo.appendChild(botonEliminar);

  tarjeta.appendChild(cuerpo);

  return tarjeta;
}

// Muestra todas las zonas nuevas después de las tres originales.
function mostrarZonas() {
  listaZonas.querySelectorAll(".tarjeta-nueva").forEach(function (tarjeta) {
    tarjeta.remove();
  });

  const zonas = obtenerZonas();

  zonas.forEach(function (zona) {
    listaZonas.appendChild(crearTarjetaZona(zona));
  });

  sinZonas.style.display = zonas.length === 0 ? "block" : "none";
}

// Elimina únicamente una zona nueva.
function eliminarZona(id) {
  const confirmar = confirm("¿Seguro que quieres eliminar esta zona?");

  if (!confirmar) {
    return;
  }

  const zonas = obtenerZonas().filter(function (zona) {
    return zona.id !== id;
  });

  guardarZonas(zonas);
  mostrarZonas();

  mensaje.textContent = "La zona fue eliminada correctamente.";
  mensaje.className = "mensaje mensaje-ok";
}

// Vista previa de la foto antes de enviar.
inputFoto.addEventListener("change", function () {
  const archivo = inputFoto.files[0];

  if (!archivo) {
    contenedorPreview.classList.remove("activa");
    vistaPreviaFoto.removeAttribute("src");
    return;
  }

  const lector = new FileReader();

  lector.onload = function (evento) {
    vistaPreviaFoto.src = evento.target.result;
    contenedorPreview.classList.add("activa");
  };

  lector.readAsDataURL(archivo);
});

// Envío del reporte.
formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const explorador = document.getElementById("nombre").value.trim();
  const nombreZona = document.getElementById("zona").value.trim();
  const nivel = document.getElementById("nivel").value;
  const observaciones = document.getElementById("observaciones").value.trim();
  const archivoFoto = inputFoto.files[0];

  if (!explorador || !nombreZona || !nivel || !observaciones) {
    mensaje.textContent = "Debes completar todos los campos obligatorios.";
    mensaje.className = "mensaje mensaje-error";
    return;
  }

  try {
    const foto = await convertirFoto(archivoFoto);

    const nuevaZona = {
      id: Date.now().toString(),
      explorador: explorador,
      nombre: nombreZona,
      nivel: nivel,
      observaciones: observaciones,
      foto: foto
    };

    const zonas = obtenerZonas();
    zonas.push(nuevaZona);
    guardarZonas(zonas);
    mostrarZonas();

    formulario.reset();
    contenedorPreview.classList.remove("activa");
    vistaPreviaFoto.removeAttribute("src");

    mensaje.textContent = "Reporte enviado. La nueva zona ya aparece en la sección de zonas.";
    mensaje.className = "mensaje mensaje-ok";

    document.getElementById("zonas").scrollIntoView({
      behavior: "smooth"
    });
  } catch (error) {
    console.error(error);
    mensaje.textContent = "No fue posible procesar la fotografía. Intenta nuevamente.";
    mensaje.className = "mensaje mensaje-error";
  }
});

// Cargar las zonas nuevas cuando se abre o recarga la página.
mostrarZonas();

// Días transcurridos desde el brote

const diasBrote = document.getElementById("diasBrote");

// Fecha en que comenzó el brote (el mes se cuenta desde 0, así que 6 = julio).
const FECHA_BROTE = new Date(2026, 6, 24);

const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
const diferencia = new Date() - FECHA_BROTE;

diasBrote.textContent = Math.floor(diferencia / MILISEGUNDOS_POR_DIA);
