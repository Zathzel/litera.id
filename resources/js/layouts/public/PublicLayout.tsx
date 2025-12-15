import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { usePage } from '@inertiajs/react';

interface AuthProps {
  user: { name: string } | null;
}

interface PageProps {
  auth?: AuthProps;
  [key: string]: any; // untuk properti lain yang mungkin ada
}

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const page = usePage<{ auth?: AuthProps }>();
  const auth = page.props.auth ?? { user: null };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 flex flex-col">
      <Navbar auth={auth} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
