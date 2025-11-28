## 🎧 Kyle Patterson – DJS Portfolio Project: Podcast App (React)
## 📋 Overview

This project represents the culmination of my DJS React course journey, building a fully-featured podcast application from scratch.

The app allows users to browse, search, filter, and sort podcasts, view detailed show information with seasons and episodes, and enjoy seamless audio playback. In this final phase, I enhanced the application with global audio playback, episode favouriting, recommended shows, theme toggling, and deployment optimizations to create a polished, user-friendly experience.

Note: I focused on creating a smooth, responsive interface that reflects best practices in React development and modern web applications.

## 🎯 Objectives

Implement a global audio player with persistent playback across navigation

Enable favouriting episodes with persistent storage in localStorage

Include a recommended shows carousel on the landing page

Support light/dark theme toggling across the app

Ensure robust routing and professional deployment on Vercel

Optionally track listening progress across sessions

## 🚀 Core Features & User Stories
## 🛠️ Setup and Deployment

Deployed on Vercel with a clean, production-ready URL

Custom favicon for brand identity

Added rich social preview metadata using Open Graph & Twitter cards

SPA routing works correctly for direct access to show pages

## 🔊 Global Audio Player

Fixed audio player at the bottom of the screen for consistent access

Supports play, pause, seek, and progress tracking

Playback persists across page navigation

Prompt before leaving a page with active playback

## ❤️ Favourites

Users can favourite/unfavourite individual episodes

Persistent storage via localStorage ensures favourites are saved across sessions

Visual feedback using filled/empty heart icons

Dedicated Favourites page with all saved episodes

Display includes show title, season, episode number, and date added

Favourites are grouped by show and can be sorted:

A–Z / Z–A by title

Newest / Oldest by date added

## 🎠 Recommended Shows Carousel

Horizontally scrollable carousel on the landing page

Displays podcast cover, title, and genres

Supports looping and navigation via arrows or swipe gestures

Clicking an item opens the Show Detail page

## 🌗 Theme Toggle

Light/Dark mode toggle for the entire app

User selection persisted in localStorage

Smooth transitions between themes

Icons indicate current theme (sun/moon)


## ✅ Deliverables

Fully functional React podcast app deployed on Vercel

Source code on GitHub with clear commit history

Live demo link for review

Optional demo video showing all implemented features

## 💡 Tips & Implementation Notes

Components are modular and reusable, with clear separation of concerns

State management handled using React hooks and context where appropriate

Responsive design ensures mobile-friendly experience

Audio persistence and favourites are tested and fully functional

Leveraged the React ecosystem (React Router, React Helmet, CSS Modules) to optimize workflow