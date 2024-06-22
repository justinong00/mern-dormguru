import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import UniForm from './UniForm.jsx';


function Unis() {
  const [showUniForm, setShowUniForm] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={() => setShowUniForm(true)}>Add University</Button>
      </div>

      {showUniForm && <UniForm showUniForm={showUniForm} setShowUniForm={setShowUniForm} />}
    </div>
  );
}

export default Unis;

