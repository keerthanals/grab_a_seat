import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useTheatreStore } from '../stores/theatreStore';
import TheatreCard from '../components/theatre/TheatreCard';
import Loader from '../components/ui/Loader';
import Input from '../components/ui/Input';

const TheatresPage = () => {
  const { theatres, isLoading, fetchTheatres } = useTheatreStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTheatres, setFilteredTheatres] = useState(theatres);

  useEffect(() => {
    fetchTheatres();
  }, [fetchTheatres]);

  useEffect(() => {
    // Only show approved theatres to regular users
    const approvedTheatres = theatres.filter(theatre => theatre.approved);

    if (searchTerm.trim() === '') {
      setFilteredTheatres(approvedTheatres);
    } else {
      const filtered = approvedTheatres.filter(
        theatre =>
          theatre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          theatre.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTheatres(filtered);
    }
  }, [searchTerm, theatres]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size={36} />
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="mb-8 text-3xl font-bold">Theatres</h1>

      <div className="mb-8">
        <Input
          placeholder="Search theatres by name or location..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon={<Search size={16} />}
          className="max-w-md"
        />
      </div>

      {filteredTheatres.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            No theatres found matching "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTheatres.map(theatre => (
            <TheatreCard key={theatre.id} theatre={theatre} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TheatresPage;
