type MinKey = 'min';
type MaxKey = 'max';
type ConstraintRecord<T extends string> = Record<T, number>;

type RatingConstraints = ConstraintRecord<MinKey | MaxKey>;
interface ProductConstraints { 
  rating: RatingConstraints;
}

export const productConstraints: ProductConstraints = {
  rating: {
    min: 1,
    max: 5,
  },
};

type PasswordConstraints = ConstraintRecord<MinKey>;
type NameConstraints = ConstraintRecord<MinKey>;
interface UserConstraints {
  password: PasswordConstraints; 
  firstName: NameConstraints;
  lastName: NameConstraints;
}

export const userConstraints: UserConstraints = {
  password: {
    min: 6,
  },
  firstName: {
    min: 2,
  },
  lastName: {
    min: 2,
  },
};