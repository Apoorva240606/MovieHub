import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar'; // create a separate SearchBar component

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    console.log(token, userData)
    if (token && userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const navigation = [
    { name: 'Home', href: '/', current: true },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <Disclosure as="nav" className="w-full bg-gray-800/80 border-b border-gray-700">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">

                {/* Mobile menu button */}
                <div className="flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                  </Disclosure.Button>
                </div>

                {/* Logo */}
                <div className="flex flex-1 items-center justify-start">
                  <Link to="/" className="flex-shrink-0 flex items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                      alt="MovieHub"
                    />
                    <span className="ml-2 font-bold text-white text-lg">MovieHub</span>
                  </Link>

                  {/* Desktop Menu */}
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {/* Search Bar */}
                    <SearchBar />
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Signup
                      </Link>
                    </>
                  ) : (
                    <Menu as="div" className="relative  z-50">
                      <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt={user.name}
                        />
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              to="/profile"
                              className={`block px-4 py-2 text-sm text-gray-300 ${active ? 'bg-gray-700' : ''}`}
                            >
                              {user.name}
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/addmovie"
                              className={`block px-4 py-2 text-sm text-gray-300 ${active ? 'bg-gray-700' : ''}`}
                            >
                              Add Movie
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`block w-full text-left px-4 py-2 text-sm text-gray-300 ${active ? 'bg-gray-700' : ''}`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            <Disclosure.Panel className="sm:hidden px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <SearchBar />
              {console.log(user)}
              {!user ? (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-400 hover:bg-gray-700">Login</Link>
                  <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-green-400 hover:bg-gray-700">Signup</Link>
                </>
              ) : (
                <>
                  <div to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">{user.name}</div>
                  <Link to="/addmovie" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Add Movie</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                    Logout
                  </button>
                </>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Page Content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
