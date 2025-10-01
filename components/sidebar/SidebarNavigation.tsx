import Link from 'next/link';
import { 
  MessageCircle, 
  User, 
  BarChart3
} from 'lucide-react';

export default function SidebarNavigation() {
  const menuItems = [
    { href: '/chat', icon: MessageCircle, label: 'AI Chat' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/survey', icon: BarChart3, label: 'Survey' },
  ];

  return (
    <nav className="flex-1">
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
