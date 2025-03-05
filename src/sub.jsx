import React, {useState,useEffect} from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react';

function App() {
   const [allObjects, setAllObjects] = useState([]); // State to store all objects (unfiltered)
  const [objects, setObjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [loading, setLoading] = useState(true); 
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [departments, setDepartments] = useState([]); // State to store the list of departments
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const perPage = 20;
  const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1/"
  //https://collectionapi.metmuseum.org/public/collection/v1/objects/:objectId
  
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${BASE_URL}/departments`);
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const data = await response.json();
        setDepartments(data.departments);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);



  useEffect(()=>{
    const fetchObject = async(page, department) =>{
      try{
        const response = await fetch(`${BASE_URL}/objects`);

        if(!response){
          throw new Error('Failed to fetch objects');
        }
        const data = await response.json();
        const objectIds = data.objectIDs;
        const total = objectIds.length;  
        setTotalPages(Math.ceil(total / perPage)); 
       

        const startIndex = (currentPage - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedIds = objectIds.slice(startIndex, endIndex);

        const objectsData = await Promise.all(
          paginatedIds.map(async (id) => {
            const objectResponse = await fetch(`${BASE_URL}/objects/${id}`);
            if (!objectResponse.ok) {
              throw new Error(`Failed to fetch object ${id}`);
            }
            return objectResponse.json();
          })
        );
        console.log(department)
        setObjects(objectsData);
        setLoading(false)
       
      }catch(error){
        console.error('Error fetching objects:', error);
        setLoading(false)
        
      }
    }

    fetchObject(currentPage, selectedDepartment);
  },[currentPage, selectedDepartment])

  const handlePrevious = () => {
    // setPaginationLoading(false)
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
    //  setPaginationLoading(true)
  };

  // Handle Next button click
  const handleNext = () => {
    // setPaginationLoading(false)
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
    // setPaginationLoading(true)
  };

 
// Handle department filter change
const handleDepartmentChange = (e) => {
  setSelectedDepartment(e.target.value);
  setCurrentPage(1); // Reset to the first page when the department changes
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    )
  }

  if (paginationLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    )
  }
  
  return (
    <>
    <section className='p-6 bg-gray-50'>
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
        <div className="text-center">
            <h1 className="mb-4 text-lg font-extrabold tracking-tight leading-none text-gray-900 md:text-2xl lg:text-3xl">Met Museum Art Collection</h1>
        </div>
    </div>

    <div className="flex justify-center mb-6">
        <select
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.departmentId} value={dept.displayName}>
              {dept.displayName}
            </option>
          ))}
        </select>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-10 bg-white rounded-lg shadow-xl">
      {
        objects.map((object)=>
        (
          <div key={object.objectID} className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
        
      {object.primaryImageSmall ? ( 
              <img
                src={object.primaryImageSmall}
                alt={object.title}
                className="w-full h-48 object-cover"
              />
            ):
            (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
              <rect width="300" height="200" fill="#f8f9fa" rx="15" ry="15"/>
              <rect x="5" y="5" width="290" height="190" fill="none" stroke="#e5e7eb" strokeWidth="2" rx="12" ry="12"/>
              <g transform="translate(75, 40)">
                <rect x="0" y="0" width="150" height="100" fill="#e5e7eb" rx="8" ry="8"/>
                <polygon points="0,100 50,40 75,60 110,20 150,100" fill="#d1d5db"/>
                <circle cx="120" cy="25" r="12" fill="#d1d5db"/>
              </g>
              <path d="M230,40 L260,40 L260,70 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1"/>
              <text x="150" y="165" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" textAnchor="middle" fill="#6b7280">Image not available</text>
            </svg>
          )}
  <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{object.title}</h2>
              <p className="text-gray-600">{object.artistDisplayName || 'Unknown Artist'}</p>
            
              <a
                  href={object.objectURL} target='_blank'
                  className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 rounded-xl"
                >
                  View Details
                </a>
               
    </div>
    </div>
      ))}
</div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
           <ArrowLeft />
        </button>
        <span className="px-4 py-2 text-lg font-semibold">{currentPage} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || paginationLoading}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages || paginationLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          <ArrowRight />
        </button>
      </div>
    </section>
    </>
  )
}


export default App;