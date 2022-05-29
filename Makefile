help:
	node  bin/gendiff.js -h
lint:
	npx eslint .
test:
	npm run test
install:
	npm install
test-coverage:
	npm test -- --coverage --coverageProvider=v8