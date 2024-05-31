import React from 'react';
import profile from '@/images/profile.png';
import Image from 'next/image';

const Profile = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50">
      <label className='text-2xl text-purple-700 font-semibold my-8'>PROFILE</label>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center mb-4">
                <Image src={profile} alt="Avatar" height={40} width={40}/>
              </div>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">Upload</button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md" value="johndoe" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">About yourself</label>
              <textarea className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Tell something about you..."></textarea>
            </div>
          </div>
          <div>
            <div className="text-center text-2xl text-purple-700 mb-8">
              Social Handles
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md" value="johndoe@syncx.io" />
            </div>
            <div className="mb-4 flex items-center">
              <span className="bg-gray-300 text-gray-600 border border-gray-300 px-4 py-2 rounded-l-md">twitter.com/</span>
              <input type="text" className="w-full border border-gray-300 px-4 py-2 border-l-0 rounded-r-md" placeholder="username" />
            </div>
            <div className="mb-4 flex items-center">
              <span className="bg-gray-300 text-gray-600 px-4 py-2 border border-gray-300 rounded-l-md">linkedin.com/</span>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 border-l-0 rounded-r-md" placeholder="username" />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button className="bg-purple-700 text-white px-6 py-2 rounded-full">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
