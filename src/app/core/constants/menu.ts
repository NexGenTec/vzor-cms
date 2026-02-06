import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
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
            { label: 'Blog y recursos', route: '/layout/vzor-cms/blog' },
            { label: 'FAQ', route: '/layout/vzor-cms/faq' },
            { label: 'Plataformas', route: '/layout/vzor-cms/platforms' },
            {
              label: 'Soluciones',
              route: '/layout/vzor-cms/solutions',
              children: [
                {
                  label: 'Listado Soluciones',
                  route: '/layout/vzor-cms/solutions',
                },
                {
                  label: 'Tabs Soluciones',
                  route: '/layout/vzor-cms/solution-tabs',
                },
              ],
            },
            { label: 'Clientes', route: '/layout/vzor-cms/clients' },
            { label: 'Socios', route: '/layout/vzor-cms/partners' },
            // { label: 'Review', route: '/layout/vzor-cms/review-clientes' },
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
