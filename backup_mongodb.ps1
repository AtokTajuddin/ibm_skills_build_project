# MongoDB Backup Script for Windows
# This script creates a backup of the Virtual Hospital MongoDB database
# and stores it in a secure location with date-based folders

param (
    [string]$BackupRoot = "F:\projek_rumah sakit_virtual\db_backups",
    [string]$DatabaseName = "virtual_hospital",
    [int]$KeepDays = 7
)

# Configuration
$dateFormat = Get-Date -Format "yyyy-MM-dd"
$backupDir = Join-Path -Path $BackupRoot -ChildPath $dateFormat

# Function to check if MongoDB tools are available
function Test-MongoTools {
    $mongodump = Get-Command mongodump -ErrorAction SilentlyContinue
    if ($null -eq $mongodump) {
        # Try to find MongoDB in common installation locations
        $possiblePaths = @(
            "C:\Program Files\MongoDB\Server\6.0\bin",
            "C:\Program Files\MongoDB\Server\5.0\bin", 
            "C:\Program Files\MongoDB\Server\4.4\bin"
        )
        
        foreach ($path in $possiblePaths) {
            if (Test-Path (Join-Path -Path $path -ChildPath "mongodump.exe")) {
                $env:PATH += ";$path"
                Write-Host "Added MongoDB tools from $path to PATH" -ForegroundColor Green
                return $true
            }
        }
        
        Write-Host "MongoDB tools not found. Please ensure MongoDB is installed and the bin directory is in your PATH." -ForegroundColor Red
        Write-Host "You can download MongoDB tools from: https://www.mongodb.com/try/download/database-tools" -ForegroundColor Yellow
        return $false
    }
    return $true
}

# Function to check if MongoDB is running
function Test-MongoDBRunning {
    try {
        $mongoService = Get-Service MongoDB -ErrorAction SilentlyContinue
        if ($null -ne $mongoService -and $mongoService.Status -eq "Running") {
            Write-Host "MongoDB service is running" -ForegroundColor Green
            return $true
        }
        
        # Try to connect to MongoDB directly
        $mongo = Start-Process -FilePath "mongo" -ArgumentList "--eval", "db.version()" -NoNewWindow -Wait -PassThru
        if ($mongo.ExitCode -eq 0) {
            Write-Host "MongoDB is running" -ForegroundColor Green
            return $true
        }
        
        Write-Host "MongoDB does not appear to be running" -ForegroundColor Red
        Write-Host "Try starting the MongoDB service with: Start-Service MongoDB" -ForegroundColor Yellow
        return $false
    }
    catch {
        Write-Host "Error checking MongoDB status: $_" -ForegroundColor Red
        return $false
    }
}

# Create backup directory
function Create-BackupDirectory {
    try {
        if (-not (Test-Path -Path $BackupRoot)) {
            New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null
            Write-Host "Created backup root directory: $BackupRoot" -ForegroundColor Green
        }
        
        if (-not (Test-Path -Path $backupDir)) {
            New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
            Write-Host "Created backup directory: $backupDir" -ForegroundColor Green
        }
        return $true
    }
    catch {
        Write-Host "Error creating backup directory: $_" -ForegroundColor Red
        return $false
    }
}

# Perform database backup
function Backup-MongoDB {
    try {
        Write-Host "Starting backup of $DatabaseName database..." -ForegroundColor Cyan
        
        # Run mongodump command
        $mongodumpArgs = "--db", $DatabaseName, "--out", $backupDir
        
        # Add authentication if credentials file exists
        $credentialsFile = Join-Path -Path $PSScriptRoot -ChildPath "mongodb_credentials.txt"
        if (Test-Path $credentialsFile) {
            $credentials = Get-Content $credentialsFile | ConvertFrom-Json
            $mongodumpArgs += "--username", $credentials.username, "--password", $credentials.password, "--authenticationDatabase", "admin"
        }
        
        $process = Start-Process -FilePath "mongodump" -ArgumentList $mongodumpArgs -NoNewWindow -Wait -PassThru
        
        if ($process.ExitCode -eq 0) {
            Write-Host "Backup completed successfully to $backupDir\$DatabaseName" -ForegroundColor Green
            
            # Secure the backup directory
            $acl = Get-Acl $backupDir
            $acl.SetAccessRuleProtection($true, $false)
            $administratorsRule = New-Object System.Security.AccessControl.FileSystemAccessRule("Administrators", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
            $systemRule = New-Object System.Security.AccessControl.FileSystemAccessRule("SYSTEM", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
            $currentUserRule = New-Object System.Security.AccessControl.FileSystemAccessRule([System.Security.Principal.WindowsIdentity]::GetCurrent().Name, "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
            
            $acl.AddAccessRule($administratorsRule)
            $acl.AddAccessRule($systemRule)
            $acl.AddAccessRule($currentUserRule)
            
            Set-Acl $backupDir $acl
            Write-Host "Backup directory permissions secured" -ForegroundColor Green
            
            return $true
        }
        else {
            Write-Host "Backup failed with exit code $($process.ExitCode)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "An error occurred during backup: $_" -ForegroundColor Red
        return $false
    }
}

# Clean up old backups
function Clean-OldBackups {
    try {
        Write-Host "Cleaning up old backups..." -ForegroundColor Cyan
        $cutoffDate = (Get-Date).AddDays(-$KeepDays)
        
        Get-ChildItem -Path $BackupRoot -Directory | Where-Object {
            $_.LastWriteTime -lt $cutoffDate
        } | ForEach-Object {
            Write-Host "Removing old backup: $($_.FullName)" -ForegroundColor Yellow
            Remove-Item $_.FullName -Recurse -Force
        }
        
        Write-Host "Cleanup completed" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Error cleaning up old backups: $_" -ForegroundColor Red
        return $false
    }
}

# Main script execution
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Virtual Hospital Project - MongoDB Backup Script" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Database: $DatabaseName" -ForegroundColor Cyan
Write-Host "Backup location: $backupDir" -ForegroundColor Cyan
Write-Host "Keeping backups for $KeepDays days" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Execute the backup process
$success = $true
$success = $success -and (Test-MongoTools)
$success = $success -and (Test-MongoDBRunning)
$success = $success -and (Create-BackupDirectory)
$success = $success -and (Backup-MongoDB)
$success = $success -and (Clean-OldBackups)

if ($success) {
    Write-Host "=====================================================" -ForegroundColor Green
    Write-Host "Backup process completed successfully!" -ForegroundColor Green
    Write-Host "Backup location: $backupDir\$DatabaseName" -ForegroundColor Green
    Write-Host "=====================================================" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "=====================================================" -ForegroundColor Red
    Write-Host "Backup process failed. Please check the errors above." -ForegroundColor Red
    Write-Host "=====================================================" -ForegroundColor Red
    exit 1
}
