import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const user = await getUser();

  // console.log(user);

  // if (!user) {
  //   redirect('/auth/login');
  // }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-background border-r">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin" 
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/posts" 
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText size={20} />
                Posts
              </Link>
            </li>
            {/* <li>
              <Link 
                href="/admin/settings" 
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings size={20} />
                Settings
              </Link>
            </li> */}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Link 
            href="/api/auth/logout"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-destructive/10 text-destructive transition-colors w-full"
          >
            <LogOut size={20} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
} 