lint:
	docker compose exec php composer cs
	docker compose exec php composer phpcbf || true
	cd pwa && pnpm run lint:fix
	cd pwa && pnpm run format:fix
	cd pwa && pnpm run type-check

phpstan:
	php -d memory_limit=-1 api/vendor/bin/phpstan analyse ./api/src -c ./api/phpstan.neon

test:
	docker compose exec php composer test
	docker run --network host -w /app -v ./e2e:/app --rm --ipc=host mcr.microsoft.com/playwright:v1.48.2-noble /bin/sh -c 'npm i; npx playwright test;'
