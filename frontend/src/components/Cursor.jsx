import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const moveCursor = (e) => {
      if (dot.current) {
        dot.current.style.left = e.clientX + 'px'
        dot.current.style.top = e.clientY + 'px'
      }
      if (ring.current) {
        ring.current.style.left = e.clientX + 'px'
        ring.current.style.top = e.clientY + 'px'
      }
    }

    const addHover = () => {
      dot.current?.classList.add('hovered')
      ring.current?.classList.add('hovered')
    }
    const removeHover = () => {
      dot.current?.classList.remove('hovered')
      ring.current?.classList.remove('hovered')
    }

    window.addEventListener('mousemove', moveCursor)
    document.querySelectorAll('button, a, [role="button"], input, select').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    const obs = new MutationObserver(() => {
      document.querySelectorAll('button, a, [role="button"], input, select').forEach(el => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })
    })
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  )
}
