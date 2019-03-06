# Testing

## TL;DR

```bash
yarn install  #setup
yarn test #working
yarn lint #pretty
yarn coverage #thorough
yarn ready #check-in-time!
```

## Jest

[Jest](https://facebook.github.io/jest/) is a testing framework built by Facebook for Javascript code (especially React). We have configured this framework to be the primary testing framework for LWC.

Check out some of our [Best Practices](BestPractices.md)

To run your Jest tests simply run the command:

```bash
yarn test
```

## Linting
According to Stack Overflow:
> Linting is the process of running a program that will analyse code for potential errors

LWC comes with best practices and Core’s precheckin enforces the LWC ESLint plug-in rule set so you don't have a choice anyhow.

To run the linter simply run the command:

```bash
yarn lint
```

If you have linter issues, you can run `yarn lint --fix` which will catch many of the low-hanging fruit. You may still need to go in and update a few lines yourself.

## Coverage
Now that we are on a new system, let's try to improve our engineering by encouraging test driven development. It is for this reason that we have accepted a coverage threshold in jest that operates to prevent individuals from checking in code without proper test coverage. There are multiple grading mechanisms including statements, functions, lines, and branches tested.

To find out your coverage run:

```bash
yarn coverage
``` 
 
This will create a `./coverage` folder in the root of your repository.

Afterwards you may open the coverage `index.html` file to get more detailed information on the coverage of yours and other modules

```bash
# For Mac
open ./coverage/lcov-report/index.html

# For Linux
xdg-open ./coverage/lcov-report/index.html
```

If you are having any problems passing the threshold, please reference our [support doc](SUPPORT.md)

## Yarn't Ready

Is that the greatest pun of all time? Probably not, but it is top five. 

Anyway here is a command that will check if your code will make the cut:

```bash
yarn ready
```

## Debugging
Gasp! We no longer have eclipse and its plethora of overcomplicated debugging tools. *How will we ever figure out what is going wrong?!*

Do not worry. We have a new hero in town and that hero goes by... 

### Chrome Dev Tools

To get started, please download [the NiM Chrome Extension](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj). It polls to see if there’s a new inspectable node to connect to and if it finds one, it’ll automatically launch a DevTools window that’s connected to it. Trust me it's totally worth cluttering up your already busy Chrome extensions.

To start debugging:
1. Run `yarn debug` from within your project.
2. Open Chrome. You should automatically be switched to the debug console thanks to our handy NiM Chrome extension.
3. Open the file (`⌘P`) that you want to inspect. If you are having trouble please reference [this site](https://developers.google.com/web/tools/chrome-devtools/javascript/) for more information.
4. Place your breakpoint and run (`⌘\`)
5. Hopefully you have hit your breakpoint and you can start debugging! *Next time try writing better code.* :bug:

### VSCode Debugging

But wait there's more! If you listened to me and are using VSCode as your primary editor, I've already configured your debug launch so that you can use the VSCode debugger if you prefer. You have two locations to look to run those Jest tests. 

1. Click the tab on the right that looks like a bug. And then press the play button at the top.
2. Press `F5` [cue "That Was Easy" button]

If you end up creating a launch configuration for another editor, please feel free to make a Pull Request. We'd all appreciate it.
