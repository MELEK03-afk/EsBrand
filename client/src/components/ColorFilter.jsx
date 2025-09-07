import React, { useMemo } from 'react';

/*
  Reusable ColorFilter component
  Props:
  - colors: Array<{ name: string, count: number }>
  - selected: Set<string> (or array convertible to Set)
  - onToggle: (colorName: string) => void
  - onClear: () => void
*/
const ColorFilter = ({ colors = [], selected = new Set(), onToggle, onClear }) => {
  const sortedColors = useMemo(() => {
    return [...colors].sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  }, [colors]);

  const isSelected = (name) => (selected instanceof Set ? selected.has(name) : new Set(selected).has(name));

  return (
    <aside className="filtersSidebar">
      <div className="filterHeader">
        <h3 className="filterSectionTitle">Filtrer par Couleur</h3>
        <button type="button" className="filterClearBtn" onClick={onClear} disabled={!sortedColors.length}>
          Clear
        </button>
      </div>
      <div className="colorFiltersList">
        {sortedColors.map(({ name, count }) => (
          <label key={name} className={`colorFilterItem ${isSelected(name) ? 'selected' : ''}`}>
            <input
              type="checkbox"
              checked={isSelected(name)}
              onChange={() => onToggle(name)}
              aria-label={`Filter by ${name}`}
            />
            <span className="colorSwatch" style={{ backgroundColor: name }} aria-hidden />
            <span className="colorName">{name}</span>
            <span className="colorCountPill">{count}</span>
          </label>
        ))}
        {!sortedColors.length && (
          <p className="emptyFilterState">No colors found</p>
        )}
      </div>
    </aside>
  );
};

export default ColorFilter;

