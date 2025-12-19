# 🍎 Food Tracking App

A full-stack web application that empowers users to track their nutritional intake efficiently. The app utilizes AI for food recognition from images and integrates with the USDA database for accurate nutrition logging.

## 🚀 Overview

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **AI Service:** Clarifai (Image Recognition)
* **Data Service:** USDA API (Nutrition Data)

---

## 🏗️ Architecture & Workflow

The application follows a 7-step data flow to ensure accurate tracking and user experience.

### 1. User Authentication
* **Frontend:** Handles Login/Register forms and JWT token storage.
* **Backend:** Validates credentials and issues tokens.
* **Security:** Passwords are hashed using `bcrypt`; routes are protected via middleware.

### 2. Image Upload Flow
* **Process:** User selects an image -> Frontend previews it -> Sends to Backend.
* **Storage:** Backend uses `multer` to handle the file and uploads it to **Cloudinary** for optimization and storage.

### 3. AI Food Recognition
* **Service:** **Clarifai**
* **Process:** The backend sends the Cloudinary image URL to Clarifai, which analyzes the image and returns top food predictions/labels.

### 4. Portion Selection
* **UI:** The user confirms the identified food item and selects the portion size (e.g., grams, cups) via the React UI.

### 5. Nutrition Data Retrieval
* **Service:** **USDA API**
* **Optimization:** The backend checks the local `FoodDatabase` cache first. If data is missing, it fetches from USDA, calculates values based on portion size, and caches the result for future efficiency.

### 6. Logging
* **Database:** A new `FoodLog` document is created in MongoDB, linking the nutrient data, image URL, and user ID.

### 7. History & Management
* **View:** Users can view their history via paginated results.
* **Actions:** Records can be edited or deleted.

---

## 🗄️ Database Models

### User Model
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier |
| `name` | String | User's full name |
| `email` | String | Unique email address |
| `password` | String | Hashed password (bcrypt) |
| `settings` | Object | (Optional) Units, dietary goals |

### FoodLog Model
| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | Ref | Reference to User model |
| `imageUrl` | String | Cloudinary URL |
| `foodName` | String | Name of the item |
| `nutrition` | Number | Calories, Protein, Carbs, Fats, Fiber |
| `confidence`| Number | AI confidence score |
| `mealType` | String | Breakfast, Lunch, Dinner, Snack |

### FoodDatabase Model (Cache)
*Used to cache USDA data to reduce API calls.*
* `foodName`, `nutritionPer100g`, `usdaId`, `lastUpdated`

---

## 📡 API Endpoints

### Authentication
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Login and receive JWT
* `GET /api/auth/me` - Get current user profile

### Media & AI
* `POST /api/upload/image` - Upload food image to Cloudinary
* `POST /api/food/identify` - Analyze image using Clarifai

### Nutrition Data
* `POST /api/food/nutrition` - Get nutrition info (Cache/USDA)
* `GET /api/food/search` - Text search for food items

### Food Logs
* `POST /api/foodlog/create` - Save a new entry
* `GET /api/foodlog/history` - View user history
* `GET /api/foodlog/:id` - Get specific entry details
* `PUT /api/foodlog/:id` - Update an entry
* `DELETE /api/foodlog/:id` - Remove an entry

---

## 🛠️ Setup & Configuration

### Dependencies
**Backend:** `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `multer`, `cloudinary`, `axios`, `dotenv`, `cors`
**Frontend:** `react-router-dom`, `axios`, `react-hook-form`

### Environment Variables
Create a `.env` file in your backend directory with the following keys:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLARIFAI_API_KEY=your_clarifai_key
USDA_API_KEY=your_usda_key
