import HeroSection from '../components/home/HeroSection'
import StatsSection from '../components/home/StatsSection'
import FeaturedVehicles from '../components/home/FeaturedVehicles'
import WhyChooseUs from '../components/home/WhyChooseUs'
import VehicleCategories from '../components/home/VehicleCategories'
import Testimonials from '../components/home/Testimonials'
import CTASection from '../components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedVehicles />
      <WhyChooseUs />
      <VehicleCategories />
      <Testimonials />
      <CTASection />
    </>
  )
}
