# npm
run:
	npm run serve

docdevup:
	docker-compose \
		-f ./config/.docker/docker-compose.yml \
		-f ./config/.docker/docker-compose.dev.yml \
		up -d

docdevbuild:
	docker-compose \
		-f ./config/.docker/docker-compose.yml \
		-f ./config/.docker/docker-compose.dev.yml \
		up -d --build

docdevdown:
	docker volume prune -f && \
	docker-compose \
		-f ./config/.docker/docker-compose.yml \
		-f ./config/.docker/docker-compose.dev.yml \
		down

# production
docprodup:
	docker-compose \
		-f ./config/.docker/docker-compose.yml \
		-f ./config/.docker/docker-compose.prod.yml \
		up -d --build

docproddown:
	docker volume prune -f && \
	docker-compose \
		-f ./config/.docker/docker-compose.yml \
		-f ./config/.docker/docker-compose.prod.yml \
		down

push:
	git push origin main

prod:
	git push heroku main
