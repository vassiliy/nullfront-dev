# Null front

## Installation
- Clone this repo;
- `cd` into it, then `npm run keep` there;
- Create projects by `gulp create -p <project name>`. It will create and populate `projects/` folder;
- **from the `nullFront` root folder** containing `gulpfile.js` run `gulp -p <project name>`;
- Then edit `h1` tag in new project `/default/index.pug` and see the text change in browser;
- Then you're good to `cd` into the project folder and `git init` there;

## Updating
- Keep the project updated by pulling this repo and `npm run keep` then;
- Further awesomeness is totally up to you now.

For instance, `gulp -p one` will run server for project whose markup is stored in `projects/one` folder.

**No default project provided. Project name `-p` parameter is mandatory for `gulp`, as well as for `gulp build`.**

**Mistypes yield errors only.**

**Example blog project:** clone [nf-example-project](https://github.com/greenminds/nf-example-blog) into your project folder and learn the most advanced features available with `nullFront`.

**Example project:** to learn just the basics, create the example project named, say, `one`, cleanup `dist/` folder, launch project `one` browser-synced server:
```bash
gulp example -p one
gulp build -p one
gulp -p one
```

Example project is a basic tutorial filled with demo stuff you won't need in actual project. To start an actual project, use the blank one.

**Blank project:** Create the blank project named `two` with
```bash
gulp create -p two
```

Run `gulp build` if you believe that the project distribution folder `dist` needs cleanup, otherwise just `gulp -p <project name>` does all the stuff and launches the project `dev` server with browser sync.

The whole example project bundle is isolated in `example` folder inside `nf-dev-server` package, let's come to some important conventions on its structure.

## Managing assets

Media files from `files`, `fonts`, `images` and `videos` folders get copied to `dist` as they are. They are accessible from layouts and css by absolute path starting from just `/`: `/files`, `/fonts` and so on.

CSS3 gets assembled by `sass` from `sass` folder. Put the files you wish to include to layouts to `/sass` root and import there all the components you wish.

JS gets browserified, babelified and pugified from `/js` folder accessible from layout the same way.

Vendor `css` and `js` packages inclusion guide is coming soon.

## Managing application routes and data

Take a look at `data` folder. Place a `js` module exporting data for `/some/route/you/wish/to/serve` to `data/some/route/you/wish/to/serve.js` and you are good to go. At [localhost:3000/some/route/you/wish/to/serve](http://localhost:3000/some/route/you/wish/to/serve) you'll see the HTML page that renders from this data, and at [localhost:3000/api/some/route/you/wish/to/serve](http://localhost:3000/api/some/route/you/wish/to/serve) you'll get the data you've provided in plain JSON. Repetitive data generation `js` snippets should be stored to `data/_generators` folder not affecting routing.

Every key of data object is accessible in `pug` templates. System information is stored in `""` (empty string) key. HTML render flow management keys `content` and/or `view` should also be placed here like this:

**file:** `/data/some/route/you/wish/to/serve.js`:
```javascript
const content = 'very/cool/content';
const view = 'really/awesome/view';
const title = 'Hello World!';
const lead = 'Keep calm and write pug';

module.exports = {
  '': {
    content,
    view
  },
  title,
  lead
};
```
Now `content` and/or `view` data will be used for rendering HTML management, and `title` and `lead` go directly to pug template chain.

## Data for site root

is stored in `data/default/index`. Obvious drawback of this is that serving route `/default/index` made impossible. This does not look like a problem since the purpose of routing is creation of human and search engines friendly URLs. URL with `default/index` is neither human, no search engines friendly, and it is not a big loss.

## Site core data

is stored in `data/_core/globals.js`. It contains common information that is needed to be accessible through all the pages of site. The content of this file is added to every data page and **may be rewritten by a certain page data**.

## Data generators

are stored in `data/_generators` and **always export function**. Unlike all the rest files in `data` folder which export JSON-able objects (arrays in JS are also special Objects).

Data generation is both tricky and controversial, and generator file format has some strict rules:

- is always starts with `module.exports`;
- `module.exports` is always `=>` function;
- this function must have at least one operator before `return` (otherwise `lint-fix` may suddenly render it unusable);
- `require` is prohibited.

Check `data/_generators/news_item.js` for example:

```javascript
module.exports = (id, title, content) => {
  id = `${id}`;
  return {
    id,
    title: `The title of news item #${title}`,
    content: `News item #${id}: The content is ${content}`,
    image: `/images/news/${id % 5}.jpg`,
  };
};
```

And use the data generation responsibly.

## Accessing data generators

Use the `generate` helper from dev server package. You may plainly `require` generator from your data files, but you'll totally lose browser sync on generator update. Don't use it this way, use the helper.

Check the `data/news/list.js` example:
```javascript
const {asset, generate} = require('@greenminds/nf-dev-server/server');
const view = 'news/index';
const title = 'News list title';

const news = [...Array(12).keys()]
  .map(i => generate('news_item')(
    i + 1,
    `title #${i + 1}`,
    `content #${i + 1}`
  ))
  .map(newsItem => Object.assign(newsItem, {image: asset(newsItem.image)}));

module.exports = {
  '': {view},
  title,
  news,
};
```

Here you see `asset` and `generate` helper playing together.

## Managing HTML flow

The whole idea of `nullFront` is usage of one set of `pug` template in client browser `js` handling AJAX UI flow as well as server-side rendering solid HTML pages. That implies some constraints described further.

All the templates are rendered with `pug` and located in `/pug`. All the folders mentioned further are to be found there by default.

Core template data — layer of `html`, `head`, meta tags, asset includes, etc. — is to be stored in `layouts`.

Minor template decoration is managed by `views`. View folders are located in pug root (`/pug`, let's remind one last time).

Components folder `components` contains templates for business logic entities. These templates are to be used in client browser `js` and therefore strictly specified.

## Layouts decorated by views

Views are intended to manage **minor markup variations around content area** like:

- show or hide page header (`h1` tag);
- display or don't display breadcrumbs;
- use or don't use sidebar(s);
- show footer one way or another.

For more serious variations please structure the template and introduce layouts with different parts.

Layout structure design started from assumption that every template should consist of:

- `meta` — content of page `head` tag;
- `head` — top layer of page `body`;
- `main` — content layer of page `body`;
- `foot` — page footer.

At the moment this structure boiled down to default layout, but should be remembered when introducing multiple layouts.

## Layouts and views markup rules

Every root may have a view. If not specified, `default/index` is assigned.

Every view must `extend` the layout and provide the `content` block for it:

**file:** `/pug/views/especially/awesome/view.pug`:
```pug
extends ../../layouts/default

block content
  p.breadcrumbs
    strong Home
  span Sweet
  span Home
  h1 Why hello there!
  p Some awesomeness here.
```

Then, somewhere in **file** `/pug/layouts/default.pug`:
```pug
div(class='container-fluid text-center')    
  div(class='row content')
    div(class='col-sm-2 sidenav')
      p
        a(href='#') Link
      p
        a(href='#') Link
      p
        a(href='#') Link
    div(class='col-sm-8 text-left')
      block content
    div(class='col-sm-2 sidenav')
      div(class='well')
        p ADS
      div(class='well')
        p ADS
```

And that's it. View/layout coupling complete.

## Content

To apply static content to `block content`, in page route data specify:

**file:** `/data/some/route/you/wish/to/serve.js`:

```javascript
const content = 'very/cool/content';
const view = 'really/awesome/view';

module.exports = {
  '': {
    content,
    view
  }
};
```

Then in **file** `/pug/content/very/cool/content.pug` just:
```pug
h1 Understatement
p is when
```

This content will be applied to specified view.

## Components

Suppose we have a `news` business logic entity:

```json
{
  "item": {
    "id": 1,
    "title": "The title of news item #1",
    "content": "The content of news item #1",
    "image": "/images/news/#1"
  }
}
```

In **file** `/pug/components/news/item.pug` we define the main snippet:
```pug
div(data-component='news/item' data-id=item.id)
  h3(data-key='title')= item.title
  p
    strong(data-key='image')= item.image
  p(data-key='content')= item.content
```

Please note that:

- top wrapping element has mandatory `data-component` and `data-id` attributes;
- every lower-level `html` element fully containing data value has mandatory `data-key` attribute.

That's the key to data visual representation management.

Then in **file** `/pug/components/news/_item.pug` we define the mixin:
```pug
mixin newsItem(item)
  include item
```

Which can be widely used across pug, e. g. in **file** `pug/views/news/index.pug`:
```pug
extends ../../layouts/default

include ../../components/news/_item

block content
  h1(data-view='news/index' data-key='title')= title
  each item in news
    +newsItem(item)
```

## Back-end server interface

`NullFront` supports seamless back-end server integration via views endpoints. This implies some requirements on assets and links management. The problem is that assets are always served from front-end server, links are always served from back-end server. `NullFront dev server` has its front and back at the same host, but in the real work flow it is not that easy.

All the pug templates have access to `asset` and `link` helpers, please always use it like this:

```pug
doctype html
html(lang='en')
  head
    link(
      rel='stylesheet',
      href=asset('/css/styles.css')
    )
    script(src=asset('/js/index.js'))
  body
    nav(class='navbar navbar-inverse')
      div(class='collapse navbar-collapse' id='myNavbar')
        ul(class='nav navbar-nav')
          li(class='active')
            a(href=link('/home')) Home
            a(href=link('/about')) About
            a(href=link('/projects')) Projects
            a(href=link('/contact')) Contact
```

**You should never add `asset` or `link` to pages data. They are always added and redefined by routing controller.**

## Data helpers

There are data helpers also. Check the data at `data/home`:

```javascript
const {asset, link} = require('@greenminds/nf-dev-server/server');

module.exports = {
  '': {
    content: 'home',
    view: 'default/content',
  },
  title: 'Home content page',
  homePic: asset('/images/bone-wagon-square.jpg'),
  aboutLink: link('/about'),
};
```
Everything looks pretty self-explaining. Helpers for `asset` and `link` are packaged into `@greenminds/nf-dev-server` for `api` level debugging in rare cases when views are somehow unavailable of inapplicable.

**Don't use this on the real pages with complete functional views, `asset` and `link` natively belong to `pug` level.**

## Conclusion

**Keep calm. Run REPL vigorously. Enjoy. Feedback. Repeat.**
