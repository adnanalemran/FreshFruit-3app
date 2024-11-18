import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'


const router = createBrowserRouter([
  // Auth routes
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  {
    path: '/sign-in-2',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in-2')).default,
    }),
  },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },
  {
    path: '/come-in-soon',
    lazy: async () => ({
      Component: (await import('./pages/come-in-soon')).default,
    }),
  },

  // Main routes
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      {
        path: 'identity',
        lazy: async () => ({
          Component: (await import('@/pages/information/identity')).default,
        }),
      },
      {
        path: 'social-media-inks',
        lazy: async () => ({
          Component: (await import('@/pages/information/social-media-inks')).default,
        }),
      },

      {
        path: 'slider',
        lazy: async () => ({
          Component: (await import('@/pages/slider')).default,
        }),
      },
      {
        path: 'services',
        lazy: async () => ({
          Component: (await import('@/pages/services')).default,
        }),
      },
      {
        path: 'shop',
        lazy: async () => ({
          Component: (await import('@/pages/shop')).default,
        }),
      },
      {
        path: 'review',
        lazy: async () => ({
          Component: (await import('@/pages/review')).default,
        }),
      },
      {
        path: 'property',
        lazy: async () => ({
          Component: (await import('@/pages/property')).default,
        }),
      },

      {
        path: 'about-page',
        lazy: async () => ({
          Component: (await import('@/pages/aboutPage')).default,
        }),
      },
      {
        path: 'about-page/create',
        lazy: async () => ({
          Component: (await import('@/pages/aboutPage/create')).default,
        }),
      },
      {
        path: 'about-page/update/:id',
        lazy: async () => ({
          Component: (await import('@/pages/aboutPage/update')).default,
        }),
      },


      //tour

      {
        path: 'identity-tour',
        lazy: async () => ({
          Component: (await import('@/pages/tour/information/identity')).default,
        }),
      },
      {
        path: 'social-media-inks-tour',
        lazy: async () => ({
          Component: (await import('@/pages/information/social-media-inks')).default,
        }),
      },

      {
        path: 'destinations',
        lazy: async () => ({
          Component: (await import('@/pages/tour/destinations')).default,
        }),
      },
      {
        path: 'destinations/create',
        lazy: async () => ({
          Component: (await import('@/pages/tour/destinations/create')).default,
        }),
      },
      {
        path: 'destinations/update/:id',
        lazy: async () => ({
          Component: (await import('@/pages/tour/destinations/update')).default,
        }),
      },

      {
        path: 'package-tour',
        lazy: async () => ({
          Component: (await import('@/pages/tour/package')).default,
        }),
      },
      {
        path: 'package/create',
        lazy: async () => ({
          Component: (await import('@/pages/tour/package/create')).default,
        }),
      },
      {
        path: 'package/update/:id',
        lazy: async () => ({
          Component: (await import('@/pages/tour/package/update')).default,
        }),
      },
      {
        path: 'order',
        lazy: async () => ({
          Component: (await import('@/pages/tour/order')).default,
        }),
      },

      //other routes

      {
        path: 'tasks',
        lazy: async () => ({
          Component: (await import('@/pages/tasks')).default,
        }),
      },

      {
        path: 'apps',
        lazy: async () => ({
          Component: (await import('@/pages/apps')).default,
        }),
      },
      {
        path: 'extra-components',
        lazy: async () => ({
          Component: (await import('@/pages/extra-components')).default,
        }),
      },
      {
        path: 'settings',
        lazy: async () => ({
          Component: (await import('./pages/settings')).default,
        }),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/settings/profile')).default,
            }),
          },
          {
            index: true,
            path: 'controller',
            lazy: async () => ({
              Component: (await import('./pages/settings/controller')).default,
            }),
          },
          {
            path: 'appearance',
            lazy: async () => ({
              Component: (await import('./pages/settings/appearance')).default,
            }),
          }, {
            path: 'set-up',
            lazy: async () => ({
              Component: (await import('./pages/settings/set-up')).default,
            }),
          },
          {
            path: 'notifications',
            lazy: async () => ({
              Component: (await import('./pages/settings/notifications'))
                .default,
            }),
          },
          {
            path: 'display',
            lazy: async () => ({
              Component: (await import('./pages/settings/display')).default,
            }),
          },
          {
            path: 'error-example',
            lazy: async () => ({
              Component: (await import('./pages/settings/error-example'))
                .default,
            }),
            errorElement: <GeneralError className='h-[50svh]' minimal />,
          },
        ],
      },

    ],




  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
