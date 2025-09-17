#!/bin/bash
log() {
    echo -e "\e[32m$(date -u) [e-class-cms] - $@\e[0m"
}

log "Generating ecosystem.config.js"
j2 apps/cms/config/ecosystem.config.js.j2 > /opt/dadai/app/ecosystem.config.js
echo "=================== /opt/dadai/app/ecosystem.config.j2 ==================="
cat /opt/dadai/app/ecosystem.config.js

log "Starting pm2"
npx pm2 start ecosystem.config.js --daemon

log "Building Apache configuration files."
j2 apps/cms/config/httpd.conf.j2 | sed '/^\s*$/d' > /etc/httpd/conf/httpd.conf
echo "=================== /etc/httpd/conf/httpd.conf ========================"
cat /etc/httpd/conf/httpd.conf
echo ""

log "Building E-Class cms Apache configuration files."
j2 apps/cms/config/dad.conf.j2 | sed '/^\s*$/d' > /etc/httpd/conf.d/dad.conf
echo "=================== /etc/httpd/conf/conf.d/dad.conf ========================"
cat /etc/httpd/conf.d/dad.conf
echo ""

log "Removing default Apache SSL configuration files."
rm -f /etc/httpd/conf.d/ssl.conf

log "Starting Apache"
httpd

log "Starting pm2 logs"
npx pm2 logs
