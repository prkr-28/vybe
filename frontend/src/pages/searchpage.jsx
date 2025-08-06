import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import { setSearchedUsers } from "../redux/userSlice";

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchedUsers } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get(
        `${serverUrl}/api/user/getSearchedUsers?query=${searchTerm}`,
        { withCredentials: true }
      );
      dispatch(setSearchedUsers(response.data));
    } catch (error) {
      console.error("Error fetching searched users:", error);
    }
  };

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        dispatch(setSearchedUsers([])); // clear results if input is empty
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center px-4 py-4 relative">
      {/* Header */}
      <div className="w-full flex items-center mb-8 gap-2">
        <IoMdArrowRoundBack
          onClick={() => navigate(-1)}
          className="text-white text-xl hover:text-blue-400 cursor-pointer"
        />
        <h2 className="text-xl font-semibold text-white">Search Users</h2>
      </div>

      {/* Input */}
      <div className="w-full flex flex-col items-center relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex items-center w-full"
        >
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // prevent closing too fast
            type="text"
            placeholder="Search users..."
            className="flex-1 bg-gray-950 text-white p-4 border border-gray-500 rounded-3xl focus:outline-none"
          />
          <IoSearch
            className="absolute text-xl right-6 text-gray-200 cursor-pointer"
            onClick={handleSearch}
          />
        </form>

        {/* Dropdown for search results */}
        {isFocused && searchedUsers.length > 0 && (
          <div className="absolute top-16 left-0 w-full bg-black rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
            {searchedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-2 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-950"
                onClick={() => navigate(`/profile/${user.userName}`)}
              >
                <img
                  src={user.profileImage}
                  className="w-10 h-10 rounded-full mr-3 inline-block"
                />
                <div className="flex flex-col">
                  <h3 className="text-white font-semibold">{user.userName}</h3>
                  <p className="text-gray-400">@{user.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
