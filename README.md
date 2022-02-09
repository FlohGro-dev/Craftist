# Craftist

Welcome to the repository of my Todoist integration for Craft.
Please read through the instructions, especially the [installation](#installation) and [login](#login) chapter.

If you have any problems with the current features or you have other feature request, you can open an issue in this repository or contact me on Twitter, the Craft developer forum or in the Craft slack community (search for "FlohGro").

If this eXtension is valuable for and you like to thank me you can

<a href="https://www.buymeacoffee.com/flohgro" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 220px !important;" ></a>

## Features

The following features are currently supported by Craftist:

### Create / Link Tasks

- create Tasks from Selection
  - this will create tasks from the selected blocks
  - if the blocks are not already a todo item in craft they will be converted

<a href="https://www.loom.com/share/3220504dbae449ffa61a1390c2c27820">
    <p>Craftist: Create Tasks from Selection - Watch Video</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/3220504dbae449ffa61a1390c2c27820-with-play.gif">
  </a>

- crosslink open tasks
  - this will create crosslinked tasks between every (unchecked) todo item in the current document and Todoist
  - the tasks in Todoist will directly link back to the todo item in Craft
  - cancelled or done todo items in the craft document will be ignored

<a href="https://www.loom.com/share/c88d0eb516594631a37b17b8b9b47416">
    <p>Craftist: Crosslink Open Tasks - Watch Video</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/c88d0eb516594631a37b17b8b9b47416-with-play.gif">
  </a>

### Sync Task States

- sync task states
  - this will sync the states of linked Tasks to todoist
  - the states will be changed with the following scheme:
    - if the task is completed anywhere (Todoist or craft) complete it on the other platform
    - if the task is cancelled in craft and open in todoist, close it in todoist
  - this will work for every todo item which was linked to a Todoist Task by this eXtension
  - note: this will **not** work properly for repeating tasks thats why it is currently disabled
  - if a task couldn't be retrieved it will be marked as done in Craft since it is was probably deleted

<a href="https://www.loom.com/share/d220d3bd9e254b47b8b7bbfa397f3b7c">
    <p>Craftist: Sync Task States - Watch Video</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/d220d3bd9e254b47b8b7bbfa397f3b7c-with-play.gif">
  </a>

### Import Tasks / Project List

- import todays tasks
  - this will import the tasks due today from your todoist account
  - the tasks will be imported as todo items and contain links to the tasks in todoist
- import all tasks
  - this will import all tasks from your todoist account (which could be a lot)
  - it's planned to improve this action (e.g. grouping by project) if you'd like to have this feature please comment on the related issue.
- the imported tasks will be nested by project, section and parent task if available
- import project list
  - this will import the list of your Todoist projects
  - the name of the project will be a direct link to the project in the app (as mentioned this does currently not work on macOS)
  - after the project name you will see a link to the Webview of the project

<a href="https://www.loom.com/share/e1e24450e0724596b87d4cf6bb310d24">
    <p>Craftist: Import Tasks / Projects - Watch Video</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/e1e24450e0724596b87d4cf6bb310d24-with-play.gif">
  </a>
  
### Settings

- a small settings menu enables the following adjustable settings to your needs
  -  the link type(s) which should be created for each task
  -  if you want to import the due date for each task (if it has one)

## Login

When you installed the Craftist eXtension and open it the first time you'll see a login form where you need to set your API-Token.
Therefore you need to get the API token of your todoist account.
To retrieve the token, open your Todoist account and go to the settings. Navigate into the integrations tab and scroll to the bottom. There you'll see a textfield titled "API-Token". Copy the API-Token with the button below or just be selecting and copying the text.
Open the Craftist eXtension again and paste the copied API-Token and press the "Set Token" button.
The Token will be stored in Craft so you'll only have to do this once.

If you ever want to logout from your todoist account - use the "Logout" button which will reset the stored API-Token.

## Installation

You can simply download the `.craftx` file from the latest [Release](https://github.com/FlohGro-dev/Craftist/releases/tag/0.3) and add it to your eXtensions in Craft on macOS.

If you want to built the eXtension by yourself (and e.g. make some custom modifications) use the instructions given by the people at Craft:

Simply run `npm install` and than `npm run build` to generate the .craftX file which can be installed.

To learn more about Craft eXtensions visit the [Craft X developer portal](https://developer.craft.do).

## Thanks

Thanks to @curtismchale for covering Craftist in a [YouTube Video Demo](https://www.youtube.com/watch?v=IxONW0W9QPY) and [Blogpost](https://curtismchale.ca/2022/01/31/connect-todoist-with-craft/) lately.

Thanks to @thomaszdxsn for the inspiration in his integration for Todoist.

## Changelog

### v0.4

- **new:** TASK GROUPING - now all imported tasks are grouped by their parent task / project / section
	- if you import tasks from a linked project the tasks will just be grouped in their sections (this can be changed later with settings)
- **new:** imported Tasks will contain the due date of the task which is linked to the correct daily note
- **new:** Settings Menu to change some basic settings:
	- Enable / Disable Mobile Url (for tasks and projects)
	- Enable / Disable Webview Url (for tasks and projects)
	- Enable / Disable Due Dates for imported tasks
	- *note: these settings are stored locally but must be set again after you reinstalled the eXtension (at least from my testing results)*
- **change:** „import project List“ now uses correct order of projects
- **fixed:** „import todays tasks“ button now also imports overdue tasks
- **fixed:** tasks won't get imported twice when they are already present in the document


### v0.3

- **new:** "Link Note to Project" Button / Feature which will prepend a link to an existing project in Todoist to the current document
- **new:** "Import Tasks from linked Project" Button / Feature which will import all Tasks from the linked Project and add them as Blocks to the end of the document
- **change:** Creating / Crosslinking tasks will now create tasks in the linked project (if the note is linked) - if the note is linked to multiple projects in todoist the tasks will be created in the inbox
- **change:** Created / Linked Tasks will now contain a Link in the Task Description to the Craft Document itself
