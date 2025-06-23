import {
  Search,
  Home,
  Info,
  Phone,
  CircleUserRound,
  ShoppingBasket,
  ShoppingCart,
} from 'lucide-react';

export const menuItems = [
  {
    name: 'Home',
    path: '/',
    color: 'from-blue-500 to-purple-600',
    description: 'Welcome to our homepage',
    icon: Home,
  },
  {
    name: 'About',
    path: '/about',
    color: 'from-emerald-500 to-teal-600',
    description: 'Learn more about us',
    icon: Info,
  },
  {
    name: 'Contact',
    path: '/contact',
    color: 'from-orange-500 to-red-600',
    description: 'Get in touch with us',
    icon: Phone,
  },
  {
    name: 'Product',
    path: '/products',
    color: 'from-violet-500 to-pink-600',
    description: 'Customize your experience',
    icon: ShoppingBasket,
  },
  {
    name: 'Search',
    path: '/search',
    color: 'from-violet-500 to-pink-600',
    description: 'Customize your experience',
    icon: Search,
  },
  {
    name: 'Login',
    path: '/login',
    color: 'from-violet-500 to-pink-600',
    description: 'Customize your experience',
    icon: CircleUserRound,
  },
  {
    name: 'Cart',
    path: '/cart',
    color: 'from-violet-500 to-pink-600',
    description: 'Customize your experience',
    icon: ShoppingCart,
  },
];
