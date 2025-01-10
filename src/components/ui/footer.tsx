import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">BlogSpace</h3>
            <p className="text-muted-foreground">
              Sharing thoughts, ideas, and stories that matter.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/technology" className="text-muted-foreground hover:text-primary">Technology</Link></li>
              <li><Link href="/category/lifestyle" className="text-muted-foreground hover:text-primary">Lifestyle</Link></li>
              <li><Link href="/category/travel" className="text-muted-foreground hover:text-primary">Travel</Link></li>
              <li><Link href="/category/food" className="text-muted-foreground hover:text-primary">Food</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Twitter</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Instagram</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">LinkedIn</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Facebook</a></li>
            </ul>
          </div>
        </div>
        
        {/* <div className="mt-8 pt-8 border-t">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} BlogSpace. All rights reserved.
          </p>
        </div> */}
      </div>
    </footer>
  );
} 