export const steps = (i18n) => [
  {
    element: '#hamburger',
    popover: {
      title: i18n('driver.hamburgerBtn'),
      description: i18n('driver.hamburgerDes'),
      position: 'bottom',
    },
  },
  {
    element: '#screenFul',
    popover: {
      title: i18n('driver.fullScreen'),
      description: i18n('driver.fullScreenDes'),
      position: 'left',
    },
  },
];
