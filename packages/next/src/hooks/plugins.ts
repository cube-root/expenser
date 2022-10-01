const plugins = [
    {
        title: 'Telegram',
        href: '/integrations/telegram',
        category: { name: 'Apps', href: 'https://docs.google.com/spreadsheets' },
        description:
            'Add and track your expenses using telegram bot',
        imageSrc:'/images/telegram_logo.png'
    }
]

const usePlugin = () => {
    return {
        plugins
    }
}

export default usePlugin