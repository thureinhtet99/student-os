PM := pnpm

# Help
.PHONY: help
help:
	@echo "*student-os Project Makefile* - Available Commands:"
	@echo "  make setup          - Install dependencies and set up project including ./web, ./server and ./mobile"
	@echo "  make start          - Start Expo development server"
	@echo "  make android        - Run on Android"
	@echo "  make ios            - Run on iOS"
	@echo "  make web            - Run on Web"
	@echo "  make prebuild       - Run Expo prebuild (for native builds)"
	@echo "  make clean-ios      - Clean iOS build artifacts"
	@echo "  make clean-android  - Clean Android build artifacts"
	@echo "  make clean-all      - Clean all build artifacts"
	@echo "  make reset          - Reset node_modules and cache"
	@echo "  make lint           - Run ESLint"
	@echo "  make typecheck      - Run TypeScript type check"

# --- Setup & Install ---
.PHONY: setup
setup:
	@echo "Setting up project..."
	cd mobile && $(PM) install
	cd server && $(PM) install
	cd web && $(PM) install

# --- Development ---
.PHONY: dev
dev:
	@echo "Starting all services in development mode..."
	@$(MAKE) -j 3 dev-mobile dev-server dev-web

.PHONY: dev-mobile
dev-mobile:
	cd mobile && $(PM) run start

.PHONY: dev-mobile-web
dev-mobile-web:
	cd mobile && $(PM) run web

.PHONY: dev-server
dev-server:
	cd server && $(PM) run start:dev

.PHONY: dev-web
dev-web:
	cd web && $(PM) run dev

# --- Expo Run / Commands ---
.PHONY: start
start:
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
	@$(MAKE) -j 3 build-mobile build-server build-web

.PHONY: build-mobile
build-mobile:
	@echo "No build defined for mobile." 

.PHONY: build-server
build-server:
	cd server && $(PM) run build

.PHONY: build-web
build-web:
	cd web && $(PM) run build

# --- Testing ---
.PHONY: test test-mobile test-server test-web
test: test-mobile test-server test-web
	@echo "Tests completed."

test-mobile:
	@echo "No tests defined for mobile."

test-server:
	cd server && $(PM) run test

test-web:
	@echo "No tests defined for web."

# --- Quality Assurance ---
.PHONY: lint
lint:
	cd mobile && $(PM) run lint
	cd server && $(PM) run lint
	cd web && $(PM) run lint

.PHONY: typecheck
typecheck:
	cd mobile && $(PM) run check-types
	cd server && $(PM) run check-types
	cd web && $(PM) run check-types

# --- Clean ---
.PHONY: clean clean-ios clean-android clean-all reset
clean: clean-all

clean-ios:
	rm -rf mobile/ios

clean-android:
	rm -rf mobile/android

clean-all: clean-ios clean-android
	rm -rf server/dist web/.next

reset: clean-all
	rm -rf mobile/node_modules server/node_modules web/node_modules
	rm -rf mobile/.expo