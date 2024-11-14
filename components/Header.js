import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false); // State to manage mobile menu visibility
    const router = useRouter();
    const currentRoute = router.pathname;

    // Function to toggle the mobile menu
    const toggleMenu = () => {
        setMenuOpen((prevState) => !prevState); // Toggle menuOpen state
    };
    const handleLogout = () => {
        localStorage.removeItem("Token");
        router.push("/");
    };

    return (
        <div className="relative flex justify-between md:px-12 px-4 h-16 shadow-xl border-b-2 Raleway">
            <div className="flex justify-center">
                <img src='/logo1.png' className="h-40 max-md:h-32 w-auto absolute -top-8 max-md:-top-6  left-6" />
            </div>

            <div className="flex items-center gap-6">
                {/* Desktop Menu */}
                <ul className="flex gap-10 max-md:hidden">
                    <li className={`cursor-pointer ${currentRoute === "/" ? "text-violet-600" : "hover:text-violet-600"}`}>
                        <Link href="/">Home</Link>
                    </li>
                    <li className={`cursor-pointer ${currentRoute === "/Contact" ? "text-violet-600" : "hover:text-violet-600"}`}>
                        <Link href="/Contact">Contact Us</Link>
                    </li>
                    <li className={`cursor-pointer ${currentRoute === "/booking" ? "text-violet-600" : "hover:text-violet-600"}`}>
                        <Link href="/booking">Booking</Link>
                    </li>
                </ul>

                <button onClick={handleLogout} className="bg-violet-500 text-sm text-white md:py-4 py-2 hover:scale-95 md:px-12 px-6 rounded-lg">
                    Logout
                </button>

                {/* Menu button for mobile view */}
                <button onClick={toggleMenu} className="md:hidden">
                    <img src="/menu_button.svg" className="h-6" alt="menu button" />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <nav className="fixed top-2 right-2 h-80 z-50 shadow-2xl w-[60vw] rounded-2xl bg-gray-200">
                    <ul className="flex flex-col items-center space-y-4 py-4 mt-16">
                        <button onClick={toggleMenu} className="md:hidden absolute top-4 right-4">
                            <img src="/menu_button.svg" className="h-6" alt="menu button" />
                        </button>
                        <li className={`px-[20vw] rounded-lg text-center ${currentRoute === "/" ? "bg-violet-600 text-white" : "hover:bg-violet-600"}`}>
                            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
                        </li>
                        <li className={`px-[12vw] rounded-lg text-center ${currentRoute === "/Contact" ? "bg-violet-600 text-white" : "hover:bg-violet-600"}`}>
                            <Link href="/Contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
                        </li>
                        <li className={`px-[20vw] rounded-lg text-center ${currentRoute === "/booking" ? "bg-violet-600 text-white" : "hover:bg-violet-600"}`}>
                            <Link href="/booking" onClick={() => setMenuOpen(false)}>Booking</Link>
                        </li>
                        <button onClick={handleLogout} className={`px-[12vw] rounded-lg text-center ${currentRoute === "/privacy-policy" ? "bg-violet-600 text-white" : "hover:bg-violet-600"}`}>
                            Logout
                        </button>
                    </ul>
                </nav>
            )}
        </div>
    );
}
