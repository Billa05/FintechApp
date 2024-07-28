import { useNavigate } from "react-router-dom";
import { Button } from "./Button"

export const Balance = ({ value }) => {
    const navigate = useNavigate();
    return <div className="flex">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {value}
        </div>
        <Button label={"Add Money"} onClick={()=>{navigate("/add")}}/>
    </div>
}