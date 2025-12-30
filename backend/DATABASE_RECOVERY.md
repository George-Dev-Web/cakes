# Database Recovery Guide

## Your Current Issue

You're getting this error:
```
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.UndefinedTable) relation "order" does not exist
```

This happens because:
1. Your migration is trying to create `order_customization` table
2. But it references the `order` table which hasn't been created yet
3. The migration has the tables in the wrong order

---

## Quick Fix Options

### Option 1: Fresh Start (RECOMMENDED if you don't have important data)

```bash
# In Git Bash or Command Prompt
cd backend
./reset_database.bat
# OR
cmd.exe /c reset_database.bat
```

This will:
- ✅ Backup your current database
- ✅ Drop and recreate the database
- ✅ Run migrations in correct order
- ✅ Give you a clean slate

### Option 2: Try to Fix Without Data Loss

```bash
cd backend
./fix_database.bat
# OR
cmd.exe /c fix_database.bat
```

This will:
- ✅ Backup your database
- ✅ Remove problematic migrations
- ✅ Create fresh migration
- ✅ Try to preserve existing data

---

## Manual Fix (If scripts don't work)

### Step 1: Backup (IMPORTANT!)
```bash
pg_dump -U postgres -d cake_db > backup_manual.sql
```

### Step 2: Clear Migration State
```bash
# Connect to database
psql -U postgres -d cake_db

# Delete migration history
DELETE FROM alembic_version;
\q
```

### Step 3: Drop All Tables
```bash
psql -U postgres -d cake_db

DROP TABLE IF EXISTS order_customization CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS customization_options CASCADE;
DROP TABLE IF EXISTS cake CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

\q
```

### Step 4: Delete Old Migrations
```bash
cd migrations/versions
rm db8a2f933691_initial_postgresql_setup.py
rm e531fd834bc8_increase_password_hash_length_to_255.py
cd ../..
```

### Step 5: Create Fresh Migration
```bash
# Make sure you're on the refactored branch
git checkout refactor/critical-fixes-2025

# Activate venv
source venv/Scripts/activate  # Git Bash
# OR
venv\Scripts\activate  # CMD

# Install python-dotenv
pip install python-dotenv

# Create new migration
flask db migrate -m "Initial setup with all models"

# Check the generated migration file
# It should create tables in this order:
# 1. user
# 2. cake
# 3. customization_options
# 4. order
# 5. order_customization
```

### Step 6: Apply Migration
```bash
flask db upgrade
```

### Step 7: Seed Database
```bash
python seed.py
```

---

## Why This Happened

The old migrations from your Ubuntu setup:
1. Were created in a different order
2. Had different table creation sequences
3. Don't match the refactored models

The refactored models have:
- New relationships
- Different table names (User.py → user.py)
- Explicit `__tablename__` attributes

---

## Preventing This in the Future

### 1. Always Delete Old Migrations When Refactoring
```bash
# When doing major refactors
rm migrations/versions/*.py
flask db migrate -m "Fresh start"
```

### 2. Check Migration Files Before Applying
Open `migrations/versions/XXXXX_migration_name.py` and verify:
- Tables are created in correct dependency order
- Foreign keys reference existing tables
- No duplicate table definitions

### 3. Use Downgrades
```bash
# If something goes wrong
flask db downgrade
```

---

## Common Errors & Solutions

### Error: "Target database is not up to date"
**Solution**: Run `flask db upgrade` first, then `flask db migrate`

### Error: "relation does not exist"
**Solution**: Database tables are missing or in wrong order. Use `reset_database.bat`

### Error: "FOREIGN KEY constraint failed"
**Solution**: Parent table doesn't exist yet. Check migration order.

### Error: "python-dotenv not installed"
**Solution**: 
```bash
pip install python-dotenv
```

### Error: "flask command not found"
**Solution**: Activate virtual environment first:
```bash
venv\Scripts\activate  # CMD
source venv/Scripts/activate  # Git Bash
```

---

## Testing After Recovery

```bash
# Start the backend
python app.py

# In another terminal, test endpoints
curl http://localhost:5000/api/cakes
```

Or open in browser: `http://localhost:5000/api/cakes`

---

## Need More Help?

If the scripts don't work:
1. Check if PostgreSQL is running (Services → postgresql)
2. Verify your `.env` file has correct database credentials
3. Make sure you're on the `refactor/critical-fixes-2025` branch
4. Check that virtual environment is activated

---

## Rollback to Old State

If you need to go back:
```bash
# Restore from backup
psql -U postgres -d cake_db < backup_YYYYMMDD_HHMMSS.sql

# Or switch back to master
git checkout master
```
