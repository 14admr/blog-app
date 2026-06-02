# MEVN Blog API - Backend

## App Description

This is the backend API for a MEVN stack Blog Application. It features user authentication with secure password hashing, and a full CRUD blog post management system. It includes role-based access control, allowing any user to view posts, authenticated users to create and manage their own posts, and administrators to delete any posts.

## User Credentials

| Account Type | Email              | Password  |
| ------------ | ------------------ | --------- |
| Regular      | jamesDoe@mail.com  | sample123 |
| Admin        | admin@mail.com     | admin123  |

## Features

**User Authentication:**

- Users can register with email, username, and password.
- Secure log-in and password hashing.

**Blog Post Management:**

- Create, Read, Update, and Delete (CRUD) operations for blog posts.
- Each post includes a title, content, author information, and creation date.

**Access Control:**

- **All Users:** Can view all available posts and view a single post.
- **Authenticated Users:** Can create new posts, update their own posts, and delete their own posts.
- **Admin:** Allowed to delete *any* posts.
