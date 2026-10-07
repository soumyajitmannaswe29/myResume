'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  ArrowRight,
  ArrowRightLeft,
  Check,
  CloudRain,
  Cpu,
  Layers,
  Sparkles,
  Sun,
  X,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Project } from '@/lib/portfolio-data'
import { playBlip } from '@/lib/sound-fx'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'architecture'>('demo')

  // Plant Disease AI state
  const [selectedLeaf, setSelectedLeaf] = useState(0)
  const [isInferring, setIsInferring] = useState(false)
  const [inferSuccess, setInferSuccess] = useState(false)

  // Weather state
  const [selectedCity, setSelectedCity] = useState<'kolkata' | 'tokyo' | 'san_francisco' | 'london'>('kolkata')

  // Currency Converter state
  const [amount, setAmount] = useState<number>(100)
  const [fromCurr, setFromCurr] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('USD')
  const [toCurr, setToCurr] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('INR')

  if (!project) return null

  const leafSamples = [
    {
      name: 'Tomato — Early Blight',
      pathogen: 'Alternaria solani',
      confidence: 97.4,
      symptoms: 'Concentric dark rings with yellow halos on lower foliage',
      remedy: 'Apply copper-based fungicide; increase spacing for air circulation.',
    },
    {
      name: 'Potato — Late Blight',
      pathogen: 'Phytophthora infestans',
      confidence: 95.8,
      symptoms: 'Irregular dark water-soaked lesions turning necrotic',
      remedy: 'Immediately remove infected leaves and apply chlorothalonil.',
    },
    {
      name: 'Apple — Healthy Leaf',
      pathogen: 'None (Healthy)',
      confidence: 99.4,
      symptoms: 'Vibrant chlorophyll distribution, intact cuticle',
      remedy: 'Optimal growth conditions. Maintain standard irrigation schedule.',
    },
    {
      name: 'Corn — Common Rust',
      pathogen: 'Puccinia sorghi',
      confidence: 93.6,
      symptoms: 'Cinnamon-brown pustules scattered across both leaf surfaces',
      remedy: 'Deploy resistant hybrids; apply foliar triazole if lesion threshold > 10%.',
    },
  ]

  const weatherData = {
    kolkata: { city: 'Kolkata, WB', temp: '29°C', condition: 'Thunderstorm / Hazy', humidity: '82%', wind: '14 km/h', uv: 'Moderate' },
    tokyo: { city: 'Tokyo, JP', temp: '18°C', condition: 'Partly Cloudy', humidity: '58%', wind: '11 km/h', uv: 'Low' },
    san_francisco: { city: 'San Francisco, US', temp: '15°C', condition: 'Pacific Mist / Cool', humidity: '76%', wind: '22 km/h', uv: 'Moderate' },
    london: { city: 'London, UK', temp: '13°C', condition: 'Light Overcast Rain', humidity: '88%', wind: '17 km/h', uv: 'Low' },
  }

  const exchangeRates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.78,
    INR: 86.85,
  }

  function handleRunInference() {
    setIsInferring(true)
    setInferSuccess(false)
    playBlip(750, 0.08, 'sine')
    setTimeout(() => {
      setIsInferring(false)
      setInferSuccess(true)
      playBlip(880, 0.1, 'triangle')
    }, 900)
  }

  function swapCurrencies() {
    const temp = fromCurr
    setFromCurr(toCurr)
    setToCurr(temp)
    playBlip(540, 0.05, 'sine')
  }

  const convertedValue = ((amount / exchangeRates[fromCurr]) * exchangeRates[toCurr]).toFixed(2)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-[#090e17] p-6 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] sm:p-8"
        >
          {/* Top header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mint">
                <Sparkles className="size-3" />
                <span>Interactive Architecture Lab</span>
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{project.title}</h2>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{project.category}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-muted-foreground transition-colors hover:border-mint/40 hover:text-white"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation tabs */}
          <div className="mt-6 flex gap-2 border-b border-white/10 pb-3" role="tablist">
            <button
              type="button"
              onClick={() => {
                setActiveTab('demo')
                playBlip(550, 0.05, 'sine')
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'demo'
                  ? 'border border-mint/40 bg-mint/15 font-semibold text-mint shadow-[0_0_16px_-4px_rgba(0,245,160,0.5)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Zap className="size-3.5" />
              Live Interactive Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('architecture')
                playBlip(550, 0.05, 'sine')
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === 'architecture'
                  ? 'border border-mint/40 bg-mint/15 font-semibold text-mint shadow-[0_0_16px_-4px_rgba(0,245,160,0.5)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="size-3.5" />
              System Architecture
            </button>
          </div>

          {/* TAB 1: INTERACTIVE DEMOS */}
          {activeTab === 'demo' && (
            <div className="mt-6 space-y-6">
              {/* Plant Disease Demo */}
              {project.title.includes('Plant') && (
                <div className="space-y-5">
                  <div>
                    <label className="font-mono text-xs text-muted-foreground">
                      Select Leaf Specimen for Inference:
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {leafSamples.map((leaf, i) => (
                        <button
                          key={leaf.name}
                          type="button"
                          onClick={() => {
                            setSelectedLeaf(i)
                            setInferSuccess(false)
                            playBlip(620, 0.04, 'sine')
                          }}
                          className={`rounded-xl border p-2.5 text-left text-xs transition-all ${
                            selectedLeaf === i
                              ? 'border-mint bg-mint/10 text-mint shadow-[0_0_15px_-4px_rgba(0,245,160,0.5)]'
                              : 'border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/20'
                          }`}
                        >
                          <div className="font-medium text-foreground">{leaf.name.split(' — ')[0]}</div>
                          <div className="truncate text-[10px] text-muted-foreground">{leaf.name.split(' — ')[1]}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Active Specimen
                        </div>
                        <div className="font-display text-lg font-bold text-foreground">
                          {leafSamples[selectedLeaf].name}
                        </div>
                        <div className="font-mono text-xs text-cyan-neon">
                          Pathogen: {leafSamples[selectedLeaf].pathogen}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRunInference}
                        disabled={isInferring}
                        className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-2.5 font-mono text-xs font-bold text-primary-foreground shadow-[0_0_24px_rgba(0,245,160,0.7)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        <Cpu className={`size-4 ${isInferring ? 'animate-spin' : ''}`} />
                        {isInferring ? 'Processing Tensors...' : 'Run CNN Inference'}
                      </button>
                    </div>

                    {/* Inference Pipeline status */}
                    <div className="mt-5 grid grid-cols-4 gap-2 border-y border-white/10 py-3 text-center font-mono text-[10px]">
                      <div className="text-muted-foreground">
                        <div className="text-mint">CONV2D</div>
                        32 filters (3x3)
                      </div>
                      <div className="text-muted-foreground">
                        <div className="text-mint">MAXPOOL</div>
                        2x2 Stride
                      </div>
                      <div className="text-muted-foreground">
                        <div className="text-mint">DROPOUT</div>
                        0.25 rate
                      </div>
                      <div className="text-muted-foreground">
                        <div className="text-cyan-neon">SOFTMAX</div>
                        Probability map
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Model Diagnostic Confidence:</span>
                        <span className="font-mono font-bold text-mint">
                          {isInferring ? '--.-%' : `${leafSamples[selectedLeaf].confidence}%`}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-mint to-cyan-neon transition-all duration-700"
                          style={{
                            width: isInferring ? '30%' : `${leafSamples[selectedLeaf].confidence}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-mint/20 bg-mint/[0.04] p-3 text-xs">
                      <div className="font-semibold text-mint">Pathological Assessment & Action:</div>
                      <div className="mt-1 text-muted-foreground">{leafSamples[selectedLeaf].remedy}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Demo */}
              {project.title.includes('Weather') && (
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {(['kolkata', 'tokyo', 'san_francisco', 'london'] as const).map((cityKey) => (
                      <button
                        key={cityKey}
                        type="button"
                        onClick={() => {
                          setSelectedCity(cityKey)
                          playBlip(600, 0.04, 'sine')
                        }}
                        className={`rounded-xl border px-3.5 py-2 font-mono text-xs transition-all ${
                          selectedCity === cityKey
                            ? 'border-cyan-neon bg-cyan-neon/15 text-cyan-neon shadow-[0_0_15px_-4px_rgba(6,182,212,0.5)]'
                            : 'border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/20'
                        }`}
                      >
                        {weatherData[cityKey].city}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c1322] to-[#070b14] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-xs text-muted-foreground">Live Telemetry</div>
                        <div className="font-display text-3xl font-bold">{weatherData[selectedCity].city}</div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-cyan-neon">
                          <CloudRain className="size-4" />
                          {weatherData[selectedCity].condition}
                        </div>
                      </div>
                      <div className="font-display text-5xl font-extrabold text-foreground">
                        {weatherData[selectedCity].temp}
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 font-mono text-xs">
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                        <div className="text-muted-foreground">Relative Humidity</div>
                        <div className="mt-1 font-bold text-mint">{weatherData[selectedCity].humidity}</div>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                        <div className="text-muted-foreground">Wind Velocity</div>
                        <div className="mt-1 font-bold text-cyan-neon">{weatherData[selectedCity].wind}</div>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
                        <div className="text-muted-foreground">UV Exposure</div>
                        <div className="mt-1 font-bold text-foreground">{weatherData[selectedCity].uv}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Currency Demo */}
              {project.title.includes('Currency') && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Real-Time Foreign Exchange Calculator
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-5 sm:items-center">
                      <div className="sm:col-span-2">
                        <label className="block font-mono text-xs text-muted-foreground">Amount &amp; Source</label>
                        <div className="mt-1.5 flex gap-2">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm font-bold text-foreground outline-none focus:border-mint"
                          />
                          <select
                            value={fromCurr}
                            onChange={(e) => setFromCurr(e.target.value as 'USD' | 'EUR' | 'GBP' | 'INR')}
                            className="rounded-xl border border-white/10 bg-[#090e17] px-3 py-2 font-mono text-sm text-mint outline-none"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="INR">INR</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-center sm:col-span-1">
                        <button
                          type="button"
                          onClick={swapCurrencies}
                          className="rounded-full border border-white/15 bg-white/5 p-2 text-muted-foreground transition-colors hover:border-mint/50 hover:text-mint"
                          title="Swap currencies"
                        >
                          <ArrowRightLeft className="size-4" />
                        </button>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-mono text-xs text-muted-foreground">Target Currency</label>
                        <div className="mt-1.5 flex items-center justify-between rounded-xl border border-mint/30 bg-mint/[0.04] px-4 py-2">
                          <span className="font-mono text-lg font-bold text-mint">{convertedValue}</span>
                          <select
                            value={toCurr}
                            onChange={(e) => setToCurr(e.target.value as 'USD' | 'EUR' | 'GBP' | 'INR')}
                            className="rounded-xl border border-white/10 bg-[#090e17] px-3 py-1 font-mono text-sm text-mint outline-none"
                          >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-3 text-right font-mono text-[11px] text-muted-foreground">
                      Rate: 1 {fromCurr} = {(exchangeRates[toCurr] / exchangeRates[fromCurr]).toFixed(4)} {toCurr} ·
                      Instant cached conversion
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ARCHITECTURE DEEP DIVE */}
          {activeTab === 'architecture' && (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                  <Activity className="size-4 text-mint" />
                  Technical Architectural Blueprint
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

                <div className="mt-5 space-y-2">
                  <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Core Engineering Highlights
                  </div>
                  <ul className="space-y-2">
                    {project.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-xs text-foreground sm:text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-mint" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Implemented Technology Stack
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-mint/20 bg-mint/5 px-3 py-1 font-mono text-xs text-mint"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
            >
              Inspect Source on GitHub <ArrowRight className="size-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 px-5 py-2 font-mono text-xs font-semibold text-foreground transition-colors hover:bg-white/20"
            >
              Close Lab
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
