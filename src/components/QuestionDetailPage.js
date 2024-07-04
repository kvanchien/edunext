import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { List, Badge, Card } from 'antd';

const QuestionDetailPage = () => {
  const { courseId, slotId } = useParams();
  const [course, setCourse] = useState(null);
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`http://localhost:9999/courses/${courseId}`);
        const courseData = await response.json();
        setCourse(courseData);
        const selectedSlot = courseData.slots.find(slot => slot.id === parseInt(slotId));
        setSlot(selectedSlot);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchCourseData();
  }, [courseId, slotId]);

  if (!course || !slot) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card title={slot.title} style={{ marginBottom: 16 }}>
        <p>{slot.desc}</p>
      </Card>
      <List
        itemLayout="horizontal"
        dataSource={slot.question}
        renderItem={question => (
          <List.Item>
            <List.Item.Meta
              title={
                <div>
                  {question.context}
                  <Badge 
                    count={question.state === "On going" ? "On going" : "Done"} 
                    style={{ backgroundColor: question.state === "On going" ? '#108ee9' : '#f50', marginLeft: 8 }} 
                  />
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default QuestionDetailPage;
