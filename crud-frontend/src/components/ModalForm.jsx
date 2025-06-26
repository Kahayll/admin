import { useState, useEffect } from 'react'; 


export default function ModalForm({ isOpen, onClose, mode, onSubmit, user }) {
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState(false); 

  
  useEffect(() => {
    if (isOpen && mode === 'edit' && user) {
      
      setName(user.name || '');
      setEmail(user.email || '');
      
      setPosition(user.position || '');
      setAge(user.age || '');
      
      setStatus(user.isactive || false);
    } else if (isOpen && mode === 'add') {
      
      setName('');
      setEmail('');
      setPosition('');
      setAge('');
      setStatus(false);
    }
  }, [isOpen, mode, user]); 

  const handleStatusChange = (e) => {
    setStatus(e.target.value === 'Active');
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    const formData = {
      name,
      email,
      position,
      age: parseInt(age, 10), 
      isactive: status 
    };

   
    if (mode === 'edit' && user && user.id) {
      formData.id = user.id;
    }

   
    onSubmit(formData);
    
  };

  return (
    <dialog id="my_modal_3" className="modal" open={isOpen}>
      <div className="modal-box">
        <h3 className="font-bold text-lg py-4">
          {mode === 'edit' ? 'Edit User' : 'Add User'} {/* Corrected title */}
        </h3>

        <form onSubmit={handleSubmit}>
          <label className="input input-bordered my-4 flex items-center gap-2">
            Name
            <input
              type="text"
              className="grow"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="input input-bordered my-4 flex items-center gap-2">
            Position
            <input
              type="text"
              className="grow"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </label>

          <label className="input input-bordered my-4 flex items-center gap-2">
            Email
            <input
              type="text"
              className="grow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <div className="flex mb-4 justify-between">
            <label className="input input-bordered mr-4 my-4 flex items-center gap-2">
              Age
              <input
                type="number"
                className="grow"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </label>
            <select
              value={status ? 'Active' : 'Inactive'}
              className="select select-bordered mt-4 w-full max-w-xs"
              onChange={handleStatusChange}
            >
              <option value="Inactive">Inactive</option>
              <option value="Active">Active</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>

          <button type="submit" className="btn btn-success">
            {mode === 'edit' ? 'Save Changes' : 'Add User'}
          </button>
        </form>
      </div>
    </dialog>
  );
}