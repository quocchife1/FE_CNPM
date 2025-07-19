import React, { useEffect } from 'react';
import { useAppDispatch } from '../hooks/reduxHooks';
import { fetchScoreList } from '../features/score';
import ScoreList from '../components/ScoreList';
import { useParams } from 'react-router-dom';


const ScorePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { examId } = useParams<{ examId: string }>();

  useEffect(() => {
  if (examId) {
    dispatch(fetchScoreList(examId));
  }
}, [dispatch, examId]);

  return (
    <div>
      <ScoreList />
    </div>
  );
};

export default ScorePage;
