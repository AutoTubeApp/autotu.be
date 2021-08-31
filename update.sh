#!/bin/sh

set -e;
ssh-agent bash;
ssh-add /root/.ssh/id_rsa_gh;
git reset --hard;
git pull;
npm i;
npm run build;
pm2 restart autotube;
