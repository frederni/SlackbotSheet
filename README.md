# SlackbotSheet
Slackbot message integration using incoming webhooks with Google Apps Script

### Usage

This can generally be used for any project involving a Slack bot sending some message based on the values of a spreadsheet.

### Features

For my case, I had a spreadsheet on the form

| Date | First name | Second name |
|------|------------|-------------|
| __   | __         | __          |
| __   | __         | __          |

and I wanted the bot to tag the users (based on their first names) in a specific channel when today's date matches that of the date column. This is done with a predefined payload whose names (or tags of user IDs based on names) are inserted based on the lookup of the date.

By scheduling the script every day, this process is completely automated.

### Example of bot output (Norwegian)

![image](https://user-images.githubusercontent.com/23258333/191314236-d41231b8-5046-4bb2-be8c-e1dbebbf23b6.png)
