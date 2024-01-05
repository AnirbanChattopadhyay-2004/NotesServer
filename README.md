## The Setup
Clone the repo

```sh
git clone https://github.com/AnirbanChattopadhyay-2004/NotesServer.git
```

Install the dependencies

```sh
npm install
   ```

Add the environment variables
- MONGSTR (Your Mongodb connection String)
- JWTPWD  (Your Secret for jwt tokens)

<hr></hr>
To run the server do the following in the root directory
<br></br>

```sh
node server.js
   ```

<hr></hr>

To Test the server , make sure to run it when your database is empty.

```sh
npx jest
  ```
