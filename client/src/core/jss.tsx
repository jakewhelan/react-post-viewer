import { create, GenerateId } from 'jss'
import preset from 'jss-preset-default'
import generateNanoId from 'nanoid/generate'

const comment = 'react-post-viewer-jss'
const insertionPoint = document.createComment(comment) as any
document.body.insertBefore(insertionPoint, document.body.firstChild)

// With this alphabet and length, collision probability is low for our use case: https://zelark.github.io/nano-id-cc/
const createGenerateId = (): GenerateId => (_) => generateNanoId('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8)
const jss = create(preset())
  .setup({
    insertionPoint,
    createGenerateId
  })

/**
 * Compile JSS stylesheet, inject into DOM and return class name aliases, class names are
 * non-deterministic auto-generated 8 character unique strings using nanoid. Collision
 * probability is low.
 *
 * @function compileStylesheet
 * @param {any} styles A JSS stylesheet that conforms with `jss` and `jss-preset-default`
 * @param {string} [classNamePrefix=defaultPrefix] Advanced users only: allows override of class name prefix - doing so may introduce naming conflicts
 */
export const compileStylesheet = (styles: any, classNamePrefix = ''): { [key: string]: string } => {
  const { classes } = jss
    .createStyleSheet(
      styles,
      { classNamePrefix }
    )
    .attach()

  return classes
}
