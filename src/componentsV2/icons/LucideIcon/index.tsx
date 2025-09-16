import React from 'react'
import { ArrowUpRight, Copyright, Github, Globe, LucideIcon, Mail, Rss } from 'lucide-react-native'
import { cssInterop } from 'nativewind'
import { cn } from '../../utils'

function interopIcon(icon: LucideIcon) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true
      }
    }
  })
}

interopIcon(ArrowUpRight)
interopIcon(Copyright)
interopIcon(Github)
interopIcon(Globe)
interopIcon(Mail)
interopIcon(Rss)

function withDefaultIconClass<T extends LucideIcon>(Icon: T): T {
  const Wrapped = (({ className, ...props }: any) => (
    <Icon className={cn('text-black dark:text-white', className)} {...props} />
  )) as unknown as T
  return Wrapped
}

const ArrowUpRightIcon = withDefaultIconClass(ArrowUpRight)
const CopyrightIcon = withDefaultIconClass(Copyright)
const GithubIcon = withDefaultIconClass(Github)
const GlobeIcon = withDefaultIconClass(Globe)
const MailIcon = withDefaultIconClass(Mail)
const RssIcon = withDefaultIconClass(Rss)

export {
  ArrowUpRightIcon as ArrowUpRight,
  CopyrightIcon as Copyright,
  GithubIcon as Github,
  GlobeIcon as Globe,
  MailIcon as Mail,
  RssIcon as Rss
}
