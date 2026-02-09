import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

/**
 * GenreFilter Component
 * Displays hierarchical genre filter with expandable/collapsible sub-genres
 *
 * @param {Array} genres - Hierarchical array of genres
 * @param {string} selectedGenreId - Currently selected genre ID
 * @param {Function} onGenreSelect - Callback when a genre is selected
 */
const GenreFilter = ({ genres, selectedGenreId, onGenreSelect }) => {
  const [expandedGenres, setExpandedGenres] = useState(new Set());

  // Toggle genre expansion
  const toggleGenre = (genreId) => {
    const newExpanded = new Set(expandedGenres);
    if (newExpanded.has(genreId)) {
      newExpanded.delete(genreId);
    } else {
      newExpanded.add(genreId);
    }
    setExpandedGenres(newExpanded);
  };

  // Render a single genre item
  const renderGenreItem = (genre, level = 0) => {
    const hasChildren = genre.children && genre.children.length > 0;
    const isExpanded = expandedGenres.has(genre.id);
    const isSelected = selectedGenreId === genre.id;

    return (
      <div key={genre.id} className="select-none">
        {/* Genre Item */}
        <div
          className={`flex items-center space-x-2 py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
            isSelected
              ? 'bg-indigo-50 text-indigo-700 font-semibold'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGenre(genre.id);
              }}
              className="p-0.5 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ExpandLessIcon sx={{ fontSize: 18 }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 18 }} />
              )}
            </button>
          ) : (
            <div className="w-6"></div>
          )}

          {/* Folder Icon */}
          {hasChildren ? (
            isExpanded ? (
              <FolderOpenIcon
                sx={{ fontSize: 18, color: isSelected ? '#4F46E5' : '#9CA3AF' }}
              />
            ) : (
              <FolderIcon
                sx={{ fontSize: 18, color: isSelected ? '#4F46E5' : '#9CA3AF' }}
              />
            )
          ) : (
            <div className="w-5"></div>
          )}

          {/* Genre Name */}
          <div
            className="flex-1 flex items-center space-x-2"
            onClick={() => onGenreSelect(genre.id)}
          >
            {isSelected ? (
              <RadioButtonCheckedIcon sx={{ fontSize: 16, color: '#4F46E5' }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
            )}
            <span className="text-sm">{genre.name}</span>
          </div>
        </div>

        {/* Children (Sub-genres) */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {genre.children.map((child) => renderGenreItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Genres</h3>
        {selectedGenreId && (
          <button
            onClick={() => onGenreSelect(null)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* All Genres Option */}
      <div
        className={`flex items-center space-x-2 py-2 px-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 ${
          !selectedGenreId
            ? 'bg-indigo-50 text-indigo-700 font-semibold'
            : 'hover:bg-gray-50 text-gray-700'
        }`}
        onClick={() => onGenreSelect(null)}
      >
        {!selectedGenreId ? (
          <RadioButtonCheckedIcon sx={{ fontSize: 16, color: '#4F46E5' }} />
        ) : (
          <RadioButtonUncheckedIcon sx={{ fontSize: 16 }} />
        )}
        <span className="text-sm">All Genres</span>
      </div>

      {/* Genre Tree */}
      <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
        {genres && genres.length > 0 ? (
          genres.map((genre) => renderGenreItem(genre))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No genres available
          </p>
        )}
      </div>
    </div>
  );
};

export default GenreFilter;
