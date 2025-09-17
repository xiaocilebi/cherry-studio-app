import React from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  ChevronDown,
  Cloud,
  Copyright,
  Github,
  Globe,
  HardDrive,
  Info,
  Languages,
  CircleUserRound,
  LucideIcon,
  Mail,
  MessageSquareMore,
  Package,
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
interopIcon(Camera)
interopIcon(ChevronDown)
interopIcon(CircleUserRound)
interopIcon(Cloud)
interopIcon(Copyright)
interopIcon(Github)
interopIcon(Globe)
interopIcon(HardDrive)
interopIcon(Info)
interopIcon(Languages)
interopIcon(Mail)
interopIcon(MessageSquareMore)
interopIcon(Package)
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
const CameraIcon = withDefaultIconClass(Camera)
const ChevronDownIcon = withDefaultIconClass(ChevronDown)
const CloudIcon = withDefaultIconClass(Cloud)
const CopyrightIcon = withDefaultIconClass(Copyright)
const GithubIcon = withDefaultIconClass(Github)
const GlobeIcon = withDefaultIconClass(Globe)
const HardDriveIcon = withDefaultIconClass(HardDrive)
const InfoIcon = withDefaultIconClass(Info)
const LanguagesIcon = withDefaultIconClass(Languages)
const CircleUserRoundIcon = withDefaultIconClass(CircleUserRound)
const MailIcon = withDefaultIconClass(Mail)
const MessageSquareMoreIcon = withDefaultIconClass(MessageSquareMore)
const PackageIcon = withDefaultIconClass(Package)
const RocketIcon = withDefaultIconClass(Rocket)
const RssIcon = withDefaultIconClass(Rss)
const Settings2Icon = withDefaultIconClass(Settings2)

export {
  ArrowLeftIcon as ArrowLeft,
  ArrowUpRightIcon as ArrowUpRight,
  CameraIcon as Camera,
  ChevronDownIcon as ChevronDown,
  CloudIcon as Cloud,
  CopyrightIcon as Copyright,
  GithubIcon as Github,
  GlobeIcon as Globe,
  HardDriveIcon as HardDrive,
  InfoIcon as Info,
  LanguagesIcon as Languages,
  CircleUserRoundIcon as CircleUserRound,
  MailIcon as Mail,
  MessageSquareMoreIcon as MessageSquareMore,
  PackageIcon as Package,
  RocketIcon as Rocket,
  RssIcon as Rss,
  Settings2Icon as Settings2
}
