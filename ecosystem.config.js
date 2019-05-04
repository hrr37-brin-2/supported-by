module.exports = {
  apps : [{
    name: 'API',
    script: 'app.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PG_EC2_PW: 'leomoz33',
      PG_EC2_HOST: 'ec2-18-237-71-223.us-west-2.compute.amazonaws.com',
      PG_EC2_USER: 'power_user'
    },
    env_production: {
      NODE_ENV: 'production',
      PG_EC2_PW: 'leomoz33',
      PG_EC2_HOST: 'ec2-18-237-71-223.us-west-2.compute.amazonaws.com',
      PG_EC2_USER: 'power_user'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};