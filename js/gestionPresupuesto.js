// =======================
// VARIABLES GLOBALES
// =======================

let presupuesto = 0;
let gastos = []; // Array global para almacenar los gastos
let idGasto = 0; // Contador para asignar IDs únicos

// =======================
// FUNCIONES DE PRESUPUESTO
// =======================

function actualizarPresupuesto(nuevoValor) {
  if (typeof nuevoValor === "number" && nuevoValor >= 0) {
    presupuesto = nuevoValor;
    return presupuesto;
  } else {
    console.log("Error: el valor no es válido.");
    return -1;
  }
}

function mostrarPresupuesto() {
  console.log(`Tu presupuesto actual es de ${presupuesto} €`);
  return presupuesto;
}

// =======================
// CONSTRUCTOR DE GASTOS
// =======================

function CrearGasto(descripcion, valor, fecha, etiquetas = []) {
  this.id = idGasto++; // ID único incremental
  this.descripcion = descripcion;
  this.valor = typeof valor === "number" && valor >= 0 ? valor : 0;
  this.fecha = fecha ? new Date(fecha) : new Date();
  this.etiquetas = Array.isArray(etiquetas) ? etiquetas : [];

  // Muestra el gasto
  this.mostrarGasto = function () {
    console.log(
      `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`
    );
  };

  // Actualiza la descripción
  this.actualizarDescripcion = function (nuevaDescripcion) {
    this.descripcion = nuevaDescripcion;
  };

  // Actualiza el valor
  this.actualizarValor = function (nuevoValor) {
    if (typeof nuevoValor === "number" && nuevoValor >= 0) {
      this.valor = nuevoValor;
    } else {
      console.log("Error: el valor no es válido.");
    }
  };

  // Actualiza la fecha
  this.actualizarFecha = function (nuevaFecha) {
    const timestamp = Date.parse(nuevaFecha);
    if (!isNaN(timestamp)) {
      this.fecha = new Date(timestamp);
    } else {
      console.log("Error: fecha no válida.");
    }
  };

  // Añadir etiquetas sin duplicados
  this.anyadirEtiquetas = function (...nuevasEtiquetas) {
    nuevasEtiquetas.forEach((etq) => {
      if (!this.etiquetas.includes(etq)) {
        this.etiquetas.push(etq);
      }
    });
  };

  // Borrar etiquetas
  this.borrarEtiquetas = function (...etiquetasABorrar) {
    this.etiquetas = this.etiquetas.filter(
      (etq) => !etiquetasABorrar.includes(etq)
    );
  };
}

// =======================
// FUNCIONES DE GESTIÓN DE GASTOS
// =======================

// Devuelve el listado completo de gastos
function listarGastos() {
  return gastos;
}

// Añade un gasto al array global
function anyadirGasto(gasto) {
  gastos.push(gasto);
}

// Borra un gasto por su id
function borrarGasto(id) {
  gastos = gastos.filter((gasto) => gasto.id !== id);
}

// Calcula el total de todos los gastos
function calcularTotalGastos() {
  return gastos.reduce((total, gasto) => total + gasto.valor, 0);
}

// Calcula el balance (presupuesto - total de gastos)
function calcularBalance() {
  return presupuesto - calcularTotalGastos();
}

// =======================
// EXPORTACIÓN (versión ES module)
// =======================
export {
  actualizarPresupuesto,
  mostrarPresupuesto,
  CrearGasto,
  listarGastos,
  anyadirGasto,
  borrarGasto,
  calcularTotalGastos,
  calcularBalance,
};

// Ejemplos de uso manual
actualizarPresupuesto(500);
mostrarPresupuesto();

let gasto1 = new CrearGasto("Comida", 100, "2025-10-22", ["alimentación"]);
anyadirGasto(gasto1);

let gasto2 = new CrearGasto("Transporte", 50);
anyadirGasto(gasto2);

console.log(listarGastos());
console.log("Total gastos:", calcularTotalGastos());
console.log("Balance:", calcularBalance());
