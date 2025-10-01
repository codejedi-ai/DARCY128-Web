import Link from 'next/link';
import Image from 'next/image';

export default function SidebarHeader() {
  return (
    <div className="mb-8">
      <Link href="/" className="flex items-center space-x-2 text-white">
        <Image
          src="/favicon.ico"
          alt="Perceptr Logo"
          width={32}
          height={32}
          className="rounded"
        />
        <span className="text-xl font-bold">Perceptr</span>
      </Link>
    </div>
  );
}
