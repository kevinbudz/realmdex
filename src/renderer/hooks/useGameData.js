// src/renderer/hooks/useGameData.js
import { useState, useEffect } from 'react';
import localGamesData from '../data/games.json';

const REMOTE_JSON_URL = 'https://kevinbudz.github.io/global.json';

export const useGameData = () => {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                // Add a cache-busting query string using the current timestamp
                const response = await fetch(`${REMOTE_JSON_URL}?t=${new Date().getTime()}`, {
                    cache: "no-store",
                });
                if (!response.ok) throw new Error('Failed to fetch games data');
                
                const data = await response.json();
                setGames(data.games);
            } catch (error) {
                console.log('Falling back to local games data:', error);
                setGames(localGamesData.games);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGames();
    }, []);

    return { games, isLoading, error };
};