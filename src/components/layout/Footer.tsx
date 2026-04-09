import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-tighter">
              ICT Bangladesh
            </h3>
            <p className="text-sm text-muted-foreground">
              Empowering learners worldwide with high-quality online courses and
              professional training.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/courses" className="hover:text-primary">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="hover:text-primary">
                  Instructors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/help" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@ictbangladesh.com</li>
              <li>Phone: +1 (555) 000-0000</li>
              <li>Address: 123 Learning Way, Education City</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ICT Bangladesh CMS. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
