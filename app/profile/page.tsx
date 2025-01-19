'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCheckUser } from '../hooks/useCheckUser';
import LoadingScreen from '../components/loadingScreen';

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
    question: "What hobbies, interests, or passions do you have that influence how you see the world?",
    maxWords: 500
  },
  {
    id: 4,
    question: "Have you ever had an experience that changed the way you view life or people around you?",
    maxWords: 500
  },
  {
    id: 5,
    question: "What is your greatest accomplishment?",
    maxWords: 500
  }
];

export default function ProfilePage() {
    const { isLoading: checkUserLoading } = useCheckUser();
    const { user, error, isLoading: authLoading } = useUser();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({
        // This should be populated with actual answers from your database
        1: "Previous answer 1",
        2: "Previous answer 2",
        3: "Previous answer 3",
        4: "Previous answer 4",
        5: "Previous answer 5",
    });
    const [editedAnswers, setEditedAnswers] = useState<{ [key: number]: string }>(answers);
    const [socialInfo, setSocialInfo] = useState({
        instagram: "your.username", // Default or from database
        discord: "username#1234"    // Default or from database
    });
    const [editedSocialInfo, setEditedSocialInfo] = useState(socialInfo);
    const [isDataLoading, setIsDataLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
    
            try {
                const response = await fetch(`/api/check-user?userId=${user.sub}`);
                const { data } = await response.json();
    
                if (user?.sub && data?.results && data.results[user.sub]) {
                    const userData = data.results[user.sub];
                    const fullText = userData.text || '';
                    const answerMap: { [key: number]: string } = {};
                    
                    questions.forEach((q) => {
                        const questionStart = fullText.indexOf(`Question: ${q.question}`);
                        if (questionStart !== -1) {
                            const answerStart = fullText.indexOf('Answer: ', questionStart) + 8;
                            const answerEnd = fullText.indexOf('Question: ', answerStart);
                            const answer = answerEnd === -1 
                                ? fullText.slice(answerStart).trim()
                                : fullText.slice(answerStart, answerEnd).trim();
                            answerMap[q.id] = answer;
                        }
                    });
    
                    setAnswers(answerMap);
                    setEditedAnswers(answerMap);
    
                    // Extract username from full Instagram URL
                    const instagramUsername = userData.social1
                        ? userData.social1.replace('https://www.instagram.com/', '')
                        : '';
    
                    setSocialInfo({
                        instagram: instagramUsername,
                        discord: userData.social2 || ''
                    });
                    setEditedSocialInfo({
                        instagram: instagramUsername,
                        discord: userData.social2 || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsDataLoading(false);
            }
        };
    
        fetchUserData();
    }, [user]);
    

    if (checkUserLoading || authLoading || isDataLoading) return <LoadingScreen />;
    if (error) return <div>{error.message}</div>;
    if (!user) {
        router.push('/');
        return null;
    }

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

    const handleSocialChange = (field: 'instagram' | 'discord', value: string) => {
        setEditedSocialInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };


    
const handleSubmit = async () => {
    try {
        const fullText = questions.map((q) => {
            return `Question: ${q.question} Answer: ${editedAnswers[q.id] || ''}`
        }).join(' ');

        const formData = {
            user_id: user.sub,
            name: user.name,
            email: user.email,
            text: fullText,
            social1: `https://www.instagram.com/${editedSocialInfo.instagram}`, // Full Instagram URL
            social2: editedSocialInfo.discord
        };

        const response = await fetch('/api/submit-survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        setAnswers(editedAnswers);
        setSocialInfo(editedSocialInfo);
        setIsEditing(false);
    } catch (error) {
        console.error('Error updating profile:', error);
        // You might want to show an error message to the user here
    }
};

    const handleCancel = () => {
        setIsEditing(false);
        setEditedAnswers(answers);
        setEditedSocialInfo(socialInfo);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-4xl lg:max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 lg:p-10">
                    {/* Go Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.push('/home')}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 
                            transition-colors duration-200 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                            <span className="font-medium">Go Back</span>
                        </button>
                    </div>

                    {/* User Profile Section */}
                    <div className="flex flex-col items-center text-center pb-8">
                        {user.picture && (
                            <Image
                                src={user.picture}
                                alt="Profile"
                                width={80}
                                height={80}
                                className="rounded-full ring-2 ring-gray-100 shadow-sm mb-4"
                            />
                        )}
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">{user.name}</h1>
                            <p className="text-gray-500 mt-1">{user.email}</p>
                        </div>
                    </div>

                    {/* Social Media Section - New */}
                    <div className="mb-8 border-b border-gray-100 pb-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-semibold text-gray-800">Your Information</h2>
                            {!isEditing && (
                                <button
                                    onClick={handleEdit}
                                    className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 
                                    transition-colors duration-200 font-medium text-sm"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {/* Instagram Field */}
                            <div className="space-y-2">
                                <label className="text-gray-700 font-medium">Instagram</label>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">instagram.com/</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedSocialInfo.instagram}
                                            onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                            className="flex-1 p-2 border border-gray-200 rounded-lg 
                                            focus:ring-2 focus:ring-blue-100 focus:border-blue-400 
                                            outline-none transition-all duration-200 text-gray-700"
                                            placeholder="username"
                                        />
                                    ) : (
                                        <span className="text-gray-600">{socialInfo.instagram}</span>
                                    )}
                                </div>
                            </div>

                            {/* Discord Field */}
                            <div className="space-y-2">
                                <label className="text-gray-700 font-medium">Discord ID</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedSocialInfo.discord}
                                        onChange={(e) => handleSocialChange('discord', e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded-lg 
                                        focus:ring-2 focus:ring-blue-100 focus:border-blue-400 
                                        outline-none transition-all duration-200 text-gray-700"
                                        placeholder="username#0000"
                                    />
                                ) : (
                                    <p className="text-gray-600">{socialInfo.discord}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Survey Answers Section */}
                    <div>
                        <div className="space-y-8">
                            {questions.map((q) => (
                                <div key={q.id} className="space-y-3">
                                    <h3 className="text-gray-700 font-medium">
                                        {q.question}
                                    </h3>
                                    {isEditing ? (
                                        <textarea
                                            value={editedAnswers[q.id] || ""}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            className="w-full p-4 border border-gray-200 rounded-lg 
                                            min-h-[120px] focus:ring-2 focus:ring-blue-100 focus:border-blue-400 
                                            outline-none transition-all duration-200 text-gray-700 text-sm"
                                            placeholder="Enter your answer..."
                                        />
                                    ) : (
                                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg text-sm">
                                            {answers[q.id] || "[Answer not available]"}
                                        </p>
                                    )}
                                    <div className="border-b border-gray-100 pt-4"></div>
                                </div>
                            ))}
                        </div>

                        
                        {/* Questions and Answers remain the same */}
                        {isEditing && (
                            <div className="mt-8 flex justify-center space-x-4">
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white 
                                    hover:bg-blue-700 transition-colors duration-200 font-medium"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 
                                    hover:bg-gray-200 transition-colors duration-200 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
