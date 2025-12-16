# ParkEase - Smart Parking Finder & Booking System

## Overview
ParkEase is a MERN stack application designed to simplify parking management. It allows users to find parking spots, book them in advance, and pay securely. It features 3 roles: Drivers, Parking Lot Owners, and Admins.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT & bcrypt
- **Real-time**: Socket.io
- **Scheduler**: node-cron

## Setup
1. Clone the repository.
2. Navigate to `backend/`.
3. Run `npm install`.
4. Create a `.env` file (see `.env.example`).
5. Run `npm start` (or `npm run dev` for development).

## API Overview
- `/api/auth`: Authentication (Register, Login)
- `/api/parking-lots`: Manage parking lots
- `/api/slots`: manage slots (Supports EV/Normal types)
- `/api/bookings`: Booking operations (Auto-price calculation, Extensions)
- `/api/reviews`: User reviews

## Key Features
- **Real-time Updates**: Socket.io integration for instant slot status changes.
- **Auto-Release**: Slots automatically free up when bookings expire.
- **Smart Booking**: Price is calculated automatically based on duration.
- **Strict Roles**: Drivers only for bookings; Owners/Admins for management.
