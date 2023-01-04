import {
  HomeIcon,
  DocumentAddIcon,
  PuzzleIcon,
} from '@heroicons/react/outline';

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
    // only show the navigation if the sheet is connected
    connectionRequired: true,
  },
  {
    id: 'integrations',
    name: 'Integration',
    href: '/integrations',
    icon: PuzzleIcon,
  },
];

export default navigation;
