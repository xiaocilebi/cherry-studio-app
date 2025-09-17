import React from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  Copyright,
  Github,
  Globe,
  Languages,
  LucideIcon,
  Mail,
  MessageSquareMore,
  Rocket,
  Rss,
  Settings2
} from 'lucide-react-native'
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

interopIcon(ArrowLeft)
interopIcon(ArrowUpRight)
interopIcon(ChevronDown)
interopIcon(Copyright)
interopIcon(Github)
interopIcon(Globe)
interopIcon(Languages)
interopIcon(Mail)
interopIcon(MessageSquareMore)
interopIcon(Rocket)
interopIcon(Rss)
interopIcon(Settings2)

function withDefaultIconClass<T extends LucideIcon>(Icon: T): T {
  const Wrapped = (({ className, ...props }: any) => (
    <Icon className={cn('text-black dark:text-white', className)} {...props} />
  )) as unknown as T
  return Wrapped
}

const ArrowLeftIcon = withDefaultIconClass(ArrowLeft)
const ArrowUpRightIcon = withDefaultIconClass(ArrowUpRight)
const ChevronDownIcon = withDefaultIconClass(ChevronDown)
const CopyrightIcon = withDefaultIconClass(Copyright)
const GithubIcon = withDefaultIconClass(Github)
const GlobeIcon = withDefaultIconClass(Globe)
const LanguagesIcon = withDefaultIconClass(Languages)
const MailIcon = withDefaultIconClass(Mail)
const MessageSquareMoreIcon = withDefaultIconClass(MessageSquareMore)
const RocketIcon = withDefaultIconClass(Rocket)
const RssIcon = withDefaultIconClass(Rss)
const Settings2Icon = withDefaultIconClass(Settings2)

export {
  ArrowLeftIcon as ArrowLeft,
  ArrowUpRightIcon as ArrowUpRight,
  ChevronDownIcon as ChevronDown,
  CopyrightIcon as Copyright,
  GithubIcon as Github,
  GlobeIcon as Globe,
  LanguagesIcon as Languages,
  MailIcon as Mail,
  MessageSquareMoreIcon as MessageSquareMore,
  RocketIcon as Rocket,
  RssIcon as Rss,
  Settings2Icon as Settings2
}
