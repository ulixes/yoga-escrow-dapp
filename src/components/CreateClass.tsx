import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEscrow } from '../hooks/useEscrow';

export default function CreateClass() {
  const { address } = useAccount();
  const { createYogaClass, isPending, isConfirming, isConfirmed, hash } = useEscrow();
  
  const [formData, setFormData] = useState({
    instructorAddress: address || '',
    price: '',
    duration: '7', // days
    className: '',
    description: '',
    location: '',
    time: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.instructorAddress || !formData.price || !formData.className) {
      alert('Please fill in all required fields');
      return;
    }

    const description = JSON.stringify({
      className: formData.className,
      description: formData.description,
      location: formData.location,
      time: formData.time,
      instructor: formData.instructorAddress,
    });

    try {
      await createYogaClass(
        formData.instructorAddress,
        formData.price,
        parseInt(formData.duration),
        description
      );
    } catch (error) {
      console.error('Error creating yoga class:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isConfirmed) {
    return (
      <div className="success-message">
        <h3>✅ Yoga Class Created Successfully!</h3>
        <p>Transaction Hash: <code>{hash}</code></p>
        <p>Students can now pay to join your class through the escrow.</p>
        <button onClick={() => window.location.reload()} className="create-another-button">
          Create Another Class
        </button>
      </div>
    );
  }

  return (
    <div className="create-class">
      <h2>Create New Yoga Class</h2>
      <p>Create a secure escrow for your yoga class. Students will pay into the escrow, and you'll receive payment after the class.</p>
      
      <form onSubmit={handleSubmit} className="class-form">
        <div className="form-group">
          <label htmlFor="className">Class Name *</label>
          <input
            type="text"
            id="className"
            name="className"
            value={formData.className}
            onChange={handleInputChange}
            placeholder="e.g., Beginner Hatha Yoga"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructorAddress">Instructor Address (You) *</label>
          <input
            type="text"
            id="instructorAddress"
            name="instructorAddress"
            value={formData.instructorAddress}
            onChange={handleInputChange}
            placeholder="0x..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (ETH) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="0.01"
            step="0.001"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Payment Deadline</label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
          >
            <option value="1">1 day</option>
            <option value="3">3 days</option>
            <option value="7">1 week</option>
            <option value="14">2 weeks</option>
            <option value="30">1 month</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Class Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your yoga class..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Studio address or online"
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Class Time</label>
          <input
            type="text"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            placeholder="e.g., Monday 6:00 PM"
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="submit-button"
        >
          {isPending || isConfirming ? (
            isConfirming ? 'Confirming...' : 'Creating Class...'
          ) : (
            'Create Yoga Class Escrow'
          )}
        </button>
      </form>
    </div>
  );
}