PM := pnpm

# Help
.PHONY: help
help:
	@echo "*student-os* - Available Commands:"
	@echo "  make setup          - Install dependencies and set up project including ./client, ./server and ./mobile"
	@echo "  make dev            - Start in development mode for all services"
	@echo "  make build          - Build all services"
	@echo "  make test           - Run tests for all services"
	@echo "  make lint           - Run ESLint for all services"
	@echo "  make typecheck      - Run TypeScript type check for all services"
	@echo "  make start          - Start Expo development server (alias for start-mobile)"
	@echo "  make android        - Run mobile app on Android"
	@echo "  make ios            - Run mobile app on iOS"
	@echo "  make web            - Run mobile app on Web"
	@echo "  make prebuild       - Run Expo prebuild (for native builds)"
	@echo "  make clean-ios      - Clean iOS build artifacts"
	@echo "  make clean-android  - Clean Android build artifacts"
	@echo "  make clean-server   - Clean server build artifacts"
	@echo "  make clean-client   - Clean client build artifacts"
	@echo "  make clean-all      - Clean all build artifacts"
	@echo "  make reset          - Reset node_modules and cache"

# --- Setup & Install ---
.PHONY: setup
setup:
	@echo "Setting up project..."
	cd mobile && $(PM) install
	cd server && $(PM) install
	cd client && $(PM) install

# --- Development ---
.PHONY: dev
dev:
	@echo "Starting all services in development mode..."
	@$(MAKE) -j 3 dev-mobile dev-server dev-client

.PHONY: dev-mobile
dev-mobile:
	@echo "Starting mobile in development mode..."
	cd mobile && $(PM) run start

.PHONY: dev-mobile-web
dev-mobile-web:
	@echo "Starting mobile for web in development mode..."
	cd mobile && $(PM) run web

.PHONY: dev-server
dev-server:
	@echo "Starting server in development mode..."
	cd server && $(PM) run start:dev

.PHONY: dev-client
dev-client:
	@echo "Starting client in development mode..."
	cd client && $(PM) run dev

# --- Expo Run / Commands ---
.PHONY: start start-mobile
start: start-mobile

start-mobile:
	cd mobile && $(PM) run start

.PHONY: android
android:
	cd mobile && $(PM) run android

.PHONY: ios
ios:
	cd mobile && $(PM) run ios

.PHONY: web
web:
	cd mobile && $(PM) run web

.PHONY: prebuild
prebuild:
	cd mobile && npx expo prebuild

# --- Development / Build ---
.PHONY: build
build:
	@echo "Starting to build all services..."
	@$(MAKE) -j 3 build-mobile build-server build-client

.PHONY: build-mobile
build-mobile:
	@echo "No build defined for mobile." 

.PHONY: build-server
build-server:
	@echo "Starting to build sever..."
	cd server && $(PM) run build

.PHONY: build-client
build-client:
	@echo "Starting to build client..."
	cd client && $(PM) run build

# --- Testing ---
.PHONY: test test-mobile test-server test-client
test: test-mobile test-server test-client
	@echo "Tests completed."

test-mobile:
	@echo "No tests defined for mobile."

test-server:
	@echo "Testing with jest for server..."
	cd server && $(PM) run test

test-client:
	@echo "No tests defined for client."

# --- Quality Assurance ---
.PHONY: lint
lint:
	@echo "Linting for all services..."
	cd mobile && $(PM) run lint
	cd server && $(PM) run lint
	cd client && $(PM) run lint

.PHONY: typecheck
typecheck:
	@echo "Type checking for all services..."
	cd mobile && $(PM) run check-types
	cd server && $(PM) run check-types
	cd client && $(PM) run check-types

# --- Clean ---
.PHONY: clean-ios clean-android clean-server clean-client clean-all reset

clean-ios:
	@echo "Cleaning ios from ./mobile..."
	rm -rf mobile/ios

clean-android:
	@echo "Cleaning android from ./mobile..."
	rm -rf mobile/android

clean-server:
	@echo "Cleaning dist from ./server..."
	rm -rf server/dist

clean-client:
	@echo "Cleaning dist from ./client..."
	rm -rf client/dist

clean-all: clean-ios clean-android clean-server clean-client

reset:
	@echo "Removing node_modules from ./mobile, ./server and ./client..."
	rm -rf mobile/node_modules server/node_modules client/node_modules

	@echo "Removing .expo from ./mobile..."
	rm -rf mobile/.expo