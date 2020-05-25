# react-post-viewer

`react-post-viewer` is a simple web app that displays relationships between user post data. Data can be grouped together by the week it was posted, the author or the location of the post. The data is displayed in a tree view and permits the user to change the location and author of a post, which subsequently causes the tree to rebuild.

## Whats included?
- Static file server & REST API, built using `node` LTS (12.16.x) and `fastify`
- React single-page-application, built using `react`, `webpack` and `babel`. 
  - Stylesheets are scoped and generated using JSS, and a small JSS library I authored - see `client/src/core/jss`
  - Three simple React components used to represent data in a tree: `PostTree`, `PostBranch`, `PostLeaf`
  - Intercomponent communication and app-level state is implemented using `redux`
- 20 unit tests written using `tape`, `sinon` and `enzyme`.
  - Tests cover UI rendering correctness and data fetch/state mutations via `PostTreeService`, including tests for a mocked async request.
  - Tests are run in a browser-alike environment within `node` using `js-dom`. This allows for simpler debugging.

## Whats missing?
- Styling
  - This task was done within a time limit. I opted to write better unit tests rather than spend a lot of time styling the app.
  - I've done some very basic layout styling using flexbox

# Getting started
## Requirements
`react-post-viewer` requires Node.js LTS (12.16.x) and npm 6.x

## Browser support
**It is recommended that you use Google Chrome 81+ for the best experience.**

`react-post-viewer` comes bundled with polyfills to support ES2020 and supports all modern browsers. Internet explorer 11 _is_ supported.

## Running the app
Install dependencies
```
# from project root
npm i
```

Build & run unit tests
```
npm test
```

Build & run the app (production)
```
npm start
```

The app will open in your default browser at http://localhost:3000/. If this doesn't happen, please manually open http://localhost:3000/ in your favourite browser.

## Advanced
Lint project
```
npm run lint
```

Build app for production (without running)
```
npm run build
```

Run the app for development, with hot reloading
```
npm run dev
```

Run unit tests with debugging
```
npm run test-debug
```