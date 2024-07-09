---
title: "Running the Script Dev Environment"
metaTitle: "Tutorials | PxL Scripts | Running the Script Dev Environment"
metaDescription: "Running the Script Dev Environment"
order: 20
redirect_from:
    - /tutorials/script-dev-environment
---

Pixie's Script Dev Environment allows you to develop PxL scripts in your favorite editor while executing the scripts in the Live UI. Because the script is saved to your local file system, you can easily push the script to GitHub or other version control systems.

Pixie's Live UI will soon support script persistence, but at the moment, any scripts modified in the Live UI will be lost if you refresh or switch to a different script.

## Setup the Script Dev Environment

1. Make sure you aren't running anything on `port 8000`. To check if the port is already in use, use the following command. If no results are returned, then `port 8000` is free.

```bash
lsof -i :8000 		# check if anything is running on port 8000

```

2. In the terminal, clone Pixie's GitHub repo.

```bash
git clone https://github.com/pixie-io/pixie.git
```

3. Run `make dev` in the `src/pxl_scripts` directory to start a local dev server. Leave this terminal tab running.

```bash
cd pixie/src/pxl_scripts
make dev
```

<svg title='' src='script-dev-env/dev-env-1.png'/>

4. Follow the instructions to copy and paste the following line in your browser's console. To open Chrome's DevTools Console use `Ctrl+Shift+J` (Windows) or `Cmd+Option+J` (Mac).

```bash
 localStorage.setItem('px-custom-oss-bundle-path', 'http://127.0.0.1:8000/bundle-oss.json')
```

<svg title='' src='script-dev-env/dev-env-2.png'/>

5. (Soft) reload the <CloudLink url="/">Live View</CloudLink> webpage. A hard reload will clear the variable you just set.

## Prepare your Script

1. In a new tab, copy and rename one of the script folders in the `px` directory. Note that the new folder name cannot contain any spaces.

```bash
cd pixie/src/pxl_scripts
cp -r px/http_data_filtered px/my_pxl_script
```

2. Modify the files in the script folder. Each script folder will have 2 or 3 files:

	- Edit `script_name.pxl` to change the output tables.
	- Edit `manifest.json` to change the script description.
	- Edit optional `vis.json` to change the charts and table visualizations.

3. (Soft) reload the <CloudLink url="/">Live View</CloudLink> webpage to see your script appear as an option in the drop-down cluster menu. The script will appear under the foldername from step 1 (e.g. `my_pxl_script`).

4. Use your favorite editor to edit the `script_name.pxl` and `vis.json` files. Make sure to soft reload the Live UI webpage to reflect any saved edits to the script.

## Cleaning Up

To return the Live UI to its normal state:

1. Copy and paste the following line in your browser's console.

```bash
localStorage.clear('px-custom-bundle-path')
```

<svg title='' src='script-dev-env/dev-env-4.png'/>

2. In the first terminal tab, kill the dev server.

<svg title='' src='script-dev-env/dev-env-3.png'/>

3. Reload the <CloudLink url="/">Live View</CloudLink> webpage.

## Contribute Your Script (Optional)

Over time, we hope that our [script repository](https://github.com/pixie-io/pixie/tree/main/src/pxl_scripts) grows into a community driven knowledge base of tools to observe, debug, secure and manage applications.

<iframe width="560" height="315" src="https://www.youtube.com/embed/So4ep2mMcSI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

#### Step 1: File an issue

File an [issue](https://github.com/pixie-io/pixie/issues/new/choose) with an explanation of what use case you are looking to address. This will help us make sure these community scripts are broadly applicable and useful.

#### Step 2: Prepare your script

Develop and test your script with the CLI or using the Live UI's [script dev environment](/tutorials/pxl-scripts/script-dev-environment).

#### Step 3: Create a pull-request

Once your script is ready, you can submit it for review by:

- Create a branch on your fork
- Commit your script folder(s) and push to origin
- Create a pull request with your original issue tagged
- Once accepted, it'll appear under the `px/` namespace in Pixie for the entire Pixie community
