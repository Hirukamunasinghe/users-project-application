import React, { useState, useEffect } from "react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { CiSearch } from "react-icons/ci";
import axios from "axios";

const Home = () => {
  const [activeTab, setActiveTab] = useState("userGroups");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [userGroups, setUserGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState({});
  const [checkedServicesByGroup, setCheckedServicesByGroup] = useState({});
  const [checkedDocumentationSearch, setCheckedDocumentationSearch] = useState(
    {}
  );
  const [tickedGroups, setTickedGroups] = useState({}); // New state for managing ticked groups

  const handleServicePilotChangeForGroup = (groupId) => {
    setCheckedServicesByGroup((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleDocumentationSearchChangeForGroup = (groupId) => {
    setCheckedDocumentationSearch((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleUserServicePilotChange = (userId, userGroup) => {
    setCheckedUsers((prev) => {
      const newCheckedUsers = {
        ...prev,
        [userId]: {
          ...prev[userId],
          servicePilot: !prev[userId]?.servicePilot,
          userGroup,
        },
      };
      return { ...newCheckedUsers };
    });
  };

  const handleUserDocumentationSearchChange = (userId, userGroup) => {
    setCheckedUsers((prev) => {
      const newCheckedUsers = {
        ...prev,
        [userId]: {
          ...prev[userId],
          documentationSearch: !prev[userId]?.documentationSearch,
          userGroup,
        },
      };
      return { ...newCheckedUsers };
    });
  };

  useEffect(() => {
    const fetchUserGroups = async () => {
      const response = await axios.get("http://localhost:5000/api/usergroups");
      setUserGroups(response.data);
    };

    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    };

    fetchUserGroups();
    fetchUsers();
  }, []);

  const displayedData =
    activeTab === "users"
      ? users.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)
      : userGroups.slice(
          currentPage * rowsPerPage,
          (currentPage + 1) * rowsPerPage
        );

  const totalItems = activeTab === "users" ? users.length : userGroups.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startRange = currentPage * rowsPerPage + 1;
  const endRange = Math.min((currentPage + 1) * rowsPerPage, totalItems);

  const isDashDisplayedForGroup = (groupId) => {
    return Object.values(checkedUsers).some(
      (user) => user.userGroup === groupId && user.servicePilot
    );
  };

  const isDashDisplayedForDocumentation = (groupId) => {
    return Object.values(checkedUsers).some(
      (user) => user.userGroup === groupId && user.documentationSearch
    );
  };

  const isGreyishForServicePilot = (userGroup) => {
    return checkedServicesByGroup[userGroup];
  };

  const isGreyishForDocumentationSearch = (userGroup) => {
    return checkedDocumentationSearch[userGroup];
  };

  const handleTabChange = (newTab) => {
    if (newTab === "users") {
      const updatedCheckedUsers = {};

      users.forEach((user) => {
        const userGroup = user.userGroup;
        const isChecked = checkedServicesByGroup[userGroup];
        updatedCheckedUsers[user.id] = {
          servicePilot: isChecked,
          documentationSearch: checkedDocumentationSearch[userGroup] || false,
          userGroup,
        };
      });

      setCheckedUsers(updatedCheckedUsers);
    }

    setActiveTab(newTab);
    setCurrentPage(0);
  };

  // New function to handle the tick/dash toggle
  const toggleGroupTick = (groupId) => {
    setTickedGroups((prev) => ({
      ...prev,
      [groupId]: prev[groupId] ? !prev[groupId] : true,
    }));
  };

  return (
    <div>
      <div className="ml-[45px] mt-[10px]">
        <div className="mt-[15px]">
          <h1 className="font-bold text-xl">Select User Group Permission</h1>
          <p className="text-sm">
            Choose which user groups and users have access to each feature
          </p>
        </div>
      </div>

      <div className="table ml-[45px] mt-[15px]">
        <table className="w-full">
          <thead>
            <tr>
              <th colSpan="2">
                <div className="flex gap-[950px]">
                  <div className="flex gap-[50px]">
                    <span
                      className={`cursor-pointer ${
                        activeTab === "userGroups"
                          ? "underline underline-offset-4 decoration-white"
                          : ""
                      }`}
                      onClick={() => handleTabChange("userGroups")}
                    >
                      User groups
                    </span>
                    <span
                      className={`cursor-pointer ${
                        activeTab === "users"
                          ? "underline underline-offset-4 decoration-white"
                          : ""
                      }`}
                      onClick={() => handleTabChange("users")}
                    >
                      Users
                    </span>
                  </div>
                  <div className="relative">
                    <CiSearch className="absolute left-[10px] top-[50%] translate-y-[-50%]" />
                    <input
                      placeholder={
                        activeTab === "userGroups"
                          ? "Search User Groups"
                          : "Search Users"
                      }
                      type="text"
                      className="pl-[35px] p-[7px] bg-bgcolor border border-bordercolor rounded-md font-normal text-searchcolor"
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="2">
                <div className="user-groups-section mt-[25px]">
                  <hr className="border-gray-500" />
                  <div className="user-group-data py-[10px] flex justify-between">
                    <h2 className="text-sm font-bold ml-[20px]">
                      {activeTab === "userGroups" ? "User Group" : "Name"}
                    </h2>
                    <div className="flex gap-[40px]">
                      {activeTab === "users" && (
                        <h2 className="text-sm font-bold mr-[410px]">
                          User Group
                        </h2>
                      )}
                      <h2 className="text-sm font-bold">Service Pilot</h2>
                      <h2 className="text-sm font-bold">Document Search</h2>
                    </div>
                  </div>
                  <hr className="border-gray-500" />

                  {displayedData.map((item, index, arr) => (
                    <div key={index}>
                      <div className="group-data py-[15px] flex justify-between">
                        {activeTab === "userGroups" ? (
                          <h2 className="text-sm ml-[20px]">{item.name}</h2>
                        ) : (
                          <h2 className="text-sm ml-[20px] w-[200px]">
                            {item.name}
                          </h2>
                        )}
                        <div className="flex gap-[140px] mr-[50px]">
                          {activeTab === "users" && (
                            <h2 className="text-sm w-[150px] mr-[275px] text-left">
                              {item.userGroup}
                            </h2>
                          )}

                          {/* Service Pilot Checkbox */}
                          <div className="flex items-center">
                            {activeTab === "userGroups" &&
                            isDashDisplayedForGroup(item.name) ? (
                              <div
                                className="flex items-center justify-center w-4 h-4 border border-gray-400"
                                onClick={() => toggleGroupTick(item.name)} // Toggle tick/dash
                              >
                                {tickedGroups[item.name] ? (
                                  <span className="text-white cursor-pointer bg:blue-500">
                                    ✓
                                  </span> // Display tick
                                ) : (
                                  <span className="text-white cursor-pointer">
                                    -
                                  </span> // Display dash
                                )}
                              </div>
                            ) : (
                              <input
                                type="checkbox"
                                className={`custom-checkbox h-4 w-4 appearance-none border border-[#788493] rounded-sm ${
                                  activeTab === "users"
                                    ? checkedUsers[item.id]?.servicePilot
                                      ? "bg-[#D3D3D3] checked:bg-[#D3D3D3] checked:border-[#D3D3D3] opacity-50"
                                      : "bg-[#788493] border-gray-400"
                                    : "bg-[#788493] checked:bg-[#336FE4] checked:border-[#336FE4]"
                                }`}
                                checked={
                                  activeTab === "userGroups"
                                    ? checkedServicesByGroup[item.name] || false
                                    : checkedUsers[item.id]?.servicePilot ||
                                      false
                                }
                                onChange={() =>
                                  activeTab === "userGroups"
                                    ? handleServicePilotChangeForGroup(
                                        item.name
                                      )
                                    : handleUserServicePilotChange(
                                        item.id,
                                        item.userGroup
                                      )
                                }
                              />
                            )}
                          </div>

                          {/* Documentation Search Checkbox */}
                          <div className="flex items-center">
                            {activeTab === "userGroups" &&
                            isDashDisplayedForDocumentation(item.name) ? (
                              <div
                                className="flex items-center justify-center w-4 h-4 border border-gray-400"
                                onClick={() => toggleGroupTick(item.name)} // Toggle tick/dash
                              >
                                {tickedGroups[item.name] ? (
                                  <span className="text-white cursor-pointer bg:blue-500">✓</span> // Display tick
                                ) : (
                                  <span className="text-white cursor-pointer">-</span> // Display dash
                                )}
                              </div>
                            ) : (
                              <input
                                type="checkbox"
                                className={`custom-checkbox h-4 w-4 appearance-none border border-[#788493] rounded-sm ${
                                  activeTab === "users"
                                    ? checkedUsers[item.id]?.documentationSearch
                                      ? "bg-[#D3D3D3] checked:bg-[#D3D3D3] checked:border-[#D3D3D3] opacity-50"
                                      : "bg-[#788493] border-gray-400"
                                    : "bg-[#788493] checked:bg-[#336FE4] checked:border-[#336FE4]"
                                }`}
                                checked={
                                  activeTab === "userGroups"
                                    ? checkedDocumentationSearch[item.name] ||
                                      false
                                    : checkedUsers[item.id]
                                        ?.documentationSearch || false
                                }
                                onChange={() => {
                                  if (activeTab === "userGroups") {
                                    handleDocumentationSearchChangeForGroup(
                                      item.name
                                    );
                                  } else {
                                    handleUserDocumentationSearchChange(
                                      item.id,
                                      item.userGroup
                                    );
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Separator */}
                      {index !== arr.length - 1 && (
                        <hr className="border-gray-500" />
                      )}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <hr className="border-gray-500 w-full " />
        <div className="lower-text-fields mt-[6px]">
          <div className="flex gap-[50px] justify-end">
            <h1>Rows per page :</h1>
            <select
              className="text-white border-none cursor-pointer bg-bgcolor ml-[-30px]"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
            <h1>
              {startRange}-{endRange} of {totalItems}{" "}
              {/* Changed to totalItems */}
            </h1>
            <button onClick={handlePrevPage} disabled={currentPage === 0}>
              <SlArrowLeft />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              <SlArrowRight />
            </button>
          </div>
        </div>
        

        <div className="btnmaindiv w-full flex justify-end mr-[80px] mb-[10px]">
          <div className="btndiv flex gap-[40px] mr-[-10px] mt-[30px]">
            <button className="bg-bgcolor p-[10px] w-[100px] border border-blue-500 rounded-md">
              Skip
            </button>
            <button className="bg-blue-500 text-white p-[10px] w-[100px] border border-blue-500 rounded-md">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
