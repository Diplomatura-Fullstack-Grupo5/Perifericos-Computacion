import { RouterProvider } from "react-router";
import { router } from "./router";
import { ComparadorProvider } from "../features/comparador";

function App() {
  return (
    <ComparadorProvider>
      <RouterProvider router={router} />
    </ComparadorProvider>
  );
}

export default App;
