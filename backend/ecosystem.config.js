const {
  JWT_SECRET,
  DB_TYPE,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PGDATA,
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF,
  DEPLOY_REPO,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'kpd',
      script: './dist/main.js',
      env_production: {
        JWT_SECRET,
        DB_TYPE,
        POSTGRES_HOST,
        POSTGRES_PORT,
        POSTGRES_USER,
        POSTGRES_PASSWORD,
        POSTGRES_DB,
        POSTGRES_PGDATA,
      },
    },
  ],
  deploy: {
    production: {
      key: '~/.ssh/id_rsa',
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      'pre-deploy-local': `scp .env* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`, // Копирование файлов .env на удаленный сервер
      'post-deploy':
        'npm ci && npm run build && pm2 reload ecosystem.config.js --env production', // Команды, выполняемые после деплоя
    },
  },
};
