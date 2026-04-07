import Image from './Image'
import Link from './Link'

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
  techStack?: string[]
}

const Card = ({ title, description, imgSrc, href, techStack = [] }: CardProps) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${
        imgSrc && 'h-full'
      } overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] dark:border-stone-800 dark:bg-stone-950/80`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-2xl leading-8 font-bold tracking-tight">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {techStack.map((item) => (
            <span
              key={item}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600 dark:bg-stone-900 dark:text-stone-300"
            >
              {item}
            </span>
          ))}
        </div>
        {href && (
          <Link
            href={href}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-base leading-6 font-medium"
            aria-label={`Link to ${title}`}
          >
            Learn more &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
