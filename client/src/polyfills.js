// polyfills - babel transforms these imports to include compile-target specific polyfills
// TODO: generate modern + legacy browser bundles, to make polyfills optional for modern browsers
import 'core-js'
import 'regenerator-runtime'

// window.fetch for IE 11
import 'whatwg-fetch'

// EventSource for IE 11 - this is needed to make webpack-hot-middleware work in IE 11
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill'
global.EventSource = NativeEventSource || EventSourcePolyfill
