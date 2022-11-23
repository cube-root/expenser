import { Telegram,GoogleSheet } from '../components/plugins';

const plugins = [
    {
        id:'google-sheet',
        title: 'Google Sheet',
        href: '/integrations/google-sheet',
        category: { name: 'Apps', href: 'https://docs.google.com/spreadsheets' },
        description:
            'Add and track your expenses using google sheet',
        imageSrc: '/images/gsheet-icon.png',
        Component: GoogleSheet
    },
    {
        id: 'telegram',
        title: 'Telegram',
        href: '/integrations/telegram',
        category: { name: 'Apps', href: 'https://docs.google.com/spreadsheets' },
        description:
            'Add and track your expenses using telegram bot',
        imageSrc: '/images/telegram_logo.png',
        Component: Telegram
    },
]

const usePlugin = () => {
    return {
        plugins
    }
}

export default usePlugin