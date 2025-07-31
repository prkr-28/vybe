import React, {useRef, useState} from 'react';
import {IoMdArrowRoundBack} from 'react-icons/io';
import {useNavigate} from 'react-router-dom';
import {FiPlusSquare} from 'react-icons/fi';
import axios from 'axios';
import {serverUrl} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {setPostData} from '../redux/postSlice';
import {setStoryData} from '../redux/storySlice';
import {setLoopData} from '../redux/loopSlice';
import {ClipLoader} from 'react-spinners';
import {setUserData} from '../redux/userSlice';

const Upload = () => {
   const navigate = useNavigate();
   const [uploadType, setUploadType] = useState('Post');
   const [frontendMedia, setFrontendMedia] = useState(null);
   const [backendMedia, setBackendMedia] = useState(null);
   const [caption, setCaption] = useState('');
   const [mediaType, setMediaType] = useState('');
   const MediaInput = useRef(null);
   const dispatch = useDispatch();
   const {postData} = useSelector((state) => state.post);
   const {storyData} = useSelector((state) => state.story);
   const {loopData} = useSelector((state) => state.loop);
   const [loading, setLoading] = useState(false);

   const handleMedia = (e) => {
      const file = e.target.files[0];
      if (file) {
         setFrontendMedia(URL.createObjectURL(file));
         setBackendMedia(file);
         if (file.type.startsWith('image/')) {
            setMediaType('image');
         } else if (file.type.startsWith('video/')) {
            setMediaType('video');
         }
      }
   };
   const handleUploadPost = async () => {
      if (!backendMedia) return;

      const formData = new FormData();
      formData.append('media', backendMedia);
      formData.append('caption', caption);
      formData.append('mediaType', mediaType);

      try {
         const res = await axios.post(
            `${serverUrl}/api/post/upload`,
            formData,
            {withCredentials: true}
         );
         dispatch(setPostData([...postData, res.data]));
         //refresh the posts page
         navigate('/');
      } catch (error) {
         setLoading(false);
         alert('Error uploading post');
         console.error('Error uploading post:', error);
      } finally {
         setLoading(false);
      }
   };

   const handleUploadStory = async () => {
      if (!backendMedia) return;

      setLoading(true);

      const formData = new FormData();
      formData.append('media', backendMedia);
      formData.append('mediaType', mediaType);

      try {
         const res = await axios.post(
            `${serverUrl}/api/story/upload`,
            formData,
            {withCredentials: true}
         );

         if (res.data?.story) {
            setUserData((prev) => ({
               ...prev,
               stories: [res.data.story],
            }));

            dispatch(setStoryData(res.data.story));
            navigate('/');
         } else {
            alert('Story upload failed');
         }
      } catch (error) {
         alert('Error uploading story');
         console.error('Error uploading story:', error);
      } finally {
         setLoading(false);
      }
   };

   const handleUploadLoop = async () => {
      if (!backendMedia) return;

      const formData = new FormData();
      formData.append('media', backendMedia);
      formData.append('caption', caption);

      try {
         const res = await axios.post(
            `${serverUrl}/api/loop/upload`,
            formData,
            {withCredentials: true}
         );
         dispatch(setLoopData([...loopData, res.data]));
         navigate('/');
      } catch (error) {
         alert('Error uploading loop');
         console.error('Error uploading post:', error);
      } finally {
         setLoading(false);
      }
   };

   const handleUpload = () => {
      setLoading(true);
      if (uploadType === 'Post') {
         handleUploadPost();
      } else if (uploadType === 'Story') {
         handleUploadStory();
      } else if (uploadType === 'Loop') {
         handleUploadLoop();
      }
   };

   return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center px-2 py-4 sm:px-4">
         {/* Header */}
         <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <IoMdArrowRoundBack
               onClick={() => navigate('/')}
               className="text-white text-xl hover:text-blue-400 cursor-pointer"
            />
            <h2 className="text-xl font-semibold text-white">Upload Media</h2>
         </div>
         <div className="w-full flex flex-col items-center mt-8">
            {!frontendMedia ? (
               <div
                  onClick={() => MediaInput.current.click()}
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-44 sm:h-52 bg-gradient-to-br from-[#0e1316] to-[#1a2230] border-2 border-gray-800 flex flex-col items-center justify-center gap-3 rounded-2xl mt-10 cursor-pointer text-white shadow-lg hover:shadow-cyan-700 transition-shadow duration-300">
                  <input
                     type="file"
                     accept={
                        uploadType === 'Loop' ? 'video/*' : 'image/*, video/*'
                     }
                     className="hidden"
                     ref={MediaInput}
                     onChange={handleMedia}
                  />
                  <FiPlusSquare className="text-5xl mb-2" />
                  <p className="text-lg font-semibold text-center">
                     Click to Upload {uploadType}
                  </p>
                  <span className="text-xs text-gray-400 text-center">
                     {uploadType === 'Loop'
                        ? 'Upload a video for your loop'
                        : 'Upload an image or video for your post or story'}
                  </span>
               </div>
            ) : (
               <div className="w-full max-w-lg bg-gradient-to-br from-[#0e1316] to-[#1a2230] border-2 border-gray-800 flex flex-col items-center justify-center gap-4 rounded-2xl mt-10 shadow-lg shadow-cyan-600 p-4">
                  {/* Media preview on top */}
                  <div className="flex justify-center items-center w-full mb-4">
                     {mediaType === 'image' ? (
                        <img
                           src={frontendMedia}
                           alt="Uploaded"
                           className="w-full max-h-80 object-contain rounded-lg border border-gray-700 shadow-md"
                        />
                     ) : (
                        <video
                           src={frontendMedia}
                           autoPlay
                           loop
                           controls
                           className="w-full max-h-80 object-contain rounded-lg border border-gray-700 shadow-md"
                        />
                     )}
                  </div>
                  {/* Caption input below media */}
                  {uploadType !== 'Story' && (
                     <div className="flex flex-col justify-center items-center w-full px-2">
                        <textarea
                           value={caption}
                           onChange={(e) => setCaption(e.target.value)}
                           rows="4"
                           placeholder="Add a caption..."
                           className="w-full bg-transparent px-4 py-2 border-b border-gray-600 outline-none text-white placeholder:text-gray-500 resize-none rounded-md focus:border-blue-400 transition-all"
                        />
                     </div>
                  )}
               </div>
            )}

            <div className="w-full max-w-2xl bg-white rounded-full flex flex-wrap justify-around items-center gap-2 p-4 shadow-md shadow-amber-200 mt-10">
               {['Post', 'Story', 'Loop'].map((type) => (
                  <div
                     key={type}
                     onClick={() => setUploadType(type)}
                     className={`flex-1 min-w-[90px] h-12 flex justify-center items-center text-black font-semibold text-base sm:text-lg cursor-pointer transition-all duration-200 ${
                        uploadType === type
                           ? 'bg-black text-white rounded-full shadow-lg shadow-black scale-105'
                           : ''
                     }`}>
                     {type}
                  </div>
               ))}
            </div>

            {frontendMedia && (
               <div className="w-full flex justify-center">
                  <button
                     onClick={handleUpload}
                     className="mt-6 px-6 py-2 bg-white text-black rounded-full font-semibold cursor-pointer hover:opacity-80 transition-colors duration-300">
                     {loading ? (
                        <ClipLoader color="#000000" size={24} />
                     ) : (
                        `Upload ${uploadType}`
                     )}
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

export default Upload;
