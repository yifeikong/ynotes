build:
	rm .cache.db; yarn ts-node src/prebuild.ts

publish:
	yarn vercel --prod
