# 👟 ShoeBot Store: AI-Powered E-commerce

An AI-powered shoe shopping experience that helps users find their perfect shoes with an intelligent chat assistant. Users can chat with an AI assistant to get personalized recommendations, browse products, add items to their cart, and complete their purchases.

## ✨ Features

- **AI Shopping Assistant:** A chat bot that helps users find shoes based on natural language queries.
- **User Authentication:** Secure user registration, login, and profile management.
- **Product Catalog:** Browse, search, and filter a wide range of shoes by category, brand, and price.
- **Shopping Cart:** Add, update, and remove items from a persistent shopping cart.
- **Secure Checkout:** A checkout process that handles shipping and payment details.

## 💻 Technologies Used

- **Frontend:**
  - **React:** For building the user interface.
  - **React Router:** For handling client-side routing.
  - **Axios:** For making API requests to the backend.
  - **Bootstrap:** For responsive and consistent styling.
- **Backend:**
  - **Node.js/Express (inferred):** The API endpoints suggest a Node.js backend with an Express framework.
  - **MongoDB (inferred):** The product IDs (`_id`) suggest a NoSQL database like MongoDB.

## 🚀 API Endpoints

The application interacts with a backend API to perform various actions. The main API calls are defined in `src/utils/api.js`.

### Authentication
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Log in an existing user.
- `GET /auth/profile`: Get the logged-in user's profile.
- `PUT /auth/profile`: Update the logged-in user's profile.

### Products
- `GET /products`: Get all products.
- `GET /products/:id`: Get a single product by ID.
- `GET /products/search?q=...`: Search for products by a query.
- `GET /products/category/:category`: Get products by category.

### Cart
- `GET /cart`: Get the user's shopping cart.
- `POST /cart/add`: Add a product to the cart.
- `PUT /cart/update/:itemId`: Update the quantity of an item in the cart.
- `DELETE /cart/remove/:itemId`: Remove an item from the cart.
- `DELETE /cart/clear`: Clear the entire cart.

### Orders
- `POST /orders`: Create a new order.
- `GET /orders`: Get all orders for the user.
- `GET /orders/:id`: Get a specific order by ID.
- `PUT /orders/:id/status`: Update the status of an order.

### Chat
- `POST /chat/message`: Send a message to the AI assistant.
- `GET /chat/history`: Get the chat history.
- `DELETE /chat/history`: Clear the chat history.

## 🔧 Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (Comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Ensure your backend API is running and accessible. The frontend is configured to use `http://localhost:5000/api` by default.

### Running the App

To run the application in development mode:

```bash
npm start
