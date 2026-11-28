# EventHive Backend API

EventHive is a RESTful backend API for event creation, discovery, and ticket booking built with Node.js, Express, TypeScript, and PostgreSQL.

## Tech Stack
- **Runtime & Framework**: Node.js, Express
- **Language & Build**: TypeScript (`NodeNext` / `ESNext`), `tsup`
- **Database**: PostgreSQL (`pg` connection pool)
- **Validation & Security**: `zod`, `bcrypt`, `jsonwebtoken`


## Folder Structure
```text
src/
├── config/
│   └── index.ts
├── db/
│   └── index.ts
├── middleware/
│   ├── auth.ts
│   ├── globalErrorHandler.ts
│   ├── index.d.ts
│   ├── logger.ts
│   └── validateRequest.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.interface.ts
│   │   ├── auth.route.ts
│   │   ├── auth.service.ts
│   │   └── auth.validation.ts
│   ├── booking/
│   │   ├── booking.controller.ts
│   │   ├── booking.interface.ts
│   │   ├── booking.route.ts
│   │   ├── booking.service.ts
│   │   └── booking.validation.ts
│   └── event/
│       ├── event.controller.ts
│       ├── event.interface.ts
│       ├── event.route.ts
│       ├── event.service.ts
│       └── event.validation.ts
├── types/
│   └── index.ts
├── utils/
│   ├── AppError.ts
│   └── sendResponse.ts
├── app.ts
└── server.ts