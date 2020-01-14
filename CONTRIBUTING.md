# Contributing to strykeforce.org

:+1::tada: First off, thanks for reading this because we need students and mentors to help make our website awesome! If you have any questions see a team mentor or check out our #sfwebsite Slack channel.

## What should I know before I get started?

If you are writing a blog post see our [blog posting resources](https://www.strykeforce.org/resources/blog/).

If you are maintaing content on the site you should be familiar with:

- [Markdown](https://www.markdownguide.org) - blog posts use this.
- [GitHub](https://help.github.com) - where we keep this website.
- PhotoShop or equivalent - basic image manipulation.

If you are developing the site itself, in addition to above:

- [HTML and CSS](https://developer.mozilla.org/en-US/)
- [Typescript](http://www.typescriptlang.org) - superset of JavaScript that provides type-safety.

## How Can I Contribute?

- Write a blog post!
- Reporting issues and suggest features using our [issue tracking system](https://github.com/strykeforce/strykeforce.org/issues) on GitHub. Please check the list first to see if the issue has been already entered - you can add your comments to existing issues.
- Content and code contributions are made by submitting a pull request to [strykeforce.org](https://github.com/strykeforce/strykeforce.org/pulls). This will automatically build a preview that can be reviewed before updating the production site.

## Blog Posts

1. See the [blog posting resources](https://www.strykeforce.org/resources/blog/) and other blog posts for examples.
2. Photos for posts can be cropped up to 1920 px wide for high dpi browsers.

## Linking Blog Posts to Social Media

1. Create a social image in PhotoShop called `social.jpg`
   - Cropped to 1.91:1
   - Resized to 1200x630
   - Export as 80% JPG
2. Fill out the following front matter fields in the blog post markdown:
   - `path: "/blog/blah/"`: should end with a trailing `/` to prevent server redirects.
   - `image: "./social.jpg"`
   - `description: Stryke Force blah blah..`
3. If desired, test at:
   - **Facebook:** https://developers.facebook.com/tools/debug/sharing/
   - **Twitter:** https://cards-dev.twitter.com/validator
4. Post link to
   - **Twitter:** we don't use description, use 240 characters for this. Add `#omgrobots`, `#FIRSTinspires`
   - **Facebook** use @2767Strykeforce in description as needed
   - **Google Business**
