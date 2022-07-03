# Local development instructions:

1. Run `npm i` to install all dependencies
2. Install PostgreSQL and start the database server. A script is provided for Ubuntu in WSL at `setup.sh`, but instructions are similar for other operating systems.
3. Setup your datatables: run `bootstrap.sh`
4. Install the Prettier extension in your editor of choice, and configure it to run on save. This ensures your code is the same style as the rest of the project, and CI will pass. Also, make sure that your editor is using Prettier to format the files, not any default formatting engine (VS Code likes to format HTML/CSS/JS its own way; this can be disabled)
5. Run `npm start`
