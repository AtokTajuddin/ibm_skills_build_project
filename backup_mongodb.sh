#!/bin/bash

# MongoDB Backup Script for Linux/Mac
# This script creates a backup of the Virtual Hospital MongoDB database
# and stores it in a secure location with date-based folders

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_ROOT="${SCRIPT_DIR}/db_backups"
DATABASE_NAME="virtual_hospital"
DATE_FORMAT=$(date +"%Y-%m-%d")
BACKUP_DIR="${BACKUP_ROOT}/${DATE_FORMAT}"
KEEP_DAYS=7

# Print header
echo "====================================================="
echo "Virtual Hospital Project - MongoDB Backup Script"
echo "====================================================="
echo "Database: ${DATABASE_NAME}"
echo "Backup location: ${BACKUP_DIR}"
echo "Keeping backups for ${KEEP_DAYS} days"
echo "====================================================="

# Function to check if MongoDB tools are available
check_mongo_tools() {
    if ! command -v mongodump &> /dev/null; then
        echo "MongoDB tools not found. Please ensure MongoDB is installed and in your PATH."
        echo "You can install MongoDB tools with:"
        echo "  Ubuntu/Debian: sudo apt install mongodb-clients"
        echo "  CentOS/RHEL: sudo yum install mongodb-org-tools"
        echo "  macOS: brew install mongodb/brew/mongodb-database-tools"
        return 1
    fi
    echo "MongoDB tools found in PATH"
    return 0
}

# Function to check if MongoDB is running
check_mongodb_running() {
    # Try to connect to MongoDB
    if mongo --eval "db.version()" &> /dev/null; then
        echo "MongoDB is running"
        return 0
    else
        echo "MongoDB does not appear to be running"
        echo "Try starting the MongoDB service with: sudo systemctl start mongod"
        return 1
    fi
}

# Create backup directory
create_backup_directory() {
    if [ ! -d "$BACKUP_ROOT" ]; then
        mkdir -p "$BACKUP_ROOT"
        echo "Created backup root directory: $BACKUP_ROOT"
    fi
    
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        echo "Created backup directory: $BACKUP_DIR"
    fi
    
    # Set secure permissions
    chmod 700 "$BACKUP_DIR"
    echo "Backup directory permissions secured"
    
    return 0
}

# Perform database backup
backup_mongodb() {
    echo "Starting backup of $DATABASE_NAME database..."
    
    # Check if credentials file exists
    CREDENTIALS_FILE="${SCRIPT_DIR}/mongodb_credentials.txt"
    MONGODUMP_ARGS="--db $DATABASE_NAME --out $BACKUP_DIR"
    
    if [ -f "$CREDENTIALS_FILE" ]; then
        # Use credentials file for authentication
        USERNAME=$(grep -oP '"username":"\K[^"]+' "$CREDENTIALS_FILE")
        PASSWORD=$(grep -oP '"password":"\K[^"]+' "$CREDENTIALS_FILE")
        MONGODUMP_ARGS="$MONGODUMP_ARGS --username $USERNAME --password $PASSWORD --authenticationDatabase admin"
    fi
    
    # Run mongodump
    if mongodump $MONGODUMP_ARGS; then
        echo "Backup completed successfully to $BACKUP_DIR/$DATABASE_NAME"
        
        # Compress the backup to save space
        tar -czf "${BACKUP_DIR}/${DATABASE_NAME}.tar.gz" -C "$BACKUP_DIR" "$DATABASE_NAME"
        
        # Remove the uncompressed backup
        rm -rf "${BACKUP_DIR}/${DATABASE_NAME}"
        
        echo "Backup compressed to ${BACKUP_DIR}/${DATABASE_NAME}.tar.gz"
        return 0
    else
        echo "Backup failed"
        return 1
    fi
}

# Clean up old backups
clean_old_backups() {
    echo "Cleaning up old backups..."
    
    # Find and delete backups older than KEEP_DAYS
    find "$BACKUP_ROOT" -type d -mtime +$KEEP_DAYS | while read -r old_backup; do
        echo "Removing old backup: $old_backup"
        rm -rf "$old_backup"
    done
    
    echo "Cleanup completed"
    return 0
}

# Main script execution
SUCCESS=true

check_mongo_tools || SUCCESS=false
$SUCCESS && check_mongodb_running || SUCCESS=false
$SUCCESS && create_backup_directory || SUCCESS=false
$SUCCESS && backup_mongodb || SUCCESS=false
$SUCCESS && clean_old_backups || SUCCESS=false

if $SUCCESS; then
    echo "====================================================="
    echo "Backup process completed successfully!"
    echo "Backup location: ${BACKUP_DIR}/${DATABASE_NAME}.tar.gz"
    echo "====================================================="
    exit 0
else
    echo "====================================================="
    echo "Backup process failed. Please check the errors above."
    echo "====================================================="
    exit 1
fi
