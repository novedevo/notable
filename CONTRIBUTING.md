# Local development instructions:

1. Run `npm i` to install all dependencies
2. Install PostgreSQL and start the database server. A script is provided for Ubuntu in WSL at `setup.sh`, but instructions are similar for other operating systems.
3. Setup your datatables: run `bootstrap.sh`
4. Install the Prettier and ESLint extensions in your editor of choice, and configure it to run on save. This ensures your code is the same style as the rest of the project, free of common errors, and CI will pass.
5. Run `npm start`
