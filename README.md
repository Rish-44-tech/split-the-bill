# Split The Bill 💸

A simple expense-splitting web app (Splitwise-style) that lets groups of people track shared expenses, see who owes whom, and settle up — without the mental math.

## Features

- **Users & Groups** — create users, create groups, and add members to a group
- **Expenses** — log an expense paid by one member and split it evenly across chosen group members
- **Balances** — automatically computes a simplified "who owes whom" settlement for a group
- **Activity feed** — per-user activity log across all groups (or filtered to a single group), with a "recent" shortcut for the latest entries

## Tech Stack

- Runtime: Node.js + TypeScript
- Server: Express
- Database ORM: Prisma
- Middleware: `cors`, `express.json`
- Config: `dotenv`
- Frontend: React + Vite (currently in progress)


## Getting Started

### Prerequisites

- Node.js (v18+)
- A database supported by Prisma (e.g. PostgreSQL, MySQL, SQLite)

### Installation

```bash
git clone https://github.com/Rish-44-tech/split-the-bill.git
cd split-the-bill
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your-database-connection-string"
PORT=3000
```

### Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### Run the Server

```bash
npm run dev
```

The server starts on `http://localhost:3000` (or the `PORT` you configured).

## API Reference

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Basic hello-world check |
| GET | `/api/health` | Server health status |

### Users
| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/users` | `{ name, email }` | Create a new user |

### Groups
| Method | Endpoint | Query / Body | Description |
|---|---|---|---|
| GET | `/api/groups` | `?userId=` | Get all groups a user belongs to |
| POST | `/api/groups` | `{ name, creatorId }` | Create a group (creator becomes first member) |
| GET | `/api/groups/:groupId/members` | — | List members of a group |
| POST | `/api/groups/:groupId/members/:userId` | — | Add a user to a group |

### Expenses
| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/groups/:groupId/expenses` | — | List all expenses for a group (newest first) |
| POST | `/api/expenses` | `{ description, amount, groupId, paidById, memberIds }` | Create an expense, split evenly across `memberIds` |

### Balances
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/groups/:groupId/balance` | Returns a simplified settlement list (who owes whom, and how much) |

### Activity
| Method | Endpoint | Query | Description |
|---|---|---|---|
| GET | `/api/:userId/activity` | `?filter=all\|<groupName>`, `?recent=true` | Returns activity across all groups or a specific group; `recent=true` returns only the latest entries |


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License

MIT
