import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { XIcon } from './icons/XIcon';
import { StarIcon } from './icons/StarIcon';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setIsSubmitted(true);
      // Close automatically after showing success message
      setTimeout(() => {
        onClose();
        // Reset state for next time
        setTimeout(() => {
            setIsSubmitted(false);
            setRating(0);
            setComment('');
        }, 300);
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600">Your feedback helps us improve.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How was your experience?</h2>
              <p className="text-gray-500 text-sm">Please rate our Invoice Generator</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <StarIcon 
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                      filled={(hoverRating || rating) >= star}
                    />
                  </button>
                ))}
              </div>

              {/* Comment Box */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Any suggestions? (Optional)
                </label>
                <Textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you liked or what needs improvement..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                    type="button" 
                    variant="ghost" 
                    className="flex-1" 
                    onClick={onClose}
                >
                    Not Now
                </Button>
                <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={rating === 0 || isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
