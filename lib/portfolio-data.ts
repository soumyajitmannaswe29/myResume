export const profile = {
  name: 'Soumyajit Manna',
  role: 'AI/ML Engineer & Full-Stack Java Developer',
  status: 'Available for High-Impact Internships & Collaborations',
  location: 'Khanakul, Hooghly, West Bengal – PIN 712406',
  shortLocation: 'Hooghly, West Bengal 712406',
  phone: '+91 8888888888',
  phoneHref: 'tel:+918888888888',
  email: 'soumyajit.manna@example.com',
  github: 'https://github.com/soumyajitmanna',
  linkedin: 'https://linkedin.com/in/soumyajitmanna',
  leetcode: 'https://leetcode.com/u/soumyajitmanna',
  resume: '/resume.pdf',
  timezone: 'Asia/Kolkata',
}

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Terminal', href: '#terminal' },
  { label: 'Contact', href: '#contact' },
]

export const education: {
  institute: string
  period: string
  degree: string
  highlight?: string
  cgpa?: number
  current?: boolean
}[] = [
  {
    institute: 'Institute of Engineering & Management (IEM), Kolkata',
    period: '2025 – 2029',
    degree: 'B.Tech in Computer Science & Engineering (2nd Year)',
    highlight: 'CGPA: 8.0 / 10.0',
    cgpa: 8.0,
    current: true,
  },
  {
    institute: 'Arambagh High School',
    period: '2024 – 2025',
    degree: 'Higher Secondary (Classes 11 & 12)',
  },
  {
    institute: 'Sekendarpur High School',
    period: '2023',
    degree: 'Secondary School (Class 10)',
  },
]

export type Project = {
  title: string
  category: string
  description: string
  stack: string[]
  highlights: string[]
  image: string
  github: string
  demo: string
}

export const projects: Project[] = [
  {
    title: 'Plant Disease Detection AI',
    category: 'Deep Learning / Computer Vision',
    description:
      'Convolutional Neural Network trained to classify leaf pathologies with high accuracy, enabling real-time agricultural diagnostics.',
    stack: ['Python', 'CNN', 'NumPy', 'Matplotlib', 'Seaborn', 'OpenCV/PIL'],
    highlights: [
      'Stacked conv + pooling blocks with dropout regularisation',
      'Image preprocessing & augmentation pipeline',
      'Confusion-matrix driven model evaluation',
    ],
    image: '/images/project-plant.png',
    github: 'https://github.com/soumyajitmanna',
    demo: '#contact',
  },
  {
    title: 'Real-time Weather Intelligence',
    category: 'Frontend & API Integration',
    description:
      'Dynamic weather dashboard featuring geolocation tracking, multi-day forecasting, and atmospheric UI transitions.',
    stack: ['JavaScript ES6+', 'OpenWeather API', 'Tailwind CSS', 'Async/Await'],
    highlights: [
      'Browser geolocation with city search fallback',
      'Multi-day forecast aggregation',
      'Condition-driven dynamic theming',
    ],
    image: '/images/project-weather.png',
    github: 'https://github.com/soumyajitmanna',
    demo: '#contact',
  },
  {
    title: 'Global Currency Exchange Engine',
    category: 'Financial Web Utility',
    description:
      'High-speed currency conversion tool with live forex rate ingestion and a responsive conversion calculator.',
    stack: ['JavaScript', 'ExchangeRate-API', 'CSS Grid', 'Local Caching'],
    highlights: [
      'Live forex rate ingestion for 150+ currencies',
      'Cached rates for instant repeat conversions',
      'Swap, search & responsive calculator UX',
    ],
    image: '/images/project-currency.png',
    github: 'https://github.com/soumyajitmanna',
    demo: '#contact',
  },
]

export type SkillCategory = 'ai' | 'java' | 'web'

export const skillFilters: { id: 'all' | SkillCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI / ML / Data' },
  { id: 'java', label: 'Core Java & DSA' },
  { id: 'web', label: 'Web & APIs' },
]

export const skills: { name: string; level: number; category: SkillCategory; note: string }[] = [
  { name: 'Java', level: 88, category: 'java', note: 'OOP, Collections, DSA' },
  { name: 'Data Structures & Algorithms', level: 84, category: 'java', note: 'Trees, Graphs, DP' },
  { name: 'SQL', level: 75, category: 'java', note: 'Joins, Aggregations' },
  { name: 'Git & GitHub', level: 82, category: 'java', note: 'Branching, PR workflow' },
  { name: 'Linux Shell', level: 70, category: 'java', note: 'Scripting, tooling' },
  { name: 'Python', level: 86, category: 'ai', note: 'Scientific computing' },
  { name: 'Deep Learning (CNNs)', level: 80, category: 'ai', note: 'Computer vision' },
  { name: 'Machine Learning', level: 78, category: 'ai', note: 'Supervised algorithms' },
  { name: 'NumPy', level: 85, category: 'ai', note: 'Vectorised ops' },
  { name: 'Pandas', level: 82, category: 'ai', note: 'Data wrangling' },
  { name: 'Matplotlib', level: 80, category: 'ai', note: 'Visualisation' },
  { name: 'Seaborn', level: 78, category: 'ai', note: 'Statistical plots' },
  { name: 'Model Evaluation', level: 76, category: 'ai', note: 'Metrics & validation' },
  { name: 'JavaScript (ES6+)', level: 82, category: 'web', note: 'Async, DOM, modules' },
  { name: 'HTML5', level: 90, category: 'web', note: 'Semantic markup' },
  { name: 'CSS / Tailwind', level: 85, category: 'web', note: 'Responsive systems' },
  { name: 'REST APIs', level: 80, category: 'web', note: 'Fetch, integration' },
]

export const metrics = [
  { value: '8.0', label: 'CGPA' },
  { value: '3+', label: 'Production Projects' },
  { value: '100%', label: 'Passion for AI' },
]
