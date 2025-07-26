import { useState } from 'react';
import { useEscrow } from '../hooks/useEscrow';
import { useChainId } from 'wagmi';

export default function CreateClass() {
  const { createYogaClass, isPending, isConfirming, isConfirmed, hash } = useEscrow();
  const chainId = useChainId();
  
  const [formData, setFormData] = useState({
    instructorAddress: '0xb07bb9D7Be773CD996cd092EF8b249Da49ec6ec6', // Instructor wallet address
    price: '0.001', // Default small amount for testing
    duration: '86400', // 1 day for testing
    className: 'Morning Yoga Session',
    description: 'A relaxing morning yoga class',
    location: 'Online via Zoom',
    time: 'Tomorrow 9:00 AM',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if on correct network
    if (chainId !== 42161) {
      alert('Please switch to Arbitrum One network (Chain ID: 42161)');
      return;
    }
    
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
        <h3>✅ Class Booked Successfully!</h3>
        <p>Transaction Hash: <code>{hash}</code></p>
        <p>You've paid {formData.price} ETH for the yoga class. Check the "Transactions" tab to manage your booking.</p>
        <p><strong>Before class starts:</strong> You can request a refund from the instructor.</p>
        <p><strong>After deadline:</strong> Payment goes to the instructor automatically.</p>
        <button onClick={() => window.location.reload()} className="create-another-button">
          Book Another Class
        </button>
      </div>
    );
  }

  return (
    <div className="create-class">
      <h2>Book a Yoga Class</h2>
      <p>Pay for a yoga class through secure escrow. You can request a refund before the class starts, or the instructor gets paid after the deadline.</p>
      
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
          <label htmlFor="instructorAddress">Instructor Address *</label>
          <input
            type="text"
            id="instructorAddress"
            name="instructorAddress"
            value={formData.instructorAddress}
            onChange={handleInputChange}
            placeholder="0xb07bb9D7Be773CD996cd092EF8b249Da49ec6ec6"
            required
          />
          <small style={{color: '#6c757d', fontSize: '0.9rem'}}>Pre-filled with instructor wallet address</small>
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
          <label htmlFor="duration">Class Deadline (when payment goes to instructor)</label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
          >
            <option value="86400">1 day (safe testing)</option>
            <option value="259200">3 days</option>
            <option value="604800">1 week</option>
            <option value="300">5 minutes (advanced)</option>
            <option value="600">10 minutes (advanced)</option>
          </select>
          <small style={{color: '#6c757d', fontSize: '0.9rem'}}>Choose a short deadline for easy testing</small>
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
            isConfirming ? 'Confirming...' : 'Booking Class...'
          ) : (
            `Book Class & Pay ${formData.price} ETH`
          )}
        </button>
      </form>
    </div>
  );
}