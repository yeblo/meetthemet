import React from 'react'

function Departments(props) {
   const {departments,selectedDepartment,onDepartmentChange} = props
  return (
    <>
     <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Select a Department</h2>
      <div className="max-w-md mx-auto">
        <select 
          value={selectedDepartment || ''}
          onChange={(e) => onDepartmentChange(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-stone-600 focus:border-transparent"
        >
          <option value="">-- Select a Department --</option>
          {departments.map((dept) => (
            <option 
              key={dept.departmentId} 
              value={dept.departmentId}
            >
              {dept.displayName}
            </option>
          ))}
        </select>
      </div>
    </div>
    </>
  )
}

export default Departments
