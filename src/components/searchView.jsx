import React from 'react'

function SearchView(props) {
    const {searchId, setSearchId, onSearchSubmit, text} = props;

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-4">{text}</h2>
    <form onSubmit={onSearchSubmit} className="flex">
      <input
        type="text"
        name={props?.searchName} 
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        placeholder="Search..."
        className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-stone-600 focus:border-transparent"
      />
      <button
        type="submit"
        className="bg-stone-600 text-white hover:bg-stone-500 px-4 py-2 rounded-r"
      >
        Search
      </button>
    </form>
  </div>
  )
}

export default SearchView