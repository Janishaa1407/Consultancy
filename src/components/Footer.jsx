import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4 flex items-center">
              <span className="bg-primary-600 text-white p-2 rounded-lg mr-2">🌱</span>
              Fertilizer Shop
            </h3>
            <p className="mb-4">
              Your trusted partner for premium agricultural solutions. Quality
              fertilizers for better yields.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-1 text-primary-400 flex-shrink-0" />
                <span>
                  123 Agriculture Street,<br />
                  Farm District, City 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary-400 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-primary-400 transition">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:info@fertilizershop.com"
                  className="hover:text-primary-400 transition"
                >
                  info@fertilizershop.com
                </a>
              </li>
            </ul>
          </div>

          {/* Policies & Support */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-primary-400 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-primary-400 transition"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="hover:text-primary-400 transition"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/return-policy"
                  className="hover:text-primary-400 transition"
                >
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary-400 transition"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-400 transition"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-400 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-primary-400 transition"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; 2024 Fertilizer Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

