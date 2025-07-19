require('dotenv').config();

const USER = process.env.DB_USER_NAME;
const PASSWORD = process.env.DB_PASSWORD;

module.exports =  {
  dialect: 'postgres',
  host: 'localhost',
  username: USER,
  password: PASSWORD,
  database: 'crud_api',
  define: {
    timestamps: true,       // Automatically adds createdAt and updatedAt fields
    underscored: true,      // Use snake_case for column names
    underscoredAll: true    // Use snake_case for all column names
  }
};

