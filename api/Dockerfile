FROM php:8.4-cli-alpine

RUN apk add --no-cache \
    bash \
    git \
    libzip-dev \
    oniguruma-dev \
    postgresql-dev \
    icu-dev \
    unzip \
    && docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    bcmath \
    intl \
    mbstring \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache/data storage/logs \
    && composer install --no-dev --optimize-autoloader --no-interaction \
    && composer clear-cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000

HEALTHCHECK --interval=10s --timeout=5s --retries=10 \
    CMD wget -qO- http://127.0.0.1:8000/up || exit 1

ENTRYPOINT ["entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
