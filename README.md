# 📚 Self-Learning Backend Project

This is a self-learning project built to deepen my understanding of backend development using modern technologies such as **Node.js**, **NestJS**, **GraphQL**, and **PostgreSQL**. It covers real-world practices like API design, database interaction, caching, modular architecture, and more.

> 🔗 **Frontend Code Available**:  
> This project comes with a modern and responsive frontend built using Next.js & Tailwind CSS.  
> 👉 [View Frontend Repository](https://github.com/FakhrulZiq/library-management-system-fe)


## 🧰 Tech Stack

- Node.js – JavaScript runtime  
- NestJS – Progressive Node.js framework  
- GraphQL – Flexible API query language  
- PostgreSQL – Relational database  
- TypeORM – ORM for TypeScript and Node.js  
- Redis – Caching layer (via `cache-manager`)  
- Jest – Unit testing framework  

## ✨ Features

- Modular and scalable project structure  
- GraphQL CRUD APIs  
- PostgreSQL integration with TypeORM  
- Redis caching layer  
- Basic pagination and search  
- Unit testing support  
- Environment variable management  

## 🚀 Getting Started

### Prerequisites

- Node.js v18+  
- PostgreSQL  
- Redis (optional if caching is enabled)  

### Installation

```bash
# Clone the repository
git clone https://github.com/FakhrulZiq/library-management-system-be
cd library-management-system-be

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory and configure it:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=youruser
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=yourdbname

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=yourpassword
```

### Run the Project

```bash
# Start the development server
npm run start:dev

# Run the build
npm run build

# Start in production
npm run start:prod
```

### Run Tests

```bash
npm run test
```


### View API Documentation

> 📘 **Swagger UI Available**
> 
> Once the server is running, you can view the auto-generated REST API documentation at:
> 
> 👉 http://localhost:3000/api

## 📁 Project Structure

```
src/
├── modules/
│   ├── book/
│   │   ├── book.module.ts
│   │   ├── book.service.ts
│   │   └── book.resolver.ts
├── common/
│   ├── logger/
│   ├── cache/
│   └── constants/
└── main.ts
```

## 📌 Purpose

This project is part of my personal journey to improve backend development skills and explore real-world backend concepts using TypeScript and NestJS.

---

Feel free to fork, clone, or suggest improvements!



