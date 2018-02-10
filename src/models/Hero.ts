import {model} from 'mongoose';
import {HeroModel, HeroSchema, Hero as IHero} from './schemas/Hero';
import {BaseRepository} from './BaseRepository';

HeroSchema.methods.toString = function () {
  return this.heroName;
};

/**
 * This would be the main object used outside this module to create Heroes.
 */
export const Hero = model<HeroModel>(
  'hero', // How it is called
  HeroSchema,
  'heroes', // How the collection its called
  true // IDK
);

/**
 * An instance of the repository to help create hero instances.
 */
export const HeroRepo = new BaseRepository<HeroModel, IHero>(Hero);
