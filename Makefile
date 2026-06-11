# Makefile
.PHONY: one-shot

# Package manager
PM := pnpm

# --- Setup & Install ---
setup: install

install: install-mobile install-server install-web

install-mobile:
	cd mobile && $(PM) install

install-server:
	cd server && $(PM) install

install-web:
	cd web && $(PM) install

# --- Development ---
dev:
	@echo "Starting all services in development mode..."
	@$(MAKE) -j 3 dev-mobile dev-server dev-web

dev-mobile:
	cd mobile && $(PM) start

dev-server:
	cd server && $(PM) run start:dev

dev-web:
	cd web && $(PM) run dev

# --- Production / Start ---
start:
	@echo "Starting all services..."
	@$(MAKE) -j 3 start-mobile start-server start-web

start-mobile:
	cd mobile && $(PM) start

start-server:
	cd server && $(PM) run start:prod

start-web:
	cd web && $(PM) run start

# --- Docker ---
docker:
	@echo "Docker configuration not found. Please add Dockerfiles to the subdirectories."
	@echo "Example: docker build -t my-app-server ./server"

# --- Testing ---
test: test-server
	@echo "Tests completed."

test-mobile:
	@echo "No tests defined for mobile."

test-server:
	cd server && $(PM) run test

test-web:
	@echo "No tests defined for web."

# --- Clean ---
clean:
	rm -rf mobile/node_modules server/node_modules web/node_modules
	rm -rf server/dist web/.next
