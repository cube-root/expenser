import { HomeIcon,DocumentAddIcon } from '@heroicons/react/outline';

const navigation: Navigation = [
  {
    id: 'home',
    name: 'Home',
    href: '/home',
    icon: HomeIcon,
  },
  {
    id: 'add-expense',
    name: 'Add Expense',
    href: '/add-expense',
    icon: DocumentAddIcon,
  },
];

export default navigation;
