import path from 'path'

import { mkdirSync, readFileSync, writeFileSync } from 'fs-extra'
import { capitalize } from 'lodash'
import opentype from 'opentype.js'
import prettierTypeScript from 'prettier/parser-typescript'
import prettier from 'prettier/standalone'
import SVGPathCommander from 'svg-path-commander'

import {
  fontWeight,
  symbolNames,
  type FontWeight,
} from '../src/design-system/tokens'
import type { SFSymbol } from '../src/design-system/symbols/generated/types'

const weights = Object.keys(fontWeight)
;(async () => {
  console.log('Generating symbols...')

  const chars = readFileSync(
    path.join(__dirname, '../public/sources/chars.txt'),
    { encoding: 'utf-8' },
  ).match(/.{1,2}/g)
  if (!chars) return

  // Load name sequence from text file.
  const names = readFileSync(
    path.join(__dirname, '../public/sources/names.txt'),
    {
      encoding: 'utf8',
      flag: 'r',
    },
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

  mkdirSync(path.join(__dirname, '../src/design-system/symbols/generated'), {
    recursive: true,
  })

  writeFileSync(
    path.join(__dirname, '../src/design-system/symbols/generated/index.ts'),
    prettier.format(`export default ${JSON.stringify(symbols)} as const`, {
      parser: 'typescript',
      plugins: [prettierTypeScript],
      singleQuote: true,
    }),
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
  writeFileSync(
    path.join(__dirname, '../src/design-system/symbols/generated/types.ts'),
    prettier.format(typesSource, {
      parser: 'typescript',
      plugins: [prettierTypeScript],
      singleQuote: true,
    }),
  )
})()
