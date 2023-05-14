// Copyright (c) 2023 DevDane <dane@danecwalker.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createRef, useEffect, useState } from "react"

const boilerCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style>
  </style>
</head>
<body>
</body>
</html>`

const keymap: {
  [key: string]: string
} = {
  "h": "left",
  "j": "down",
  "k": "up",
  "l": "right",
  "x": "select_line"
}

const Editor = () => {
  const lines = boilerCode.split("\n")
  const [cursor, setCursor] = useState({ x: 0, y: 0, barType: 'block' })
  const cursorRef = createRef<HTMLDivElement>()

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key
    if (keymap[key]) {
      event.preventDefault()
      if (keymap[key] === "left") {
        let x = cursor.x
        let y = cursor.y
        
        if (cursor.x > 0) {
          x = cursor.x - 1
        } else if (cursor.y > 0) {
          y = cursor.y - 1
          x = lines[cursor.y - 1].length - 1
        }
        setCursor({ ...cursor, x, y })
      } else if (keymap[key] === "right") {
        let x = cursor.x
        let y = cursor.y
        if (cursor.x < lines[cursor.y].length - 1) {
          x = cursor.x + 1
        } else if (cursor.y < lines.length - 1) {
          y = cursor.y + 1
          x = 0
        }
        setCursor({ ...cursor, x, y })
      } else if (keymap[key] === "up") {
        let x = cursor.x
        let y = cursor.y
        if (cursor.y > 0) {
          y = cursor.y - 1
          if (cursor.x > lines[cursor.y - 1].length - 1) {
            x = lines[cursor.y - 1].length - 1
          }
        }
        setCursor({ ...cursor, x, y })
      } else if (keymap[key] === "down") {
        let x = cursor.x
        let y = cursor.y
        if (cursor.y < lines.length - 1) {
          y = cursor.y + 1
          if (cursor.x > lines[cursor.y + 1].length - 1) {
            x = lines[cursor.y + 1].length - 1
          }
        }
        setCursor({ ...cursor, x, y })
      } else if (keymap[key] === "select_line") {
        const line = document.getElementById(`${cursor.y}`)
        if (line) {
          const t = line.textContent?.length || 1
          setCursor({ ...cursor, x: (t - 1), y: cursor.y, barType: 'underline' })
        }
      }
    }
  }

  useEffect(() => {
    const cursorElement = cursorRef.current
    if (cursorElement) {
      cursorElement.style.top = `${cursor.y * 1.5}rem`
      cursorElement.style.left = `${cursor.x}ch`
    }
  }, [cursor, cursorRef])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  })

  return (
    <div className="flex bg-slate-600 text-white font-mono">
      <div className="relative flex-1">
        <div ref={cursorRef} id="cursor" className={`absolute w-[1ch] bg-white mix-blend-difference ${cursor.barType === 'block' ? "h-[1.5rem]" : "h-1 translate-y-[1.25rem]"}`}>&nbsp;</div>
        {
          lines.map((line, index) => {
            return (
              <pre key={index} id={`${index}`} className="w-full h-6">
                {line}
              </pre>
            )
          })
        }
      </div>
    </div>
  )
}

export default Editor