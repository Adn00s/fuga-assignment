# Fuga Music Project - Docker Commands

.PHONY: help dev up down logs clean build test

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev       - Start development environment"
	@echo "  make up        - Start production environment"
	@echo "  make down      - Stop all services"
	@echo "  make logs      - View logs from all services"
	@echo "  make logs-api  - View backend API logs"
	@echo "  make logs-db   - View database logs"
	@echo "  make clean     - Remove all containers and volumes"
	@echo "  make build     - Build all services"
	@echo "  make test      - Run tests in container"

# Development environment with hot reload
dev:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "🚀 Development environment started!"
	@echo "Backend API: http://localhost:3000"
	@echo "API Explorer: http://localhost:3000/api-explorer"
	@echo "Health Check: http://localhost:3000/api/health"

# Production environment
up:
	docker-compose up -d
	@echo "🚀 Production environment started!"

# Stop all services
down:
	docker-compose -f docker-compose.dev.yml down
	docker-compose down

# View logs
logs:
	docker-compose -f docker-compose.dev.yml logs -f

logs-api:
	docker-compose -f docker-compose.dev.yml logs -f backend

logs-db:
	docker-compose -f docker-compose.dev.yml logs -f postgres

# Clean up everything
clean:
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v
	docker system prune -f

# Build services
build:
	docker-compose -f docker-compose.dev.yml build
	docker-compose build

# Run tests in container
test:
	docker-compose -f docker-compose.dev.yml exec backend npm test
