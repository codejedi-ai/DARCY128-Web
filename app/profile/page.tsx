'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "Tell me about yourself.",
    maxWords: 500
  },
  {
    id: 2,
    question: "What are some key aspects of your culture or upbringing that shaped your perspective?",
    maxWords: 500
  },
  {
    id: 3,
    question: "What unique perspectives do you bring?",
    maxWords: 500
  },
  {
    id: 4,
    question: "What drives you to do what you do?",
    maxWords: 500
  },
  {
    id: 5,
    question: "What is your greatest accomplishment?",
    maxWords: 500
  }
];

export default function ProfilePage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({
        1: "Sample answer 1",
        2: "Sample answer 2", 
        3: "Sample answer 3",
        4: "Sample answer 4",
        5: "Sample answer 5",
    });
    const [editedAnswers, setEditedAnswers] = useState<{ [key: number]: string }>(answers);
    const [socialInfo, setSocialInfo] = useState({
        instagram: "sample_user",
        discord: "user#1234"
    });
    const [editedSocialInfo, setEditedSocialInfo] = useState(socialInfo);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedAnswers({...answers});
    };

    const handleAnswerChange = (questionId: number, value: string) => {
        setEditedAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSocialChange = (platform: string, value: string) => {
        setEditedSocialInfo(prev => ({
            ...prev,
            [platform]: value
        }));
    };

    const handleSave = async () => {
        try {
            // Here you would normally save to your backend
            console.log('Saving profile data...');
            
            setAnswers(editedAnswers);
            setSocialInfo(editedSocialInfo);
            setIsEditing(false);
            
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile. Please try again.');
        }
    };

    const handleCancel = () => {
        setEditedAnswers({...answers});
        setEditedSocialInfo({...socialInfo});
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.push('/home')}
                        className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            AU
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">Anonymous User</h1>
                            <p className="text-gray-600">anonymous@example.com</p>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Media</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Instagram Username
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedSocialInfo.instagram}
                                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="your_username"
                                    />
                                ) : (
                                    <p className="text-gray-800">@{socialInfo.instagram}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discord Username
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedSocialInfo.discord}
                                        onChange={(e) => handleSocialChange('discord', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="username#1234"
                                    />
                                ) : (
                                    <p className="text-gray-800">{socialInfo.discord}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Survey Answers */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Survey Responses</h2>
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {questions.map((question) => (
                                <div key={question.id} className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                                        {question.question}
                                    </h3>
                                    {isEditing ? (
                                        <textarea
                                            value={editedAnswers[question.id] || ''}
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                                            rows={4}
                                            placeholder="Enter your answer..."
                                        />
                                    ) : (
                                        <p className="text-gray-700 leading-relaxed">
                                            {answers[question.id] || 'No answer provided'}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
