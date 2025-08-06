import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setLoopData } from "../redux/loopSlice";

const useGetAllLoops = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { loopData } = useSelector((state) => state.loop);
  useEffect(() => {
    const fetchAllLoops = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/loop/`, {
          withCredentials: true,
        });

        dispatch(setLoopData(response.data));
      } catch (error) {
        console.error("Error fetching all loops:", error);
      }
    };

    fetchAllLoops();
  }, [dispatch, userData]);
};
export default useGetAllLoops;
