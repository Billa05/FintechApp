# Basic fintech app

**steps to stat the application:**

1. clone the repo

   ```
   git@github.com:Billa05/FintechApp.git
   ```

   or

   ```
   https://github.com/Billa05/FintechApp.git
   ```
2. ```
   cd Fintechapp/backend
   ```
3. ```
   npm install
   ```
4. ```
   node index.js
   ```
5. backend is running, now to start the frontend in open another terminal and follow below steps
6. ```
   cd Fintech/frontend
   ```
7. ```
   npm install
   ```
8. ```
   npm run dev
   ```
9. now head to [http://localhost:5173/](http://localhost:5173/)
10. now you can signup and add money to your accound and transfer money to others.


## Api endpoints and concepts of transcation

All the rest apis:

1. http://localhost:3000/api/v1/user/signup
2. http://localhost:3000/api/v1/user/signin
3. http://localhost:3000/api/v1/user/update
4. http://localhost:3000/api/v1/account/transfer
5. http://localhost:3000/api/v1//account/auth
6. http://localhost:3000/api/v1/account/balance
7. http://localhost:3000/api/v1/account/deposit

I tried to use Hasura, but the decision of working with hasura with mongodb was not good as it doesnt support many features for mongodb. its better to go with an SQL database like Postgresql.

still, I managed to use the basic graphql feature using hasura:

hasura api: https://assured-ladybird-90.hasura.app/v1/graphql


query for fetching the firstname of user using the Mongo ID:

```
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
          }
```


query for fetching all the users in the db:

```
{
          query: `
                query MyQuery @cached {
                    users {
                        firstName
                        lastName
                        _id
                    }
                }`,
        }
```


some information about banking concepts:

In India, the smallest unit of currency is called "paise," represented by a value with only two decimal digits, in the format XX.XX.

It is not recommended to store monetary values as float or double types in a database, as it can lead to conversion issues. Instead, it is best practice to store the money value as an integer in databases. For example, 69.69 RS should be saved as 6969 in the database.

When working with MongoDB, it is essential to use the transaction and session APIs to ensure that the entire transaction process occurs smoothly, involving both users and updating the database accordingly. If any error occurs during the transaction, the transaction will not take place.
