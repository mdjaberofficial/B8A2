eventhive-api/
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies & scripts (dev, build, start)
├── README.md                       # Project & API documentation
├── tsconfig.json                   # Strict TypeScript configuration
├── tsup.config.ts                  # ESM/CJS bundle config for dist/server.js
├── vercel.json                     # Vercel deployment routing configuration
├── logger.txt                      # Request audit log output (optional / local)
└── src/
    ├── app.ts                      # App configuration & middleware pipeline
    ├── server.ts                   # Server bootstrap & database pool connection
    ├── config/
    │   └── index.ts                # Environment variables loader
    ├── db/
    │   └── index.ts                # PostgreSQL pool & auto schema migration (users, events, bookings)
    ├── middleware/
    │   ├── auth.ts                 # JWT authentication & Role-Based Access Control (RBAC)
    │   ├── globalErrorHandler.ts   # Centralized 4-argument error handler (AppError + PG errors)
    │   ├── index.d.ts              # TypeScript declaration merging for Express.Request (req.user)
    │   ├── logger.ts               # Custom request logging middleware
    │   └── validateRequest.ts      # Optional Zod validation middleware
    ├── modules/
    │   ├── auth/                   # Registration & Login with JWT token issuance
    │   │   ├── auth.controller.ts
    │   │   ├── auth.interface.ts
    │   │   ├── auth.route.ts
    │   │   ├── auth.service.ts
    │   │   └── auth.validation.ts  # Optional Zod schemas for signup & login
    │   ├── events/                 # Events CRUD, search, & seat inventory management
    │   │   ├── event.controller.ts
    │   │   ├── event.interface.ts
    │   │   ├── event.route.ts
    │   │   ├── event.service.ts
    │   │   └── event.validation.ts # Optional Zod schemas for create & update event
    │   └── bookings/               # Ticket booking, history & cancellation
    │       ├── booking.controller.ts
    │       ├── booking.interface.ts
    │       ├── booking.route.ts
    │       ├── booking.service.ts
    │       └── booking.validation.ts # Optional Zod schema for book tickets
    ├── types/
    │   └── index.ts                # Role types ("attendee" | "organizer") & constants
    └── utils/
        ├── AppError.ts             # Custom HTTP error class (statusCode + errors array)
        └── sendResponse.ts         # Generic type-safe response helper