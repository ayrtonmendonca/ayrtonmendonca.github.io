
import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

export const useTheme = (): [string, () => void] => {
    const [theme, setTheme] = useLocalStorage<string>('theme', 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return [theme, toggleTheme];
};
