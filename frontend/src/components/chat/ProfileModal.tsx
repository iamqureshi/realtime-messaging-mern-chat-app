import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Camera, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user.service';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('bio', bio);
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      const updatedUser = await userService.updateProfile(formData);
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();
      
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition bg-gray-800 hover:bg-gray-700 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-emerald-500/50 transition-all shadow-xl relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-4xl font-bold text-gray-600 group-hover:text-emerald-500 transition-colors">
                    {user?.userName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                  <Camera className="text-white drop-shadow-lg" size={32} />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full border-4 border-gray-900 group-hover:scale-110 transition-transform shadow-lg">
                  <Camera size={14} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <p className="text-gray-500 text-sm mt-3 font-medium">Change Profile Photo</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
              <input
                type="text"
                className="w-full bg-gray-950 text-white rounded-xl border border-gray-800 p-3.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition placeholder:text-gray-600"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
              <input
                type="text"
                className="w-full bg-gray-950 text-white rounded-xl border border-gray-800 p-3.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition placeholder:text-gray-600"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
             <textarea
               className="w-full bg-gray-950 text-white rounded-xl border border-gray-800 p-3.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition resize-none h-28 placeholder:text-gray-600 leading-relaxed"
               placeholder="Tell us a bit about yourself..."
               value={bio}
               onChange={(e) => setBio(e.target.value)}
             />
          </div>

          <div className="flex justify-end gap-3 pt-4">
             <button
               type="button"
               onClick={onClose}
               disabled={loading}
               className="px-5 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition disabled:opacity-50"
             >
               Cancel
             </button>
             <button
               type="submit"
               disabled={loading}
               className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 hover:shadow-emerald-600/30"
             >
               {loading ? 'Saving Changes...' : (
                 <>
                   <Save size={18} />
                   Save Changes
                 </>
               )}
             </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
