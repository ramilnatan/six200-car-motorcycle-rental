import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.05 }
    )

    function observe(el: Element) {
      if (!el.classList.contains('visible')) io.observe(el)
    }

    // Observe all currently-mounted reveal elements
    document.querySelectorAll('.reveal').forEach(observe)

    // Watch for elements added later (async-loaded cards, etc.)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            if (node.classList.contains('reveal')) observe(node)
            node.querySelectorAll('.reveal').forEach(observe)
          }
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
