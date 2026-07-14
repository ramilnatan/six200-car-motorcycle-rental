import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const categories = [
  { id:'sedan',   label:'Sedan',      type:'car',        image:'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=600', desc:'Comfortable city & business travel' },
  { id:'suv',     label:'SUV',        type:'car',        image:'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=600', desc:'Spacious family & adventure trips' },
  { id:'van',     label:'Van',        type:'car',        image:'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=600', desc:'Group travel & airport transfers' },
  { id:'pickup',  label:'Pickup',     type:'car',        image:'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=600', desc:'Off-road & cargo-ready workhorses' },
  { id:'luxury',  label:'Luxury',     type:'car',        image:'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600',   desc:'Premium executive experience' },
  { id:'scooter', label:'Scooter',    type:'motorcycle', image:'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg?auto=compress&cs=tinysrgb&w=600', desc:'Easy city navigation' },
  { id:'sport',   label:'Sport Bike', type:'motorcycle', image:'https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg?auto=compress&cs=tinysrgb&w=600', desc:'High-performance thrills' },
  { id:'adventure',label:'Adventure', type:'motorcycle', image:'https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=600', desc:'Off-road exploration' },
]

export default function VehicleCategories() {
  return (
    <section className="bg-[#F7F7F7] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 reveal">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">Browse by Type</p>
          <h2 className="section-heading">Popular Categories</h2>
          <p className="section-subheading mt-3">From city sedans to adventure motorcycles — find the perfect vehicle for your journey.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <div key={cat.id} className={`reveal reveal-delay-${Math.min((i%4+1)*100,400)}`}>
              <motion.div
                initial="rest"
                animate="rest"
                whileHover="hover"
                variants={{
                  rest: { y: 0, scale: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
                  hover: {
                    y: -12,
                    scale: 1.04,
                    boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(14,128,239,0.2)',
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                style={{ willChange: 'transform' }}
              >
                <Link to={`/vehicles?type=${cat.type}&category=${cat.id}`} className="block w-full h-full">
                  <motion.img
                    src={cat.image} alt={cat.label} loading="lazy"
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.1, transition: { duration: 0.5, ease: 'easeOut' } },
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <motion.div
                    variants={{
                      rest: { opacity: 1 },
                      hover: { opacity: 1, transition: { duration: 0.3 } },
                    }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"
                  />
                  {/* Gradient overlay - blue tint on hover */}
                  <motion.div
                    variants={{
                      rest: { opacity: 0 },
                      hover: { opacity: 1, transition: { duration: 0.4 } },
                    }}
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent"
                  />
                  {/* Shimmer sweep */}
                  <motion.div
                    variants={{
                      rest: { x: '-150%', opacity: 0 },
                      hover: { x: '150%', opacity: 1, transition: { duration: 0.7, ease: 'easeInOut' } },
                    }}
                    className="pointer-events-none absolute inset-0 z-10"
                    style={{
                      background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)',
                      width: '60%',
                      height: '100%',
                    }}
                  />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <motion.span
                      variants={{ rest: { color: 'rgba(255,255,255,0.6)' }, hover: { color: 'rgba(255,255,255,0.8)', transition: { duration: 0.3 } } }}
                      className="text-xs font-medium mb-0.5"
                    >
                      {cat.type === 'car' ? 'Car' : 'Motorcycle'}
                    </motion.span>
                    <motion.h3
                      variants={{
                        rest: { color: '#ffffff' },
                        hover: { color: '#7cc0ff', transition: { duration: 0.3 } },
                      }}
                      className="font-bold text-base leading-tight"
                    >
                      {cat.label}
                    </motion.h3>
                    <motion.p
                      variants={{
                        rest: { y: 0, opacity: 0.6 },
                        hover: { y: -3, opacity: 0.9, transition: { duration: 0.35, ease: 'easeOut' } },
                      }}
                      className="text-xs mt-0.5 text-white"
                    >
                      {cat.desc}
                    </motion.p>
                    <motion.span
                      variants={{
                        rest: { opacity: 0, y: 5 },
                        hover: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
                      }}
                      className="mt-2 text-xs text-white font-semibold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm w-fit"
                    >
                      Browse →
                    </motion.span>
                  </div>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
