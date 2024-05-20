
# CMS - Backend

## Project Structure
The project is structured following MVC architecture pattern

```bash

  src
    ├───Components
    │   ├───config
    │   ├───controllers
    │   ├───middleware
    │   ├───routes
    │   ├───services
    │      
    └───index.js
```
## Setup and Installation

Setup
```bash
Clone the Repository by running this command 
git clone https://github.com/shaShvat07/CMS.git
cd backend 
```

Installating Dependencies
```bash
npm i
```
Create a .env file
```bash
PORT=[Any 4 digit number]
DB_USER=postgres
DB_PASSWORD=[Your postgres password]
DB_HOST=localhost
DB_PORT=5432
DB_NAME=[Your database table name]
SECRET_KEY=[Choose any string]
```
Run the Application
```bash
nodemon index.js
```
Or
```bash
node index.js
```
The APIs will be accessible through this url
```bash
http://localhost:[PORT]
``` 
## Backend API Endpoints

### Collections

- `POST /collection`: Create a new collection.
- `GET /collection`: Get all collections belonging to the authenticated user.
- `GET /collection/:collection_id`: Get a specific collection by its ID.
- `PATCH /collection/:collection_id`: Update a specific collection by its ID.
- `DELETE /collection/:collection_id`: Delete a specific collection by its ID.

### Properties

- `POST /collection/:collection_id/prop`: Add a new property to a specific collection.
- `GET /collection/:collection_id/prop`: Get all properties of a specific collection.
- `DELETE /collection/:collection_id/prop/:prop_id`: Delete a specific property from a collection.

### Entries

- `POST /:collection_id/entry`: Create a new entry in a specific collection.
- `GET /:collection_id/entry`: Get all entries within a specific collection.
- `PUT /:collection_id/entry/:entry_id`: Update a specific entry within a collection.
- `DELETE /:collection_id/entry/:entry_id`: Delete a specific entry within a collection.

### Authentication

- `POST /register`: Register a new user.
- `POST /login`: Login with existing credentials.

### User

- `GET /user`: Get user details by user ID.

## Authentication

All endpoints except `/register` and `/login` require authentication with a valid token. The `verifyToken` middleware is used to verify the token before allowing access to the protected routes.

## Usage

To use these APIs, you'll need to include the appropriate headers and request bodies. Please refer to the API documentation or the code for more details on the required data formats and authentication mechanisms.
