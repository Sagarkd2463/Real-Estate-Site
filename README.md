REAL ESTATE WEBSITE 
----------------------

PROJECT OVERVIEW 
----------------------
A responsive and dynamic real estate website built with React.js and Redux, designed to help users browse, search, and filter through property listings. It features user authentication, property details pages, and smooth navigation with intuitive UI and state management using Redux Toolkit. The backend service of these full-stack real estate listing platform is built with Node.js, Express.js, and MongoDB, featuring secure user authentication, role-based access, and listing management APIs. It supports email/password and social OAuth (Google, Facebook, GitHub) login methods, JWT-based session handling, and RESTful APIs to manage property listings and user accounts.

FEATURES 
--------------

• Firebase-based authentication (Sign up, Sign in, OAuth)

• View and search real estate listings

• Filter properties by location, type, price, etc.

• Paginated and sorted listing results

• Redux for state management

• Responsive UI with Tailwind CSS

• Protected routes for authenticated users

# JWT-based Authentication & Authorization
Secure login/logout and session verification with access tokens.
Token-based middleware to protect restricted routes.

# Social Login Support
Integrated with Google, Facebook, and GitHub OAuth providers.

# User Management
Signup, signin, profile update, and account deletion.
Custom avatar and gender support in the user schema.

# Listing Management
CRUD operations for property listings (create, read, update, delete).
Listings include metadata like pricing, location, amenities, and owner reference.

# User-specific Data Access
Retrieve listings created by a specific user. Enforced ownership checks via verifyToken middleware.

# Centralized Error Handling
Clean error propagation using custom middleware.

TECH STACK 
--------------------

Frontend: React.js, Redux Toolkit, React Router, Tailwind CSS
Auth & Data Store: Firebase (Auth, Firestore)
Tools: Git, GitHub, VS Code.

Runtime & Server: Node.js, Express.js
Database: MongoDB with Mongoose ODM
Authentication: JWT (access token via cookies), OAuth (Google, Facebook, GitHub)
Security: HTTP-only cookies, route protection middleware.
Tools: Git, GitHub.

KEY API ENDPOINTS
---------------------------

Method	     Endpoint	                  Description
-------------------------------------------------------------------
POST	     /api/auth/signup	            Register a new user
POST	    /api/auth/signin	            Login with email/password
POST	    /api/auth/google	            Sign in via Google OAuth
POST	    /api/auth/facebook	          Sign in via Facebook OAuth
POST	    /api/auth/github	            Sign in via GitHub OAuth
GET	    /api/auth/signout	              Logout
POST	    /api/listings/create	        Create a new listing (protected)
GET	   /api/listings/get/:id	          Get a specific listing through its id
GET	   /api/listings/get	              Get all listings of the user
PATCH   	/api/listings/update/:id	    Update listing (protected) of the user
DELETE	 /api/listings/delete/:id	      Delete listing (protected) of the user
PUT	    /api/users/update/:id	          Update user profile (protected)
DELETE	  /api/users/delete/:id	        Delete user account (protected)
GET	   /api/users/listings/:id	        Get all listings by a user

FOLDER STRUCTURE 
---------------------------------

Frontend Structure
-------------------------

├── src/
│   ├── components/         # Reusable UI components (Navbar, PropertyCard, Filters)
│   ├── pages/              # Page components (Home, Listings, SignIn, SignUp)
│   ├── redux/              # Redux store and slices
│   ├── App.js              # Main App component
│   └── main.jsx            # Entry point

Backend Structure
--------------------------

├── controllers/
│   ├── authController.js
│   ├── listingController.js
│   └── userController.js
├── models/
│   ├── Listing.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── listingRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── verifyUser.js
│   └── error.js
├── server.js

USAGE 
-----------------------

1. Register or login using email/password or OAuth.
2. Browse all available properties.
3. Use filters to narrow down by price, location, or property type.
4. View details of a listing and contact the owner.
5. Authenticated users can manage their listings.
