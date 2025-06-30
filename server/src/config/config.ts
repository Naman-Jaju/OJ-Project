    const config = {
      development: {
        username: "your_username", // Replace with your PostgreSQL username
        password: "your_password", // Replace with your PostgreSQL password
        database: "your_database", // Replace with your PostgreSQL database name
        host: "localhost", // Replace with your PostgreSQL host
        port: 5432,       // Default PostgreSQL port
        dialect: "postgres",
      },
      test: {
        // Your test database configuration
        username: "test_username",
        password: "test_password",
        database: "test_database",
        host: "localhost",
        port: 5432,
        dialect: "postgres",
      },
      production: {
        // Your production database configuration
        username: "production_username",
        password: "production_password",
        database: "production_database",
        host: "your_production_host",
        port: 5432,
        dialect: "postgres",
      },
    };
    module.exports = config;