import React from "react";
import LoadingSpinner from "./loadingspinner";
import Pagination from "./pagination";
function Objects(props) {
  const {
    objects,
    loading,
    page,
    totalPages,
    selectedDepartment,
    departments,
    onObjectClick,
    onNextPage,
    onPreviousPage,
  } = props;

  const departmentName = selectedDepartment
    ? departments.find((d) => d.departmentId === selectedDepartment)
        ?.displayName
    : null;
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {selectedDepartment ? `Artworks in ${departmentName}` : "All Artworks"}
      </h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {objects.length > 0 ? (
              objects.map((object) => (
                <div
                  key={object.objectID}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => onObjectClick(object.objectID)}
                >
                  {object.primaryImageSmall ? (
                    <img
                      src={object.primaryImageSmall}
                      alt={object.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 object-cover">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 300 200"
                      >
                        <rect
                          width="300"
                          height="200"
                          fill="#f8f9fa"
                          rx="15"
                          ry="15"
                        />
                        <rect
                          x="5"
                          y="5"
                          width="290"
                          height="190"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                          rx="12"
                          ry="12"
                        />
                        <g transform="translate(75, 40)">
                          <rect
                            x="0"
                            y="0"
                            width="150"
                            height="100"
                            fill="#e5e7eb"
                            rx="8"
                            ry="8"
                          />
                          <polygon
                            points="0,100 50,40 75,60 110,20 150,100"
                            fill="#d1d5db"
                          />
                          <circle cx="120" cy="25" r="12" fill="#d1d5db" />
                        </g>
                        <path
                          d="M230,40 L260,40 L260,70 Z"
                          fill="#e5e7eb"
                          stroke="#d1d5db"
                          strokeWidth="1"
                        />
                        <text
                          x="150"
                          y="165"
                          fontFamily="Arial, Helvetica, sans-serif"
                          fontSize="14"
                          textAnchor="middle"
                          fill="#6b7280"
                        >
                          Image not available
                        </text>
                      </svg>
                    </div>
                  )}
                  <div className="p-3">
                    <h3
                      className="font-medium text-sm truncate"
                      title={object.title}
                    >
                      {object.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {object.artistDisplayName || "Anonymous"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No objects found in this department
              </div>
            )}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
          />
        </>
      )}
    </div>
  );
}

export default Objects;
