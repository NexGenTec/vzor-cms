import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    // {
    //   group: 'Menu',
    //   separator: false,
    //   items: [
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/chart-pie.svg',
    //     //   label: 'Dashboard',
    //     //   route: '/layout/dashboard',
    //     //   children: [
    //     //     { label: 'General', route: '/layout/dashboard/general' },
    //     //     // { label: 'Productos', route: '/layout/dashboard/product' },
    //     //     // { label: 'Tareas', route: '/layout/dashboard/task' },
    //     //     // { label: 'Tickets', route: '/layout/dashboard/ticket'},
    //     //   ],
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/users.svg',
    //     //   label: 'Management',
    //     //   route: '/management',
    //     //   children: [
    //     //     { label: 'Usuarios', route: '/management/user' },
    //     //     { label: 'Clientes', route: '/management/client' },
    //     //   ],
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/list-details.svg',
    //     //   label: 'Productos',
    //     //   route: '/layout/dashboard/product',
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/list-check.svg',
    //     //   label: 'Tareas',
    //     //   route: '/layout/dashboard/task',
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/calendar-week.svg',
    //     //   label: 'Calendario',
    //     //   route: '/layout/dashboard/calendar',
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/ticket.svg',
    //     //   label: 'Tickets',
    //     //   route: '/layout/dashboard/ticket',
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/users.svg',
    //     //   label: 'Usuarios',
    //     //   route: '/layout/dashboard/users',
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/users.svg',
    //     //   label: 'Users',
    //     //   route: '/layout/dashboard/us',
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/message.svg',
    //     //   label: 'Chat',
    //     //   route: '/layout/chat',
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/bell.svg',
    //     //   label: 'Notificacciones',
    //     //   route: '/layout/notificacciones',
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/lock-closed.svg',
    //     //   label: 'Auth',
    //     //   route: '/auth',
    //     //   children: [
    //     //     { label: 'Sign up', route: '/auth/sign-up' },
    //     //     { label: 'Sign in', route: '/auth/sign-in' },
    //     //     { label: 'Forgot Password', route: '/auth/forgot-password' },
    //     //     { label: 'New Password', route: '/auth/new-password' },
    //     //     { label: 'Two Steps', route: '/auth/two-steps' },
    //     //   ],
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/exclamation-triangle.svg',
    //     //   label: 'Errors',
    //     //   route: '/errors',
    //     //   children: [
    //     //     { label: '404', route: '/errors/404' },
    //     //     { label: '500', route: '/errors/500' },
    //     //   ],
    //     // },
    //     // {
    //     //   icon: '../../../assets/icons/heroicons/outline/cube.svg',
    //     //   label: 'Components',
    //     //   route: '/components',
    //     //   children: [{ label: 'Table', route: '/components/table' }],
    //     // },
    //   ],
    // },
    {
      group: 'Menu',
      separator: false,
      items: [
        {
          icon: '../../../assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Vzor CMS',
          route: '/layout/vzor-cms',
          children: [
            { label: 'Dashboard', route: '/layout/vzor-cms/dashboard' },
            { label: 'Blog', route: '/layout/vzor-cms/blog' },
            { label: 'Recursos', route: '/layout/vzor-cms/recursos' },
            { label: 'Review', route: '/layout/vzor-cms/review-clientes' },
          ],
        },
        // {
        //   icon: '../../../assets/icons/heroicons/outline/ticket.svg',
        //   label: 'Tickets',
        //   route: '/layout/dashboard/ticket',
        // },
      ],
    },
    // {
    //   group: 'Collaboration',
    //   separator: true,
    //   items: [
    //     {
    //       icon: '../../../assets/icons/heroicons/outline/download.svg',
    //       label: 'Download',
    //       route: '/download',
    //     },
    //     {
    //       icon: '../../../assets/icons/heroicons/outline/gift.svg',
    //       label: 'Gift Card',
    //       route: '/gift',
    //     },
    //     {
    //       icon: '../../../assets/icons/heroicons/outline/users.svg',
    //       label: 'Users',
    //       route: '/users',
    //     },
    //   ],
    // },
    // {
    //   group: 'Config',
    //   separator: false,
    //   items: [
    //     {
    //       icon: '../../../assets/icons/heroicons/outline/cog.svg',
    //       label: 'Settings',
    //       route: '/settings',
    //     },
    //     {
    //       icon: '../../../assets/icons/heroicons/outline/help.svg',
    //       label: 'Ayuda',
    //       route: '/ticket',
    //     },
    //     {
    //       icon: '../../../assets/icons/heroicons/outline/bell.svg',
    //       label: 'Notifications',
    //       route: '/gift',
    //     },
    //     {
    //       icon: '../../../assets/icons/heroicons/outline/folder.svg',
    //       label: 'Folders',
    //       route: '/folders',
    //       children: [
    //         { label: 'Current Files', route: '/folders/current-files' },
    //         { label: 'Downloads', route: '/folders/download' },
    //         { label: 'Trash', route: '/folders/trash' },
    //       ],
    //     },
    //   ],
    // },
  ];
}
