# Craftist

Welcome to the repository of my Todoist integration for Craft.
Please read through the instructions, especially the [installation](#installation) and [login](#login) chapter.

If you have any problems with the current features or you have other feature request, you can open an issue in this repository or contact me on Twitter, the Craft developer forum or in the Craft slack community (search for "FlohGro").

If this eXtension is valuable for and you like to thank me you can

<a href="https://www.buymeacoffee.com/flohgro" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 220px !important;" ></a>

## Features

The following features are currently supported by Craftist:

- import todays tasks
  - this will import the tasks due today from your todoist account
  - the tasks will be imported as todo items and contain links to the tasks in todoist (a direct link to the task in the app (doesn't work on macOS) and a link to the Webview of the task)
- crosslink open tasks
  - this will create crosslinked tasks between every (unchecked) todo item in the current document and Todoist
  - the tasks in Todoist will directly link back to the todo item in Craft
  - cancelled or done todo items in the craft document will be ignored
- sync task states
  - this will sync the states of linked Tasks to todoist
  - the states will be changed with the following scheme:
    - if the task is completed anywhere (Todoist or craft) complete it on the other platform
    - if the task is cancelled in craft and open in todoist, close it in todoist
  - this will work for every todo item which was linked to a Todoist Task by this eXtension
- import project list
  - this will import the list of your Todoist projects
  - the name of the project will be a direct link to the project in the app (as mentioned this does currently not work on macOS)
  - after the project name you will see a link to the Webview of the project

## Login

When you installed the Craftist eXtension and open it the first time you'll see a login form where you need to set your API-Token.
Therefore you need to get the API token of your todoist account.
To retrieve the token, open your Todoist account and go to the settings. Navigate into the integrations tab and scroll to the bottom. There you'll see a textfield titled "API-Token". Copy the API-Token with the button below or just be selecting and copying the text.
Open the Craftist eXtension again and paste the copied API-Token and press the "Set Token" button.
The Token will be stored in Craft so you'll only have to do this once.

If you ever want to logout from your todoist account - use the "Logout" button which will reset the stored API-Token.

## Installation

You can simply download the `.craftx` file and add it to your eXtensions in Craft on macOS.

If you want to built the eXtension by yourself (and e.g. make some custom modifications) use the instructions given by the people at Craft:

Simply run `npm install` and than `npm run build` to generate the .craftX file which can be installed.

To learn more about Craft eXtensions visit the [Craft X developer portal](https://developer.craft.do).

## Thanks

Thanks to @thomaszdxsn for the inspiration in his integration for Todoist.
