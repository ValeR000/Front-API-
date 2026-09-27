async function obtenerPersonajes() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/character");
  const datos = await respuesta.json();
  return datos.results;
}

function filtrarPorEstado(personajes, estado) {
  if (estado === "") {
    return personajes;
  }
  return personajes.filter(function (personaje) {
    return personaje.status.toLowerCase() === estado;});
}

function filtrarPorEspecie(personajes, especie) {
  if (especie === "") {
    return personajes;}
  return personajes.filter(function (personaje) {
    return personaje.species === especie;});
}

function obtenerNombres(personajes) {
  return personajes.map(function (personaje) {
    return personaje.name;});
}

function buscarPorNombre(personajes, nombre) {
  return personajes.find(function (personaje) {
    return personaje.name === nombre;
  });
}

function ordenarPorNombre(personajes) {
  return [...personajes].sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

function hayPersonajesMuertos(personajes) {
  return personajes.some(function (personaje) {
    return personaje.status === "Dead";
  });
}

function todosVivos(personajes) {
  return personajes.every(function (personaje) {
    return personaje.status === "Alive";
  });
}

function primeros(personajes, cantidad) {
  return personajes.slice(0, cantidad);
}

function posicionDeNombre(nombres, nombre) {
  return nombres.indexOf(nombre);
}

function contarVivos(personajes) {
  return personajes.reduce(function (total, personaje) {
    return personaje.status === "Alive" ? total + 1 : total;
  }, 0);
}

let personajes = [];
let ordenDescendente = false;

document.querySelector("#btn-ordenar").addEventListener("click", function () {
  ordenDescendente = !ordenDescendente;
  document.querySelector("#btn-ordenar").textContent = ordenDescendente ? "Ordenar Z-A" : "Ordenar A-Z";
  aplicarFiltros();
});

function aplicarFiltros() {
  const nombre = document.querySelector("#filtro-nombre").value.trim().toLowerCase();
  const estado = document.querySelector("#filtro-estado").value;
  const especie = document.querySelector("#filtro-especie").value;
  const soloPrimeros10 = document.querySelector("#check-primeros10").checked;

  let filtrados = filtrarPorEstado(personajes, estado);
  filtrados = filtrarPorEspecie(filtrados, especie);
  filtrados = filtrados.filter(function (personaje) {
    return personaje.name.toLowerCase().includes(nombre);
  });
  filtrados = ordenarPorNombre(filtrados);
  if (ordenDescendente) {
    filtrados = filtrados.reverse();
  }

  document.querySelector("#contador").textContent = filtrados.length + " personajes encontrados";
  mostrarEstadisticas(filtrados);

  if (soloPrimeros10) {
    filtrados = primeros(filtrados, 10);
  }
  pintarResultados(filtrados);
}

document.querySelector("#btn-limpiar").addEventListener("click", function () {
  document.querySelector("#filtro-nombre").value = "";
  document.querySelector("#filtro-estado").value = "";
  document.querySelector("#filtro-especie").value = "";
  document.querySelector("#check-primeros10").checked = true;
  ordenDescendente = false;
  document.querySelector("#btn-ordenar").textContent = "Ordenar A-Z";
  aplicarFiltros();
});

document.querySelector("#check-primeros10").addEventListener("change", aplicarFiltros);

function mostrarEstadisticas(lista) {
  const vivos = contarVivos(lista);
  const muertos = filtrarPorEstado(lista, "dead").length;
  const desconocidos = filtrarPorEstado(lista, "unknown").length;

  document.querySelector("#estadisticas").textContent =
    "Vivos: " + vivos + " · Muertos: " + muertos + " · Desconocidos: " + desconocidos;
}

function pintarResultados(lista) {
  const contenedor = document.querySelector("#resultados");

  contenedor.innerHTML = lista
    .map(function (personaje) {
      return (
        '<article class="personaje-card">' +
        '<img src="' + personaje.image + '" alt="' + personaje.name + '" />' +
        "<h3>" + personaje.name + "</h3>" +
        "<p>" + personaje.status + " · " + personaje.species + "</p>" +
        "</article>"
      );
    })
    .join("");
}

document.querySelector("#filtro-nombre").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-estado").addEventListener("change", aplicarFiltros);
document.querySelector("#filtro-especie").addEventListener("change", aplicarFiltros);

obtenerPersonajes().then(function (datos) {
  personajes = datos;
  aplicarFiltros();
});