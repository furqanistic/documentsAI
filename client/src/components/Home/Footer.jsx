import { Github, Instagram, Linkedin, Twitter } from 'lucide-react'
import React from 'react'

const Footer = () => {
  // Essential footer links
  const footerLinks = [
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
  ]

  // Social Media links
  const socialLinks = [
    { icon: <Twitter size={16} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={16} />, href: '#', label: 'Instagram' },
    { icon: <Linkedin size={16} />, href: '#', label: 'LinkedIn' },
    { icon: <Github size={16} />, href: '#', label: 'GitHub' },
  ]

  return (
    <footer className='bg-black text-white py-4 w-full'>
      <div className='container mx-auto px-2'>
        <div className='flex flex-wrap items-center justify-between'>
          {/* Logo and tagline - centered on mobile */}
          <div className='flex items-center mb-2 md:mb-0 w-full md:w-1/4 justify-center md:justify-start'>
            <div className='flex items-center sm:space-x-4'>
              <img src='./logo.png' alt='Documnt Logo' className='h-10' />
              <div className='hidden sm:block text-xs text-gray-400'>
                <p className='m-0'>AI-Powered Document Creation</p>
                <p className='m-0'>& Interactive Testing</p>
              </div>
            </div>
          </div>

          {/* Desktop Links - perfectly centered horizontally */}
          <div className='hidden md:flex md:w-2/4 justify-center'>
            <div className='flex space-x-4'>
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className='text-xs text-gray-300 hover:text-white transition-colors duration-200'
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile links - centered */}
          <div className='flex flex-wrap gap-x-4 gap-y-2 md:hidden w-full justify-center mt-2'>
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className='text-xs text-gray-300 hover:text-white transition-colors duration-200'
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Social icons and email - centered on mobile */}
          <div className='flex items-center mt-3 md:mt-0 w-full md:w-1/4 justify-center md:justify-end'>
            <div className='flex items-center space-x-3'>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className='text-gray-400 hover:text-white transition-colors duration-200'
                >
                  {social.icon}
                </a>
              ))}
              <span className='text-gray-500 mx-3'>|</span>
              <a
                href='mailto:help@documnt.ai'
                className='text-xs text-gray-400 hover:text-white'
              >
                help@documnt.ai
              </a>
            </div>
          </div>

          {/* Copyright on new line - centered without border */}
          <div className='w-full mt-3 pt-2 flex justify-center'>
            <span className='text-xs text-gray-500'>
              © {new Date().getFullYear()} Documnt AI. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
