export default () => ({
  jwt_secret: process.env.JWT_SECRET,
  database: {
    type: process.env.DB_TYPE,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
});
