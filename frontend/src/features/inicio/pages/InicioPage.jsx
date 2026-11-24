import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router";
import { HeroInicio } from "../components/HeroInicio";
import { CategoriasDestacadas } from "../components/CategoriasDestacadas";
import { MasVendidos } from "../components/MasVendidos";
import { obtenerMasVendidos } from "../services/inicioService";
import { Spinner } from "../../../shared/components/atoms/Spinner";

/**
 * Página de inicio: hero, accesos por categoría y productos más vendidos.
 * Las categorías vienen del loader del layout público (ruta "publico"), así no se piden dos veces.
 * @returns {JSX.Element}
 */
export function InicioPage() {
  const { categorias } = useRouteLoaderData("publico");
  const [datos, setDatos] = useState({
    masVendidos: [],
    cargando: true,
    error: null,
  });

  useEffect(() => {
    let ignoreResponse = false;

    obtenerMasVendidos({ limite: 8 })
      .then((masVendidos) => {
        if (!ignoreResponse) {
          setDatos({ masVendidos, cargando: false, error: null });
        }
      })
      .catch((err) => {
        if (ignoreResponse) return;
        console.error("Error al cargar la página de inicio:", err);
        setDatos({
          masVendidos: [],
          cargando: false,
          error: "No se pudieron cargar los productos. Por favor, intentá de nuevo.",
        });
      });

    return () => {
      ignoreResponse = true;
    };
  }, []);

  return (
    <div className="bg-body-tertiary">
      <HeroInicio />

      {datos.cargando && <Spinner />}

      {datos.error && (
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {datos.error}
          </div>
        </div>
      )}

      {!datos.cargando && !datos.error && (
        <>
          <CategoriasDestacadas categorias={categorias} />
          <MasVendidos productos={datos.masVendidos} />
        </>
      )}
    </div>
  );
}
