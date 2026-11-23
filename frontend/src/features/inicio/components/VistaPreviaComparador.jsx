import "./VistaPreviaComparador.css";

const PASOS = ["Filtrá por specs", "Sumá hasta 4", "Mirá las diferencias"];

const PRODUCTOS = [
  { nombre: "Superlight 2", precio: "$239.900" },
  { nombre: "Pulsefire Haste 2", precio: "$89.900" },
  { nombre: "Basilisk V3", precio: "$104.900" },
];

const FILAS = [
  { spec: "DPI máximo", valores: ["32.000", "26.000", "26.000"], mejor: 0 },
  { spec: "Peso", valores: ["60 g", "53 g", "101 g"], mejor: 1 },
  { spec: "Tasa de sondeo", valores: ["1.000 Hz", "1.000 Hz", "1.000 Hz"] },
];

/**
 * Ilustración estática de cómo funciona el comparador, para el hero de la página de inicio.
 * Los datos son fijos: la comparación real está en la feature comparador.
 */
export function VistaPreviaComparador() {
  return (
    <div className="card border-0 shadow vista-comparador">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-baseline mb-3">
          <h2 className="fs-6 fw-bold mb-0">Así se compara</h2>
          <span className="small text-secondary">Vista previa</span>
        </div>

        <ol className="list-unstyled d-flex flex-wrap gap-3 justify-content-between mb-3 small fw-semibold">
          {PASOS.map((paso, i) => (
            <li key={paso} className="d-flex align-items-center gap-2">
              <span className="vista-comparador-paso">{i + 1}</span>
              {paso}
            </li>
          ))}
        </ol>

        <div className="table-responsive border rounded-3">
          <table className="table table-sm small mb-0 align-middle vista-comparador-tabla">
            <thead>
              <tr>
                <th scope="col" className="bg-body-tertiary"></th>
                {PRODUCTOS.map((producto) => (
                  <th
                    key={producto.nombre}
                    scope="col"
                    className="bg-body-tertiary fw-semibold"
                  >
                    {producto.nombre}
                    <span className="d-block text-primary fw-bold">
                      {producto.precio}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FILAS.map((fila) => {
                const difieren = new Set(fila.valores).size > 1;
                return (
                  <tr key={fila.spec}>
                    <th scope="row" className="fw-semibold">
                      {fila.spec}
                    </th>
                    {fila.valores.map((valor, i) => {
                      const esMejor = fila.mejor === i;
                      const clases = [
                        difieren && "vista-comparador-difiere",
                        esMejor && "vista-comparador-mejor",
                      ]
                        .filter(Boolean)
                        .join(" ");
                      return (
                        <td key={i} className={clases}>
                          {valor}
                          {esMejor && " ★"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="small text-secondary mt-3 mb-0">
          Borde amarillo: la spec difiere entre productos. Verde con ★: mejor
          valor según la regla de cada spec.
        </p>
      </div>
    </div>
  );
}
