// src/renderer/hooks/useGameData.js
import { useState, useEffect } from 'react';
import localGamesData from '../data/games.json';

const REMOTE_JSON_URL = 'https://your-domain.com/games.json'; // Replace with your actual URL

export const useGameData = () => {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(REMOTE_JSON_URL);
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