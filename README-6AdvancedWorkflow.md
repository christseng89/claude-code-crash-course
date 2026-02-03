# Advanced Workflows

## Plan mode

```bash
claude
# Alt + m
 ⏸ plan mode on (meta+m to cycle) 

I want you to help me come up with a spec for a NEW web application that I'm going to  build. So the NEW web application is going to be a marketplace displaying all of the hooks that are available. So it's going to display lots of cards and each card is going to be a link to a GitHub repository with a different Claude Code hook to help us in our developer workflows.

I want you to think harder and I don't want to display it in a carousel but I want to display lots of cards in the homepage. And you missed lots of hook can be after generation for example.

Review HooksMarketplaceSpecV2.0 for me.

```

```bash
claude
/clear
/init

```

## Hands on HooksMarketplaceSpecV2.1.md

```bash
cd hookhub
npm install
npm run dev
```

```bash
claude
Refer to ./HooksMarketplaceSpecV2.1.md update the project hookhub for me.
Make the project hookhub more modern, cleaner, simpler and beautiful.

In the hookhub project, the theme should be working as follows:                                                  
                                                                                                                   
The defaulted theme will based on System;                                                                        
When Click light button, all theme MUST be changed to LIGHT mode;                                                
When Click dark button, all theme MUST be changed to DARK mode;                                                  
When Click system button, all theme MUST be changed to SYSTEM mode. 
```
