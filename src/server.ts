import app from "./app";
import config from "./config";
import { initDB } from "./db";


const startServer = async (): Promise<void> => {
  try {

    await initDB();


    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {

    console.error("Failed to start server:", error);
    process.exit(1);
  }
};


startServer();