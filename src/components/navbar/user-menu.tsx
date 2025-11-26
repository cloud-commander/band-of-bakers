import { memo } from "react";
import Link from "next/link";
import { User, LogOut, Package, UserCircle, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  isLoggedIn: boolean;
}

export const UserMenu = memo(function UserMenu({ isLoggedIn }: UserMenuProps) {
  if (!isLoggedIn) {
    return (
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-sm font-medium flex items-center gap-2 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-md transition-colors"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        <Link href="/auth/login">
          <LogIn className="h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <User className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center cursor-pointer">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="flex items-center cursor-pointer">
            <Package className="mr-2 h-4 w-4" />
            My Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
