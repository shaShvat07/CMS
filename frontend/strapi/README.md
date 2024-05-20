
# CMS - FRONTEND

## Project Structure
The project is structured as follows, ensuring modular and organized management of various functionalities.

```bash
src
    ├───Components
    │   ├───Collection
    │   ├───CollectionModal
    │   ├───DynamicForm
    │   ├───Entry
    │   ├───EntryModal
    │   ├───FormPage
    │   ├───Home
    │   ├───Layout
    │   ├───Login
    │   ├───SignUp
    │   ├───Navbar
    │   ├───PageNotFound
    |   ├───PropModal
    |   ├───Sidebar
    |   ├───UpdateEntryForm
    │   ├───App.jsx
    │   ├───index.js
    │   ├───utils.js
    │   
    ├───index.css
    └───main.jsx
```
## Setup and Installation

Setup
```bash
Clone the Repository by running this command 
git clone https://github.com/shaShvat07/CMS.git
cd frontend 
cd strapi
```

Installating Dependencies
```bash
npm i
```

Run the Application
```bash
npm run dev
```

## Routes

* ```/ ``` - Home Page
* ```/login ``` - Login Page
* ```/register ``` - Signup Page
* ```/:collectionId ``` - Collection Entry Page
