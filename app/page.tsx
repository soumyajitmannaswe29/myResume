import { AboutBento } from '@/components/portfolio/about-bento'
import { Background3D } from '@/components/portfolio/background-3d'
import { Contact } from '@/components/portfolio/contact'
import { CursorGlow, ScrollProgress } from '@/components/portfolio/cursor-glow'
import { Education } from '@/components/portfolio/education'
import { Footer } from '@/components/portfolio/footer'
import { Hero } from '@/components/portfolio/hero'
import { Marquee } from '@/components/portfolio/marquee'
import { Navbar } from '@/components/portfolio/navbar'
import { Projects } from '@/components/portfolio/projects'
import { Skills } from '@/components/portfolio/skills'
import { Terminal } from '@/components/portfolio/terminal'
import { ThreeHud } from '@/components/portfolio/three-hud'

export default function Page() {
  return (
    <>
      <Background3D />
      <ThreeHud />
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <Marquee />
        <AboutBento />
        <Education />
        <Projects />
        <Skills />
        <Terminal />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
