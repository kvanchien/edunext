import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';

const SlotsDetail = () => {
  const { courseId, slotId } = useParams();
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const response = await fetch(`http://localhost:9999/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course data');
        }
        const course = await response.json();
        const slot = course.slots.find(s => s.id === parseInt(slotId));
        if (!slot) {
          throw new Error('Slot not found');
        }
        setSlot(slot);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSlot();
  }, [courseId, slotId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div>
      <h2>{slot.title}</h2>
      <p>{slot.desc}</p>
      <h3>Questions</h3>
      <ul>
        {slot.question.map(q => (
          <li key={q.id}>
            <span>{q.context}</span>
            <span
              style={{
                color: q.state === 'On going' ? 'blue' : 'red',
                marginLeft: '10px',
              }}
            >
              {q.state}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SlotsDetail;
