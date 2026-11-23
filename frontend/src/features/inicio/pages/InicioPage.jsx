import { useEffect, useState } from "react";
import { HeroInicio } from "../components/HeroInicio";
import { CategoriasDestacadas } from "../components/CategoriasDestacadas";
import { MasVendidos } from "../components/MasVendidos";
import { obtenerMasVendidos } from "../services/inicioService";
import { obtenerCategorias } from "../../catalogo";
import { Spinner } from "../../../shared/components/atoms/Spinner";

export function InicioPage() {
  const [datos, setDatos] = useState({
    categorias: [],
    masVendidos: [],
    cargando: true,
    error: null,
  });

  useEffect(() => {
    let ignoreResponse = false;

    Promise.all([obtenerCategorias(), obtenerMasVendidos({ limite: 8 })])
      .then(([categorias, masVendidos]) => {
        if (!ignoreResponse) {
          setDatos({ categorias, masVendidos, cargando: false, error: null });
        }
      })
      .catch((err) => {
        if (ignoreResponse) return;
        console.error("Error al cargar la página de inicio:", err);
        setDatos({
          categorias: [],
          masVendidos: [],
          cargando: false,
          error: "No se pudieron cargar los productos. Por favor, inténtalo de nuevo.",
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
          <CategoriasDestacadas categorias={datos.categorias} />
          <MasVendidos productos={datos.masVendidos} />
        </>
      )}
    </div>
  );
}
