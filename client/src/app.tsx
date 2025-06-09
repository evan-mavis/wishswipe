import { ThemeProvider } from "./components/themeProvider/ThemeProvider";
import Home from "./pages/home/Home";

function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}

export default App;
