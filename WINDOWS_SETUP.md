# Windows Setup Guide for Cakes Project

## Prerequisites

### 1. Install Required Software

#### Python 3.10+
1. Download from [python.org](https://www.python.org/downloads/)
2. **IMPORTANT**: Check "Add Python to PATH" during installation
3. Verify installation:
   ```cmd
   python --version
   pip --version
   ```

#### PostgreSQL
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. During installation, remember your postgres user password
3. Add PostgreSQL bin to PATH:
   - Default: `C:\Program Files\PostgreSQL\16\bin`
4. Verify installation:
   ```cmd
   psql --version
   ```

#### Node.js (for frontend)
1. Download from [nodejs.org](https://nodejs.org/) (LTS version)
2. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### Git
1. Download from [git-scm.com](https://git-scm.com/download/win)
2. Use default settings during installation

---

## Project Setup

### Step 1: Clone the Repository

```cmd
cd C:\Users\YourUsername\Projects
git clone https://github.com/George-Dev-Web/cakes.git
cd cakes
git checkout refactor/critical-fixes-2025
```

### Step 2: Setup PostgreSQL Database

1. Open Command Prompt as Administrator
2. Connect to PostgreSQL:
   ```cmd
   psql -U postgres
   ```
3. Create the database:
   ```sql
   CREATE DATABASE cake_db;
   \q
   ```

### Step 3: Backend Setup

```cmd
cd backend
```

#### Create Virtual Environment
```cmd
python -m venv venv
```

#### Activate Virtual Environment
```cmd
venv\Scripts\activate
```
You should see `(venv)` in your command prompt.

#### Install Dependencies
```cmd
pip install --upgrade pip
pip install -r requirements.txt
```

#### Create .env File
```cmd
copy .env.example .env
```

Now edit `.env` with Notepad or VS Code:
```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here-change-this

# Windows PostgreSQL connection
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/cake_db

JWT_SECRET_KEY=your-jwt-secret-here-change-this

CORS_ORIGINS=http://localhost:5173
```

**Replace**:
- `YOUR_PASSWORD` with your PostgreSQL password
- Secret keys with random strings

#### Initialize Database

```cmd
# Initialize migrations (if not already done)
flask db init

# Create migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade

# Seed database (optional)
python seed.py
```

#### Run Backend
```cmd
python app.py
```

Backend should run on `http://localhost:5000`

---

### Step 4: Frontend Setup

Open a **new** Command Prompt window:

```cmd
cd C:\Users\YourUsername\Projects\cakes\frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend should run on `http://localhost:5173`

---

## Common Windows Issues & Solutions

### Issue 1: `psycopg2` Installation Fails

**Solution**: Use `psycopg2-binary` (already in requirements.txt)

If still fails:
```cmd
pip install psycopg2-binary --force-reinstall
```

### Issue 2: Virtual Environment Won't Activate

**Error**: "execution of scripts is disabled on this system"

**Solution**: Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then use Command Prompt instead of PowerShell, or activate with:
```powershell
venv\Scripts\Activate.ps1
```

### Issue 3: Port Already in Use

**Backend (5000)**:
```cmd
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Frontend (5173)**: Same as above, replace 5000 with 5173

### Issue 4: PostgreSQL Connection Refused

1. Check PostgreSQL is running:
   - Open Services (Win + R → `services.msc`)
   - Find "postgresql-x64-16" (or your version)
   - Ensure it's "Running"
   - If not, right-click → Start

2. Check connection settings in `.env`

### Issue 5: Flask Commands Not Found

**Solution**: Make sure virtual environment is activated (you should see `(venv)`)

If still not working:
```cmd
python -m flask db upgrade
```

### Issue 6: Module Import Errors

If you get "No module named 'models.User'":

**Solution**: The old `User.py` needs to be removed:
```cmd
cd backend\models
del User.py
```

Then make sure controllers import from `models.user`:
```python
from models.user import User  # Correct
```

---

## Development Workflow

### Starting the Project

**Terminal 1 - Backend**:
```cmd
cd C:\Users\YourUsername\Projects\cakes\backend
venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend**:
```cmd
cd C:\Users\YourUsername\Projects\cakes\frontend
npm run dev
```

### Stopping the Project

- Press `Ctrl + C` in each terminal
- Type `deactivate` to exit virtual environment

---

## Database Management

### Backup Database
```cmd
pg_dump -U postgres -d cake_db > backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.sql
```

### Restore Database
```cmd
psql -U postgres -d cake_db < backup_YYYYMMDD.sql
```

### Reset Database
```cmd
# Drop and recreate
psql -U postgres -c "DROP DATABASE cake_db;"
psql -U postgres -c "CREATE DATABASE cake_db;"

# Re-run migrations
cd backend
venv\Scripts\activate
flask db upgrade
python seed.py
```

---

## IDE Setup (VS Code Recommended)

### Install VS Code Extensions
1. Python (Microsoft)
2. PostgreSQL (Chris Kolkman)
3. ES7+ React/Redux/React-Native snippets
4. Prettier - Code formatter
5. GitLens

### Configure VS Code

1. Open project folder in VS Code
2. Select Python interpreter: `Ctrl+Shift+P` → "Python: Select Interpreter" → Choose the venv one
3. Create `.vscode/settings.json`:
   ```json
   {
     "python.defaultInterpreterPath": "${workspaceFolder}\\backend\\venv\\Scripts\\python.exe",
     "python.terminal.activateEnvironment": true
   }
   ```

---

## Testing the Setup

### Backend Health Check
```cmd
curl http://localhost:5000/api/cakes
```

Or open in browser: `http://localhost:5000/api/cakes`

### Frontend Check
Open browser: `http://localhost:5173`

---

## Next Steps After Setup

1. ✅ Update controller imports (User.py → user.py)
2. ✅ Test user registration and login
3. ✅ Test creating orders
4. ✅ Test admin functionality
5. ✅ Check CORS is working between frontend/backend

---

## Troubleshooting Checklist

- [ ] Python 3.10+ installed and in PATH
- [ ] PostgreSQL installed and running
- [ ] Node.js and npm installed
- [ ] Virtual environment activated (see `(venv)` in prompt)
- [ ] Dependencies installed (`pip list` shows Flask, etc.)
- [ ] `.env` file created with correct database credentials
- [ ] Database `cake_db` exists
- [ ] Migrations applied (`flask db upgrade`)
- [ ] No port conflicts (5000, 5173)
- [ ] CORS origins match frontend URL

---

## Quick Reference Commands

```cmd
# Activate backend
cd backend && venv\Scripts\activate

# Run backend
python app.py

# Create migration
flask db migrate -m "description"

# Apply migration
flask db upgrade

# Run frontend
cd frontend && npm run dev

# Install new Python package
pip install package-name
pip freeze > requirements.txt

# Install new npm package
npm install package-name
```

---

## Getting Help

If you encounter issues:
1. Check this guide's "Common Issues" section
2. Check error messages carefully
3. Ensure all prerequisites are installed
4. Make sure virtual environment is activated
5. Check database is running and accessible

---

**You're all set!** 🚀 Follow these steps and your project should work perfectly on Windows.
