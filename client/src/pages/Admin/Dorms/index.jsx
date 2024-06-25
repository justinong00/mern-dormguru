import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Dorms() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end">
      <Button onClick={() => navigate("/admin/dorms/add")}>Add Dorm</Button>
    </div>
  );
}

export default Dorms;
