import axios from "axios";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export const AddMoney = () => {
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        let value = e.target.value;
        // Allow only numbers and up to two decimal places
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
        }
    };

    const handleBlur = () => {
        // Convert to a number and format to two decimal places
        setAmount(parseFloat(amount).toFixed(2));
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={amount}
                                    type="text"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                />
                            </div>
                            <button
                                onClick={async () => {
                                    const response = await axios.post("http://localhost:3000/api/v1/account/deposit", {
                                        amount: parseFloat(amount) * 100
                                    }, {
                                        headers: {
                                            Authorization: "Bearer " + localStorage.getItem("token")
                                        }
                                    });
                                    if (response.data.message === "Deposit successful") {
                                        navigate("/dashboard");
                                    }
                                }}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                            >
                                Add Money
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
