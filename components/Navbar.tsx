'use client';
import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

const Navbar = () => {
    const handleNavClick = (label: string, href: string) => {
        posthog.capture("nav_link_clicked", { label, href });
    };

    return (
        <header>
            <nav>
                <Link href='/' className="logo" onClick={() => handleNavClick("Logo", "/")}>
                    <Image src="/icons/logo1.png" alt="logo" width={75} height={75}/>
                    <p>Breksa Events</p>
                </Link>
                <ul>
                    <Link href="/" onClick={() => handleNavClick("Home", "/")}>Home</Link>
                    <Link href="/" onClick={() => handleNavClick("Events", "/")}>Events</Link>
                    <Link href="/" onClick={() => handleNavClick("Create Event", "/")}>Create Event</Link>
                </ul>

            </nav>
        </header>
    )
}
export default Navbar
