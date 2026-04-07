import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  const socialLinks = [
    { kind: 'github', href: siteMetadata.github },
    { kind: 'linkedin', href: siteMetadata.linkedin },
    { kind: 'mail', href: siteMetadata.email ? `mailto:${siteMetadata.email}` : '' },
  ].filter((item): item is { kind: 'github' | 'linkedin' | 'mail'; href: string } =>
    Boolean(item.href)
  )

  return (
    <footer>
      <div className="mt-16 border-t border-stone-200/80 pt-8 dark:border-stone-800">
        <div className="mb-3 flex items-center justify-center space-x-4">
          {socialLinks.map((item) => (
            <SocialIcon key={item.kind} kind={item.kind} href={item.href} size={6} />
          ))}
        </div>
        <div className="mb-6 flex justify-center space-x-2 text-sm text-stone-500 dark:text-stone-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
