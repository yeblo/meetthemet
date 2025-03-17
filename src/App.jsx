import React, { useState, useEffect } from "react";
import Departments from "./components/departments";
import SearchView from "./components/searchView";
import Objects from "./components/objects";
import ObjectDetail from "./components/objectDetail";
function App() {
  const [objects, setObjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchId, setSearchId] = useState("");
  const [titleSearchTerm, setTitleSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [titleSearchInput, setTitleSearchInput] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10)

  
   const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1/"
  // Fetch departments on initial load
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch objects on initial load and when department or page changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchObjectsByDepartment(selectedDepartment, page);
    } else if (isSearching && titleSearchTerm) {
      searchObjectsByTitle(titleSearchInput, page);
    } else {
      fetchAllObjects(page);
    }

  }, [selectedDepartment, page, itemsPerPage]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/departments`
      );
      const data = await response.json();
      setDepartments(data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchAllObjects = async (currentPage) => {
    setLoading(true);
    try {
      // Get all object IDs
      const response = await fetch(
        `${BASE_URL}/objects`
      );
      const data = await response.json();

      const totalObjects = data.total;
      setTotalPages(Math.ceil(totalObjects / itemsPerPage));

      // Calculate start and end indices for current page
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(
        startIndex + itemsPerPage,
        data.objectIDs.length
      );

      // Get the IDs for the current page
      const pageObjectIds = data.objectIDs.slice(startIndex, endIndex);

      // Fetch details for each object
      const objectDetails = await Promise.all(
        pageObjectIds.map(async (id) => {
          try {
            const objResponse = await fetch(
              `${BASE_URL}/objects/${id}`
            );
            return await objResponse.json();
          } catch (error) {
            console.error(`Error fetching object ${id}:`, error);
            return null;
          }
        })
      );

      setObjects(objectDetails.filter(Boolean)); // Filter out any null objects
    } catch (error) {
      console.error("Error fetching objects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchObjectsByDepartment = async (departmentId, currentPage) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}`
      );
      const data = await response.json();

      const totalObjects = data.total;
      setTotalPages(Math.ceil(totalObjects / itemsPerPage));

      // Calculate start and end indices for current page
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(
        startIndex + itemsPerPage,
        data.objectIDs.length
      );

      // Get the IDs for the current page
      const pageObjectIds = data.objectIDs.slice(startIndex, endIndex);

      // Fetch details for each object
      const objectDetails = await Promise.all(
        pageObjectIds.map(async (id) => {
          try {
            const objResponse = await fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
            );
            return await objResponse.json();
          } catch (error) {
            console.error(`Error fetching object ${id}:`, error);
            return null;
          }
        })
      );

      setObjects(objectDetails.filter(Boolean)); // Filter out any null objects
    } catch (error) {
      console.error("Error fetching objects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchObjectDetails = async (objectId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
      );
      const data = await response.json();
      setSelectedObject(data);
    } catch (error) {
      console.error("Error fetching object details:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchObjectsByTitle = async (searchTerm, currentPage) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/search?q=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();

      if (!data.objectIDs || data.objectIDs.length === 0) {
        setObjects([]);
        setTotalPages(0);
        setLoading(false);
        return;
      }

      const totalObjects = data.objectIDs.length;
      setTotalPages(Math.ceil(totalObjects / itemsPerPage));

      // Calculate start and end indices for current page
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(
        startIndex + itemsPerPage,
        data.objectIDs.length
      );

      // Get the IDs for the current page
      const pageObjectIds = data.objectIDs.slice(startIndex, endIndex);

      // Fetch details for each object
      const objectDetails = await Promise.all(
        pageObjectIds.map(async (id) => {
          try {
            const objResponse = await fetch(`${BASE_URL}/objects/${id}`);
            return await objResponse.json();
          } catch (error) {
            console.error(`Error fetching object ${id}:`, error);
            return null;
          }
        })
      );

      // Further filter results to include only objects with title matching the search term
      const filteredObjects = objectDetails
        .filter(Boolean)
        .filter(
          (obj) =>
            obj.title &&
            obj.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

      setObjects(filteredObjects);
    } catch (error) {
      console.error("Error searching objects by title:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const objectId = parseInt(searchId.trim());
    if (isNaN(objectId)) {
      alert("Please enter a valid object ID (numeric value)");
      return;
    }

    fetchObjectDetails(objectId);
  };

  const handleTitleSearch = (e) => {
    e.preventDefault();
    if (!titleSearchInput.trim()) return;
    
    setTitleSearchTerm(titleSearchInput.trim());
    setSelectedDepartment(null);
    setPage(1);
    setSelectedObject(null);
    setIsSearching(true);
    searchObjectsByTitle(titleSearchInput, page)
  };
  const handleDepartmentChange = (departmentId) => {
    setSelectedDepartment(departmentId);
    setPage(1);
    setSelectedObject(null);
  };

  const handleObjectClick = (objectId) => {
    fetchObjectDetails(objectId);
  };

  const handleBack = () => {
    setSelectedObject(null);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };


  const handlePageChange = (page)=>{
    setItemsPerPage(page)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="bg-amber-900 text-white text-center py-6 px-4 rounded-lg mb-8">
        <h1 className="text-3xl font-bold">
          The Metropolitan Museum of Art Collection
        </h1>
      </header>
      <main className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Departments
            departments={departments}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDepartmentChange}
          />
          <SearchView
            searchId={searchId}
            setSearchId={setSearchId}
            onSearchSubmit={handleSearchSubmit}
            text="Search by ID"
          />
          <SearchView
            searchId={titleSearchInput}
            searchName="titleSearch"
            setSearchId={setTitleSearchInput}
            onSearchSubmit={handleTitleSearch}
            text="Search by Title"
          />
          
          <select 
          value={itemsPerPage}
          onChange={(e) => handlePageChange(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-600 focus:border-transparent"
        >
          <option value="">-- Items per page--</option>
            <option value="10"> 10 </option>
            <option value="20"> 20 </option>
            <option value="30"> 30 </option>
            <option value="40"> 40 </option>
        
        </select>

        </div>
        {selectedObject ? (
          <ObjectDetail
            object={selectedObject}
            loading={loading}
            onBack={handleBack}
          />
        ) : (
          <Objects
            objects={objects}
            loading={loading}
            page={page}
            totalPages={totalPages}
            selectedDepartment={selectedDepartment}
            departments={departments}
            onObjectClick={handleObjectClick}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        )}
      </main>
    </div>
  );
}

export default App;
