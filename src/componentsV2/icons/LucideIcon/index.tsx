import React from 'react'
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Camera,
  ChevronDown,
  Cloud,
  Copy,
  Copyright,
  Eye,
  EyeOff,
  FileText,
  Folder,
  FolderOpen,
  FolderSearch2,
  Github,
  Globe,
  HardDrive,
  HeartPulse,
  Info,
  Languages,
  CircleUserRound,
  LucideIcon,
  Mail,
  Menu,
  MessageSquareDiff,
  MessageSquareMore,
  Minus,
  Package,
  PenLine,
  Plus,
  Rocket,
  RotateCcw,
  Rss,
  ScanQrCode,
  Search,
  Settings2,
  ChevronRight,
  ShieldCheck,
  Trash2,
  Wifi
} from 'lucide-react-native'
import { cssInterop } from 'nativewind'
import { cn } from 'heroui-native'

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
interopIcon(ArrowLeftRight)
interopIcon(ArrowUpRight)
interopIcon(Camera)
interopIcon(ChevronDown)
interopIcon(CircleUserRound)
interopIcon(Cloud)
interopIcon(Copy)
interopIcon(Copyright)
interopIcon(Eye)
interopIcon(EyeOff)
interopIcon(FileText)
interopIcon(Folder)
interopIcon(FolderOpen)
interopIcon(FolderSearch2)
interopIcon(Github)
interopIcon(Globe)
interopIcon(HardDrive)
interopIcon(HeartPulse)
interopIcon(Info)
interopIcon(Languages)
interopIcon(Mail)
interopIcon(Menu)
interopIcon(MessageSquareDiff)
interopIcon(MessageSquareMore)
interopIcon(Minus)
interopIcon(Package)
interopIcon(PenLine)
interopIcon(Plus)
interopIcon(Rocket)
interopIcon(RotateCcw)
interopIcon(Rss)
interopIcon(ScanQrCode)
interopIcon(Search)
interopIcon(Settings2)
interopIcon(ChevronRight)
interopIcon(ShieldCheck)
interopIcon(Trash2)
interopIcon(Wifi)

function withDefaultIconClass<T extends LucideIcon>(Icon: T): T {
  const Wrapped = (({ className, ...props }: any) => (
    <Icon className={cn('text-black dark:text-white', className)} {...props} />
  )) as unknown as T
  return Wrapped
}

const ArrowLeftIcon = withDefaultIconClass(ArrowLeft)
const ArrowLeftRightIcon = withDefaultIconClass(ArrowLeftRight)
const ArrowUpRightIcon = withDefaultIconClass(ArrowUpRight)
const CameraIcon = withDefaultIconClass(Camera)
const ChevronDownIcon = withDefaultIconClass(ChevronDown)
const CloudIcon = withDefaultIconClass(Cloud)
const CopyIcon = withDefaultIconClass(Copy)
const CopyrightIcon = withDefaultIconClass(Copyright)
const EyeIcon = withDefaultIconClass(Eye)
const EyeOffIcon = withDefaultIconClass(EyeOff)
const FileTextIcon = withDefaultIconClass(FileText)
const FolderIcon = withDefaultIconClass(Folder)
const FolderOpenIcon = withDefaultIconClass(FolderOpen)
const FolderSearch2Icon = withDefaultIconClass(FolderSearch2)
const GithubIcon = withDefaultIconClass(Github)
const GlobeIcon = withDefaultIconClass(Globe)
const HardDriveIcon = withDefaultIconClass(HardDrive)
const HeartPulseIcon = withDefaultIconClass(HeartPulse)
const InfoIcon = withDefaultIconClass(Info)
const LanguagesIcon = withDefaultIconClass(Languages)
const CircleUserRoundIcon = withDefaultIconClass(CircleUserRound)
const MailIcon = withDefaultIconClass(Mail)
const MenuIcon = withDefaultIconClass(Menu)
const MessageSquareDiffIcon = withDefaultIconClass(MessageSquareDiff)
const MessageSquareMoreIcon = withDefaultIconClass(MessageSquareMore)
const MinusIcon = withDefaultIconClass(Minus)
const PackageIcon = withDefaultIconClass(Package)
const PenLineIcon = withDefaultIconClass(PenLine)
const PlusIcon = withDefaultIconClass(Plus)
const RocketIcon = withDefaultIconClass(Rocket)
const RotateCcwIcon = withDefaultIconClass(RotateCcw)
const RssIcon = withDefaultIconClass(Rss)
const ScanQrCodeIcon = withDefaultIconClass(ScanQrCode)
const SearchIcon = withDefaultIconClass(Search)
const Settings2Icon = withDefaultIconClass(Settings2)
const ChevronRightIcon = withDefaultIconClass(ChevronRight)
const ShieldCheckIcon = withDefaultIconClass(ShieldCheck)
const Trash2Icon = withDefaultIconClass(Trash2)
const WifiIcon = withDefaultIconClass(Wifi)

export {
  ArrowLeftIcon as ArrowLeft,
  ArrowLeftRightIcon as ArrowLeftRight,
  ArrowUpRightIcon as ArrowUpRight,
  CameraIcon as Camera,
  ChevronDownIcon as ChevronDown,
  CloudIcon as Cloud,
  CopyIcon as Copy,
  CopyrightIcon as Copyright,
  EyeIcon as Eye,
  EyeOffIcon as EyeOff,
  FileTextIcon as FileText,
  FolderIcon as Folder,
  FolderOpenIcon as FolderOpen,
  FolderSearch2Icon as FolderSearch2,
  GithubIcon as Github,
  GlobeIcon as Globe,
  HardDriveIcon as HardDrive,
  HeartPulseIcon as HeartPulse,
  InfoIcon as Info,
  LanguagesIcon as Languages,
  CircleUserRoundIcon as CircleUserRound,
  MailIcon as Mail,
  MenuIcon as Menu,
  MessageSquareDiffIcon as MessageSquareDiff,
  MessageSquareMoreIcon as MessageSquareMore,
  MinusIcon as Minus,
  PackageIcon as Package,
  PenLineIcon as PenLine,
  PlusIcon as Plus,
  RocketIcon as Rocket,
  RotateCcwIcon as RotateCcw,
  RssIcon as Rss,
  ScanQrCodeIcon as ScanQrCode,
  SearchIcon as Search,
  Settings2Icon as Settings2,
  ChevronRightIcon as ChevronRight,
  ShieldCheckIcon as ShieldCheck,
  Trash2Icon as Trash2,
  WifiIcon as Wifi
}
