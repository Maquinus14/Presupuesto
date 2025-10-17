// Variable global del presupuesto
let presupuesto = 0;

// Función para actualizar el presupuesto
function actualizarPresupuesto(nuevoValor) {
  if (typeof nuevoValor === "number" && nuevoValor >= 0) {
    presupuesto = nuevoValor;
    return presupuesto;
  } else {
    console.log("Error: el valor no es válido.");
    return -1;
  }
}

// Función para mostrar el presupuesto
function mostrarPresupuesto() {
  console.log(`Tu presupuesto actual es de ${presupuesto} €`);
}

// Función constructora para crear gastos
function CrearGasto(descripcion, valor) {
  this.descripcion = descripcion;
  this.valor = typeof valor === "number" && valor >= 0 ? valor : 0;

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
}

// Ejemplos para probar el programa
actualizarPresupuesto(500);
mostrarPresupuesto();

let gasto1 = new CrearGasto("Comida", 100);
gasto1.mostrarGasto();

gasto1.actualizarValor(120);
gasto1.mostrarGasto();

gasto1.actualizarDescripcion("Cena");
gasto1.mostrarGasto();
