import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface InteractiveQuizProps {
  quizTitle: string;
  questions: Question[];
  onComplete?: (score: number, total: number) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  quizTitle,
  questions,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      if (onComplete) {
        onComplete(score + (selectedOption === currentQuestion.correctAnswerIndex ? 1 : 0), questions.length);
      }
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center dir-rtl">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">نتيجة الاختبار</h2>
        <p className="text-gray-600 mb-6">{quizTitle}</p>

        <div className="text-5xl font-extrabold my-4 text-blue-600 dir-ltr">
          {percentage}%
        </div>
        
        <p className="text-lg font-medium mb-6 text-gray-700">
          حصلت على <span className="font-bold text-blue-600">{score}</span> من <span className="font-bold">{questions.length}</span> إجابة صحيحة.
        </p>

        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
        >
          إعادة الاختبار 🔄
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 dir-rtl">
      {/* Quiz Header & Progress */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
          سؤال {currentIndex + 1} من {questions.length}
        </span>
        <h3 className="text-sm font-medium text-gray-500">{quizTitle}</h3>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-2 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Text */}
      <div className="text-lg font-semibold text-gray-800 mb-6">
        <MarkdownRenderer content={currentQuestion.questionText} />
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, idx) => {
          let btnStyle = "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 text-gray-700";

          if (isAnswered) {
            if (idx === currentQuestion.correctAnswerIndex) {
              btnStyle = "border-green-500 bg-green-50 text-green-800 font-semibold";
            } else if (idx === selectedOption) {
              btnStyle = "border-red-500 bg-red-50 text-red-800 font-semibold";
            } else {
              btnStyle = "border-gray-100 opacity-50 text-gray-400";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between ${btnStyle}`}
            >
              <div className="flex-1">
                <MarkdownRenderer content={option} />
              </div>
              {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                <span className="text-green-600 mr-2">✓</span>
              )}
              {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                <span className="text-red-600 mr-2">✕</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {isAnswered && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
          <p className="text-xs font-bold text-slate-500 mb-1">الشرح والإيضاح:</p>
          <div className="text-sm text-slate-700">
            <MarkdownRenderer content={currentQuestion.explanation} />
          </div>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNextQuestion}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-md"
          >
            {currentIndex + 1 === questions.length ? "عرض النتيجة 🏁" : "السؤال التالي ⬅️"}
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveQuiz;
