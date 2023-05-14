import { useEffect, useRef } from "react"
import Editor from "./components/Editor"

function App() {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    spanRef.current?.focus()
  }, [])
  return (
    <div className="w-full h-screen">
      <Editor />
    </div>
  )
}

export default App
