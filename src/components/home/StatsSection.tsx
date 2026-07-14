import { useEffect, useRef, useState } from 'react'
import { useCounter } from '../../hooks/useCounter'

const stats = [
  { value:500, suffix:'+', label:'Happy Customers' },
  { value:10, suffix:'+', label:'Premium Vehicles' },
  { value:24,  suffix:'/7', label:'Customer Support' },
  { value:5,   suffix:'★', label:'Customer Satisfaction' },
]

function StatCounter({ stat }: { stat: typeof stats[0] }) {
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCounter(stat.value, 2000, started)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className="text-center">
      <div className="flex items-baseline justify-center gap-0.5">
        <span className="text-4xl lg:text-5xl font-black text-[#111111] font-display">{count}</span>
        <span className="text-2xl lg:text-3xl font-black text-primary-600 font-display">{stat.suffix}</span>
      </div>
      <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
    </div>
  )
}

export default function StatsSection() {
  return (
    <section className="bg-white border-b border-[#F0F0F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s) => <StatCounter key={s.label} stat={s} />)}
        </div>
      </div>
    </section>
  )
}
