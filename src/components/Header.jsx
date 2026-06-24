'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Menu, X, User, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc } from 'firebase/firestore';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
const [userData, setUserData] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
      const userData =  getUserData(user.uid);
      if (userData) {
        setUser({
          ...user,
          ...userData
        });
      }
      }

    });
    return () => unsubscribe();
  }, []);

  const getUserData = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data().role);
        console.log(userDoc.data().role);
        return userDoc.data();
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.mobile-menu-container') && !e.target.closest('.mobile-menu-button')) {
          setMobileMenuOpen(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (profileDropdownOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.profile-dropdown') && !e.target.closest('.profile-button')) {
          setProfileDropdownOpen(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [profileDropdownOpen]);

  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
      setProfileDropdownOpen(false);
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const NavLink = ({ href, children, onClick }) => (
    <Link
      href={href}
      className="group relative px-3 py-2 text-gray-700 hover:text-[#7F1C75] font-medium transition-colors duration-200"
      onClick={onClick}
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7F1C75] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
    </Link>
  );

  const MobileNavLink = ({ href, children, onClick }) => (
    <Link
      href={href}
      className="w-full px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-[#7F1C75] transition-colors rounded-md flex items-center"
      onClick={onClick}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link  href="/" className="flex  items-center">
              <img className="w-full h-15" src="/logo.png" alt="Logo"/>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            
            <NavLink href="/services">Services</NavLink>
            
            {/* <NavLink href="/dashboard/user?tab=custom">Custom Services</NavLink> */}
            { !loading && user && <NavLink href={`/dashboard/${userData}`}>Dashboard</NavLink> }
            {
                !loading && user && (
                    <NavLink href="/dashboard/user?tab=your-forms">Forms</NavLink>
                )
            }
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              user ? (
                <div className="relative profile-dropdown">
                  <button
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#7F1C75] profile-button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#7F1C75]">
                      {user.displayName ? user.displayName[0] : user.email[0]}
                    </div>
                    <span className="font-medium">{user.displayName || user.email.split('@')[0]}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10">
                      <Link
                        href="/dashboard/user?tab=profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#7F1C75]"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User size={16} className="inline mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#7F1C75]"
                      >
                        <LogOut size={16} className="inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/signin" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-[#7F1C75] font-medium transition-colors duration-200"
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </Link>
              )
            )}

            <Link 
              href="/contact" 
              className="flex items-center px-4 py-2 bg-gradient-to-r from-[#7F1C75] to-[#401B71] text-white rounded-lg hover:from-[#401B71] hover:to-[#401B71] transition-all duration-200 shadow-sm font-medium"
            >
              <Phone size={16} className="mr-2" />
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-[#7F1C75] focus:outline-none mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-[#00000066] bg-opacity-30 z-40" aria-hidden="true">
            <div 
              className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 transform mobile-menu-container overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-8 h-8 bg-gradient-to-br from-[#7F1C75] to-[#401B71] rounded-md flex items-center justify-center text-white font-bold text-lg">
                      K
                    </div>
                    <span className="ml-2 text-lg font-semibold text-gray-800">KBG Online</span>
                  </Link>
                  <button 
                    className="p-2 text-gray-600 hover:text-[#7F1C75] focus:outline-none" 
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-1">
                {!loading && user && (
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#7F1C75] font-medium">
                        {user.displayName ? user.displayName[0] : user.email[0]}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-800">{user.displayName || user.email.split('@')[0]}</p>
                        <p className="text-gray-500 text-xs truncate max-w-40">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink href="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
                <MobileNavLink href="/services" onClick={() => setMobileMenuOpen(false)}>Services</MobileNavLink>
                {!loading && user && (
                  <MobileNavLink href={`/dashboard/${userData}`} onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                )}
                {!loading && user && (
                  <MobileNavLink href="/dashboard/user?tab=your-forms" onClick={() => setMobileMenuOpen(false)}>Forms</MobileNavLink>
                )}
                {/* <MobileNavLink href="/dashboard/user?tab=custom" onClick={() => setMobileMenuOpen(false)}>Custom Services</MobileNavLink> */}
                
                <div className="pt-4 mt-4 border-t border-gray-100">
                  {!loading && (
                    user ? (
                      <>
                        <MobileNavLink href="/dashboard/user?tab=profile" onClick={() => setMobileMenuOpen(false)}>
                          <User size={16} className="mr-3" />
                          Profile
                        </MobileNavLink>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 hover:text-[#7F1C75] transition-colors rounded-md flex items-center"
                        >
                          <LogOut size={16} className="mr-3" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <MobileNavLink href="/signin" onClick={() => setMobileMenuOpen(false)}>
                        <LogIn size={16} className="mr-3" />
                        Sign In
                      </MobileNavLink>
                    )
                  )}
                  
                  <div className="mt-6">
                    <Link 
                      href="/contact" 
                      className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#7F1C75] to-[#401B71] text-white rounded-md hover:from-[#401B71] hover:to-[#7F1C75] transition-all duration-200 shadow-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Phone size={16} className="mr-2" />
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}