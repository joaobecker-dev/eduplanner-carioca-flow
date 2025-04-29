
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, BookOpen, FileText, BarChartBig, FolderOpen, LayoutDashboard } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-edu-blue-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="mr-2" />
            <h1 className="text-xl font-bold">EduPlanner</h1>
          </div>
          <div className="text-sm">Versão Beta</div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block bg-white w-64 border-r border-gray-200 shadow-sm">
          <nav className="flex flex-col p-4 gap-1">
            <Link 
              to="/" 
              className={`flex items-center p-3 rounded-md transition-colors ${
                isActivePath('/') 
                  ? 'bg-edu-blue-100 text-edu-blue-700 font-semibold' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={18} className="mr-3" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/planejamento" 
              className={`flex items-center p-3 rounded-md transition-colors ${
                location.pathname.includes('/planejamento') 
                  ? 'bg-edu-blue-100 text-edu-blue-700 font-semibold' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <FileText size={18} className="mr-3" />
              <span>Planejamento</span>
            </Link>
            <Link 
              to="/avaliacoes" 
              className={`flex items-center p-3 rounded-md transition-colors ${
                location.pathname.includes('/avaliacoes') 
                  ? 'bg-edu-blue-100 text-edu-blue-700 font-semibold' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <BarChartBig size={18} className="mr-3" />
              <span>Avaliações</span>
            </Link>
            <Link 
              to="/materiais" 
              className={`flex items-center p-3 rounded-md transition-colors ${
                location.pathname.includes('/materiais') 
                  ? 'bg-edu-blue-100 text-edu-blue-700 font-semibold' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <FolderOpen size={18} className="mr-3" />
              <span>Materiais</span>
            </Link>
            <Link 
              to="/calendario" 
              className={`flex items-center p-3 rounded-md transition-colors ${
                location.pathname.includes('/calendario') 
                  ? 'bg-edu-blue-100 text-edu-blue-700 font-semibold' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <Calendar size={18} className="mr-3" />
              <span>Calendário</span>
            </Link>
          </nav>
        </aside>

        {/* Mobile navbar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <nav className="flex justify-around p-2">
            <Link 
              to="/" 
              className={`flex flex-col items-center p-2 ${
                isActivePath('/') ? 'text-edu-blue-700' : 'text-gray-600'
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link 
              to="/planejamento" 
              className={`flex flex-col items-center p-2 ${
                location.pathname.includes('/planejamento') ? 'text-edu-blue-700' : 'text-gray-600'
              }`}
            >
              <FileText size={20} />
              <span className="text-xs mt-1">Planejamento</span>
            </Link>
            <Link 
              to="/avaliacoes" 
              className={`flex flex-col items-center p-2 ${
                location.pathname.includes('/avaliacoes') ? 'text-edu-blue-700' : 'text-gray-600'
              }`}
            >
              <BarChartBig size={20} />
              <span className="text-xs mt-1">Avaliações</span>
            </Link>
            <Link 
              to="/materiais" 
              className={`flex flex-col items-center p-2 ${
                location.pathname.includes('/materiais') ? 'text-edu-blue-700' : 'text-gray-600'
              }`}
            >
              <FolderOpen size={20} />
              <span className="text-xs mt-1">Materiais</span>
            </Link>
            <Link 
              to="/calendario" 
              className={`flex flex-col items-center p-2 ${
                location.pathname.includes('/calendario') ? 'text-edu-blue-700' : 'text-gray-600'
              }`}
            >
              <Calendar size={20} />
              <span className="text-xs mt-1">Calendário</span>
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-600">
        <div className="container mx-auto px-4">
          <p>EduPlanner &copy; {new Date().getFullYear()} - Versão Beta</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
