import {useState, useEffect} from 'react';

const RaceResults = () => {
    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRaces = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:8000/api/races/grand_prix/search/?year=2025');
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRaces(data);
        } catch (err) {
            setError('Something went wrong!');
            console.error('Error fetching races:', err);
        } finally {
            setLoading(false);
        }
        };

        fetchRaces();
    }, []);

    if (loading) return <div className="p-4">Loading race results...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    console.log(races)

    return (
        <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">F1 Race Results</h1>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grand Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Circuit
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {races.map((race, index) => (
                <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {race.date || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {race.race_track.name || 'N/A'}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {races.length === 0 && (
            <div className="text-center py-8 text-gray-500">
            No race results found
            </div>
        )}
        </div>
    );
};

export default RaceResults;
