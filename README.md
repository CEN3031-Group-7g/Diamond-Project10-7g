# CaSMM

> Computation and Science Modeling through Making

Cloud-based programming interface

![Deploy Staging](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Staging/badge.svg)
![Deploy Production](https://github.com/STEM-C/CaSMM/workflows/Deploy%20Production/badge.svg)

<br/>

## Group 7g Diamond Division - Project 10: Personal and Organizational Accounts

### Features Implemented

* #### User Signup
	* Users not logged in will see an option for the signup page in the navbar which redirects to /signup
	* Users can sign up with username, email, password. This will make a new user in the "Users" collection with their role set to "Personal"
	* Input validation such as checking if username/email exists, checking if email is valid, checking password strength, checking for empty fields.
	<img width="435" alt="Signup1" src="https://github.com/CEN3031-Group-7g/Diamond-Project10-7g/assets/100661623/0b9471ca-323b-48c4-8499-3f679668eb7a">


* #### User Settings
	* Logged in users will see an option for the settings page in the navbar which redirects to /settings
	* On the settings page, there are options and buttons for:
		* ##### Change Username
		 	* Updates username in database
		 	* Verify password before changing
		 	* Makes sure username is valid and is not taken
		* ##### Change Password
			* Updates password of user
			* Verify Password before changing
		* ##### Change Email
			* Updates email of user
			* Verify password before changing
			* Makes sure email is valid with regex, and not taken
		* ##### Merge Accounts 
			* Appears only for personal accounts
			* Select student from dropdown/search
			* Select emoji from dropdown, checks if correct emoji
			* Merges the personal account to the student account, using the table "Merged accounts"
        * ##### Delete Account
        	* Deletes account from database, redirects to login
        	* Account is removed from "Users" collection
        	* Verify password before deleting
 	
<img width="327" alt="Settings1" src="https://github.com/CEN3031-Group-7g/Diamond-Project10-7g/assets/100661623/89e4921c-71bf-49ea-b317-91f70e1dd3f8">
<img width="330" alt="Settings2" src="https://github.com/CEN3031-Group-7g/Diamond-Project10-7g/assets/100661623/f9c8ccae-4885-4d1c-8472-fee055b88581">


* #### Admin Request
	* On signup page /signup, users can click the link at the bottom to request an admin account
	* This is for users who are asking for permissions to the strapi backend
	* They enter username, email, password.
	* Pressing submit opens their email client to send an email to the strapi admins to approve or deny them, also adding their information to the "Administrator Account Requests" collection to prevent spam from the same email and help in the approval process.
	<img width="222" alt="AdminRequest1" src="https://github.com/CEN3031-Group-7g/Diamond-Project10-7g/assets/100661623/2d87e123-ab45-465a-a910-8962b6b409d5">
<img width="368" alt="AdminRequest2" src="https://github.com/CEN3031-Group-7g/Diamond-Project10-7g/assets/100661623/34028fd2-7317-4d9b-97f3-79ae3fcfce87">



* #### User Permissions
	* Implemented features onto frontend utility for pages and route directory, as well as settings page for function permission - currently only supports current existing roles (Mentor, ContentCreator, Student, Researcher, Personal)
		* Checks if user is authorized to be on route/page based on their role
		* Redirects user back to their designated homepage if not authorized
		* Checks for specific role when displaying specific user functionalities (Merge - visible to only Personal users)
	* The redirection checks serve to prevent users from accessing pages that are not for them or would otherwise be a hindrance for them (ex: accidentally typing into login URL based on browser suggestion when accessing pages through url) For public route checks, the component checks for a user token that is generated if a user logs in. If a user token exists, then the user cannot access any route marked with the PublicRoute component and will be redirected to their respective dashboard/hub. RedirectCheck checks for the user’s current role and compares it to the role that is designated for the specific page, redirecting users back to their dashboard/hub similar to PublicRoute if unauthorized.
	* Screenshot cannot demonstrate this feature 

## How to Run

The `develop` branch on this GitHub Repository holds the code we have developed and that is ready for you to run and merge into the main repo. This is the branch you should run to test all of the functionality that we have implemented.

To get the **frontend** running (casmm-client-dev):
1. Follow the [client](/client#setup) setup
2. Run  `yarn` from `/client` to install dependencies
3. Run `yarn start` from `/client`

To get the **backend** running (casmm-server-dev, casmm-compile-dev, casmm-db-dev, and casmm-compile_queue-dev)
1. Install [docker](https://docs.docker.com/get-docker/):

2. Run `docker compose up` from `/`

   > Grant permission to the **scripts** and **server** directories if you are prompted

**IMPORTANT:** If this isn’t your first time running Casmm and you already have Casmm containers in docker, 
1. Use the command `docker compose down` in /, 
2. Use the command `docker compose up` from /. 

> This ensures that the database is configured with our new dump in `scripts/development_db.dump`, which has the tables, roles, and permissions we added.

## Database and Server connections
We dumped our database in `scripts/development_db.dump`, which has the tables, roles, and permissions we added. To apply this on your machine locally, please 
1. Use the command `docker compose down` in /, 
2. Use the command `docker compose up` from /. 

We added two new collections/tables to the database:

`Merged accounts` with schema Username(string) Student(string) StudentID(string) Classroom(string), id(integer). This collection is used to store personal users who have merged their account to a student account. The intent is for this database to be used on the student login page and the gallery page. For example, on the gallery page, this table should be checked to see if the student account merged to the personal account has any projects that should be displayed.

`Administrator Account Requests` with schema Admin_email(string), approval_status(String), created_at(date), updated_at(string), id(integer). This collection is used to store incoming admin account requests. These requests are for strapi admin accounts that only other strapi admin accounts can create. The intent is to prevent spam/duplicate requests and allow existing admins to quickly review applicants to add them.

Additionally, we added a new role to the users and permission plugin, a `Personal` role which lets users create personal accounts on the signup page.

You can add to these collections with the endpoints given in the documentation found in strapi.

## Update database and Strapi dump files
We dumped our database in `scripts/development_db.dump`, which has the tables, roles, and permissions we added. To apply this on your machine locally, please 
1. Use the command `docker compose down` in /, 
2. Use the command `docker compose up` from /. 

To create your own dump and apply it, please read the dump instructions in the readme for [`/scripts`](/scripts)

## Outstanding work

None.

## Built Upon
We installed a dependency with yarn, called [`react-select`](https://react-select.com/home), which was used for the student and emoji dropdowns in the merge modal on the user settings page. Simply navigate to the /client folder of the repo and run yarn to install this dependency. 

## Application

### `client` 
[client](/client#client) is the frontend of the application. It is powered by [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly).

### `server`

[server](/server#server) is the web server and application server. It is powered by [Node](https://nodejs.org/en/) and [Strapi](https://docs-v3.strapi.io/developer-docs/latest/getting-started/introduction.html).

### `compile`

  [compile](/compile#compile) is an arduino compiler service. It is an unofficial fork of [Chromeduino](https://github.com/spaceneedle/Chromeduino).

<br/>

## Environments

> The project is divided into three conceptual environments.

### Development
#### Structure

The development environment is composed of five servers. The first one is run with the [Create React App](https://create-react-app.dev/docs/getting-started/) dev server. The later four are containerized with docker and run with [docker compose](https://docs.docker.com/compose/).

* `casmm-client-dev` - localhost:3000

* `casmm-server-dev` - localhost:1337/admin

* `casmm-compile-dev` 

* `casmm-db-dev` - localhost:5432

  > The first time the db is started, the [init_db.sh](/scripts/init_db.sh) script will run and seed the database with an environment specific dump. Read about Postgres initialization scripts [here](https://github.com/docker-library/docs/blob/master/postgres/README.md#initialization-scripts). To see how to create this dump, look [here](https://github.com/DavidMagda/CaSMM_fork_2023/blob/develop/scripts/readme.md).

* `casmm-compile_queue-dev`
   

### Staging

#### Structure

The staging environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm-staging` - [casmm-staging.herokuapp.com](https://casmm-staging.herokuapp.com/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm-staging` is automatically built from the latest commits to branches matching `release/v[0-9].[0-9]`. Heroku runs the container orchestration from there.

### Production

#### Structure

The production environment is a Heroku app. It is composed of a web dyno, compile dyno, Heroku Postgres add-on, and Heroku Redis add-on.

* `casmm` - [www.casmm.org](https://www.casmm.org/)
  * The web dyno runs `server`
  * The compile dyno runs `compile`

#### Running

`casmm` is automatically built from the latest commits to `master`. Heroku runs the container orchestration from there.

<br/>

## Maintenance

All three components of the application have their own dependencies managed in their respective `package.json` files. Run `npm outdated` in each folder to see what packages have new releases. Before updating a package (especially new major versions), ensure that there are no breaking changes. Avoid updating all of the packages at once by running `npm update` because it could lead to breaking changes. 

### Strapi

This is by far the largest and most important dependency we have. Staying up to date with its [releases](https://github.com/strapi/strapi/releases) is important for bug/security fixes and new features. When it comes to actually upgrading Strapi make sure to follow the [migration guides](https://docs-v3.strapi.io/developer-docs/latest/update-migration-guides/migration-guides.html#v3-guides)!

<br/>

## CI/CD

All of the deployments and releases are handled automatically with [GitHub Actions](https://docs.github.com/en/actions). The workflows implement custom [Actions](https://github.com/STEM-C/CaSMM/actions) that live in the [auto](https://github.com/STEM-C/auto) repo.

<br/>

## Contributing

### Git Flow 

> We will follow this git flow for the most part — instead of individual release branches, we will have one to streamline staging deployment 

![Git Flow](https://nvie.com/img/git-model@2x.png)

### Branches

#### Protected

> Locked for direct commits — all commits must be made from a non-protected branch and submitted via a pull request with one approving review

- **master** - Production application

#### Non-protected

> Commits can be made directly to the branch

- **release** - Staging application
- **develop** - Working version of the application
- **feature/<`scaffold`>-<`feature-name`>** - Based off of develop
  - ex. **feature/cms-strapi**
- **hotfix/<`scaffold`>-<`fix-name`>** - Based off of master
  - ex. **hotfix/client-cors**

### Pull Requests

Before submitting a pull request, rebase the feature branch into the target branch to resolve any merge conflicts.

- PRs to **master** should squash and merge
- PRs to all other branches should create a merge commit
