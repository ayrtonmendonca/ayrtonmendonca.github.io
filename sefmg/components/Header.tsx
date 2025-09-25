
import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    theme: string;
    toggleTheme: () => void;
}

const NavLink: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {children}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
    return (
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-md">
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                           SEF/MG Sim
                        </span>
                        <div className="flex items-baseline space-x-4">
                           <NavLink isActive={activeTab === 'home'} onClick={() => setActiveTab('home')}>Simulador</NavLink>
                           <NavLink isActive={activeTab === 'legislation'} onClick={() => setActiveTab('legislation')}>Legislação</NavLink>
                           <NavLink isActive={activeTab === 'about'} onClick={() => setActiveTab('about')}>Sobre</NavLink>
                        </div>
                    </div>
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
            </nav>
        </header>
    );
};

export default Header;
