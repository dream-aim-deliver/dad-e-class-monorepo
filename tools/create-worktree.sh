#!/bin/bash

# Script to create a git worktree with proper setup for the monorepo
# Usage: ./create-worktree.sh TSK-NUMBER "description with spaces"

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_error() {
    echo -e "${RED}L $1${NC}"
}

print_success() {
    echo -e "${GREEN} $1${NC}"
}

print_info() {
    echo -e "${YELLOW}9 $1${NC}"
}

# Check if we have the required arguments
if [ $# -lt 2 ]; then
    print_error "Missing required arguments!"
    echo "Usage: $0 TSK-NUMBER \"description with spaces\""
    echo "Example: $0 TSK-1234 \"implement new feature\""
    exit 1
fi

# Get arguments
TASK_NUMBER="$1"
DESCRIPTION="$2"

# Convert description to lowercase and replace spaces with underscores
DESCRIPTION_FORMATTED=$(echo "$DESCRIPTION" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')

# Create branch name
BRANCH_NAME="${TASK_NUMBER}-${DESCRIPTION_FORMATTED}"

# Define paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKTREES_DIR="$(cd "$REPO_ROOT/.." && pwd)/worktrees"
WORKTREE_PATH="${WORKTREES_DIR}/${BRANCH_NAME}"

print_info "Creating worktree for branch: ${BRANCH_NAME}"
print_info "Worktree location: ${WORKTREE_PATH}"

# Create worktrees directory if it doesn't exist
if [ ! -d "$WORKTREES_DIR" ]; then
    print_info "Creating worktrees directory..."
    mkdir -p "$WORKTREES_DIR"
    print_success "Worktrees directory created"
fi

# Check if worktree already exists
if [ -d "$WORKTREE_PATH" ]; then
    print_error "Worktree already exists at: ${WORKTREE_PATH}"
    echo "Please remove it first or use a different task number/description"
    exit 1
fi

# Check if branch already exists
cd "$REPO_ROOT"
if git show-ref --verify --quiet "refs/heads/${BRANCH_NAME}"; then
    print_error "Branch '${BRANCH_NAME}' already exists!"
    echo "Please delete the branch first or use a different task number/description"
    exit 1
fi

# Create the worktree with a new branch
print_info "Creating git worktree..."
git worktree add -b "${BRANCH_NAME}" "${WORKTREE_PATH}"
if [ $? -eq 0 ]; then
    print_success "Git worktree created successfully"
else
    print_error "Failed to create git worktree"
    exit 1
fi

# Copy necessary files
print_info "Copying environment and configuration files..."

# Copy .npmrc from root
if [ -f "$REPO_ROOT/.npmrc" ]; then
    cp "$REPO_ROOT/.npmrc" "$WORKTREE_PATH/.npmrc"
    print_success "Copied .npmrc"
else
    print_info ".npmrc not found in root, skipping"
fi

# Copy apps/cms/.env.local
if [ -f "$REPO_ROOT/apps/cms/.env.local" ]; then
    mkdir -p "$WORKTREE_PATH/apps/cms"
    cp "$REPO_ROOT/apps/cms/.env.local" "$WORKTREE_PATH/apps/cms/.env.local"
    print_success "Copied apps/cms/.env.local"
else
    print_info "apps/cms/.env.local not found, skipping"
fi

# Copy apps/platform/.env.local
if [ -f "$REPO_ROOT/apps/platform/.env.local" ]; then
    mkdir -p "$WORKTREE_PATH/apps/platform"
    cp "$REPO_ROOT/apps/platform/.env.local" "$WORKTREE_PATH/apps/platform/.env.local"
    print_success "Copied apps/platform/.env.local"
else
    print_info "apps/platform/.env.local not found, skipping"
fi

# Copy .claude folder if present
if [ -d "$REPO_ROOT/.claude" ]; then
    cp -r "$REPO_ROOT/.claude" "$WORKTREE_PATH/.claude"
    print_success "Copied .claude folder"
else
    print_info ".claude folder not found, skipping"
fi

# Copy .dadai folder if present
if [ -d "$REPO_ROOT/.dadai" ]; then
    cp -r "$REPO_ROOT/.dadai" "$WORKTREE_PATH/.dadai"
    print_success "Copied .dadai folder"
else
    print_info ".dadai folder not found, skipping"
fi

# Run pnpm install in the worktree
print_info "Running pnpm install in the worktree..."
cd "$WORKTREE_PATH"
if command -v pnpm &> /dev/null; then
    pnpm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        echo "You may need to run 'pnpm install' manually in the worktree"
    fi
else
    print_error "pnpm is not installed!"
    echo "Please install pnpm and run 'pnpm install' in the worktree manually"
fi

# Final success message
echo ""
print_success "Worktree setup complete! <�"
echo ""
echo "To start working:"
echo "  cd ${WORKTREE_PATH}"
echo ""
echo "Branch name: ${BRANCH_NAME}"
echo "Worktree path: ${WORKTREE_PATH}"
echo ""
echo "When done, you can remove the worktree with:"
echo "  git worktree remove ${BRANCH_NAME}"