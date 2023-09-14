import path from 'node:path'
import opentype from 'opentype.js'
import SVGPathCommander from 'svg-path-commander'

import type { SFSymbol } from '../src/design-system/symbols/generated/types'
import {
  type FontWeight,
  fontWeight,
  symbolNames,
} from '../src/design-system/tokens'

const capitalize = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`

const weights = Object.keys(fontWeight)
;(async () => {
  console.log('Generating symbols...')

  const chars = (
    await Bun.file(path.join(__dirname, '../public/sources/chars.txt')).text()
  ).match(/.{1,2}/g)
  if (!chars) return

  // Load name sequence from text file.
  const names = (
    await Bun.file(path.join(__dirname, '../public/sources/names.txt')).text()
  ).split(/\r?\n/)
  if (!names) return

  const fonts = await Promise.all(
    weights.map(async (weight) => ({
      weight,
      font: await opentype.load(
        path.join(
          __dirname,
          `../public/sources/SF-Pro-Text-${capitalize(weight)}.otf`,
        ),
      ),
    })),
  )

  const symbols = {} as Record<string, Record<FontWeight, SFSymbol>>
  fonts.forEach(({ font, weight }) => {
    symbolNames.forEach((name) => {
      const index = names.indexOf(name)
      const symbolPath = font.getPath(chars[index], 0, 0, 28)
      const boundingBox = symbolPath.getBoundingBox()
      const pathData = symbolPath.toPathData(2)

      // Move symbol to boundary of future container. This may be unwanted by some because it eliminates baseline consistency between symbols.
      const transform = {
        translate: [boundingBox.x1 * -1, boundingBox.y1 * -1], // X and Y axis translation
        origin: [0, 0],
      }

      const transformedPathData = new SVGPathCommander(pathData)
        .transform(transform)
        .toString()

      symbols[name] = {
        ...symbols[name],
        [weight]: {
          name,
          path: transformedPathData,
          viewBox: {
            width: boundingBox.x2 - boundingBox.x1,
            height: boundingBox.y2 - boundingBox.y1,
          },
        },
      }
    })
  })

  const source = `export default ${JSON.stringify(symbols)} as const`

  Bun.write(
    path.join(
      import.meta.dir,
      '../src/design-system/symbols/generated/index.ts',
    ),
    source,
  )

  const typesSource = `
  export type SFSymbolName = "${names.join(`" | "`)}"
  
  export type SFSymbol = {
    name: SFSymbolName;
    path: string;
    viewBox: {
      width: number;
      height: number;
    };
  }
  `
  Bun.write(
    path.join(
      import.meta.dir,
      '../src/design-system/symbols/generated/types.ts',
    ),
    typesSource,
  )
})()
