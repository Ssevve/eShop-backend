type MinKey = 'min';
type MaxKey = 'max';
type MinMaxKey = MinKey | MaxKey;
type ConstraintRecord<T extends string> = Record<T, number>;

type RatingConstraints = ConstraintRecord<MinMaxKey>;
type AmountConstraints = ConstraintRecord<MinMaxKey>;
interface ProductConstraints { 
  rating: RatingConstraints;
  amount: AmountConstraints;
}

export const productConstraints: ProductConstraints = {
  rating: {
    min: 1,
    max: 5,
  },
  amount: {
    min: 1,
    max: 99,
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