import Link from 'next/link';
import Button from './ui/Button';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center pb-20 px-4">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-6">Page Not Found</h2>
      <p className="text-gray_secondary font-inter max-w-md mx-auto leading-relaxed mb-8">
        We couldn't find the page you were looking for. It might have been removed, renamed, or didn't exist in the first place.
      </p>
      <Link 
        href="/"               
      >
        <Button variant="primary" className='px-4'>Return Home</Button>
      </Link>
    </div>
  );
}
