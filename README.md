# 🚀 Crypto Monitor

Crypto Monitor is a full-stack application that tracks cryptocurrency prices using external APIs and stores historical prices in a database. It consists of:

- **crypto-backend (NestJS)** → Handles API requests, data storage, and caching.
- **crypto-frontend (Angular)** → Displays real-time and historical prices in a clean UI.

---

## 📌 **Setup Instructions**
### **1️⃣ Clone the repository**
```sh
git clone https://github.com/jesusjackson/cryptomonitor
cd crypto-monitor
```
### Backend preparations
Put the Coin Market API key on .env inside the backend folder
Run:
```
cd crypto-backend
npm install
docker-compose up --build
```
### Frontend preparations
Run:
```
cd crypto-frontend
npm install
docker-compose up --build
```
You can access the frontend on the url: http://localhost:4200/
### ✅ **What can be Improved?**
✔ **`.env` File Configuration**  
✔ **More Troubleshooting Steps**  
✔ **Complete API Endpoints List**  
✔ **Consistent Formatting & Clarity**
✔ **Use https for the frontend**

Would you like me to **save this as `README.md`** in your project? 😊