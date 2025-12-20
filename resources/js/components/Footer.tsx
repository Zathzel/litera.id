import React from 'react';
import { Link } from '@inertiajs/react';
// 1. IMPORT HOOK
import useTranslation from "@/hooks/UseTranslation";

// --- COMPONENTS ---
const SocialIcon = ({ path, label }: { path: string, label: string }) => (
  <a 
    href="#" 
    aria-label={label}
    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
  </a>
);

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <li>
    <Link 
      href={href} 
      className="text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">
    {children}
  </h3>
);

// --- MAIN FOOTER ---
const Footer: React.FC = () => {
  // 2. PANGGIL HOOK
  const { t } = useTranslation();

  return (
    <footer className="relative bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 pt-16 pb-8 overflow-hidden">
      
      {/* Background Decor (Subtle Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          
          {/* BRAND COLUMN (Lebar Double di Desktop) */}
          <div className="col-span-2 lg:col-span-2 space-y-6 pr-0 lg:pr-8">
            <Link href="/" className="flex items-center gap-3 group w-fit">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                  L
                </div>
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Litera<span className="text-indigo-600 dark:text-indigo-400">.id</span>
                </span>
            </Link>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              {/* [TRANSLATE] */}
              {t("Future digital library platform. Discover thousands of books, save your favorite collections, and enjoy unlimited reading experiences anywhere.")}
            </p>

            <div className="flex gap-3 pt-2">
                <SocialIcon label="Twitter" path="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                <SocialIcon label="GitHub" path="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                <SocialIcon label="Instagram" path="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 2.53c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
            </div>
          </div>

          {/* COLUMN 2 */}
          <div>
            {/* [TRANSLATE] */}
            <FooterHeading>{t("Explore")}</FooterHeading>
            <ul className="space-y-4">
              <FooterLink href="/">{t("Home")}</FooterLink>
              <FooterLink href="/books">{t("Book Collection")}</FooterLink>
              <FooterLink href="/categories">{t("Categories")}</FooterLink>
              <FooterLink href="/bookmarks">{t("Bookmarks")}</FooterLink>
            </ul>
          </div>

          {/* COLUMN 3 */}
          <div>
            {/* [TRANSLATE] */}
            <FooterHeading>{t("Popular")}</FooterHeading>
            <ul className="space-y-4">
              <FooterLink href="/books?cat=teknologi">{t("Technology")}</FooterLink>
              <FooterLink href="/books?cat=sains">{t("Science")}</FooterLink>
              <FooterLink href="/books?cat=sejarah">{t("History")}</FooterLink>
              <FooterLink href="/books?cat=fiksi">{t("Fiction & Novels")}</FooterLink>
            </ul>
          </div>

          {/* COLUMN 4 */}
          <div>
            {/* [TRANSLATE] */}
            <FooterHeading>{t("Company")}</FooterHeading>
            <ul className="space-y-4">
              <FooterLink href="#">{t("About Us")}</FooterLink>
              <FooterLink href="#">{t("Careers")}</FooterLink>
              <FooterLink href="#">{t("Blog")}</FooterLink>
              <FooterLink href="#">{t("Contact")}</FooterLink>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {/* [TRANSLATE] */}
            &copy; {new Date().getFullYear()} Litera.id. {t("All rights reserved.")}
          </p>
          
          <div className="flex gap-6 text-xs text-gray-400 dark:text-gray-500">
            {/* [TRANSLATE] */}
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{t("Privacy")}</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{t("Terms")}</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">{t("Cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;