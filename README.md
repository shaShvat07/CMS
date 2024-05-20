# Content Management System Application Overview

The Content Management System Application provides a basic headless CMS with Create, Read, Update, and Delete (CRUD) functionalities like Strapi. Users can define custom collections with properties, based upon that a table is created/updated in the backend. 
It then enables us perform CRUD operations on data within those collections entity all from the frontend.

**Key Features:**

* **Intuitive Collection Creation:** 
Define custom collections, essentially data models, to precisely represent your content structure. Each collection can have a set of properties, defining the type of data each piece of information can hold (e.g., name: string, age: number).
* **Automatic Table Management:** 
Based on your defined collections and properties, the backend automatically creates and maintains the corresponding tables in the chosen database. This eliminates the need for manual table creation and ensures data integrity.
* **Seamless CRUD Operations:** 
Perform all essential data manipulation operations directly from the frontend (requires integration):
    * **Create:** Effortlessly add new entries to your collections, populating them with relevant data.
    * **Read:** Retrieve existing data from your collections, allowing you to access and display information as needed.
    * **Update:** Modify existing entries within your collections to keep your data current and accurate.
    * **Delete:** Remove entries that are no longer required, ensuring your data remains organized and relevant.

## Technology Stack

The application leverages the following technologies:

- **Backend:**
  - Node.js
  - Express.js
  - PostgreSQL
- **Frontend:**
  - React.js
  - TailwindCSS
  - React Hook Form

## Project Structure

The project follows the MVC architecture pattern and is organized into separate backend and frontend directories.

### Backend

The backend directory contains the backend API implementation. Refer to the [README](./backend/README.md) in the backend folder for detailed setup instructions and API documentation.

### Frontend

The frontend directory contains the frontend application implementation. Refer to the [README](./frontend/strapi/README.md) in the frontend folder for detailed setup instructions and application overview.

## Contribution

Contributions to the project are welcome! Feel free to open issues or submit pull requests to enhance the application further.
