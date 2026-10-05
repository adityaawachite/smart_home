NestControl — 3-file standalone frontend

Files:
- index.html
- style.css
- script.js

This package consolidates the original templates/CSS/JavaScript into three browser-side files.
It runs directly by opening index.html and uses localStorage for demo data.

The original ZIP also contained a Flask + SQLAlchemy backend (app.py, models.py, config.py,
requirements.txt). Those backend files cannot be represented by HTML/CSS/JS alone. If you need
real login, SQLite persistence and the original Flask APIs, keep the original backend and use
these three files as the frontend.

Demo login in standalone mode:
demo@example.com
Demo@123
