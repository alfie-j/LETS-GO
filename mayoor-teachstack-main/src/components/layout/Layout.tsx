import React from 'react';
import Header from './Header';
import { Sidebar } from './Sidebar';
// import { Toaster } from '@/components/ui/sonner'; // Removed
import { useAppContext } from '@/context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="flex min-h-screen w-full">
      {isLoggedIn && <Sidebar />}
      
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
        <footer className="border-t bg-background/80 py-4 text-center text-sm text-muted-foreground">
          Made with love by Alfie
        </footer>
      </div>
      {/* <Toaster richColors position="bottom-right" /> Removed */}
    </div>
  );
};

export default Layout;