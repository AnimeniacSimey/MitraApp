# MitraApp
App to connect university students with similar interests and break the ice! Accesses user locations using mobile geolocation data and stores in a secure database, displays locations of nearby like-minded university students; whether you're making new friends or looking for project partner, Mitra helps you build your network.

# Tech Stack:
- Built using React JS to run the web app locally
- React communicates with OpenStreetMaps API to feed coordinate data to and from the SQL server
- Backend: locally hosted Docker SQL server
- Operable using any modern browser or mobile OS

# Backend Setup Instructions

## 1. Install SQL Server
Install SQL Server Express + SSMS

## 2. Restore Database
- Open SSMS
- Restore `MitraDB.bak`

## 3. Configure SQL Server
- Enable TCP/IP
- Set port to 1433

## 4. Create Login
Run:

ALTER LOGIN mitra_user
WITH PASSWORD = 'StrongPass123!' UNLOCK;

## 5. Install dependencies
npm install

## 6. Run server
node index.js
