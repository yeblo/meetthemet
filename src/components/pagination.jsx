import React from 'react'
import {ArrowLeft, ArrowRight} from 'lucide-react'
function Pagination(props) {
   const {page, totalPages, onNextPage, onPreviousPage} = props
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button 
        onClick={onPreviousPage} 
        disabled={page === 1}
        className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
      >
        <ArrowLeft/>
      </button>
      <span className="text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button 
        onClick={onNextPage} 
        disabled={page === totalPages}
        className={`px-4 py-2 rounded ${page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
      >
        <ArrowRight/>
      </button>
    </div>
  )
}

export default Pagination