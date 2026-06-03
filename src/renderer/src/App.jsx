import ComponentePrueba from "./components/ComponentePrueba"


function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <ComponentePrueba></ComponentePrueba>
    </>
  )
}

export default App
