# Craftist

Welcome to the repository of my Todoist eXtension for Craft.
Please read through the instructions, especially the [installation](#installation) and [login](#login) chapter.
Also make sure to check out the latest changes in the [changelog](#changelog) which will contain the latest feature updates

If you want to follow me for updates or get in touch you can follow me on [Twitter](https://twitter.com/FlohGro) or choose anything else to contact on my [website](https://flohgro.com/contactme/). Feel free to create issues in the repository for bugs you notice or features you'd like to see.

If this eXtension is valuable for and you like to thank me you can

<a href="https://www.buymeacoffee.com/flohgro" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 220px !important;" ></a>

If you want to have a look to other things I'm working, check out my website at [flohgro.com](https://flohgro.com).

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
  - this will sync the states of linked Tasks with Todoist
  - the states will be changed with the following scheme:
    - if the task is completed anywhere (Todoist or craft) complete it on the other platform
    - if the task is cancelled in craft and open in todoist, close it in todoist
  - this will work for every todo item which was linked to a Todoist Task by this eXtension
  - syncing tasks is disabled if no task links are enablded since they are necessary to retrieve the tasks information
  - if the due dates are imported as metadata the sync will work for repeating tasks, too since the due date will be updated. If you disabled due date import, repeating tasks will not be synced.
  - if a task couldn't be retrieved it will be marked as done in Craft since it is was probably deleted
- sync task content (and metadata)
  - syncing the tasks will also sync the content and (enabled) metadata
  - content and metadata will just be synced one-way, from Todoist to Craft and **not** vice-verca
  - this means if you make changes to the task in Todoist - the changes will be synced (e.g. the new content will be visible after the sync) but if you make changes to the block of the Task in Craft they will **not** be synced to Todoist (this would make the handling too complicated right now)

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

- the settings menu lets you configure the Craftist to your preferences.
- following settings are possible:
  - task links: the link type(s) which should be created for each task (attention: if you disable both, syncing task states is no longer possible)
  - task metadata import: select the metadata which should be imported with your tasks
  - task grouping: select how tasks should be grouped on import (by project, by section or both); available for all import features
  - import location: you can decide if you want to import tasks below the current selected block or always at the end of a document
  - due dates from daily notes: you can choose if created / crosslinked tasks shall receive the due date of the current open daily note (this will not add due dates if you create tasks from other documents)
  - (beta) enable continuous task sync

## Login

When you installed the Craftist eXtension (also when you update the eXtension) you hav to "login" into your Todoist account by providing your API-Token.
Therefore you need to get the token of your Todoist account.
To retrieve the token, open Todoist and go to the settings. Navigate into the integrations tab and scroll to the bottom. There you'll see a textfield titled "API-Token". Copy the API-Token with the button below or just be selecting and copying the text.
Open the Craftist eXtension again and click on the "Login/Logout" button. Paste the copied API-Token into the text field and press the green "Set Token" button.
The eXtension will then reload and you can close the UI to set the token by pressing the "x" in the upper right corner
The Token will be stored in Craft so you'll only have to do this once.

If you ever want to logout from your todoist account - use the "Login/Logout" button and press "Delete Token" which will reset the stored API-Token.

## Installation

You can simply download the `.craftx` file from the latest [Release](https://github.com/FlohGro-dev/Craftist/releases/tag/0.7) and add it to your eXtensions in Craft on macOS.

If you want to built the eXtension by yourself (and e.g. make some custom modifications) use the instructions given by the people at Craft:

Simply run `npm install` and than `npm run build` to generate the .craftX file which can be installed.

To learn more about Craft eXtensions visit the [Craft X developer portal](https://developer.craft.do).

## Thanks

Thanks to @curtismchale for covering Craftist in a [YouTube Video Demo](https://www.youtube.com/watch?v=IxONW0W9QPY) and [Blogpost](https://curtismchale.ca/2022/01/31/connect-todoist-with-craft/) lately.

Thanks to @thomaszdxsn for the inspiration in his integration for Todoist.

## Changelog

### v0.7

- **improved:** sync task improvements - switched to update Blocks - blocks will not get recreated in every sync
- **new:** priorities sync - priorities can be synced as metadata which will colorize the task content similar to Todoists colors
- **new:** recurring tasks will be unlinked when when they are completed in a daily note which will prevent repeated sync of the task / keep it checked in the daily note
- **new:** (beta) continuous sync of tasks can be enabled in the settings - this will perform a sync every 30 seconds - it will be enabled / disabled with the Sync Tasks Button
  - this is a beta feature so please be patient and expect bugs; report them in the repository with as much details as possible
  - to report issues or thoughts on the beta you can add comments in the [discussion](https://github.com/FlohGro-dev/Craftist/discussions/45)

### v0.6

- **new/improved:** sync task improvements - recurring tasks are now enabled if due dates are included as metadata
- **new:** metadata import - imported and synced tasks will now contain metadata from todoist (due dates, labels and descriptions) which you can enable / disable as you like
- **change:** added warning for disabled task links since syncing states is not possible without links
- **new/improved:** completely revamped settings window for easier usability
- **fixed:** creating tasks features now respect link settings
- **new:** option to import tasks after the current selected block (enabled by default)
- **new:** option to set due dates for exported tasks to date of the daily notes (enabled by default)
- **change:** craftdocs://open[..] urls (resulting from cross-linking) will be stripped from task contents since they don't work and just produce clutter.


### v0.5

- **new/fixed:** **Craftist is now working in the web version of Craft**
- **change:** slightly changed the login behavior - no separate login form anymore - now included in the "Login/Logout" button
- **fixed:** cleanup of notification behavior when execution of operations succeeds / fails

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
