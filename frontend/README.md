# ParkEase Frontend

A modern, responsive, and animated frontend for the ParkEase Smart Parking System. Built with React, Tailwind CSS, and GSAP.

## Tech Stack
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock)
- **Routing**: React Router DOM v6
- **State Management**: Context API
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios

## Features
- **Role-Based Auth**: Distinct flows for Drivers and Owners/Admins.
- **Real-Time Updates**: Slots change color instantly when booked/released.
- **Smart Booking**: Frontend price calculation before confirmation.
- **Responsive Design**: Mobile-friendly Navbar and Grids.
- **Smooth Animations**: Hero entries, staggered lists, and hover effects.

## Setup & Run

1.  **Install Dependencies**
    ```bash
    cd frontend
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Runs on `http://localhost:5173` by default.

## Project Structure
- `src/components`: Reusable UI (Navbar, SlotCard, Loader).
- `src/pages`: Main views (Home, Slots, Booking, Dashboard).
- `src/context`: Authentication logic.
- `src/services`: API and Socket configuration.
- `src/animations`: Reusable GSAP functions.
