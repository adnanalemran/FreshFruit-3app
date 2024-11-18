import { IconChecklist, IconLayoutDashboard, IconSettings } from '@tabler/icons-react'
import { MdTour } from 'react-icons/md'
import { MdOutlineMarkunreadMailbox } from 'react-icons/md'

import { VscSettings } from 'react-icons/vsc'

import { CgDisplayGrid } from 'react-icons/cg'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Set-Up',
    label: '',
    href: '/identity',
    icon: <VscSettings size={18} />,
    sub: [
      {
        title: 'Identity',
        label: '',
        href: 'identity',
        icon: <IconChecklist size={18} />,
      },
      {
        title: 'Contact Links',
        label: '',
        href: 'social-media-inks',
        icon: <IconChecklist size={18} />,
      },
    ],
  },
  // {
  //   title: 'Home Page',
  //   label: '',
  //   href: '/main site',
  //   icon: <IconChecklist size={18} />,
  //   sub: [
  //     {
  //       title: 'Slider',
  //       label: '',
  //       href: '/slider',
  //       icon: <IconChecklist size={18} />,
  //     },
  //     {
  //       title: 'Services',
  //       label: '',
  //       href: '/services',
  //       icon: <IconChecklist size={18} />,
  //     },
  //     {
  //       title: 'property (why choose us) ',
  //       label: '',
  //       href: '/property',
  //       icon: <IconChecklist size={18} />,
  //     },

  //     {
  //       title: 'review',
  //       label: '',
  //       href: '/review',
  //       icon: <IconChecklist size={18} />,
  //     },
  //     {
  //       title: 'E-commerce ',
  //       label: '',
  //       href: '/shop',
  //       icon: <IconChecklist size={18} />,
  //     },
  //   ],
  // },
  {
    title: 'Menu-Pages',
    label: '',
    href: '/about-page',
    icon: <IconChecklist size={18} />,
    sub: [
      {
        title: 'About Us',
        label: '',
        href: '/about-page',
        icon: <IconChecklist size={18} />,
      },
    ],
  },

  {
    title: ' Tour',
    label: '',
    href: '/tour',
    icon: <CgDisplayGrid size={18} />,
    sub: [
      {
        title: 'Destinations',
        label: '',
        href: 'destinations',
        icon: <MdTour size={18} />,
      },
      {
        title: 'Package',
        label: '',
        href: 'package-tour',
        icon: <MdOutlineMarkunreadMailbox size={18} />,
      },
      // {
      //   title: 'Order',
      //   label: '',
      //   href: 'order',
      //   icon: <LiaDollyFlatbedSolid size={18} />,
      // },
    ],
  },

  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
