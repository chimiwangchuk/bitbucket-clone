// @ts-ignore TODO: fix noImplicitAny error here
import LiquidMetal from 'liquidmetal';

export default (str: string, search: string) =>
  LiquidMetal.score(str.toLowerCase(), search.toLowerCase());
