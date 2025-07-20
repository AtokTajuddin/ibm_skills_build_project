@echo off
echo ====================================================
echo Virtual Hospital Backend - Fixed Startup Script
echo ====================================================
echo.

echo Checking TypeScript setup...

cd /d "%~dp0backend"

echo Installing required dependencies...
call npm install typescript@4.9.5 ts-node@10.9.1 ts-node-dev@2.0.0 @types/node@18.15.11 --save-dev

echo Fixing TypeScript configuration...
echo {
echo   "compilerOptions": {
echo     "target": "es2018",
echo     "module": "commonjs",
echo     "lib": ["es2018", "dom"],
echo     "declaration": true,
echo     "strict": true,
echo     "noImplicitAny": true,
echo     "strictNullChecks": true,
echo     "noImplicitThis": true,
echo     "alwaysStrict": true,
echo     "noUnusedLocals": false,
echo     "noUnusedParameters": false,
echo     "noImplicitReturns": true,
echo     "noFallthroughCasesInSwitch": false,
echo     "moduleResolution": "node",
echo     "baseUrl": "./",
echo     "types": ["node"],
echo     "allowSyntheticDefaultImports": true,
echo     "esModuleInterop": true,
echo     "experimentalDecorators": true,
echo     "emitDecoratorMetadata": true,
echo     "skipLibCheck": true,
echo     "forceConsistentCasingInFileNames": true,
echo     "removeComments": true,
echo     "sourceMap": true,
echo     "outDir": "./dist",
echo     "rootDir": "./src"
echo   },
echo   "include": ["src/**/*"],
echo   "exclude": ["node_modules", "**/*.spec.ts"]
echo }
) > tsconfig.json

echo Starting backend server...
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ====================================================
    echo ERROR: Server failed to start
    echo ====================================================
    echo.
    echo Attempting alternative start method...
    call npx ts-node src/app.ts
)
