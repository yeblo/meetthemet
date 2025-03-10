import React from 'react'
import LoadingSpinner from './loadingspinner';
function ObjectDetail(props) {
    const {object, loading, onBack} = props;
    if (loading) {
        return (
          <div className="bg-white p-5 rounded-lg shadow-md">
            <button 
              onClick={onBack} 
              className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to List
            </button>
            <LoadingSpinner />
          </div>
        );
      }
    
      return (
        <div className="bg-white p-5 rounded-lg shadow-md">
          <button 
            onClick={onBack} 
            className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to List
          </button>
          
          <h2 className="text-2xl font-bold mb-4">{object.title}</h2>
          
          {object.primaryImage && (
            <div className="mb-6 text-center">
              <img
                src={object.primaryImage}
                alt={object.title}
                className="max-w-full max-h-96 mx-auto rounded-lg"
              />
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p>
                <span className="font-bold">Artist:</span> {object.artistDisplayName || 'Anonymous'}
                {object.artistDisplayBio && ` (${object.artistDisplayBio})`}
              </p>
              {object.objectDate && (
                <p>
                  <span className="font-bold">Date:</span> {object.objectDate}
                </p>
              )}
              {object.medium && (
                <p>
                  <span className="font-bold">Medium:</span> {object.medium}
                </p>
              )}
              {object.dimensions && (
                <p>
                  <span className="font-bold">Dimensions:</span> {object.dimensions}
                </p>
              )}
              {object.department && (
                <p>
                  <span className="font-bold">Department:</span> {object.department}
                </p>
              )}
            </div>
            <div className="space-y-2">
              {object.culture && (
                <p>
                  <span className="font-bold">Culture:</span> {object.culture}
                </p>
              )}
              {object.period && (
                <p>
                  <span className="font-bold">Period:</span> {object.period}
                </p>
              )}
              {object.dynasty && (
                <p>
                  <span className="font-bold">Dynasty:</span> {object.dynasty}
                </p>
              )}
              {object.reign && (
                <p>
                  <span className="font-bold">Reign:</span> {object.reign}
                </p>
              )}
              {object.creditLine && (
                <p>
                  <span className="font-bold">Credit:</span> {object.creditLine}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            {object.objectURL && (
              <a 
                href={object.objectURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mr-4 text-red-700 hover:text-red-900 hover:underline"
              >
                View on Met Museum Website
              </a>
            )}
            {object.objectWikidata_URL && (
              <a 
                href={object.objectWikidata_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block text-blue-600 hover:text-blue-800 hover:underline"
              >
                View on Wikidata
              </a>
            )}
          </div>
        </div>
  )
}

export default ObjectDetail