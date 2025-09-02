import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Moon, Sun, UserCircle2, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import NotificationDropdown from './NotificationDropdown'; // Import the new component

const Header = () => {
  const { currentUser, isLoggedIn, logout, theme, toggleTheme, appConfig } =
    useAppContext();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm shadow-lg">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          {/* Mobile Sidebar Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden mr-4">
                <Menu className="h-6 w-6 text-foreground" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r-0">
              <Sidebar />
            </SheetContent>
          </Sheet>

          <Link to={isLoggedIn ? "/dashboard" : "/login"} className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              {appConfig.appName}
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-blue-600" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isLoggedIn && (
            <>
              <NotificationDropdown /> {/* Use the new NotificationDropdown component */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8 border-2 border-primary/50">
                      <AvatarImage src="/placeholder.svg" alt="User Avatar" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <UserCircle2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 shadow-xl border-border/50 bg-card/90 backdrop-blur-md" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {currentUser?.name || "Guest"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email || "N/A"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="hover:bg-accent/50 cursor-pointer">
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive hover:bg-destructive/10 cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!isLoggedIn && (
            <Link to="/login">
              <Button className="px-4 py-2 rounded-md text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;