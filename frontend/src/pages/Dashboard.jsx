import axios from "axios";
import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";

export const Dashboard = ({ userId }) => {
  const [name, setName] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          "https://assured-ladybird-90.hasura.app/v1/graphql",
          {
            query: `
              query MyQuery($_id: objectId_mongodb_comparison_exp = {}) {
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
              'Content-Type': 'application/json',
              'x-hasura-admin-secret': "rPGNWbXP6llF2jUpOclUB3CiRjicg7BmvzmWZUqs05uELc7unO28CJjQ1Vp5GIUe"
            }
          }
        );
        const fetchedName = response.data.data.users[0].firstName;
        setName(fetchedName);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div>
      <Appbar username={name} />
      <div className="m-8">
        <Balance value={"10,000"} />
        <Users />
      </div>
    </div>
  );
};
