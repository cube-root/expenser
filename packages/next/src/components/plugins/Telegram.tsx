const Telegram = ()=>{
    return <div>
        <button
        className="rounded-full flex items-center space-x-2 bg-slate-900 w-full justify-center mx-auto sm:w-auto text-white px-4 py-2"
        onClick={() => {
          // router.push('/integrations');
          window.open('https://t.me/expenser_scheduler_bot', '_blank');
        }}>
        <span className="text-base">Open Telegram Bot</span>
      </button>
    </div>
}

export default Telegram;