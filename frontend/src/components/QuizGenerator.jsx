import React, { useState } from 'react';

const QuizGenerator = ({ noteContent }) => {
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const generateQuestions = async () => {
    setLoadingQuestions(true);
    setError('');
    setQuestions([]);

    try {
      const response = await fetch('http://localhost:5001/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteContent }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to generate questions: ${response.status} ${errText}`);
      }

      const data = await response.json();
      setQuestions(data.questions || []);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  return (
    <>        {/*按鈕樣式*/}                    {/*載入中無法重複點擊*/}
      <button className="btn btn-secondary" disabled={loadingQuestions} onClick={generateQuestions}>
        {loadingQuestions ? '生成中...' : '生成問題'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

    {/*Modal*/}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">生成的題目</h2>
        <pre className="whitespace-pre-wrap">{questions}</pre>
        <div className="mt-6 text-right">
        <button className="btn btn-sm" onClick={() => setIsModalOpen(false)}> 關閉 </button>
        </div>
     </div>
    </div>
    )}
    </>
  );
};

export default QuizGenerator;

