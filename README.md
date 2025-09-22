# 🎬 MovieHub

MovieHub is a full-stack web application that allows users to upload, browse, vote, and comment on movies.  
It supports authentication, role-based permissions (admin vs normal user), and sorting movies by latest, trending, and worst.

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/MovieHub.git
cd MovieHub
cd moviehub-backend
npm install
PORT=5000
DATABASE_URL=postgres://username:password@hostname:5432/dbname
JWT_SECRET=yourSecretKey
FRONTEND_URK=

Schema tables in utils/databse.sql
npm start

Frontend Setup
cd ../moviehub-frontend
npm install
npm run dev   # or npm run build && npm run preview

Schema Diagram
<img width="1352" height="590" alt="image" src="https://github.com/user-attachments/assets/257d6787-7c3a-4ffa-8942-8ffbec8d964c" />

AI Usage
- Designing database tables, relationships, and constraints.
- Structuring the monorepo with backend and frontend separation.
- Creating React components, Tailwind CSS styling, and vote highlighting.
- Debugging React hooks, API calls, and vote sync issues.
- Deployment setup, environment variables, and CORS configuration.


## 📡 API Routes

All routes are prefixed with `/api`.  
For protected routes, include the JWT token in the `Authorization` header:  

---

### **Auth**
| Method | Endpoint     | Body              | Description                    |
|--------|-------------|-----------------|--------------------------------|
| POST   | `/signup`   | `{ username, email, password }` | Register a new user |
| POST   | `/login`    | `{ email, password }` | Login and get JWT token |

---

### **Movies**
| Method | Endpoint                    | Body/Params                     | Description |
|--------|----------------------------|---------------------------------|-------------|
| GET    | `/movies`                  | —                               | Get all movies (latest first) |
| GET    | `/movies/trending`         | —                               | Get movies sorted by highest votes |
| GET    | `/movies/worst`            | —                               | Get movies sorted by lowest votes |
| POST   | `/movies`                  | `{ title, description }`        | Add a new movie (auth required) |
| DELETE | `/movies/:movieId`         | —                               | Delete a movie (auth required, owner/admin) |
| POST   | `/movies/:movieId/vote`    | `{ vote_type: 1|-1 }`          | Vote for a movie (auth required) |
| GET    | `/movies/:id`              | —                               | Get single movie by ID |
| GET    | `/movies/search?q=query`   | Query param `q`                 | Search movies by title/description |

---

### **Comments**
| Method | Endpoint                       | Body/Params         | Description |
|--------|--------------------------------|-------------------|-------------|
| GET    | `/movies/:movieId/comments`    | —                 | Get comments for a movie |
| POST   | `/movies/:movieId/comments`    | `{ body }`        | Add a comment (auth required) |
| DELETE | `/comments/:commentId`         | —                 | Delete comment (auth required, owner/admin) |
| POST   | `/editcomments/:commentId`     | `{ body }`        | Edit comment (auth required, owner only) |

---

### **Voting**
- Vote type: `1` = upvote, `-1` = downvote.
- If the user repeats the same vote, it removes the vote.
- If the user changes vote, it updates automatically.

---

### **Notes**
- Protected routes require a valid JWT token in `Authorization` header.
- Public routes (`GET /movies`, `GET /movies/:id`, `GET /movies/search`) can be accessed without login, but `user_vote` will be returned only for logged-in users.

Admin login
alice@example.com    123456


[Frontend Site](https://movie-hub-ochre-six.vercel.app/)
[Backend Link](https://moviehub-ryih.onrender.com)
