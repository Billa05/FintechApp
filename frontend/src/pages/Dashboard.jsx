import axios from "axios";
import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = ({ userId }) => {
  const [name, setName] = useState(null);
  const [balance, setBalance] = useState("fetching...");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          "https://assured-ladybird-90.hasura.app/v1/graphql",
          {
            query: `
              query MyQuery($_id: objectId_mongodb_comparison_exp = {}) @cached {
                users(where: {_id: $_id}) {
                  firstName
                }
              }`,
            variables: {
              _id: {
                _eq: {
                  $oid: userId,
                },
              },
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret":
                "rPGNWbXP6llF2jUpOclUB3CiRjicg7BmvzmWZUqs05uELc7unO28CJjQ1Vp5GIUe",
            },
          }
        );
        const users = response.data.data.users;
        if (users && users.length > 0) {
          const fetchedName = users[0].firstName;
          setName(fetchedName);
        } else {
          console.error("No users found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/account/balance",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const value = response.data.balance;
        setBalance(value);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchUser();
    fetchBalance();
  }, [userId]);

  return (
    <div>
      <Appbar username={name} />
      <div className="m-8">
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
};
