// components/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between">
        <div className="mb-4 sm:mb-0">
          <p className="text-lg font-bold">Food Identifier</p>
          <p className="text-gray-400">© 2023 Food Identifier. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/about" className="text-gray-400 hover:text-white">
            About
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-white">
            Contact
          </Link>
          <a
            href="https://www.example.com/privacy"
            className="text-gray-400 hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;