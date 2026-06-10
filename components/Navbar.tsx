import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <header>
            <nav className="w-full h-20 px-10 bg-[#12244A] flex items-center">
                <Link href='/' className="logo">
                    <Image src="/icons/logo.png" alt="logo" width={75} height={75}/>
                </Link>
                <ul>
                    <Link href="/homepage">Home</Link>
                    <Link href="/mentorship">Mentorship</Link>
                    <Link href="/eventfunction">Events</Link>
                    <Link href="/infohub">InfoHub</Link>
                    <Link href="/profile">Profile</Link>
                </ul>
            
            </nav>
        </header>
    )
}
export default Navbar
