import React from 'react';
import { useParams } from 'react-router-dom';

const SlotsDetail = ({ courses }) => {
  let { courseId, slotId } = useParams();
  courseId = parseInt(courseId);
  slotId = parseInt(slotId);

  const course = courses.find(course => course.id === courseId);
  if (!course) {
    return <div>Course not found!</div>;
  }

  const slot = course.slots.find(slot => slot.id === slotId);
  if (!slot) {
    return <div>Slot not found!</div>;
  }

  return (
    <div>
      <h2>{slot.title}</h2>
      <p>{slot.desc}</p>
      <ul>
        {slot.question.map(question => (
          <li key={question.id}>
            <strong>{question.context}</strong> - {question.state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SlotsDetail;
