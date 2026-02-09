import React from 'react';
import { Link } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    library: [
      { name: 'Browse Books', path: '/books' },
      { name: 'New Arrivals', path: '/new-arrivals' },
      { name: 'Popular Books', path: '/popular' },
      { name: 'Categories', path: '/categories' },
    ],
    membership: [
      { name: 'Join Now', path: '/signup' },
      { name: 'Plans & Pricing', path: '/pricing' },
      { name: 'Member Benefits', path: '/benefits' },
      { name: 'FAQs', path: '/faqs' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Accessibility', path: '/accessibility' },
    ],
  };

  const socialLinks = [
    { icon: GitHubIcon, href: 'https://github.com', label: 'GitHub' },
    { icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  ];

  const contactInfo = [
    { icon: EmailIcon, text: 'contact@finkilibrary.com' },
    { icon: PhoneIcon, text: '+1 (555) 123-4567' },
    { icon: LocationOnIcon, text: '123 Library St, Reading City, RC 12345' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 group mb-6">
              <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-700 transition-colors">
                <MenuBookIcon sx={{ fontSize: 24, color: 'white' }} />
              </div>
              <span className="text-2xl font-bold text-white">
                FINKI Library
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your gateway to endless knowledge. Discover, reserve, and enjoy thousands of books from our extensive collection.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <Icon sx={{ fontSize: 16, color: '#6366F1' }} />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Library Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Library</h3>
            <ul className="space-y-3">
              {footerLinks.library.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Membership Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Membership</h3>
            <ul className="space-y-3">
              {footerLinks.membership.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-white font-semibold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-400 text-sm">Get updates about new arrivals and special offers.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500 flex-1 md:w-64"
              />
              <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} FINKI Library. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </a>
                );
              })}
            </div>

            {/* Made with Love */}
            <p className="text-gray-400 text-sm">
              Made with <span className="text-white">🤍</span> by Petar's Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
