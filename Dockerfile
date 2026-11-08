FROM node:24-bookworm-slim

ENV HOME=/home/node \
    NODE_ENV=production \
    SHARP_IGNORE_GLOBAL_LIBVIPS=1
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      fonts-dejavu \
      fonts-liberation \
      fonts-noto-core \
      fonts-noto-extra \
      ghostscript \
      libreoffice-core \
      libreoffice-writer \
      poppler-utils \
      qpdf \
      unzip \
      zip \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /home/node \
    && chown -R node:node /home/node /app

RUN corepack enable && corepack prepare pnpm@11.11.0 --activate

COPY --chown=node:node . .
USER node

RUN pnpm install --frozen-lockfile --prod=false \
    && pnpm --filter @workspace/api-server run build

EXPOSE 3000
CMD ["pnpm", "--filter", "@workspace/api-server", "start"]
