# npm
run:
	npm run serve

# docker
docup:
	docker-compose -f ./config/.docker/docker-compose.yml up -d

docbuild:
	docker-compose -f ./config/.docker/docker-compose.yml up -d --build

docdown:
	docker-compose -f ./config/.docker/docker-compose.yml down

# git
or:
	git push origin main

prod:
	git push heroku main
