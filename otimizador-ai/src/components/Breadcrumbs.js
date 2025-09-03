import Link from 'next/link';

// Ícone de "Casa" para o link de Início
const HomeIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
  </svg>
);

export default function Breadcrumbs({ crumbs }) {
  return (
    <div className="w-full max-w-6xl mb-6 px-4 sm:px-0">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg">
          <li className="inline-flex items-center">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
              <HomeIcon />
              Início
            </Link>
          </li>
          {crumbs && crumbs.map((crumb, index) => (
            <li key={index}>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                {crumb.href ? (
                  <Link href={crumb.href} className="ml-1 text-sm font-medium text-slate-300 hover:text-blue-400 md:ml-2 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="ml-1 text-sm font-medium text-slate-400 md:ml-2">
                    {crumb.label}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

