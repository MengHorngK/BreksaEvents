import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <header>
            <nav className="w-full h-20 px-10 bg-[#1700A8] flex items-center">
                <Link href='/' className="logo">
                    <Image src="/icons/logo1.png" alt="logo" width={75} height={75}/>
                    <p>Breksa Events</p>
                </Link>
                <ul>
                    <Link href="/">Home</Link>
                    <Link href="/">Events</Link>
                </ul>
            
            </nav>
        </header>
    )
}
export default Navbar
