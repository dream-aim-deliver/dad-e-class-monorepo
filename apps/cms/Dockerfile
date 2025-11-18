FROM almalinux:9

LABEL stage=production

RUN dnf -y update && \
    dnf -y module reset nodejs && \
    dnf -y module enable nodejs:20 && \
    dnf -y module install nodejs:20/common && \
    dnf -y install httpd mod_ssl python39 python-pip git procps patchutils vim jq && \
    dnf clean all && \
    rm -rf /var/cache/dnf

RUN python3 -m pip install --no-cache-dir --upgrade pip && \
    python3 -m pip install --no-cache-dir --upgrade --ignore-installed setuptools
RUN python3 -m pip install --no-cache-dir j2cli

RUN rm -rf /etc/httpd/conf.d/ssl.conf

ENV NVM_DIR=/home/e-class/.nvm
RUN mkdir -p $NVM_DIR
ENV NODE_VERSION=23.10.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

RUN npm i -g pm2 pnpm

WORKDIR /opt/dadai/app
COPY . .

ENV APP_PATH=/opt/dadai/app

RUN pnpm install --frozen-lockfile

# This removes a plugin that is not required in production and causes the build to fail.
# The build failure happens only in PM2 environment despite utilizing the latest Node version.
RUN jq '.plugins = [.plugins[] | select(.plugin != "@nx/eslint/plugin")]' nx.json > nx.tmp.json && \
    mv nx.tmp.json nx.json

# Build the CMS app during Docker image creation
# This improves startup time from ~2-3 minutes to ~1 second
RUN pnpm nx build cms

EXPOSE 443
EXPOSE 80
EXPOSE 3000

ENTRYPOINT ["apps/cms/config/docker-entrypoint.sh"]
