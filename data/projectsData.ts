interface Project {
  title: string
  description: string
  techStack: string[]
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Enterprise Banking Platform',
    description:
      'Led frontend architecture for a banking platform used across customer onboarding, account servicing, and internal operations.',
    techStack: ['React', 'TypeScript', 'Design Systems', 'Microfrontends'],
    imgSrc: '/static/images/google.png',
    href: 'https://github.com/dohuy91',
  },
  {
    title: 'Developer Productivity Toolkit',
    description:
      'A collection of internal tooling and workflow experiments focused on documentation quality, automation, and team velocity.',
    techStack: ['Node.js', 'CLI', 'Automation', 'Developer Experience'],
    imgSrc: '/static/images/time-machine.jpg',
    href: 'https://github.com/dohuy91',
  },
]

export default projectsData
