



rm .cache.db && yarn tsc src/prebuild.ts --downlevelIteration --esModuleInterop && node src/prebuild.js
