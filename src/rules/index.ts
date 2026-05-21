import type { Rule } from '../types.ts';
import r1 from './r1-nesting.ts';
import r3 from './r3-function-size.ts';
import r4 from './r4-file-size.ts';
import r7 from './r7-params.ts';
import r9 from './r9-types.ts';
import r12 from './r12-block-bodies.ts';
import tsEnumInterface from './ts-enum-interface.ts';
import tsTypesPlacement from './ts-types-placement.ts';
import testR7 from './test-r7-naming.ts';

export const rules: Rule[] = [
  r1,
  r3,
  r4,
  r7,
  r9,
  r12,
  tsEnumInterface,
  tsTypesPlacement,
  testR7,
];
