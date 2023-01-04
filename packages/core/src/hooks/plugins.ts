const plugins = [
  {
    id: 'google-sheet',
    title: 'Google Sheet',
    href: '/integrations/google-sheet',
    category: 'Storage',
    description: 'Add and track your expenses using google sheet',
    imageSrc: '/images/gsheet-icon.png',
    // routeLink: '/onboarding',
  },
  {
    id: 'telegram',
    title: 'Telegram',
    href: '/integrations/telegram',
    description: 'Add and track your expenses using telegram bot',
    imageSrc: '/images/telegram_logo.png',
  },
];

const usePlugins = () => {
  return [plugins];
};

export default usePlugins;
