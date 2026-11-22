import { Outlet } from "react-router";

/**
 * Estructura común de las páginas públicas.
 */
export function LayoutPublico() {
  return (
    <>
      {/* TODO: reemplazar por el Navbar de shared/components/organisms */}
      <main>
        <Outlet />
      </main>
    </>
  );
}
