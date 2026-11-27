import { RouterProvider } from "react-router";
import { router } from "./router";
import { ComparadorProvider } from "../features/comparador";
import { CarritoProvider } from "../features/carrito";

function App() {
  return (
    <ComparadorProvider>
      <CarritoProvider>
        <RouterProvider router={router} />
      </CarritoProvider>
    </ComparadorProvider>
  );
}

export default App;
