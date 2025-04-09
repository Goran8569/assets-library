import AssetsLibrary from "./components/AssetsLibrary";
import { AssetsProvider } from "./context/AssetsContext";

function App() {
  return (
    <AssetsProvider>
      <AssetsLibrary />
    </AssetsProvider>
  );
}

export default App;
