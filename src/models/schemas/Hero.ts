import {Schema, Document} from 'mongoose';

/**
 * Defines the basic info a user must have.
 */
export interface Hero {
  firstName?: string;
  lastName?: string;
  heroName: string;
  picture?: string; // Holds the URL for the hero image
  birth?: Date;
}

/**
 * Defined the model that the User instance are going to be based.
 */
export interface HeroModel extends Document, Hero {}

/**
 * Prepares the HeroModel to be a mongoose schema.
 */
export const HeroSchema = new Schema({
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  heroName: {
    type: String,
    required: true,
    unique: true
  },
  picture: {
    type: String,
    required: false
  },
  birth: {
    type: Date,
    required: false
  },
});
