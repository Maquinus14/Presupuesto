import * as gesGastos from "./gestionPresupuesto.js";

// ===============================
// Elementos base del documento
// ===============================
const divTotal = document.getElementById("total");
const divForm = document.getElementById("formcreacion");
const divLista = document.getElementById("listado");

// ===============================
// Formulario de creación de gasto
// ===============================
const form = document.createElement("form");
form.innerHTML = `
  <label>Descripción: <input name="descripcion" required></label>
  <label>Valor (€): <input name="valor" type="number" required></label>
  <label>Fecha: <input name="fecha" type="date" required></label>
  <label>Etiquetas: <input name="etiquetas" placeholder="Separadas por espacios"></label>
  <button type="submit">Crear gasto</button>
`;
divForm.append(form);

// ===============================
// Definición del componente Web <mi-gasto>
// ===============================
const plantilla = document.getElementById("plantilla-gasto");

class MiGasto extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(plantilla.content.cloneNode(true));
  }

  set gasto(g) {
    this._gasto = g;
    this.render();
  }

  get gasto() {
    return this._gasto;
  }

  render() {
    const g = this._gasto;
    const root = this.shadowRoot;

    // Mostrar datos
    root.getElementById("descripcion").textContent = g.descripcion;
    root.getElementById("valor").textContent = `${g.valor} €`;
    root.getElementById("fecha").textContent = new Date(
      g.fecha
    ).toLocaleDateString();
    root.getElementById("etiquetas").textContent = g.etiquetas.join(" ");

    // Botones
    const editarBtn = root.getElementById("editar");
    const borrarBtn = root.getElementById("borrar");
    const formEditar = root.getElementById("formEditar");
    const cancelarBtn = root.getElementById("cancelar");

    editarBtn.onclick = () => formEditar.classList.toggle("visible");
    cancelarBtn.onclick = () => formEditar.classList.remove("visible");

    borrarBtn.onclick = () => {
      if (confirm("¿Seguro que desea borrar el gasto?")) {
        this.dispatchEvent(
          new CustomEvent("borrar-gasto", {
            detail: { id: g.id },
            bubbles: true,
            composed: true,
          })
        );
      }
    };

    // Rellenar formulario de edición
    formEditar.fDescripcion.value = g.descripcion;
    formEditar.fValor.value = g.valor;
    formEditar.fFecha.value = new Date(g.fecha).toISOString().slice(0, 10);
    formEditar.fEtiquetas.value = g.etiquetas.join(" ");

    // Guardar cambios
    formEditar.onsubmit = (e) => {
      e.preventDefault();
      const cambios = {
        descripcion: formEditar.fDescripcion.value.trim(),
        valor: parseFloat(formEditar.fValor.value),
        fecha: formEditar.fFecha.value,
        etiquetas: formEditar.fEtiquetas.value.split(" ").filter(Boolean),
      };

      this.dispatchEvent(
        new CustomEvent("editar-gasto", {
          detail: { id: g.id, cambios },
          bubbles: true,
          composed: true,
        })
      );

      formEditar.classList.remove("visible");
    };
  }
}

customElements.define("mi-gasto", MiGasto);

// ===============================
// Renderizado de los gastos
// ===============================
function pintarGastos() {
  divLista.innerHTML = "";

  for (const gasto of gesGastos.listarGastos()) {
    const elem = document.createElement("mi-gasto");
    elem.gasto = gasto;

    elem.addEventListener("borrar-gasto", (ev) => {
      gesGastos.borrarGasto(ev.detail.id);
      pintarGastos();
    });

    elem.addEventListener("editar-gasto", (ev) => {
      const g = gesGastos.listarGastos().find((x) => x.id === ev.detail.id);
      if (g) {
        const c = ev.detail.cambios;
        g.actualizarDescripcion(c.descripcion);
        g.actualizarValor(c.valor);
        g.actualizarFecha(c.fecha);
        g.etiquetas = c.etiquetas;
        pintarGastos();
      }
    });

    divLista.append(elem);
  }

  divTotal.textContent = `Total de gastos: ${gesGastos.calcularTotalGastos()} €`;
}

// ===============================
// Alta de nuevos gastos
// ===============================
form.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const desc = ev.target.elements.descripcion.value;
  const valor = parseFloat(ev.target.elements.valor.value);
  const fecha = ev.target.elements.fecha.value;
  const etiquetas = ev.target.elements.etiquetas.value
    .split(" ")
    .filter(Boolean);

  const nuevoGasto = new gesGastos.CrearGasto(desc, valor, fecha, ...etiquetas);
  gesGastos.anyadirGasto(nuevoGasto);

  form.reset();
  pintarGastos();
});

// ===============================
// Cargar algunos gastos iniciales
// ===============================
gesGastos.anyadirGasto(
  new gesGastos.CrearGasto("Constantinopla", 35, "1453-5-24", "Caída")
);
gesGastos.anyadirGasto(
  new gesGastos.CrearGasto("Terreno Edificado", 100000, "2019-7-21", "Terreno")
);
gesGastos.anyadirGasto(
  new gesGastos.CrearGasto("Transporte", 3, "2025-11-07", "Bus")
);

// ===============================
// Render inicial
// ===============================
pintarGastos();
