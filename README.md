# strykeforce.org
The Stryke Force web site.

## Blog Posts

1. How to [contribute](https://deploy-preview-16--strykeforce.netlify.com/howto/blog/)
2. Photos for posts can be cropped up to 1920 px wide for high dpi browsers.

## Linking Blog Posts to Social Media

1. Create a social image in PhotoShop call `social.jpg`
    - Cropped to 1.91:1
    - Resized to 1200x630
    - Export as 80% JPG
2. Fill out the following front matter fields
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