const Mode = ({
  setDarkMode,
  darkMode,
}: {
  setDarkMode: (darkMode: boolean) => void;
  darkMode: boolean;
}) => {
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
  }
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      title={darkMode ? 'Light Mode' : 'Dark Mode'}
      className={classNames(
        darkMode ? 'bg-white/5' : 'bg-gray-900/5',
        'inline-flex p-2 rounded-full',
      )}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        height="20"
        viewBox="0 0 24 24"
        width="20">
        <path
          d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8V16Z"
          fill={darkMode ? 'white' : 'black'}
        />
        <path
          clipRule="evenodd"
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4V8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16V20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
          fill={darkMode ? 'white' : 'black'}
          fillRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default Mode;
