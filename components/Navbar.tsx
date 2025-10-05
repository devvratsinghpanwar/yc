// app/components/Navbar.tsx (or your component's path)

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { BadgePlus, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions"; // <-- Import your new action
import RecommendationsDropdown from "@/components/RecommendationsDropdown";

const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="px-5 py-4 bg-white shadow-200 font-work-sans border-b-4 border-black">
      <nav className="flex justify-between items-center">
        <Link href="/" className="hover:scale-105 transition-transform">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Create Button */}
              <Link href="/startup/create">
                <Button className="bg-primary hover:bg-primary/90 text-white border-2 border-black shadow-100 hover:shadow-none transition-all font-semibold">
                  <BadgePlus className="size-4 mr-2" />
                  <span className="max-sm:hidden">Create Pitch</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </Link>

              {/* Recommendations Dropdown */}
              <RecommendationsDropdown />

              {/* Profile Button */}
              <Link href={`/user/${user.id}`}>
                <Button variant="outline" className="border-2 border-black shadow-100 hover:shadow-none hover:bg-primary-100 transition-all">
                  <User className="size-4 mr-2" />
                  <span className="max-sm:hidden">Profile</span>
                </Button>
              </Link>

              {/* Logout Button */}
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="outline"
                  className="border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 shadow-100 hover:shadow-none transition-all"
                >
                  <LogOut className="size-4 mr-2" />
                  <span className="max-sm:hidden">Logout</span>
                </Button>
              </form>

              {/* Avatar */}
              <Link href={`/user/${user.id}`}>
                <Avatar className="size-10 border-2 border-black shadow-100 hover:shadow-300 transition-all">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url || ""}
                    alt={user.user_metadata?.name || "User Avatar"}
                  />
                  <AvatarFallback className="bg-primary-100 text-black font-bold">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-white border-2 border-black shadow-100 hover:shadow-none transition-all font-semibold px-6">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;